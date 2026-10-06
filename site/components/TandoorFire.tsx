"use client";

import { useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import SaffronFilm from "./SaffronFilm";
import FlipNum, { type FlipHandle } from "./FlipNum";
import { fire, fireFilm } from "../content";
import type { Rect } from "../lib/film";

/**
 * ST11 + M441 over the tandoor film. The film starts ash-grey; its colour rises from the coals upward as you scroll,
 * behind a flickering ember edge line, linear over the whole pin so it finishes exactly at the end (LESSON 9). The grey
 * is a "saturation" blend drawn in the film canvas itself (no CSS/canvas filter: LESSON 59). The heat label rides the
 * line (0 → 480 °C) and the four stats roll up as flip digits. ?static=1: full colour, final numbers.
 */
export default function TandoorFire() {
  const heat = useRef(prefersReducedMotionSafe() ? 1 : 0);
  const stage = useRef<HTMLDivElement>(null);
  const flips = useRef<(FlipHandle | null)[]>([]);

  const post = (ctx: CanvasRenderingContext2D, _r: Rect, cw: number, ch: number) => {
    const h = heat.current;
    if (h >= 1) return;
    const y = ch * (1 - h); // colour below y, grey above
    const band = ch * 0.12;
    ctx.save();
    // grey above the line, softened over a band so the edge reads as heat, not a cut
    const g = ctx.createLinearGradient(0, y - band, 0, y);
    g.addColorStop(0, "rgba(128,128,128,1)");
    g.addColorStop(1, "rgba(128,128,128,0)");
    ctx.globalCompositeOperation = "saturation";
    ctx.fillStyle = "rgb(128,128,128)";
    ctx.fillRect(0, 0, cw, Math.max(0, y - band));
    ctx.fillStyle = g;
    ctx.fillRect(0, y - band, cw, band);
    // the ember edge: a bright flickering line where the colour arrives
    const t = performance.now() / 1000;
    const flick = 0.75 + 0.25 * Math.sin(t * 11) * Math.sin(t * 6.7);
    const e = ctx.createLinearGradient(0, y - 10, 0, y + 10);
    e.addColorStop(0, "rgba(226,85,43,0)");
    e.addColorStop(0.5, `rgba(244,180,26,${(0.85 * flick).toFixed(3)})`);
    e.addColorStop(1, "rgba(226,85,43,0)");
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = e;
    ctx.fillRect(0, y - 10, cw, 20);
    ctx.restore();
  };

  const onTime = (_t: number, p: number) => {
    heat.current = p;
    const el = stage.current;
    if (!el) return;
    el.style.setProperty("--heat", p.toFixed(4));
    const label = el.querySelector<HTMLElement>(".fire-heat-num");
    if (label) label.textContent = `${Math.round(480 * p)} °C`;
    // stats roll up while the heat climbs (25 → 90 % of the pin), each a little after the last
    fire.stats.forEach((_s, i) => {
      const a = 0.22 + i * 0.07;
      flips.current[i]?.set((p - a) / 0.5);
    });
  };

  return (
    <SaffronFilm
      id="fire"
      film={fireFilm}
      arrive={0.8}
      loadWhen="#tasting"
      className="sheet fire"
      place={() => ({ x: 0.56, y: 0.5, fade: { l: 0.18 }, post })}
      onTime={onTime}
    >
      <div ref={stage} className="fire-overlay">
        <div className="fire-heat" aria-hidden>
          <span className="fire-heat-num">480 °C</span>
        </div>
        <div className="fire-pool" aria-hidden />

        <div className="fire-copy">
          <p className="ss-meta">
            <span>III</span> The kitchen fire
          </p>
          <h2 className="fire-title">
            {fire.title[0]}
            <br />
            <em>{fire.title[1]}</em>
          </h2>
          <p className="fire-text">{fire.copy}</p>
        </div>

        <dl className="fire-stats">
          {fire.stats.map((s, i) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>
                <FlipNum
                  value={s.value}
                  ref={(h) => {
                    flips.current[i] = h;
                  }}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </SaffronFilm>
  );
}

function prefersReducedMotionSafe() {
  return typeof window !== "undefined" && prefersReducedMotion();
}
