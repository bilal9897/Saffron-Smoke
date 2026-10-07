"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { pairing } from "../content";

export default function PairingSheet() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    const items = el.querySelectorAll<HTMLElement>(".pr-rows li");
    const drinks = el.querySelectorAll<HTMLElement>(".pr-drink");
    const prices = el.querySelectorAll<HTMLElement>(".pr-options p");
    let tl: gsap.core.Timeline | null = null;
    const reset = () => {
      tl?.kill();
      gsap.set(items, { autoAlpha: 0, y: 30, scale: 0.98 });
      gsap.set(prices, { autoAlpha: 0, y: 20 });
    };
    const play = () => {
      reset();
      tl = gsap.timeline();
      tl.to(items, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", stagger: 0.1 });
      tl.to(prices, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.15 }, 0.4);
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
            {pairing.rows.map((r, i) => {
              const imageMap: Record<string, string> = {
                "Golgappa": "/images/golgappa.jpg",
                "Prawn": "/images/prawn.jpg",
                "Paneer": "/images/paneer.jpg",
                "Shank": "/images/shank.jpg",
              };
              const imgUrl = imageMap[r.dish] || "/images/shank.jpg";

              return (
              <li key={r.dish} className="pr-card">
                <div className="pr-card-content">
                  <div className="pr-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgUrl} alt={r.dish} />
                  </div>
                  <span className="pr-dish">{r.dish}</span>
                  <div className="pr-divider"></div>
                  <span className="pr-drink">{r.drink}</span>
                  <span className="pr-arrow">→</span>
                </div>
              </li>
              );
            })}
          </ul>
          <div className="pr-options">
            {pairing.options.map((o) => (
              <p key={o.name} className="pr-price-card">
                <span className="pr-opt">{o.name}</span>
                <span className="pr-price">{o.price}</span>
              </p>
            ))}
          </div>
          <p className="pr-note">{pairing.note}</p>
        </div>
        <figure className="pr-pic">
          <div className="pr-gold-ring"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pairing.image} alt="A saffron cordial over ice with lime, saffron threads and cardamom" draggable={false} />
        </figure>
      </div>
    </section>
  );
}
