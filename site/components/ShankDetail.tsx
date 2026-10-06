"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { shank } from "../content";

/**
 * FT15 + M197 (candle-light, ADDED light only). The dish stays as bright as its source still at all times; a warm
 * candle glow (screen blend, never a dark overlay) travels over the four details and each numbered note lights as the
 * glow reaches its spot. Scroll-driven over the section's travel: all four notes are lit by 40 % (≈ as the section
 * arrives; the record hold sits near 50 %), then by 48 % the glow has widened into a gentle warm lift and it fades
 * back to the plain picture by 75 %. Reversible both ways. The photo keeps a slow push-in. dish-pushin.mp4 is not in raw/ yet: the
 * picture is the hero's end still. ?static=1: notes lit, no glow.
 */
const SPOTS: [number, number][] = [
  [52, 30], // 01 shank
  [40, 70], // 02 jus
  [62, 62], // 03 rice
  [68, 14], // 04 smoke
];
/** scroll progress at which each note is lit: all four inside the first 40 % */
const LIT_AT = [0.1, 0.18, 0.26, 0.34];

export default function ShankDetail() {
  const root = useRef<HTMLElement>(null);
  const left = shank.notes.slice(0, 2);
  const right = shank.notes.slice(2);

  useEffect(() => {
    const el = root.current!;
    const notes = el.querySelectorAll<HTMLElement>(".shank-note");
    const pic = el.querySelector<HTMLElement>(".shank-pic")!;
    if (prefersReducedMotion()) return;

    const light = { x: 30, y: 20, r: 0, a: 0 };
    const paint = () => {
      pic.style.setProperty("--lx", `${light.x}%`);
      pic.style.setProperty("--ly", `${light.y}%`);
      pic.style.setProperty("--lr", `${light.r}%`);
      pic.style.setProperty("--la", light.a.toFixed(3));
    };
    // one timeline, 0..1 = the section's scroll travel (top enters the bottom → bottom leaves the top)
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" }, onUpdate: paint });
    tl.set(light, { x: 30, y: 20, r: 0, a: 0 }, 0);
    tl.to(light, { r: 26, a: 1, duration: 0.06 }, 0.02);
    SPOTS.forEach(([x, y], i) => {
      tl.to(light, { x, y, duration: 0.07, ease: "sine.inOut" }, LIT_AT[i] - 0.07);
    });
    tl.to(light, { x: 54, y: 46, r: 120, a: 0.15, duration: 0.1, ease: "sine.inOut" }, 0.38); // by 48 %: a gentle warm lift, not a wash
    tl.to(light, { a: 0, duration: 0.15 }, 0.6);
    tl.to({}, { duration: 0.25 }, 0.75); // pad the timeline to exactly 1
    paint();

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        tl.progress(self.progress);
        notes.forEach((n, i) => n.classList.toggle("is-lit", self.progress >= LIT_AT[i]));
      },
      onRefresh: (self) => {
        tl.progress(self.progress);
        notes.forEach((n, i) => n.classList.toggle("is-lit", self.progress >= LIT_AT[i]));
      },
    });
    return () => {
      st.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      id="shank"
      data-chapter="shank"
      className="sheet shank"
      data-record-time={1.2}
      data-record-hold={1.2}
      data-record-align="center"
      data-record-label="The shank"
    >
      <header className="shank-head">
        <p className="ss-meta">
          <span>{shank.num}</span> The signature
        </p>
        <h2 className="shank-title">{shank.title}</h2>
        <p className="shank-sub">{shank.sub}</p>
      </header>

      <div className="shank-grid">
        <ol className="shank-notes">
          {left.map((n) => (
            <Note key={n.n} note={n} />
          ))}
        </ol>

        <figure className="shank-pic" data-cursor="Taste">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shank.image} alt="Lamb shank on saffron rice with Kashmiri chilli jus" draggable={false} />
          <div className="shank-light" aria-hidden />
        </figure>

        <ol className="shank-notes">
          {right.map((n) => (
            <Note key={n.n} note={n} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Note({ note }: { note: { n: string; title: string; text: string } }) {
  return (
    <li className="shank-note is-lit">
      <span className="shank-n">{note.n}</span>
      <span className="shank-note-title">{note.title}</span>
      <span className="shank-note-text">{note.text}</span>
    </li>
  );
}
