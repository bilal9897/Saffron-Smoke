"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { shank } from "../content";

export default function ShankDetail() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".shank-text",
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          stagger: 0.1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 60%",
          }
        }
      );
      
      gsap.fromTo(
        ".shank-img",
        { scale: 1.05 },
        {
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
          }
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="shank" data-chapter="shank" className="shank-sec" data-record-time={1.2} data-record-label={shank.title}>
      <style>{`
        .shank-sec {
          width: 100vw;
          min-height: 100vh;
          background-color: #F8F5EE;
          color: #2A211B;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 80px 40px;
          font-family: var(--font-sans, sans-serif);
        }
        
        .shank-grid {
          width: 100%;
          max-width: 1400px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          margin: 0 auto;
        }

        .shank-col-left {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          aspect-ratio: 4 / 5;
        }

        .shank-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .shank-num {
          font-family: var(--font-mono, monospace);
          font-size: 14px;
          letter-spacing: 0.1em;
          color: #C89B3C;
          margin-bottom: 24px;
        }

        .shank-title {
          font-family: var(--font-serif, serif);
          font-size: clamp(48px, 6vw, 80px);
          line-height: 1.1;
          margin-bottom: 24px;
        }
        
        .shank-sub {
          font-size: 18px;
          line-height: 1.5;
          opacity: 0.8;
          margin-bottom: 64px;
          max-width: 480px;
        }

        .shank-notes {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .shank-note {
          display: flex;
          gap: 24px;
        }

        .note-n {
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          color: #C89B3C;
          margin-top: 6px;
        }

        .note-title {
          font-family: var(--font-serif, serif);
          font-size: 24px;
          margin-bottom: 8px;
        }

        .note-text {
          font-size: 14px;
          opacity: 0.7;
          line-height: 1.5;
          max-width: 320px;
        }

        @media (max-width: 1024px) {
          .shank-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .shank-col-left {
            aspect-ratio: 16 / 9;
          }
        }
      `}</style>

      <div className="shank-grid">
        <div className="shank-col-left shank-img-wrap">
          <img src={shank.image} alt={shank.title} className="shank-img" />
        </div>
        
        <div className="shank-col-right">
          <div className="shank-num shank-text">{shank.num}</div>
          <h2 className="shank-title shank-text">{shank.title}</h2>
          <p className="shank-sub shank-text">{shank.sub}</p>
          
          <div className="shank-notes">
            {shank.notes.map((note) => (
              <div key={note.n} className="shank-note shank-text">
                <div className="note-n">{note.n}</div>
                <div>
                  <h3 className="note-title">{note.title}</h3>
                  <p className="note-text">{note.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
