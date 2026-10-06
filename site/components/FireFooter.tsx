"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { footer, hero } from "../content";

/**
 * FO14 restyled: a tall crop of the finished dish on the left (the plate the hero built), the wordmark at its foot,
 * info on the right: address, hours, Reserve, links, concept note.
 * M222: the wordmark is SVG text: its bone outline draws on (stroke dash per glyph), then it rises into place and fills
 * from the bottom (clip rect), played once the wordmark itself comes on screen, so it finishes as the page rests.
 * A broad candle glow drifts over the photo so the resting end screen is never still (LESSONS 35/55).
 * The record end stop is the marker after the footer (LESSON 66). ?static=1: drawn, risen and filled.
 */
export default function FireFooter() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    const outline = el.querySelector<SVGTextElement>(".ft-wm-outline");
    const fillRect = el.querySelector<SVGRectElement>(".ft-wm-cliprect");
    const wm = el.querySelector<SVGSVGElement>(".ft-wm");
    const ctx = gsap.context(() => {
      // on the clock from the moment the wordmark itself is on screen (it sits at the very foot of the page, so a
      // scroll-tied version finished before anyone could see it): outline 0.6 s → rise → fill, ≈ 1.3 s in all
      const tl = gsap
        .timeline({ paused: true })
        .fromTo(outline, { strokeDashoffset: 420 }, { strokeDashoffset: 0, ease: "power1.inOut", duration: 0.6 }, 0)
        .fromTo(wm, { yPercent: 40 }, { yPercent: 0, ease: "power3.out", duration: 0.6 }, 0.35)
        .fromTo(fillRect, { attr: { y: 100, height: 0 } }, { attr: { y: 0, height: 100 }, ease: "power1.inOut", duration: 0.55 }, 0.75);
      ScrollTrigger.create({
        trigger: wm,
        start: "top bottom",
        onEnter: () => tl.restart(),
        onLeaveBack: () => tl.pause(0),
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={root} className="sheet ft" data-record-time={1.2} data-record-offset="-160" data-record-label="Footer">
      <div className="ft-grid">
        <figure className="ft-pic">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={footer.image} alt="" draggable={false} />
          <div className="ft-glow" aria-hidden />
          <svg className="ft-wm" viewBox="0 0 500 100" aria-label={footer.wordmark} role="img">
            <defs>
              <clipPath id="ft-wm-clip">
                <rect className="ft-wm-cliprect" x="0" y="0" width="500" height="100" />
              </clipPath>
            </defs>
            <text className="ft-wm-fill" x="0" y="78" clipPath="url(#ft-wm-clip)">
              {footer.wordmark}
            </text>
            <text className="ft-wm-outline" x="0" y="78">
              {footer.wordmark}
            </text>
          </svg>
        </figure>

        <div className="ft-info">
          <h2 className="ft-title">{footer.title}</h2>
          <div className="ft-cols">
            <div>
              <p className="ss-meta">Find us</p>
              {footer.address.map((l) => (
                <p key={l} className="ft-line">
                  {l}
                </p>
              ))}
            </div>
            <div>
              <p className="ss-meta">Hours</p>
              {footer.hours.map((l) => (
                <p key={l} className="ft-line">
                  {l}
                </p>
              ))}
            </div>
          </div>
          <div className="ft-actions">
            <a href="#reserve" className="ss-btn" data-cursor="Book">
              {hero.cta}
            </a>
            <ul className="ft-links">
              {footer.links.map((l) => (
                <li key={l}>
                  <a href="#plating" className="ft-link">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="ft-note">{footer.note}</p>
        </div>
      </div>
      <div aria-hidden className="ft-end" data-record-time={0.8} data-record-label="End" />
    </footer>
  );
}
