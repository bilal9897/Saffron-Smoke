"use client";

import { useEffect, useRef, useState } from "react";
import { isRecording, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { reserve } from "../content";
import gsap from "gsap";

type State = { day: number | null; guests: number; time: string | null; held: boolean };
const EMPTY: State = { day: null, guests: 2, time: null, held: false };
const DEMO: State = { day: reserve.demo.day, guests: reserve.demo.guests, time: reserve.demo.time, held: true };

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#C89B3C" />
  </svg>
);

const OutlineIcons = {
  Michelin: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6F5D4C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v6M12 17v6M1 12h6M17 12h6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
    </svg>
  ),
  TastingMenu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6F5D4C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h12M12 4v8M9 8h6M5 14h14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
    </svg>
  ),
  WinePairing: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6F5D4C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 22h8"></path>
      <path d="M12 15v7"></path>
      <path d="M7 3h10l-2.5 12h-5L7 3z"></path>
      <path d="M8 8h8"></path>
    </svg>
  ),
  Experience: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6F5D4C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  )
};

export default function ReserveTable() {
  const root = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [s, setS] = useState<State>(EMPTY);
  const set = (p: Partial<State>) => setS((o) => ({ ...o, ...p, held: p.held ?? false }));

  useEffect(() => {
    if (prefersReducedMotion()) {
      setS(DEMO);
      return;
    }
    const el = root.current!;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".reserve-anim",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 60%",
          }
        }
      );

      gsap.fromTo(
        ".reserve-panel",
        { y: 40, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 55%",
          }
        }
      );

      gsap.to(imgRef.current, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

    }, root);

    if (!isRecording()) return;
    let timers: number[] = [];
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      const steps: [number, Partial<State>][] = [
        [0.0, { day: reserve.demo.day }],
        [0.4, { guests: 3 }],
        [0.8, { guests: reserve.demo.guests }],
        [1.2, { time: reserve.demo.time }],
        [1.6, { held: true }],
      ];
      timers = steps.map(([t, p]) => window.setTimeout(() => setS((o) => ({ ...o, ...p })), t * 1000));
    };
    const st = ScrollTrigger.create({ trigger: el, start: "top 75%", once: true, onEnter: play });
    return () => {
      ctx.revert();
      st.kill();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section
      ref={root}
      id="reserve"
      data-chapter="reserve"
      className="reserve-section"
      data-record-time={1.0}
      data-record-hold={1.2}
      data-record-label="Reserve"
    >
      <div className="reserve-bg-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/reservation-bg.jpg" alt="Atmosphere" className="reserve-bg-img" />
        <div className="reserve-bg-gradient"></div>
      </div>

      <div className="reserve-container">
        <div className="reserve-content-split">

          <div className="reserve-left">
            <div className="reserve-label reserve-anim">
              <div className="reserve-label-line">
                <div className="rll-circle-top"></div>
                <div className="rll-circle-solid"></div>
              </div>
              <span className="reserve-label-text">VI &nbsp;&nbsp;&nbsp; RESERVATIONS</span>
            </div>

            <h2 className="reserve-title">
              <span className="reserve-title-serif reserve-anim">Join us</span>
              <br />
              <span className="reserve-title-italic reserve-anim">for dinner.</span>
            </h2>

            <div className="reserve-meta reserve-anim">
              <span className="reserve-meta-item">TASTING MENU ONLY</span>
              <span className="reserve-meta-sep">|</span>
              <span className="reserve-meta-item">2 H 40 MIN</span>
              <span className="reserve-meta-sep">|</span>
              <span className="reserve-meta-item">₹7,500 PER GUEST</span>
            </div>

            <div className="reserve-rating reserve-anim">
              <StarIcon />
              <span>4.9 from 1,280 diners</span>
            </div>

            <div className="reserve-image-wrapper reserve-anim">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={imgRef} src="/images/reservation-dish.jpg" alt="Signature Dish" className="reserve-image" />
            </div>
          </div>

          <div className="reserve-right">
            <div className="reserve-panel">
              <div className="rp-header">
                <span className="rp-month">{reserve.month}</span>
                <span className="rp-status">CLOSED MONDAYS</span>
              </div>

              <div className="rp-days" role="group" aria-label="Day">
                {reserve.days.map((d) => (
                  <button
                    key={d.d}
                    type="button"
                    className={`rp-day ${s.day === d.d ? "is-on" : ""}`}
                    onClick={() => set({ day: d.d })}
                  >
                    <span className="rp-dow">{d.dow}</span>
                    <span className="rp-date">{d.d}</span>
                  </button>
                ))}
              </div>

              <div className="rp-divider"></div>

              <div className="rp-row">
                <span className="rp-label">GUESTS</span>
                <div className="rp-stepper">
                  <button type="button" aria-label="Fewer guests" onClick={() => set({ guests: Math.max(1, s.guests - 1) })}>
                    −
                  </button>
                  <b key={s.guests} className="rp-num">
                    {s.guests}
                  </b>
                  <button type="button" aria-label="More guests" onClick={() => set({ guests: Math.min(8, s.guests + 1) })}>
                    +
                  </button>
                </div>
              </div>

              <div className="rp-divider"></div>

              <div className="rp-row">
                <span className="rp-label">PICK A TIME</span>
              </div>

              <div className="rp-times" role="group" aria-label="Time">
                {reserve.times.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`rp-time ${s.time === t ? "is-on" : ""}`}
                    onClick={() => set({ time: t })}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="rp-divider"></div>

              <div className="rp-action-wrap">
                <button
                  type="button"
                  className="rp-btn"
                  disabled={!s.day || !s.time}
                  onClick={() => setS((o) => ({ ...o, held: true }))}
                >
                  <span className="rp-btn-text">
                    {s.held ? "Table held ✓" : "RESERVE YOUR SEAT"}
                  </span>
                  {!s.held && (
                    <div className="rp-btn-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#E6C27A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>

              <div className="rp-divider-invisible"></div>

              <div className="reserve-features">
                {[
                  { icon: <OutlineIcons.Michelin />, title: "MICHELIN", subtitle: "INSPIRED" },
                  { icon: <OutlineIcons.TastingMenu />, title: "SEASONAL", subtitle: "TASTING MENU" },
                  { icon: <OutlineIcons.WinePairing />, title: "CURATED", subtitle: "WINE PAIRING" },
                  { icon: <OutlineIcons.Experience />, title: "EXCEPTIONAL", subtitle: "EXPERIENCE" },
                ].map((feat, i) => (
                  <div key={i} className="reserve-feature-card">
                    <div className="feat-icon">{feat.icon}</div>
                    <div className="feat-text">
                      <span>{feat.title}</span>
                      <span>{feat.subtitle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .reserve-section {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background-color: #F8F5EE;
          overflow: hidden;
          padding: 6vw 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2B241E;
        }

        .reserve-bg-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .reserve-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 1;
          transform: scale(1.05);
        }

        .reserve-bg-gradient {
          display: none;
        }

        .reserve-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 4vw;
          display: flex;
          flex-direction: column;
        }

        .reserve-content-split {
          display: grid;
          grid-template-columns: 4.5fr 5.5fr;
          gap: 6vw;
          align-items: center;
        }

        @media (max-width: 1024px) {
          .reserve-content-split {
            grid-template-columns: 1fr;
            gap: 4rem;
          }
        }

        .reserve-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding-right: 2vw;
        }

        .reserve-label {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }
        
        .reserve-label-line {
          position: absolute;
          left: -30px;
          top: 0;
          bottom: -40px;
          width: 1px;
          background: rgba(200, 155, 60, 0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .rll-circle-top {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #C89B3C;
          margin-top: -2px;
        }
        
        .rll-circle-solid {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #F8F5EE;
          border: 1px solid #C89B3C;
          margin-top: 15px;
        }

        .reserve-label-text {
          font-family: var(--font-sans, sans-serif);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #8B7B6C;
          font-weight: 500;
        }

        .reserve-title {
          font-size: clamp(3rem, 5.5vw, 6rem);
          line-height: 1;
          margin-bottom: 0;
          margin-left: -0.05em;
          color: #2B241E;
        }

        .reserve-title-serif {
          font-family: var(--font-serif, serif);
          font-weight: 500;
        }

        .reserve-title-italic {
          font-family: var(--font-serif-italic, serif);
          font-style: italic;
          background: linear-gradient(135deg, #E2BD75 0%, #C89B3C 50%, #A67C27 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          padding-right: 0.2em;
          font-weight: 400;
        }

        .reserve-meta {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          font-family: var(--font-sans, sans-serif);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: #6F5D4C;
          text-transform: uppercase;
          margin-bottom: 0;
          flex-wrap: wrap;
        }

        .reserve-meta-sep {
          color: rgba(200, 155, 60, 0.5);
          font-weight: 300;
        }

        .reserve-rating {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-serif, serif);
          font-size: 1.2rem;
          color: #2B241E;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .reserve-image-wrapper {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,.12);
          position: relative;
        }

        .reserve-image {
          width: 100%;
          height: 110%;
          object-fit: cover;
          position: absolute;
          top: -5%;
          left: 0;
          filter: brightness(1.05) contrast(0.95);
        }

        .reserve-panel {
          background: rgba(255,250,242,0.9);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          padding: 0.25rem 0.75rem;
          max-width: 460px;
          margin: 0 auto;
          box-shadow: 0 30px 80px rgba(0,0,0,.10), 
                      inset 0 0 40px rgba(255,255,255,0.6);
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 640px) {
          .reserve-panel {
            padding: 0.5rem;
            border-radius: 16px;
          }
        }

        .rp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0;
          font-family: var(--font-sans, sans-serif);
          font-size: 0.85rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .rp-month {
          color: #2B241E;
          font-weight: 600;
        }

        .rp-status {
          color: #8B7B6C;
        }

        .rp-days {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0;
          gap: 0.35rem;
        }

        .rp-day {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.05rem;
          padding: 0.15rem 0;
          border-radius: 6px;
          border: 1px solid rgba(200, 155, 60, 0.15);
          background: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .rp-day:hover {
          border-color: rgba(200, 155, 60, 0.4);
          background: rgba(255,255,255,0.8);
          transform: translateY(-1px);
        }

        .rp-day.is-on {
          background: #FFFFFF;
          border-color: #C89B3C;
          box-shadow: 0 4px 12px -4px rgba(200,155,60,0.2);
        }

        .rp-dow {
          font-family: var(--font-sans, sans-serif);
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #8B7B6C;
        }

        .rp-day.is-on .rp-dow {
          color: #2B241E;
          font-weight: 600;
        }

        .rp-date {
          font-family: var(--font-serif, serif);
          font-size: 1.3rem;
          color: #2B241E;
        }

        .rp-divider {
          width: 100%;
          height: 1px;
          background: rgba(200,155,60,0.2);
          position: relative;
          margin: 0;
        }
        
        .rp-divider::after {
          content: '';
          position: absolute;
          width: 3px;
          height: 3px;
          background: #C89B3C;
          transform: rotate(45deg);
          left: 50%;
          top: -1px;
        }

        .rp-divider-invisible {
          display: none;
        }

        .rp-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .rp-label {
          font-family: var(--font-sans, sans-serif);
          font-size: 0.85rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #2B241E;
          font-weight: 500;
        }

        .rp-stepper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .rp-stepper button {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid rgba(200, 155, 60, 0.3);
          background: rgba(255,255,255,0.5);
          color: #2B241E;
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .rp-stepper button:hover {
          background: #FFFFFF;
          border-color: #C89B3C;
          box-shadow: 0 4px 12px rgba(200,155,60,0.15);
        }

        .rp-num {
          font-family: var(--font-serif, serif);
          font-size: 1.3rem;
          color: #2B241E;
          font-weight: 400;
          min-width: 0.8rem;
          text-align: center;
        }

        .rp-times {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.35rem;
          margin-top: 0;
        }

        .rp-time {
          padding: 0.25rem 0;
          border-radius: 6px;
          border: 1px solid rgba(200, 155, 60, 0.15);
          background: rgba(255,255,255,0.4);
          font-family: var(--font-sans, sans-serif);
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          color: #2B241E;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .rp-time:hover {
          border-color: rgba(200, 155, 60, 0.4);
          background: rgba(255,255,255,0.8);
          transform: translateY(-1px);
        }

        .rp-time.is-on {
          background: #FFFFFF;
          border-color: #C89B3C;
          box-shadow: 0 4px 12px -4px rgba(200,155,60,0.2);
          font-weight: 500;
        }

        .rp-action-wrap {
          display: flex;
          justify-content: center;
          margin-top: 0;
        }

        .rp-btn {
          width: 100%;
          max-width: 240px;
          padding: 0.35rem 1rem;
          border-radius: 100px;
          border: none;
          background: linear-gradient(135deg, #E6C27A 0%, #C89B3C 50%, #A67C27 100%);
          color: #2B241E;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 20px -8px rgba(200,155,60,0.5),
                      inset 0 1px 1px rgba(255,255,255,0.6);
        }

        .rp-btn-text {
          font-family: var(--font-sans, sans-serif);
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
          flex: 1;
          text-align: center;
        }

        .rp-btn-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2B241E;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .rp-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -10px rgba(200,155,60,0.6),
                      inset 0 1px 2px rgba(255,255,255,0.8);
        }
        
        .rp-btn:hover:not(:disabled) .rp-btn-icon {
          transform: translateX(2px);
        }

        .rp-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(0.5);
          box-shadow: none;
        }

        .reserve-features {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.15rem;
        }

        .reserve-feature-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.15rem;
        }

        .feat-icon {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C89B3C;
        }

        .feat-text {
          display: flex;
          flex-direction: column;
          font-family: var(--font-sans, sans-serif);
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          color: #8B7B6C;
          text-transform: uppercase;
          line-height: 1.4;
        }
      `}</style>
    </section>
  );
}
