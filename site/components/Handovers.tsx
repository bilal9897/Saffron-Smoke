"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { IMG } from "../content";
import { onOpen } from "../lib/open";

/**
 * Section hand-overs (DESIGN.md → Transitions) + S11 sheet tilts. Each hand-over is scrubbed over the NEXT section's
 * arrival (its top travelling from the bottom of the screen to its stop), i.e. 0.8–1.2 record seconds, and all are
 * calmer than the burn:
 *  hero → tasting   X20 smoke: a band of smoke (pre-rendered texture, no live filter) rises through the seam
 *  tasting → fire   X12 fade through black, with embers drifting up in the dark (never a dead black)
 *  fire → shank     X15 vignette: the edges close in, then open on the candle-lit dish (gone before the hold)
 *  shank → pairing  X2 colour wash: the sheet's ground goes charcoal → bone paper as it arrives
 *  pairing → reserve X3 edge curl: the charcoal sheet arrives with its top-left corner curled up, flattening as it lands
 *  reserve → footer X16 cut-and-stamp: the footer lands with a 4 px press jolt
 * S11: every sheet arrives tilted 0.5–1° (alternating) and settles flat as it lands.
 * ?static=1: none of it (every sheet flat, no veils).
 */
export default function Handovers() {
  const smoke = useRef<HTMLDivElement>(null);
  const black = useRef<HTMLDivElement>(null);
  const vignette = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const arrive = (sel: string, end = "top top") => ({ trigger: sel, start: "top bottom", end, scrub: true });
    const ctx = gsap.context(() => {
      // X20 smoke through the hero → tasting seam
      gsap
        .timeline({ scrollTrigger: arrive("#tasting") })
        .fromTo(smoke.current, { yPercent: 55, scale: 1.05, autoAlpha: 0 }, { yPercent: -55, scale: 1.25, ease: "none", duration: 1 }, 0)
        .to(smoke.current, { autoAlpha: 0.9, duration: 0.45, ease: "sine.out" }, 0)
        .to(smoke.current, { autoAlpha: 0, duration: 0.45, ease: "sine.in" }, 0.55);

      // X12 fade through black (with embers) into the fire
      gsap
        .timeline({ scrollTrigger: arrive("#fire") })
        .fromTo(black.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.inOut" }, 0)
        .to(black.current, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, 0.5);

      // X15 vignette spotlight onto the dish (open again well before the hold)
      gsap
        .timeline({ scrollTrigger: arrive("#shank", "top 15%") })
        .fromTo(vignette.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "sine.inOut" }, 0)
        .to(vignette.current, { autoAlpha: 0, duration: 0.55, ease: "sine.inOut" }, 0.45);

      // X2 colour wash: the pairing sheet's ground goes charcoal → bone paper as it arrives
      gsap.fromTo(
        "#pairing",
        { backgroundColor: "#121110" },
        { backgroundColor: "#ede5d6", ease: "none", scrollTrigger: arrive("#pairing", "top 35%") },
      );

      // X3 edge curl: the booking sheet arrives with its top-left corner curled, flattening as it lands
      const curl = { k: 1 };
      const edge = document.querySelector<SVGPathElement>(".bk-curl path");
      const lip = document.querySelector<SVGPathElement>(".bk-curl .bk-curl-lip");
      const drawCurl = () => {
        const k = curl.k;
        const d = `M0 120 L0 ${(120 - 96 * k).toFixed(1)} C ${(150 * k).toFixed(1)} ${(120 - 46 * k).toFixed(1)}, ${(420 * k).toFixed(1)} 120, ${(720 * k + 1).toFixed(1)} 120 Z`;
        edge?.setAttribute("d", d);
        lip?.setAttribute("d", `M0 ${(120 - 96 * k).toFixed(1)} C ${(150 * k).toFixed(1)} ${(120 - 46 * k).toFixed(1)}, ${(420 * k).toFixed(1)} 120, ${(720 * k + 1).toFixed(1)} 120`);
      };
      drawCurl();
      gsap.fromTo(curl, { k: 1 }, { k: 0, ease: "sine.out", onUpdate: drawCurl, scrollTrigger: arrive("#reserve", "top 10%") });

      // X16 cut-and-stamp: the footer lands with a press jolt
      ScrollTrigger.create({
        trigger: ".ft",
        start: "top 70%",
        onEnter: () => gsap.fromTo(".ft-grid", { y: 4 }, { y: 0, duration: 0.35, ease: "expo.out", overwrite: true }),
      });

      // price flip on enter: the figure turns down into place like a menu card (hero: as the curtain lifts)
      const flip = (el: Element) =>
        gsap.fromTo(el, { rotationX: -90, transformOrigin: "50% 0%" }, { rotationX: 0, duration: 0.55, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>(".js-price-flip").forEach((el) => {
        if (el.closest("#plating")) return;
        gsap.set(el, { rotationX: -90, transformOrigin: "50% 0%" });
        ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => flip(el) });
      });

      // S11: each sheet arrives tilted (alternating sides) and settles flat as it lands
      gsap.utils.toArray<HTMLElement>(".sheet").forEach((el, i) => {
        gsap.fromTo(
          el,
          { rotation: i % 2 ? 0.8 : -0.8, transformOrigin: "50% 0%" },
          { rotation: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 18%", scrub: true } },
        );
      });
    });
    const heroPrice = document.querySelector("#plating .js-price-flip");
    if (heroPrice) gsap.set(heroPrice, { rotationX: -90, transformOrigin: "50% 0%" });
    const off = onOpen(() => heroPrice && gsap.to(heroPrice, { rotationX: 0, duration: 0.6, ease: "power3.out", delay: 0.5 }));
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <div className="handovers" aria-hidden>
      <div ref={smoke} className="ho-smoke" style={{ backgroundImage: `url(${IMG}/smoke.webp)` }} />
      <div ref={black} className="ho-black">
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i} className="ho-ember" style={{ left: `${(i * 61) % 100}%`, animationDelay: `${-((i * 0.37) % 2.4)}s` }} />
        ))}
      </div>
      <div ref={vignette} className="ho-vignette" />
    </div>
  );
}
