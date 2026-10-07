import re

content = '''"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { createShader, loadImage, type GLHandle } from "@/lib/gl";
import { PIN_VH_PER_SEC } from "../lib/film";
import { courses, tasting } from "../content";

const FRAG = \
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
  vec3 raw = texture2D(uTex0, cover(uv, uTexRes0)).rgb;
  vec3 cooked = texture2D(uTex1, cover(uv, uTexRes1)).rgb;
  vec3 next = texture2D(uTex2, cover(uv, uTexRes2)).rgb;

  float r = length(uv - 0.5);
  float rough = (fbm(uv * 3.0 + vec2(uTime * 0.10, -uTime * 0.14)) - 0.5) * 0.7
              + (fbm(uv * 9.0 - vec2(uTime * 0.2, uTime * 0.1)) - 0.5) * 0.3;
  float n = r + rough * 0.12;                       
  float p = uBurn < 0.75 ? mix(-0.04, 0.42, uBurn / 0.75) : mix(0.42, 0.8, (uBurn - 0.75) / 0.25);
  float d = n - p;                                  

  float burnt = smoothstep(0.012, -0.012, d);
  vec3 col = mix(raw, cooked, burnt);

  float charBand = smoothstep(0.0, -0.012, d) * smoothstep(-0.045, -0.02, d);
  col *= 1.0 - charBand * 0.72;
  float scorch = smoothstep(0.04, 0.0, d) * step(0.0, d);
  col *= 1.0 - scorch * 0.35;

  float flick = 0.86 + 0.14 * sin(uTime * 8.0 + n * 40.0) * sin(uTime * 4.7 - n * 23.0);
  float live = step(0.001, uBurn) * step(uBurn, 0.999);
  float core = exp(-pow(d / 0.010, 2.0));
  float halo = exp(-pow(d / 0.035, 2.0));
  vec3 saffron = vec3(1.0, 0.80, 0.30);
  vec3 ember = vec3(0.886, 0.333, 0.169);           
  col = mix(col, ember, halo * 0.55 * flick * live);
  col += saffron * core * 0.95 * flick * live;

  vec2 g = uv * vec2(46.0, 46.0) + vec2(0.0, uTime * 1.6);
  vec2 cell = floor(g);
  float h = h21(cell);
  vec2 sp = cell + vec2(0.2 + 0.6 * h21(cell + 7.1), 0.2 + 0.6 * h21(cell + 3.7));
  vec2 cuv = (sp - vec2(0.0, uTime * 1.6)) / 46.0;   
  float near = exp(-pow((length(cuv - 0.5) - p) / 0.05, 2.0));
  float tw = 0.5 + 0.5 * sin(uTime * (6.0 + 6.0 * h) + h * 30.0);
  float spark = smoothstep(0.12, 0.0, length(g - sp)) * step(0.86, h) * near * tw * live;
  col += mix(ember, saffron, tw) * spark * 1.4;

  col = mix(col, next, uMix);
  gl_FragColor = vec4(col, 1.0);
}\;

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
    let cookedUpTo = -1;

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
      className="pin-outer sheet tj-luxury"
      style={{ height: \calc(100svh + \vh)\ }}
      data-record-time={tasting.arrive}
      data-record-label="Tasting"
    >
      {courses.map((c, i) => (
        <div
          key={c.num}
          aria-hidden
          className="rec-stop pointer-events-none absolute left-0 h-px w-px"
          style={{ top: \\vh\ }}
          data-record-time={tasting.secsPerCourse}
          data-record-label={\Course \\}
        />
      ))}
      <div className="pin-stage tj-luxury-stage">
        <div className="tj-luxury-bg"></div>
        <div className="tj-luxury-grid">
          
          <div className="tj-luxury-left">
            <div className="tj-luxury-header">
              <span className="tj-luxury-eyebrow-num">II</span>
              <span className="tj-luxury-eyebrow-text">A CULINARY JOURNEY</span>
            </div>
            
            <div className="tj-luxury-list">
              {courses.map((c, i) => (
                <div key={c.num} className={\	j-luxury-row \\}>
                  <div className="tj-luxury-row-bg"></div>
                  <div className="tj-luxury-thumb-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.thumb} alt={c.name} className="tj-luxury-thumb" draggable={false} />
                  </div>
                  <div className="tj-luxury-row-content">
                    <span className="tj-luxury-num">{c.num}</span>
                    <div className="tj-luxury-details">
                      <h3 className="tj-luxury-name">{c.name}</h3>
                      <p className="tj-luxury-pair">{c.pairing}</p>
                    </div>
                    <span className="tj-luxury-arrow" aria-hidden>?</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="tj-luxury-bottom">
              <div className="tj-luxury-price-col">
                <span className="tj-luxury-price-note">NINE CRAFTED COURSES, PER GUEST</span>
                <span className="tj-luxury-price-num">?7,500</span>
              </div>
              <a href="#reserve" className="tj-luxury-cta">
                JOIN OUR TABLE <span className="arrow" aria-hidden>?</span>
              </a>
            </div>
          </div>

          <div className="tj-luxury-right">
            <div className="tj-luxury-plate-wrap">
              <canvas ref={canvas} className="tj-burn" aria-hidden />
            </div>
            <div className="tj-luxury-nav">
              <span className="tj-luxury-nav-label">{courses[active].num} · TASTING</span>
              <div className="tj-luxury-nav-track">
                {courses.map((c, i) => (
                   <div key={c.num} className={\	j-luxury-nav-tick \\}>
                     {c.num}
                   </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
'''

with open("site/components/TastingJourney.tsx", "w", encoding="utf-8") as f:
    f.write(content)
