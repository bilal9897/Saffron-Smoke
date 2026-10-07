"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const IconStar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconLock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const IconClock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconWine = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M8 22h8"/><path d="M12 15v7"/><path d="M12 15a7.5 7.5 0 0 0 7.5-7.5V3a2 2 0 0 0-2-2H6.5a2 2 0 0 0-2 2v4.5A7.5 7.5 0 0 0 12 15z"/><path d="M4.5 7.5h15" opacity="0.3"/></svg>;

export default function FireFooter() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      // Elegant fade-up animation for the text elements
      gsap.fromTo(
        ".aw-fade-up",
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.4, 
          stagger: 0.1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 60%",
          }
        }
      );
      
      // Image subtle parallax
      gsap.fromTo(
        ".aw-img-parallax",
        { scale: 1.05, y: -20 },
        {
          scale: 1,
          y: 20,
          duration: 2,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={root}
      id="footer"
      className="aw-section"
      data-record-time={1.2}
      data-record-hold={1.2}
      data-record-align="center"
      data-record-label="Footer"
    >
      <style>{`
        .aw-section {
          width: 100vw;
          min-height: 100vh;
          background-color: #2A211B;
          color: #F8F5EE;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: var(--font-sans, sans-serif);
        }
        
        .aw-grid {
          width: 100%;
          max-width: 1600px;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 40px;
          gap: 80px;
          margin: 0 auto;
        }

        .aw-left {
          position: relative;
          width: 100%;
          height: calc(100vh - 80px);
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4);
        }

        .aw-img-parallax {
          width: 100%;
          height: 115%;
          object-fit: cover;
          position: absolute;
          top: -7.5%;
          left: 0;
        }

        .aw-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 40px;
          position: relative;
        }

        .aw-label {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8A7A6A;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .aw-label::before {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background-color: #C89B3C;
        }

        .aw-headline {
          font-family: var(--font-serif, serif);
          font-size: clamp(72px, 8vw, 130px);
          line-height: 0.95;
          letter-spacing: -0.02em;
          margin-bottom: 64px;
          color: #F6F2EA;
          font-weight: 400;
        }

        .aw-italic {
          font-style: italic;
          background: linear-gradient(135deg, #E6C875 0%, #C89B3C 50%, #A87B2C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: block;
          margin-top: 8px;
        }

        .aw-features {
          list-style: none;
          padding: 0;
          margin: 0 0 64px 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px 24px;
        }

        .aw-feature-item {
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          letter-spacing: 0.1em;
          color: #8A7A6A;
          display: flex;
          align-items: center;
          gap: 16px;
          text-transform: uppercase;
        }

        .aw-feature-icon {
          color: #C89B3C;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
        }

        .aw-cta-wrap {
          margin-bottom: 80px;
        }

        .aw-cta {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          background: linear-gradient(135deg, rgba(200, 155, 60, 0.1) 0%, rgba(200, 155, 60, 0.02) 100%);
          border: 1px solid rgba(200, 155, 60, 0.3);
          padding: 16px 48px;
          border-radius: 100px;
          color: #C89B3C;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05);
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .aw-cta::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(200, 155, 60, 0.25) 0%, rgba(200, 155, 60, 0) 100%);
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .aw-cta:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
          border-color: rgba(200, 155, 60, 0.6);
        }
        
        .aw-cta:hover::before {
          opacity: 1;
        }

        .aw-cta span {
          position: relative;
          z-index: 1;
        }
        
        .aw-cta-arrow {
          position: relative;
          z-index: 1;
          transition: transform 0.5s ease;
        }
        
        .aw-cta:hover .aw-cta-arrow {
          transform: translateX(8px);
        }

        .aw-footer {
          margin-top: auto;
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          border-top: 1px solid rgba(138, 122, 106, 0.15);
          padding-top: 32px;
        }

        .aw-footer-link {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.15em;
          color: #8A7A6A;
          text-transform: uppercase;
          text-decoration: none;
          transition: color 0.4s ease;
        }

        .aw-footer-link:hover {
          color: #C89B3C;
        }
        
        /* Ambient lighting */
        .aw-lighting {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: radial-gradient(circle at 70% 30%, rgba(200, 155, 60, 0.06) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }
        
        .aw-grid-bg {
          position: relative;
          z-index: 1;
        }

        @media (max-width: 1024px) {
          .aw-grid {
            grid-template-columns: 1fr;
            padding: 24px;
            gap: 40px;
          }
          .aw-left {
            height: 50vh;
          }
          .aw-headline {
            font-size: 64px;
          }
          .aw-right {
            padding: 20px 0;
          }
        }
      `}</style>

      <div className="aw-lighting"></div>

      <div className="aw-grid aw-grid-bg">
        <div className="aw-left aw-fade-up">
          <img 
            src="/images/ivory_shank.jpg" 
            alt="Slow-braised lamb shank on saffron rice" 
            className="aw-img-parallax" 
            draggable={false}
          />
        </div>

        <div className="aw-right">
          <div className="aw-label aw-fade-up">Small Luxury Details</div>
          
          <h2 className="aw-headline aw-fade-up">
            Dinner,<br/>
            <span className="aw-italic">by fire.</span>
          </h2>

          <ul className="aw-features aw-fade-up">
            <li className="aw-feature-item">
              <span className="aw-feature-icon"><IconStar /></span>
              Michelin Inspired
            </li>
            <li className="aw-feature-item">
              <span className="aw-feature-icon"><IconLock /></span>
              Reservation Only
            </li>
            <li className="aw-feature-item">
              <span className="aw-feature-icon"><IconClock /></span>
              14 Hour Slow Cook
            </li>
            <li className="aw-feature-item">
              <span className="aw-feature-icon"><IconWine /></span>
              Curated Wine Pairing
            </li>
          </ul>

          <div className="aw-cta-wrap aw-fade-up">
            <a href="#reserve" className="aw-cta">
              <span>Join Our Table</span>
              <span className="aw-cta-arrow">→</span>
            </a>
          </div>

          <div className="aw-footer aw-fade-up">
            <a href="#" className="aw-footer-link">Phone</a>
            <a href="#" className="aw-footer-link">Email</a>
            <a href="#" className="aw-footer-link">Instagram</a>
            <a href="#" className="aw-footer-link">Journal</a>
            <a href="#" className="aw-footer-link">Gift Cards</a>
            <a href="#" className="aw-footer-link">Dress Code</a>
            <a href="#" className="aw-footer-link">Valet Parking</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
