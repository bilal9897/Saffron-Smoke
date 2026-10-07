"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, isRecording, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { chapters, hero } from "../content";

/**
 * NV10 restyled as the menu's own contents: wordmark top-left (hairline underline draws on hover), a magnetic saffron
 * Reserve pill top-right (leans toward the pointer on a calm ease, a bone fill wipes across on hover), and a slim course
 * rail on the right edge (I–VI ticks, the current chapter named).
 * M128: when the chapter changes, the label rolls on a drum: the old name tips up and away, the new one rolls up from
 * below. The II tick bumps each time a course finishes cooking ("saffron:cooked" from the tasting stage).
 * Hands-free (filming only, ?record=1): as the booking sheet arrives the pill leans and wipes once by itself.
 */
export default function CourseRail() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const drum = useRef<HTMLSpanElement>(null);
  const pill = useRef<HTMLAnchorElement>(null);
  const ticks = useRef<HTMLOListElement>(null);
  const activeRef = useRef(0);

  // active chapter: the last one whose top has passed 55 % of the screen (robust to jumps)
  useEffect(() => {
    const els = chapters.map((c) => document.querySelector<HTMLElement>(`[data-chapter="${c.id}"]`));
    const update = () => {
      const line = window.innerHeight * 0.55;
      let i = 0;
      els.forEach((el, k) => {
        if (el && el.getBoundingClientRect().top <= line) i = k;
      });
      if (i !== activeRef.current) {
        setPrev(activeRef.current);
        activeRef.current = i;
        setActive(i);
      }
    };
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: update, onRefresh: update });
    update();
    return () => st.kill();
  }, []);

  // M128 drum roll on every chapter change
  useEffect(() => {
    if (prev === null || prefersReducedMotion() || !drum.current) return;
    const [out, inn] = drum.current.querySelectorAll<HTMLElement>(".ss-drum-face");
    const fwd = active > prev; // scrolling forward rolls up, back rolls down
    gsap.fromTo(
      out,
      { yPercent: 0, rotationX: 0, autoAlpha: 1 },
      { yPercent: fwd ? -100 : 100, rotationX: fwd ? 80 : -80, autoAlpha: 0, duration: 0.45, ease: "power2.in", overwrite: true },
    );
    gsap.fromTo(
      inn,
      { yPercent: fwd ? 100 : -100, rotationX: fwd ? -80 : 80, autoAlpha: 0 },
      { yPercent: 0, rotationX: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out", delay: 0.08, overwrite: true },
    );
  }, [active, prev]);

  // magnetic pill (calm ease, no elastic) + record-only hands-free lean & wipe; II tick bump on each cooked course
  useEffect(() => {
    const el = pill.current;
    if (!el || prefersReducedMotion()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.25);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);

    let st: ScrollTrigger | null = null;
    const reserveEl = document.querySelector("#reserve");
    if (isRecording() && reserveEl)
      st = ScrollTrigger.create({
        trigger: reserveEl,
        start: "top 80%",
        once: true,
        onEnter: () => {
          el.classList.add("is-wipe");
          gsap
            .timeline()
            .to(el, { x: -10, y: 4, duration: 0.45, ease: "power3.out" })
            .to(el, { x: 0, y: 0, duration: 0.6, ease: "power3.inOut" })
            .add(() => el.classList.remove("is-wipe"), 0.95);
        },
      });

    const bump = () => {
      const t = ticks.current?.children[1] as HTMLElement | undefined;
      if (t) gsap.fromTo(t, { scale: 1.45 }, { scale: 1, duration: 0.5, ease: "power3.out", overwrite: true });
    };
    window.addEventListener("saffron:cooked", bump);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      window.removeEventListener("saffron:cooked", bump);
      st?.kill();
    };
  }, []);

  const cur = chapters[active];
  const old = chapters[prev ?? active];
  const paper = cur.id === "pairing" || cur.id === "tasting"; // light bg: switch to ink

  return (
    <>
      <header className={`ss-bar ${paper ? "on-paper" : ""}`}>
        <a href="#plating" className="ss-wordmark" data-cursor="Top">
          Saffron <i>&amp;</i> Smoke
        </a>
        <a ref={pill} href="#reserve" className="ss-pill" data-cursor="Book">
          <span className="ss-pill-label">{hero.cta}</span>
        </a>
      </header>
      <nav className={`ss-rail ${paper ? "on-paper" : ""}`} aria-label="Chapters">
        <div className="ss-rail-label">
          <span ref={drum} className="ss-rail-drum">
            <span className="ss-drum-face ss-drum-old" aria-hidden>
              <span className="ss-rail-num">{old.num}</span> · {old.label}
            </span>
            <span className="ss-drum-face">
              <span className="ss-rail-num">{cur.num}</span> · {cur.label}
            </span>
          </span>
        </div>
        <ol ref={ticks} className="ss-rail-ticks">
          {chapters.map((c, i) => (
            <li key={c.id} className={i === active ? "is-on" : i < active ? "is-past" : ""}>
              <a href={`#${c.id}`} aria-label={`${c.num} · ${c.label}`}>
                <span>{c.num}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
