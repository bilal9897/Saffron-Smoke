"use client";

import { useEffect, useRef, useState } from "react";
import { isRecording, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { reserve } from "../content";

type State = { day: number | null; guests: number; time: string | null; held: boolean };
const EMPTY: State = { day: null, guests: 2, time: null, held: false };
const DEMO: State = { day: reserve.demo.day, guests: reserve.demo.guests, time: reserve.demo.time, held: true };

/**
 * BK05 restyled: week strip + guest stepper + time chips + a summary ticket. Normal mode: nothing changes by itself,
 * only on click. ?record=1 only: as the section arrives (its top passes 75 % of the screen) a scripted booking plays
 * once, one snappy step every 0.4 s: Sat 17 → 3 → 4 guests → 20:30 → "Table held". It starts early in the arrival
 * move, so all five steps land inside the 1.2 s hold. ?static=1: the booked state.
 * M266: every change of date / guests / time flips into the ticket like a flip-clock card; "Held" stamps on at the end.
 */
export default function ReserveTable() {
  const root = useRef<HTMLElement>(null);
  const [s, setS] = useState<State>(EMPTY);
  const set = (p: Partial<State>) => setS((o) => ({ ...o, ...p, held: p.held ?? false }));

  useEffect(() => {
    if (prefersReducedMotion()) {
      setS(DEMO);
      return;
    }
    if (!isRecording()) return; // hands-free booking is for filming only
    const el = root.current!;
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
      st.kill();
      timers.forEach(clearTimeout);
    };
  }, []);

  const dayObj = reserve.days.find((d) => d.d === s.day);
  const summary = [
    dayObj ? `${dayObj.dow.toUpperCase()} ${dayObj.d} OCT` : "PICK A DAY",
    `${s.guests} GUESTS`,
    s.time ?? "PICK A TIME",
  ];

  return (
    <section
      ref={root}
      id="reserve"
      data-chapter="reserve"
      className="sheet bk"
      data-record-time={1.0}
      data-record-hold={1.2}
      data-record-label="Reserve"
    >
      {/* X3 edge curl: the sheet's top-left corner arrives curled up and flattens as it lands (Handovers.tsx) */}
      <svg className="bk-curl" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden>
        <path d="M0 120 L0 120 C 0 120, 0 120, 1 120 Z" />
        <path className="bk-curl-lip" d="M0 120 C 0 120, 0 120, 1 120" />
      </svg>
      <div className="bk-grid">
        <div className="bk-intro">
          <p className="ss-meta">
            <span>VI</span> Reservations
          </p>
          <h2 className="bk-title">
            {reserve.title[0]}
            <br />
            <em>{reserve.title[1]}</em>
          </h2>
          <ul className="bk-notes">
            {reserve.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <p className="bk-rating">{reserve.rating}</p>
        </div>

        <div className="bk-card">
          <div className="bk-row bk-row-head">
            <span className="ss-meta">{reserve.month}</span>
            <span className="ss-meta">Closed Mondays</span>
          </div>

          <div className="bk-days" role="group" aria-label="Day">
            {reserve.days.map((d) => (
              <button
                key={d.d}
                type="button"
                className={`bk-day ${s.day === d.d ? "is-on" : ""}`}
                onClick={() => set({ day: d.d })}
                data-cursor="Book"
              >
                <span>{d.dow}</span>
                <b>{d.d}</b>
              </button>
            ))}
          </div>

          <div className="bk-row">
            <span className="bk-label">Guests</span>
            <div className="bk-stepper">
              <button type="button" aria-label="Fewer guests" onClick={() => set({ guests: Math.max(1, s.guests - 1) })}>
                −
              </button>
              <b key={s.guests} className="bk-flipnum">
                {s.guests}
              </b>
              <button type="button" aria-label="More guests" onClick={() => set({ guests: Math.min(8, s.guests + 1) })}>
                +
              </button>
            </div>
          </div>

          <div className="bk-times" role="group" aria-label="Time">
            {reserve.times.map((t) => (
              <button
                key={t}
                type="button"
                className={`bk-time ${s.time === t ? "is-on" : ""}`}
                onClick={() => set({ time: t })}
                data-cursor="Book"
              >
                {t}
              </button>
            ))}
          </div>

          <div className={`bk-ticket ${s.held ? "is-held" : ""}`}>
            <p className="bk-summary" aria-live="polite">
              {/* M266: a segment that changes is a new card that flips down into place (key = its text) */}
              {summary.map((x, i) => (
                <span key={`${i}-${x}`} className="bk-flip">
                  {/* the separator ends the part before it (non-breaking), so a wrapped line never starts with "·" */}
                  {i < summary.length - 1 ? `${x}\u00a0·` : x}
                </span>
              ))}
            </p>
            <button
              type="button"
              className="ss-btn bk-hold"
              disabled={!s.day || !s.time}
              onClick={() => setS((o) => ({ ...o, held: true }))}
            >
              {s.held ? "Table held ✓" : reserve.button}
            </button>
            {s.held && (
              <span className="bk-stamp" aria-hidden>
                Held
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
