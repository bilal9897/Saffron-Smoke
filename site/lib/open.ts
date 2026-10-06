"use client";

// The site's own loader (EmberLoader) fires "saffron:open" the moment its curtain starts to lift, so the hero film's
// intro starts on the loader's last frame (LESSONS 4 + 64). The engine loader is off for this site, which means the
// engine's onSiteReady fires at page load; use onOpen for anything that must wait for the curtain.

let opened = false;

export function markOpen() {
  if (opened) return;
  opened = true;
  window.dispatchEvent(new Event("saffron:open"));
}

export function onOpen(fn: () => void) {
  if (opened) {
    fn();
    return () => {};
  }
  const h = () => fn();
  window.addEventListener("saffron:open", h, { once: true });
  return () => window.removeEventListener("saffron:open", h);
}
