"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { loading } from "@/lib/loading";
import { loaderWords } from "../content";
import { markOpen } from "../lib/open";

/**
 * I30 · word beats then a curved curtain. Three words flicker on like a struck match (pure CSS from the first paint,
 * LESSON 11), the loader waits for every hero frame (the hero film registers with `blockLoader`), then a saffron
 * curtain with a curved top rises over the charcoal and lifts off. "saffron:open" fires as the lift starts, so the
 * hero film is already moving on the loader's last frame. Never still: a broad ember glow drifts and breathes behind
 * the words from the first painted frame (CSS), and the words keep flickering. The curtain takes 0.9 s in all.
 * ?static=1: no loader.
 */
const MIN_MS = 1250; // the three beats (0.45 s apart) must all have shown

export default function EmberLoader() {
  const root = useRef<HTMLDivElement>(null);
  const curtain = useRef<SVGPathElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setGone(true);
      markOpen();
      return;
    }
    const el = root.current!;
    const t0 = performance.now();
    let leaving = false;
    let tl: gsap.core.Timeline | null = null;
    const hard = window.setTimeout(() => leave(), 9000);

    const leave = () => {
      if (leaving) return;
      leaving = true;
      window.clearTimeout(hard);
      const wait = Math.max(0, MIN_MS - (performance.now() - t0)) / 1000;
      // curtain: a saffron sheet rises from below with a curved top that flattens, then the whole plate lifts off
      tl = gsap
        .timeline({ delay: wait })
        // 0.9 s in all: rise 0.32 · flatten 0.08 · lift 0.5
        .fromTo(curtain.current, { attr: { d: CURVE_LOW } }, { attr: { d: CURVE_HIGH }, duration: 0.32, ease: "power2.in" })
        .to(curtain.current, { attr: { d: FLAT_FULL }, duration: 0.08, ease: "none" })
        .add(() => markOpen())
        .to(el, { yPercent: -100, duration: 0.5, ease: "power3.inOut" })
        .add(() => setGone(true));
    };

    const unsub = loading.subscribe((_p, done) => {
      if (done) leave();
    });
    return () => {
      unsub();
      window.clearTimeout(hard);
      tl?.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} data-loader className="ember-loader" aria-hidden>
      <div className="ember-heat" />
      <div className="ember-words">
        {loaderWords.map((w, i) => (
          <span key={w} className="ember-word" style={{ animationDelay: `${0.1 + i * 0.45}s` }}>
            {w}
          </span>
        ))}
      </div>
      <svg className="ember-curtain" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path ref={curtain} d={CURVE_LOW} />
      </svg>
    </div>
  );
}

// viewBox 0..100: the curtain's top edge is a curve that bows up in the middle, then flattens to cover the plate
const CURVE_LOW = "M0 100 L0 100 Q50 100 100 100 L100 100 Z";
const CURVE_HIGH = "M0 100 L0 40 Q50 -10 100 40 L100 100 Z";
const FLAT_FULL = "M0 100 L0 0 Q50 0 100 0 L100 100 Z";
