"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { filmPinVh, filmStops, filmTimeAt, useFilm, type Film, type FilmPlayer, type Place } from "../lib/film";
import { onOpen } from "../lib/open";

/**
 * Site copy of components/patterns/FilmPin.tsx: a pinned scroll film played by VIDEO TIME (site/lib/film.ts, charcoal
 * page colour, desktop only). Changes: the hero intro starts on the site loader's "open" signal (not onSiteReady),
 * and the stage has the site's pin classes. Record mode: the section top is a stop, then one stop per segment.
 * ?static=1: no pin, the stage shows the film's poster second.
 */
export default function SaffronFilm({
  id,
  film,
  arrive,
  eager = false,
  blockLoader = false,
  className = "",
  onTime,
  playerRef,
  children,
  place,
  loadWhen,
  intro,
}: {
  id: string;
  film: Film;
  arrive: number;
  eager?: boolean;
  blockLoader?: boolean;
  className?: string;
  onTime?: (t: number, p: number) => void;
  playerRef?: React.MutableRefObject<FilmPlayer | null>;
  children?: React.ReactNode;
  place?: () => Place;
  loadWhen?: string;
  intro?: { to: number; secs: number };
}) {
  const outer = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const player = useFilm(film.frames, canvas, { eager, blockLoader, initial: film.start, place, loadWhen });
  const cb = useRef(onTime);
  cb.current = onTime;
  const pinVh = filmPinVh(film);

  useEffect(() => {
    if (playerRef) playerRef.current = player.current;
    if (prefersReducedMotion()) {
      player.current.seekTime(film.poster);
      cb.current?.(film.poster, 1);
      return;
    }
    const auto = { t: film.start };
    let lastP = 0;
    const apply = (p: number) => {
      lastP = p;
      const t = Math.max(filmTimeAt(film, p), auto.t);
      player.current.seekTime(t);
      cb.current?.(t, p);
    };
    apply(0);
    const st = ScrollTrigger.create({
      trigger: outer.current!,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });
    // linear and long: keeps moving until the scroll overtakes it (LESSON 64)
    const offIntro = intro
      ? onOpen(() => {
          gsap.to(auto, { t: intro.to, duration: intro.secs, ease: "none", onUpdate: () => apply(lastP) });
        })
      : () => {};
    return () => {
      offIntro();
      st.kill();
    };
  }, [film, player, playerRef, intro]);

  const stops = filmStops(film);

  return (
    <section
      ref={outer}
      id={id}
      data-chapter={id}
      className={`pin-outer ${className}`}
      style={{ height: `calc(100svh + ${pinVh}vh)` }}
      data-record-time={arrive}
      data-record-label={id}
    >
      {stops.map((s) => (
        <div
          key={s.label}
          aria-hidden
          className="rec-stop pointer-events-none absolute left-0 h-px w-px"
          style={{ top: `${(pinVh * s.p).toFixed(2)}vh` }}
          data-record-time={s.secs}
          data-record-label={s.label}
        />
      ))}
      <div className="pin-stage">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
        {children}
      </div>
    </section>
  );
}
