"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { createShader, loadImage, type GLHandle } from "@/lib/gl";
import { PIN_VH_PER_SEC } from "../lib/film";
import { courses, tasting } from "../content";

/**
 * MN02 + M511 (the signature): a pinned long-table stage. For every course the RAW plate shows first, then a fire
 * front spreads from the plate's centre outward and burns it into the COOKED plate: a soft thick glow (saffron core →
 * ember → transparent), a thin band of char just behind the edge and a few tiny sparks (OGL shader). The pairs are
 * pixel-aligned: both textures are sampled at the SAME uv with the same cover-fit, no scale, no drift, no shift.
 * Per course (2.2 record s): the burn edge moves from 2 % to 86 % (linear in scroll), then a cross-fade to the next
 * raw plate 86–100 %. The last course burns over 2–100 %, so the effect finishes exactly at the end of the pin (LESSON 9); the noise and
 * the rim flicker run on the clock, so the stage is never still. The DOM images stay underneath as the fallback.
 * ?static=1: no canvas, course III cooked.
 */
const FRAG = /* glsl */ `
uniform float uBurn, uMix;
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), u.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int k = 0; k < 5; k++) { v += a * vnoise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = vUv;
  // identical sampling for raw (0), cooked (1) and the next raw (2): the pair can never drift apart
  vec3 raw = texture2D(uTex0, cover(uv, uTexRes0)).rgb;
  vec3 cooked = texture2D(uTex1, cover(uv, uTexRes1)).rgb;
  vec3 next = texture2D(uTex2, cover(uv, uTexRes2)).rgb;

  // the fire front: a round, softly ragged ring that starts at the plate's centre and spreads outward
  // (distance from the centre leads; the noise only roughens the rim, so it never runs out in long cracks)
  float r = length(uv - 0.5);
  float rough = (fbm(uv * 3.0 + vec2(uTime * 0.10, -uTime * 0.14)) - 0.5) * 0.7
              + (fbm(uv * 9.0 - vec2(uTime * 0.2, uTime * 0.1)) - 0.5) * 0.3;
  float n = r + rough * 0.12;                       // ≈ 0 (centre) … 0.76 (corners), a flame-ragged rim
  // 75 % of the burn is spent on the plate (rim ≈ 0.42), then the front races out over the bare slate
  float p = uBurn < 0.75 ? mix(-0.04, 0.42, uBurn / 0.75) : mix(0.42, 0.8, (uBurn - 0.75) / 0.25);
  float d = n - p;                                  // < 0: inside the front = burnt through -> cooked

  float burnt = smoothstep(0.012, -0.012, d);
  vec3 col = mix(raw, cooked, burnt);

  // a thin band of dark char just behind the edge (on the burnt side), and a light scorch just ahead of it
  float charBand = smoothstep(0.0, -0.012, d) * smoothstep(-0.045, -0.02, d);
  col *= 1.0 - charBand * 0.72;
  float scorch = smoothstep(0.04, 0.0, d) * step(0.0, d);
  col *= 1.0 - scorch * 0.35;

  // the glow: bright saffron core -> ember orange -> transparent, soft and thick, flickering a little
  float flick = 0.86 + 0.14 * sin(uTime * 8.0 + n * 40.0) * sin(uTime * 4.7 - n * 23.0);
  float live = step(0.001, uBurn) * step(uBurn, 0.999);
  float core = exp(-pow(d / 0.010, 2.0));
  float halo = exp(-pow(d / 0.035, 2.0));
  vec3 saffron = vec3(1.0, 0.80, 0.30);
  vec3 ember = vec3(0.886, 0.333, 0.169);           // #E2552B
  col = mix(col, ember, halo * 0.55 * flick * live);
  col += saffron * core * 0.95 * flick * live;

  // a few tiny ember sparks lifting off the front
  vec2 g = uv * vec2(46.0, 46.0) + vec2(0.0, uTime * 1.6);
  vec2 cell = floor(g);
  float h = h21(cell);
  vec2 sp = cell + vec2(0.2 + 0.6 * h21(cell + 7.1), 0.2 + 0.6 * h21(cell + 3.7));
  vec2 cuv = (sp - vec2(0.0, uTime * 1.6)) / 46.0;   // the spark's own spot on the plate
  float near = exp(-pow((length(cuv - 0.5) - p) / 0.05, 2.0));
  float tw = 0.5 + 0.5 * sin(uTime * (6.0 + 6.0 * h) + h * 30.0);
  float spark = smoothstep(0.12, 0.0, length(g - sp)) * step(0.86, h) * near * tw * live;
  col += mix(ember, saffron, tw) * spark * 1.4;

  col = mix(col, next, uMix);
  gl_FragColor = vec4(col, 1.0);
}`;

export default function TastingJourney() {
  const outer = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const n = courses.length;
  const pinVh = Math.round(n * tasting.secsPerCourse * PIN_VH_PER_SEC);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setActive(n - 1);
      return;
    }
    let h: GLHandle | null = null;
    let imgs: { raw: HTMLImageElement; cooked: HTMLImageElement }[] = [];
    let slot = -1;
    let state = { burn: 0, mix: 0 };
    let cancelled = false;
    let cookedUpTo = -1; // highest course whose burn has finished: the rail's II tick bumps once per course

    const bind = (c: number) => {
      if (!h || !imgs.length || slot === c) return;
      slot = c;
      h.setTexture(0, imgs[c].raw);
      h.setTexture(1, imgs[c].cooked);
      h.setTexture(2, imgs[Math.min(n - 1, c + 1)].raw);
    };

    const apply = (p: number) => {
      const x = Math.min(0.99999, Math.max(0, p)) * n;
      const c = Math.min(n - 1, Math.floor(x));
      const q = x - c;
      const last = c === n - 1;
      const lin = (a: number, b: number) => Math.min(1, Math.max(0, (q - a) / (b - a)));
      // the burn runs across the whole course (no still raw or cooked stretch), then a short cross-fade to the next raw
      state = last ? { burn: lin(0.02, 1), mix: 0 } : { burn: lin(0.02, 0.86), mix: lin(0.86, 1) };
      setActive(state.mix > 0.5 ? c + 1 : c);
      const done = state.burn >= 0.97 ? c : c - 1;
      if (done > cookedUpTo) window.dispatchEvent(new Event("saffron:cooked"));
      cookedUpTo = done;
      bind(c);
      if (h) {
        h.uniforms.uBurn.value = state.burn;
        h.uniforms.uMix.value = state.mix;
      }
    };

    const st = ScrollTrigger.create({
      trigger: outer.current!,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });

    (async () => {
      const loaded = await Promise.all(courses.map(async (c) => ({ raw: await loadImage(c.raw), cooked: await loadImage(c.cooked) })));
      if (cancelled || loaded.some((l) => !l.raw || !l.cooked) || !canvas.current) return;
      imgs = loaded as typeof imgs;
      h = await createShader(canvas.current, FRAG, {
        textures: [imgs[0].raw, imgs[0].cooked, imgs[Math.min(n - 1, 1)].raw],
        uniforms: { uBurn: { value: 0 }, uMix: { value: 0 } },
        dpr: 1.5,
      });
      if (cancelled) {
        h?.destroy();
        return;
      }
      slot = 0;
      apply(st.progress);
    })();

    return () => {
      cancelled = true;
      st.kill();
      h?.destroy();
    };
  }, [n]);

  return (
    <section
      ref={outer}
      id="tasting"
      data-chapter="tasting"
      className="pin-outer sheet tj"
      style={{ height: `calc(100svh + ${pinVh}vh)` }}
      data-record-time={tasting.arrive}
      data-record-label="Tasting"
    >
      {courses.map((c, i) => (
        <div
          key={c.num}
          aria-hidden
          className="rec-stop pointer-events-none absolute left-0 h-px w-px"
          style={{ top: `${((pinVh * (i + 1)) / n).toFixed(2)}vh` }}
          data-record-time={tasting.secsPerCourse}
          data-record-label={`Course ${c.num}`}
        />
      ))}
      <div className="pin-stage tj-stage">
        <div className="tj-menu">
          <p className="ss-meta">
            <span>II</span> {tasting.eyebrow}
          </p>
          <ol className="tj-list">
            {courses.map((c, i) => (
              <li key={c.num} className={i === active ? "is-on" : i < active ? "is-past" : ""}>
                <span className="tj-num">{c.num}</span>
                <span className="tj-name">{c.name}</span>
                <span className="tj-pair">{c.pairing}</span>
              </li>
            ))}
            <li className="tj-next">
              <span className="tj-num">{tasting.next.num}</span>
              <span className="tj-name">
                {tasting.next.name} <span aria-hidden>↓</span>
              </span>
            </li>
          </ol>
          <p className="tj-price">
            <span className="ss-meta">{tasting.priceNote}</span>
            <span className="tj-price-num js-price-flip">{tasting.price}</span>
          </p>
        </div>

        <div className="tj-table">
          <div className="tj-glow" aria-hidden />
          <div className="tj-plate" data-cursor="Taste">
            {courses.map((c, i) => (
              <div key={c.num} className={`tj-course ${i === active ? "is-on" : ""}`} data-course={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.cooked} alt={c.name} className="tj-img" draggable={false} />
              </div>
            ))}
            <canvas ref={canvas} className="tj-burn" aria-hidden />
          </div>
          <p className="tj-caption ss-meta">
            Course {courses[active].num} of IX · raw → fired
          </p>
        </div>
      </div>
    </section>
  );
}
