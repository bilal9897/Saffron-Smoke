"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import SaffronFilm from "./SaffronFilm";
import { hero, heroFilm, pour, ticket } from "../content";
import { onOpen } from "../lib/open";

/**
 * HR19 + M135. A full-bleed plating film (pinned, played by video time) with a giant two-line title anchored
 * bottom-left: a bone outline (drawn on as the curtain lifts, a pen sweep per line) and a saffron fill clipped by
 * --fill, which follows the measured pour (2.75 → 4.7 s of the film) both ways. The kitchen ticket starts unticked;
 * each check draws (DrawSVG) when the film CROSSES its landing second (LESSON 13), and undraws when scrolled back.
 * The philosophy caption rises in at 6.2 s. ?static=1: everything in its final state.
 */
export default function HeroPlating() {
  const root = useRef<HTMLDivElement>(null);
  const done = useRef<boolean[]>(ticket.items.map(() => false));
  const capOn = useRef(false);

  const stat = typeof window !== "undefined" && prefersReducedMotion();

  // first state (before the first film second arrives): unticked, unfilled, outline hidden
  useEffect(() => {
    const el = root.current?.closest("section");
    if (!el || prefersReducedMotion()) return;
    const checks = el.querySelectorAll<SVGPathElement>(".hero-tick path");
    gsap.set(checks, { drawSVG: "0%" });
    gsap.set(el.querySelectorAll(".hero-ticket li"), { className: "" });
    gsap.set(el.querySelector(".hero-caption"), { autoAlpha: 0, y: 18 });
    const lines = el.querySelectorAll<HTMLElement>(".hero-outline");
    gsap.set(lines, { clipPath: "inset(0% 100% 0% 0%)" });
    const off = onOpen(() => {
      gsap.to(lines, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power2.inOut", stagger: 0.18, delay: 0.05 });
    });
    return off;
  }, []);

  const onTime = (t: number) => {
    const el = root.current?.closest("section");
    if (!el) return;
    // M135 flood: the fill tracks the pour exactly (linear in video time, finishes when the pool settles)
    const f = Math.min(1, Math.max(0, (t - pour.from) / (pour.to - pour.from)));
    el.style.setProperty("--fill", f.toFixed(4));
    if (stat) return;
    // ticket: tick on crossing the measured second
    const lis = el.querySelectorAll<HTMLElement>(".hero-ticket li");
    ticket.items.forEach((it, i) => {
      const on = t >= it.at;
      if (on === done.current[i]) return;
      done.current[i] = on;
      lis[i].classList.toggle("is-done", on);
      gsap.to(lis[i].querySelector(".hero-tick path"), {
        drawSVG: on ? "100%" : "0%",
        duration: on ? 0.38 : 0.2,
        ease: on ? "power2.out" : "power1.in",
        overwrite: true,
      });
      if (on) gsap.fromTo(lis[i], { x: -6 }, { x: 0, duration: 0.5, ease: "power3.out" });
    });
    const cap = t >= hero.captionAt;
    if (cap !== capOn.current) {
      capOn.current = cap;
      gsap.to(el.querySelector(".hero-caption"), {
        autoAlpha: cap ? 1 : 0,
        y: cap ? 0 : 18,
        duration: cap ? 0.7 : 0.3,
        ease: cap ? "power3.out" : "power1.in",
        overwrite: true,
      });
    }
  };

  return (
    <SaffronFilm
      id="plating"
      film={heroFilm}
      arrive={0}
      eager
      blockLoader
      intro={{ to: 1.6, secs: 1.6 }}
      className="hero"
      place={() => ({ x: 0.5, y: 0.5 })}
      onTime={onTime}
    >
      <div ref={root} className="hero-pool" aria-hidden />

      <div className="hero-ticket" data-hero-ticket>
        <div className="hero-ticket-head">
          {ticket.head.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
        <ul>
          {ticket.items.map((it) => (
            <li key={it.label} className="is-done" data-at={it.at}>
              <span className="hero-tick" aria-hidden>
                <svg viewBox="0 0 24 24">
                  <path d="M4 12.5l5 5L20 6.5" />
                </svg>
              </span>
              {it.label}
            </li>
          ))}
        </ul>
      </div>

      <p className="hero-caption" data-hero-caption>
        {hero.caption}
      </p>

      <div className="hero-bottom">
        <div className="hero-titlewrap">
          <p className="hero-kicker">{hero.kicker}</p>
          <h1 className="hero-title" aria-label={hero.title.join(" ")}>
            {hero.title.map((line) => (
              <span key={line} className="hero-line" aria-hidden>
                <span className="hero-outline">{line}</span>
                <span className="hero-fill">{line}</span>
              </span>
            ))}
          </h1>
        </div>
        <div className="hero-side">
          <p className="hero-priceline">{hero.priceLine}</p>
          <p className="hero-price">
            <span className="hero-price-num js-price-flip">{hero.price}</span> <span>per guest</span>
          </p>
          <a href="#reserve" className="ss-btn" data-cursor="Book">
            {hero.cta}
          </a>
        </div>
      </div>
    </SaffronFilm>
  );
}
