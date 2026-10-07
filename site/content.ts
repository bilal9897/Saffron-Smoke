// All text + data for Saffron & Smoke (a fictional restaurant: no real guides, people or addresses).
import type { Film } from "./lib/film";

export const IMG = "/images/saffron";

/** Chapters for the right-edge course rail (NV10), in page order. `id` = the section's data-chapter. */
export const chapters = [
  { id: "plating", num: "I", label: "Plating" },
  { id: "tasting", num: "II", label: "Tasting" },
  { id: "fire", num: "III", label: "Fire" },
  { id: "shank", num: "IV", label: "The shank" },
  { id: "pairing", num: "V", label: "Pairing" },
  { id: "reserve", num: "VI", label: "Reserve" },
] as const;

export const loaderWords = ["Welcome.", "To our.", "Kitchen."];

/* ── Hero: the plating film. Video seconds measured on a contact sheet (raw/hero-plating.mp4):
 *  rice lands 1.55 · shank lands 3.0 · jus pours 2.75 → 4.7 · garnish 4.75 → 5.9 · smoke from 6.0 */
export const heroFilm: Film = {
  frames: "/frames/saffron-hero",
  start: 0,
  poster: 7.5,
  segments: [
    { to: 1.6, secs: 1.3, label: "Plating · rice" },
    { to: 3.05, secs: 1.3, label: "Plating · shank" },
    { to: 4.75, secs: 1.7, label: "Plating · jus" },
    { to: 5.9, secs: 1.0, label: "Plating · garnish" },
    { to: 7.5, secs: 2.2, label: "Plating · smoke + caption" },
  ],
};
/** The title's saffron fill follows the pour (video seconds). */
export const pour = { from: 2.75, to: 4.7 };
/** Kitchen ticket: each line ticks on its measured landing second. */
export const ticket = {
  head: ["KOT 07", "Table 7", "19:42"],
  items: [
    { label: "Rice", at: 1.55 },
    { label: "Shank", at: 3.0 },
    { label: "Jus", at: 4.7 },
    { label: "Smoke", at: 6.2 },
  ],
};
export const hero = {
  title: ["A story told", "in smoke."],
  kicker: "Welcome to our kitchen.",
  caption: "We believe in the quiet power of open fire and ingredients that speak for themselves.",
  captionAt: 6.0,
  priceLine: "A nine-course journey through the flames",
  price: "₹7,500",
  cta: "Join our table",
};

/* ── Tasting journey (signature): raw → cooked, pixel-aligned pairs. */
export const courses = [
  {
    num: "I",
    name: "Golgappa, tamarind snow",
    pairing: "Riesling, off-dry",
    raw: `${IMG}/course-1-raw.webp`,
    cooked: `${IMG}/course-1.webp`,
    thumb: `/images/golgappa_thumb.jpg`,
    plateImage: `/images/course1_plate.jpg`,
  },
  {
    num: "II",
    name: "Kerala prawn, moilee",
    pairing: "Albariño",
    raw: `${IMG}/course-2-raw.webp`,
    cooked: `${IMG}/course-2.webp`,
    thumb: `/images/prawn_thumb.jpg`,
    plateImage: `/images/course2_plate.jpg`,
  },
  {
    num: "III",
    name: "Paneer, from the coal",
    pairing: "Grenache rosé",
    raw: `${IMG}/course-3-raw.webp`,
    cooked: `${IMG}/course-3.webp`,
    thumb: `/images/paneer_thumb.jpg`,
    plateImage: `/images/course3_plate.jpg`,
  },
  {
    num: "IV",
    name: "Our signature shank, born from the fire",
    pairing: "Nebbiolo, bold",
    raw: `${IMG}/hero-end.webp`,
    cooked: `${IMG}/hero-end.webp`,
    thumb: `/images/shank_thumb.jpg`,
    plateImage: `/images/course4_plate.jpg`,
  },
];
export const tasting = {
  eyebrow: "A culinary journey",
  priceNote: "Nine crafted courses, per guest",
  price: "₹7,500",
  mainImage: "/images/tasting_main.jpg",
  /** record seconds per course on the pin */
  secsPerCourse: 2.2,
  arrive: 0.8,
};

/* ── Tandoor (ST11). Fire clip = raw seconds 0.5 → 5.6, frames' times start at 0. */
export const fireFilm: Film = {
  frames: "/frames/saffron-fire",
  start: 0,
  poster: 5.1,
  segments: [
    { to: 1.2, secs: 1.0, label: "Fire · coals" },
    { to: 3.2, secs: 1.4, label: "Fire · flames" },
    { to: 5.1, secs: 0.8, label: "Fire · charred" },
  ],
};
export const fire = {
  title: ["The heart", "of our kitchen."],
  copy: "At the center of everything we do is a single clay tandoor. We light it every afternoon at five, feeding it with fragrant babool wood, and letting the steady, glowing embers do their magic until the last guest bids us goodnight.",
  stats: [
    { value: "480 °C", label: "glowing embers" },
    { value: "1", label: "clay oven" },
    { value: "5 pm", label: "lit daily" },
    { value: "14 h", label: "for the shank" },
  ],
};

/* ── Signature dish (FT15). Stand-in still until dish-pushin.mp4 arrives. */
export const shank = {
  num: "IV",
  title: "The Signature Shank",
  sub: "Slow-cooked with fourteen hours of patience and a single, unwavering flame.",
  image: `/images/ivory_shank.jpg`,
  notes: [
    { n: "01", title: "Shank, 14 hours", text: "Slow-braised overnight, then carefully caramelized to perfection in the clay oven." },
    { n: "02", title: "Kashmiri chilli jus", text: "A rich, deep red broth bursting with gentle warmth and the richness of pure ghee." },
    { n: "03", title: "Saffron rice", text: "Aged long-grain basmati, delicately perfumed with hand-picked Pampore saffron threads." },
    { n: "04", title: "Clove smoke", text: "Infused with a whisper of clove smoke, unveiled right at your table." },
  ],
};

/* ── Pairing (MN01) */
export const pairing = {
  title: "Poured with intention.",
  image: `${IMG}/pairing.webp`,
  rows: [
    { dish: "Golgappa", drink: "Riesling" },
    { dish: "Prawn", drink: "Albariño" },
    { dish: "Paneer", drink: "Grenache" },
    { dish: "Shank", drink: "Nebbiolo" },
  ],
  options: [
    { name: "Curated wine pairing", price: "₹4,200" },
    { name: "Zero-proof pairing", price: "₹2,400" },
  ],
  note: "Our signature zero-proof pour brings together bright lime, house-made saffron cordial, and a hint of clove smoke.",
};

/* ── Reservations (BK05). Picks by itself only in ?record=1; otherwise only on click. */
export const reserve = {
  title: ["Join us", "for dinner."],
  notes: ["Tasting menu only", "2 h 40 min", "₹7,500 per guest"],
  rating: "★ 4.9 from 1,280 diners",
  month: "October 2026",
  days: [
    { dow: "Tue", d: 13 },
    { dow: "Wed", d: 14 },
    { dow: "Thu", d: 15 },
    { dow: "Fri", d: 16 },
    { dow: "Sat", d: 17 },
    { dow: "Sun", d: 18 },
  ],
  times: ["19:00", "19:30", "20:30", "21:15"],
  /** the scripted record-mode booking (and the ?static=1 final state) */
  demo: { day: 17, guests: 4, time: "20:30" },
  button: "Reserve your seat",
};

/* ── Footer (FO14) */
export const footer = {
  title: "Dinner, by fire.",
  /** its own tight crop of the dish (rice + jus, the shank just entering at the top): not the Signature picture */
  image: `${IMG}/footer-crop.webp`,
  address: ["14 Ember Lane", "Jubilee Hills, Hyderabad"],
  hours: ["Tue – Sun", "7 pm – 11 pm", "Closed on Mondays"],
  links: ["Instagram", "Journal", "Gift a dinner"],
  wordmark: "Saffron & Smoke",
  note: "© 2026 Saffron & Smoke · Concept website · fictional restaurant",
};
