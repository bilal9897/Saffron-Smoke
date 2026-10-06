"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

/**
 * Flip digits for the tandoor stats: each digit is a 0–9 strip in a mask that rolls continuously (odometer maths,
 * so no stepped frames: LESSON 10), with a slight rotateX tilt while it moves. `set(k)` shows value × k (0..1).
 * The markup holds the final value, so ?static=1 and no-JS show "480 °C", "1", "5 pm", "14 h".
 */
export type FlipHandle = { set: (k: number) => void };

const FlipNum = forwardRef<FlipHandle, { value: string; className?: string }>(function FlipNum({ value, className }, ref) {
  const m = value.match(/^(\d+)(.*)$/);
  const num = m ? Number(m[1]) : 0;
  const digits = m ? m[1].length : 0;
  const suffix = m ? m[2] : value;
  const cols = useRef<(HTMLSpanElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    set(k: number) {
      const v = num * Math.min(1, Math.max(0, k));
      cols.current.forEach((el, i) => {
        if (!el) return;
        const place = 10 ** (digits - 1 - i);
        // odometer: the units roll continuously; a higher digit only turns while the digits below go 9 → 0
        const base = Math.floor(v / place) % 10;
        const turn = place === 1 ? v - Math.floor(v) : Math.min(1, Math.max(0, (v % place) - (place - 1)));
        const raw = base + turn;
        const frac = raw - Math.floor(raw);
        const tilt = Math.sin(frac * Math.PI) * 28; // tips back mid-roll, flat when it lands
        el.style.transform = `translateY(${(-raw * 100) / 11}%) rotateX(${tilt.toFixed(1)}deg)`; // one cell = 100/11 % of the strip
      });
    },
  }));

  if (!m) return <span className={className}>{value}</span>;

  return (
    <span className={`flipnum ${className ?? ""}`} aria-label={value}>
      {m[1].split("").map((d, i) => (
        <span key={i} className="flipnum-mask" aria-hidden>
          {/* the cell is as wide as its FINAL digit (a proportional "1" sits tight: "14 h", not "1 4h") */}
          <span className="flipnum-size">{d}</span>
          <span
            ref={(el) => {
              cols.current[i] = el;
            }}
            className="flipnum-strip"
            style={{ transform: `translateY(${(-Number(d) * 100) / 11}%)` }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((x, j) => (
              <span key={j}>{x}</span>
            ))}
          </span>
        </span>
      ))}
      {suffix && <span aria-hidden>{suffix.replace(/^ /, "\u00a0")}</span>}
    </span>
  );
});

export default FlipNum;
