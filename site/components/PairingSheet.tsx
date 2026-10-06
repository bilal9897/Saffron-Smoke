"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { pairing } from "../content";

/**
 * MN01 + M8 on the bone paper band: a printed wine list (course → glass). The dotted leaders draw from each dish
 * across to its drink, one row after another (DrawSVG on a solid mask stroke; the dots themselves stay round),
 * then each drink name settles in. The photo keeps a slow push-in so the record hold is never still (LESSON 8).
 * Leaving and coming back draws them again. ?static=1: every leader drawn.
 */
export default function PairingSheet() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    const masks = el.querySelectorAll<SVGPathElement>(".pr-leader-mask");
    const drinks = el.querySelectorAll<HTMLElement>(".pr-drink");
    const prices = el.querySelectorAll<HTMLElement>(".pr-options p");
    let tl: gsap.core.Timeline | null = null;
    const reset = () => {
      tl?.kill();
      gsap.set(masks, { drawSVG: "0%" });
      gsap.set(drinks, { autoAlpha: 0, x: -12 });
      gsap.set(prices, { autoAlpha: 0, y: 14 });
    };
    const play = () => {
      reset();
      tl = gsap.timeline();
      masks.forEach((m, i) => {
        const at = i * 0.42; // spread over the arrival + the hold, so the sheet is never still on camera
        tl!.to(m, { drawSVG: "100%", duration: 0.5, ease: "power1.inOut" }, at);
        tl!.to(drinks[i], { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out" }, at + 0.4);
      });
      tl.to(prices, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.18 }, masks.length * 0.42 + 0.1);
      // price flip: each figure turns down into place like a menu card as its box arrives
      tl.fromTo(
        el.querySelectorAll(".pr-price"),
        { rotationX: -90, transformOrigin: "50% 0%" },
        { rotationX: 0, duration: 0.5, ease: "power3.out", stagger: 0.18 },
        masks.length * 0.42 + 0.12,
      );
    };
    reset();
    const st = ScrollTrigger.create({ trigger: el, start: "top 70%", onEnter: play, onEnterBack: play, onLeaveBack: reset });
    return () => {
      st.kill();
      tl?.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      id="pairing"
      data-chapter="pairing"
      className="sheet sheet-paper pr"
      data-record-time={1.2}
      data-record-hold={1.2}
      data-record-label="Pairing"
    >
      <div className="pr-grid">
        <div className="pr-list">
          <p className="ss-meta">
            <span>V</span> The pairing
          </p>
          <h2 className="pr-title">{pairing.title}</h2>
          <ul className="pr-rows">
            {pairing.rows.map((r, i) => (
              <li key={r.dish}>
                <span className="pr-dish">{r.dish}</span>
                <svg className="pr-leader" preserveAspectRatio="none" viewBox="0 0 100 4" aria-hidden>
                  <defs>
                    <mask id={`pr-m${i}`} maskUnits="userSpaceOnUse" x="-2" y="-4" width="104" height="12">
                      <path className="pr-leader-mask" d="M0 2 H100" />
                    </mask>
                  </defs>
                  <path className="pr-leader-dots" d="M0 2 H100" mask={`url(#pr-m${i})`} />
                </svg>
                <span className="pr-drink">{r.drink}</span>
              </li>
            ))}
          </ul>
          <div className="pr-options">
            {pairing.options.map((o) => (
              <p key={o.name}>
                <span className="pr-opt">{o.name}</span>
                <span className="pr-price">{o.price}</span>
              </p>
            ))}
          </div>
          <p className="pr-note">{pairing.note}</p>
        </div>
        <figure className="pr-pic">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pairing.image} alt="A saffron cordial over ice with lime, saffron threads and cardamom" draggable={false} />
        </figure>
      </div>
    </section>
  );
}
