# Saffron & Smoke — design direction (Round 0)

**Brand:** Saffron & Smoke, a fictional modern Indian fine-dining restaurant (tasting menu, tandoor, pairings). No real restaurant look-alike, no real logos or guides.
**Hook:** "A menu that cooks as you scroll."
**Build:** desktop only, 1440×900. Reel text is about 40 px (prices 48 px). Record run ≈ 32.5 s.
**Slug:** `saffron` → `public/images/saffron/`, `public/frames/saffron-*`, `raw/`.

Uniqueness: 8 of 8 different from each of the last 3 sites. No layout code is shared with them. See the sites log.

---

## Choices

| Menu | Pick | Why it suits this site |
|---|---|---|
| Look | **L11 editorial magazine, after-dark edition**: a printed tasting-menu card on charcoal stock. Big serif, column rules, folio numbers (I–IV), captions under the plates, lit only by candle and fire inside the photos | A tasting menu is already an editorial object. The page reads like the menu card in your hand, and the warm light comes only from the food and the fire |
| Palette | **Saffron & Smoke**: bg `#121110` charcoal · surface `#1B1917` · text `#EEE7DA` bone · muted `#9E978C` smoke ash (6.5:1) · accent **saffron `#F4B41A`** · line `#2C2926`. Ember `#E2552B` appears only as light inside the films and glows, never in the UI. One paper band (Pairing) in bone `#EDE5D6` with charcoal ink | Smoke-grey neutrals carry the page, and saffron is used on about 5% of it (buttons, the hero title fill, the course rail). Category-reflex check: no maroon, no gold, no arches or paisley, so it doesn't read as the default "Indian restaurant" palette |
| Type | **T19 DM Serif Display + DM Mono** (one italic serif word per heading at most) | Serif for dish names and statements. Mono gives the kitchen-ticket voice for course numbers, prices, times and the booking |
| Nav | **N8 index rail** (layout NV10): wordmark top-left, saffron "Reserve" pill top-right, plus a slim **course rail** on the right edge (the six chapters, the current one named) | The page is a sequence of courses, so the nav is the menu's own contents list and always shows which course you're on |
| Hero | **Plating push-in**: a full-screen scroll film. The camera pushes in slowly while the dish plates itself (rice, then shank, then jus pours, then garnish falls, then smoke rises), with flames glowing behind. The giant bottom-anchored title fills with saffron in step with the pour (M135) | The hook, made literal. The move is new for the kit: a stroke-drawn title flooding with colour in sync with a liquid in the film |
| Section shape | **S11 overlapping sheets**: each section is a menu sheet laid slightly over the last, with a soft charcoal shadow and 0.5–1° rotation that settles flat | Menu cards set down on the table one after another |
| Cards | **C1 sharp + hairline, as letterpress menu cards**: square corners, 1 px rules, folio numbers, dotted price leaders, mono prices | Fine-dining restraint: no pills, glass or rounded cards |
| Signature | **The fire passes over each course** (M511): on a pinned long-table stage, three courses arrive one by one **raw** and burn through to **cooked** along a drifting noise edge with a glowing ember rim | "Cooks as you scroll" in its purest form. No earlier site had a cooking moment or used a burn |
| Loader | **I30 word beats then curved curtain**: "Saffron." "Smoke." "Fire." flicker in like a struck match (CSS from the first paint), then a saffron curtain with a curved top rises and lifts off, and the hero film is already moving | A three-beat story that sets the senses before the first plate |

**Motion feel:** slow, warm, confident. Arrivals `cubic-bezier(0.22,1,0.36,1)` at 0.9–1.4 s. Pins and wipes `cubic-bezier(0.77,0,0.175,1)`. Linear only for scrub, opacity and the course rail. No bounce. Exits run at 75% of the entrance time.

---

## Section plan (8 parts, approved with changes)

8 parts by the user's call: loader + 7 sections (fewer than the kit's usual 9–12, so each one gets time). The nav / course rail runs over all of them.

| # | Section | Layout | Starts from | How it's restyled here | Record (s) |
|---|---|---|---|---|---|
| 0 | Loader | — | `fx` I30 demo | Charcoal plate. Three mono-caps words flicker like a match strike, then a saffron curtain (curved top) rises off | 2.0 |
| — | Nav + course rail | **NV10** | `sections` NV10 altitude rail | The altitude marks become the chapters (Plating · Tasting · Fire · The shank · Pairing · Reserve) on the right edge; the label rolls to the current one. Wordmark top-left, Reserve pill top-right | — |
| 1 | Hero: "A menu that cooks as you scroll." | **HR19** | HR19 bottom-anchored title | Full-bleed plating film (frames). Giant two-line title at the bottom ("Cooks as / you scroll."), outlined in bone and flooding saffron with the pour. Small mono kitchen ticket top-left ticks off Rice · Shank · Jus · Smoke as each lands. **At the end of the hero, a 40 px serif caption fades in beside the ticket (top band, clear of the shank): "We cook with fire, not with noise."** and holds about 1.5 s to be read | 7.5 |
| 2 | **Tasting journey (signature)** | **MN02** | MN02 tasting sequence | Pinned long-table stage. Left: the printed course list I–III (the active course lit in saffron, its pairing in mono). Right: a 1:1 top-down plate that arrives raw and burns to cooked. The 40 px dish names live in the list (the active one lit); under the plate a mono line "Course I of IX · raw → fired". The last line reads "IV · the shank, from the fire ↓" and hands over to the fire. Price line: Nine courses · ₹7,500 per guest (48 px) | 7.5 |
| 3 | Tandoor fire | **ST11** | ST11 statement + sinking stats | Full-bleed tandoor film. Statement left: "480° of patience." Ruled stats sink bottom-right: 480 °C · 1 clay oven · since 5 pm · babool charcoal | 4.0 |
| 4 | Signature dish | **FT15** | FT15 numbered features flanking a tall image | Tall 4:5 photo of the shank in near-dark. Four numbered notes flank it (01 Shank, 14 hours · 02 Kashmiri chilli jus · 03 Pampore saffron rice · 04 Clove smoke), each lighting up when the candle-light reaches its spot | 3.0 |
| 5 | Pairing | **MN01** | MN01 two-column menu with dotted leaders | The paper band (bone sheet laid over the charcoal). Left: course → paired glass with dotted leaders. Right: the pairing photo + two options: Wine pairing ₹4,200 · Temperance (zero-proof) ₹2,400 | 2.5 |
| 6 | Reservations | **BK05** | BK05 week strip + time-slot chips | Left: "Hold a table." + mono notes (tasting only, 2 h 40 min, ₹7,500) + **"★ 4.9 from 1,280 diners"** (40 px). Right: October week strip, guest stepper, time chips (19:00 · 19:30 · 20:30 · 21:15) and a summary ticket "SAT 17 OCT · 4 GUESTS · 20:30 · Hold my table". **It picks by itself only in `?record=1`; in normal mode it only changes on click** | 3.0 |
| 7 | Footer | **FO14** | FO14 image-side footer | Left: **a tall crop of `hero-end.jpg`** (the finished dish, the same plate the hero built), wordmark rising at its foot. Right: address (fictional: 14 Ember Lane, Jubilee Hills, Hyderabad), hours (Tue–Sun · 7 pm – 11 pm, closed Mon), Reserve, socials, "Concept website · fictional restaurant" | 2.0 |

Total ≈ 31.5 s (loader 2.0 + page 29.5). No layout code is used twice, and none came from the last 3 sites.
**Reel text:** callouts, dish names, notes, captions and the rating are about 40 px, prices 48 px, one line each. 12–18 px mono only for meta nobody needs to read on camera. Desktop only (1440×900).

---

## Motion map

| # | Section | Layout | Motion | How it plays here | Record mode |
|---|---|---|---|---|---|
| 0 | Loader | — | **I30** word beats + curved curtain | CSS from the first paint: each word flickers on like a struck match (opacity + a small warm glow), 0.45 s apart. At ready, the saffron curtain rises with a curved top that flattens as it lifts. The hero film is already moving underneath on the last frame | fixed 2.0 s, CSS starts at paint |
| — | Nav + course rail | NV10 | **M128** rolling drum text | The rail label rolls on a cylinder to the next chapter name as each section takes over. The rail tick fills linearly with scroll | scroll-driven, always visible |
| 1 | Hero | HR19 | **M135** stroke draw then flood fill | The title outline draws on during the intro (0.08 s per letter). Then saffron floods up inside the letters, scrubbed by the **film's measured pour seconds** (the fill starts on the first drop of jus and is full when the pool settles). The film itself is the scrub (frames by video time, blended). The kitchen ticket ticks on the measured landing seconds. Last ~1.5 s: the philosophy caption fades in at 40 px (support) while the smoke rises | self-playing intro → scroll overtakes (shown time = max(scroll, intro)); the film is never still: push-in, smoke, flame flicker |
| 2 | **Tasting journey (signature)** | MN02 | **M511** noise burn image change, scroll-driven | For each of 3 courses (~2.5 s each): the raw plate slides in along the table (0.5 s), a drifting-noise burn with a glowing ember rim sweeps it to the cooked plate (0.9 s), and the dish name rises at 40 px and holds to be read (1.1 s). The list column lights the matching line. The noise keeps drifting in time, so the stage is never still | pinned, scrubbed linearly across the whole pin, ends exactly at the end; noise and ember rim animate on the clock |
| 3 | Tandoor fire | ST11 | **M441** colour rises over greyscale | The tandoor film starts ash-grey. Its true colour rises from the coals upward behind a bright ember edge line, and the temperature counter rides that line 0 → 480 °C. Stats sink in bottom-right as the heat arrives | scrubbed by scroll + the film plays by video time underneath (flames never freeze) |
| 4 | Signature dish | FT15 | **M197** flashlight in the dark (candle-light) | The photo sits in near-darkness. A warm candle-light circle follows a path tied to the scroll over the four details, and each numbered note brightens as the light reaches its spot | scroll-driven path + a gentle flicker in the light radius |
| 5 | Pairing | MN01 | **M8** SVG line draw-on | The dotted leaders draw from each course across to its glass, row by row, and the two prices land at the end | scrub; the paper sheet settles from 1° to flat (S11) |
| 6 | Reservations | BK05 | **M266** flip-clock digits | **`?record=1` only:** a scripted booking runs once on enter: Saturday 17 lights, guests flip 2 → 4, the 20:30 chip fills, the summary ticket's digits flip into place, "Hold my table" fills saffron (2.4 s). **Normal mode:** the picker changes only when the visitor clicks; each click flips the matching digits in the ticket. The rating sits still beside it | record: scripted once on enter; a slow candle glow behind the ticket keeps the hold alive |
| 7 | Footer | FO14 | **M222** outlined wordmark rises | "Saffron & Smoke" rises at the foot of the dish crop as its outline draws and a faint saffron fill comes in. A broad candle glow breathes over the photo, so the resting end screen is never frozen | scrub into the footer + glow on the clock; the record stop goes on an element after the footer |

No code is used twice, no section is a plain fade, and the hero (M135) and signature (M511) match no earlier site's. The hero is a film with a filling title, not a shape growing to full screen.

**Transitions (S11 sheets, one at a time)**
- 0 → 1: I30 curtain lifts off a hero that is already moving (no dead second).
- 1 → 2: **X20 smoke mask**. The long-table sheet appears through smoke that continues the dish's own wisp.
- 2 → 3: **X12 fade through black**. Black with a few drifting embers (never a dead black), then the tandoor coals light.
- 3 → 4: **X15 vignette spotlight**. The edges close in on the flames and open as the candle-light on the dish.
- 4 → 5: **X2 colour wash**. Charcoal → bone paper. The pairing sheet lands slightly rotated and settles flat.
- 5 → 6: **X3 edge shape morph**. The paper sheet's lower edge curls up and lifts away, uncovering the booking sheet on charcoal.
- 6 → 7: **X16 cut-and-stamp**. The ticket stamps and the footer is in place.

**Details (Round 4).** These are hover/click in normal mode; any hands-free version plays only in `?record=1`, as with Reservations.
- Magnetic saffron "Reserve" pill with a fill wipe.
- Hairline underline draws under nav links.
- Cursor label "Taste" over the plates and "Book" over the time chips.
- Course rail tick bumps when a course cooks (scroll-driven).
- Price figures flip once on enter (mono).

---

## Assets needed (few, strong: 2 films + 10 stills)

General rules: **check the ratio chip in Flow before every generation.** `.jpg` for everything (nothing needs transparency). One grade across all assets: charcoal shadows, warm candle and ember light, saffron highlights, no blue cast. **No hands, no people, no utensils held by anyone, no text, no logos** in any asset. Keep subjects away from the bottom-right corner (Veo watermark).

### Film 1: Hero plating (`raw/hero-plating.mp4`, 16:9, 8 s)

**Make the end frame first**, then edit it into the start frame so the plate, slate and camera match exactly.

**1. `raw/images/hero-end.jpg`** · 16:9 (1920×1080 or larger, upscaled: also used for the footer crop), Nano Banana Pro
> Fine-dining plate on a dark charcoal slate table, seen from about 35 degrees above, plate in the upper-centre-right of the frame, the lower third of the frame darker and calm. A matte black stoneware plate holding a neat dome of saffron rice, a glossy slow-braised lamb shank resting on it with the bone pointing up and to the right, a pool of deep red Kashmiri chilli jus around it, a few saffron threads and micro herbs scattered on top, a thin wisp of white smoke rising from the dish. Behind, out of focus, the soft orange glow of open flames and two small candle flames. Moody candle-lit fine dining, deep charcoal and saffron and ember colour palette, photorealistic, shallow depth of field. No hands, no people, no text, no logos.

**2. `raw/images/hero-start.jpg`** · 16:9, Nano Banana edit **of hero-end.jpg** (attach it)
> Exactly the same image, same plate, same slate, same camera angle, same light and same flames behind, but the plate is completely empty and clean, with no food, no sauce and no smoke. Keep everything else identical.

**Veo** · Start frame = hero-start.jpg, End frame = hero-end.jpg, 16:9, 8 s
> Start frame to end frame, one continuous shot. The camera pushes in very slowly and steadily toward the plate for the whole shot. On the empty plate the dish assembles itself with no hands and no utensils: a dome of saffron rice drops softly into the centre and settles, then the lamb shank lowers onto the rice by itself, then a thin stream of deep red sauce pours down from above the top of the frame and pools around it, then saffron threads and tiny herbs drift down onto the dish, then a thin wisp of smoke rises from it. Behind, out-of-focus open flames glow and breathe softly. Slow, elegant, candle-lit. No hands, no people, no utensils, no text, no logos, no cuts, no camera shake.

**Timeline (aim):** 0–1 s push-in on the empty plate · **1.0–2.0 s rice drops + settles** · **2.0–3.0 s shank lowers on** · **3.0–4.5 s jus pours and pools** (title fill syncs here) · 4.5–5.5 s garnish drifts down · 5.5–7.5 s smoke wisp rises, flames breathe. Use the first ~7.5 s. I'll measure the real seconds on a contact sheet before syncing anything (lesson 6).
*Fallback if Veo adds a hand or a jug:* split it into two clips. (A) start → "assembled, no sauce" (make that middle image by editing hero-end: "same, but no sauce and no smoke"). (B) middle → end (pour + garnish + smoke). Then join them at the shared frame.

### Film 2: Tandoor fire (`raw/fire-tandoor.mp4`, 16:9, 8 s)

**3. `raw/images/fire-end.jpg`** · 16:9, Nano Banana Pro (make first)
> Looking down into a traditional clay tandoor oven from its rim at about 45 degrees, the round opening filling the right 60% of the frame, the left side dark clay and shadow. Bright orange flames lick up the curved clay walls from a bed of glowing charcoal, two oval naan breads stuck to the inner wall puffed and blistered with charred spots, two metal skewers of saffron-marinated paneer hanging inside with charred edges. Intense ember light, deep charcoal and saffron and ember colour palette, photorealistic, cinematic, shallow depth of field. No hands, no people, no text, no logos.

**4. `raw/images/fire-start.jpg`** · 16:9, Nano Banana edit **of fire-end.jpg** (attach it)
> Exactly the same image, same oven, same angle, same skewers and naan in the same places, but the fire is low: only dim glowing coals at the bottom, no flames, the naan flat and pale and uncooked, the paneer pale and uncharred. Keep everything else identical.

**Veo** · Start = fire-start.jpg, End = fire-end.jpg, 16:9, 8 s
> Start frame to end frame, one continuous shot, camera almost still with a very slow push-in. The coals at the bottom of the clay oven breathe brighter, then flames rise and climb the curved clay walls, the naan on the wall puffs up and blisters and chars, the paneer edges char, sparks drift upward. Nobody touches anything. No hands, no people, no text, no logos, no cuts.

**Timeline:** 0–1.5 s coals breathe · **1.5–3.5 s flames climb the walls** · **3–5 s naan puffs and chars** · 5–8 s full steady flame, sparks.

### Signature courses: raw → cooked pairs (6 stills, 1:1, 2048×2048)

All of them are **top-down, plate centred, the same matte black stoneware plate, the same charcoal slate, the same soft candle light from the upper left**. For each course, **make the cooked image first**, then make the raw image as a Nano Banana **edit of it** (attach it, "exactly the same plate, framing and light"), so the burn lines up.

Shared cooked prompt: *"Top-down photo of a fine-dining course on a matte black stoneware plate, plate centred with even margin, on a dark charcoal slate table, soft warm candle light from the upper left, deep shadows, modern Indian fine dining, deep charcoal and saffron and ember palette, photorealistic, sharp. [DISH]. No hands, no cutlery, no people, no text, no logos."*
Shared raw edit: *"Exactly the same plate, framing, table and light, but the dish is not cooked yet: [RAW]. Arranged neatly in the same spots on the plate."*

| File (cooked / raw) | Course | [DISH] | [RAW] |
|---|---|---|---|
| `raw/images/course-1.jpg` / `course-1-raw.jpg` | I · Golgappa, tamarind snow | five crisp puffed golden semolina spheres in an arc, filled with spiced potato, topped with dark tamarind snow and mint oil dots | five flat pale uncooked semolina discs, a halved tamarind pod, mint leaves, a few whole spices |
| `course-2.jpg` / `course-2-raw.jpg` | II · Prawn, coconut ash | one large seared tiger prawn with charred edges on a pool of saffron coconut moilee, black coconut-ash powder line, curry leaves fried crisp | one raw grey tiger prawn, a halved fresh coconut piece, fresh green curry leaves, a small pile of turmeric |
| `course-3.jpg` / `course-3-raw.jpg` | III · Paneer, from the coal | three thick cubes of tandoor-charred saffron paneer with blistered edges on smoked yoghurt, chilli oil, a charred lime half | three pale raw paneer cubes, a spoon-shaped smear of orange marinade, a whole green lime, two dried red chillies |

### Stills

**5. `raw/images/dish-detail.jpg`** · 4:5 (1600×2000), Nano Banana edit **of hero-end.jpg**
> The same lamb shank dish, closer, in portrait framing, three-quarter view, the plate filling the middle of the frame, very detailed: glossy glaze on the shank, saffron rice grains, red jus pool, saffron threads, a thin wisp of smoke. Darker overall, lit by one candle from the left. Same colour grade. No hands, no text.

**6. `raw/images/pairing.jpg`** · 4:5 (1600×2000), Nano Banana Pro
> Two stemmed glasses on a dark charcoal slate table at night, one with deep ruby red wine, one with a clear saffron-gold zero-proof cordial with a single curl of smoke resting inside the glass, a lit candle behind them out of focus, warm reflections on the glass rims. Moody fine dining, deep charcoal and saffron palette, photorealistic, shallow depth of field. No hands, no people, no bottle labels, no text, no logos.

**Footer image:** no new still. The footer uses a tall crop of `hero-end.jpg`. **Generate hero-end at the highest size Flow offers (upscale to 2K/4K if available)** so the tall crop (about 4:5 out of the 16:9) stays sharp in the footer column.

**Later (Round 5):** a 9:16 reel cover (`cover.jpg`) from a hero frame plus the title, checked with `cover-check`.

### After generating
Put files in `raw/` (videos) and `raw/images/` (stills). Round 1: films → frames with the `video-frames` skill (`site/frames.json`, by video time, watermark painted out, ≤ 12 MB each). Stills → WebP in `public/images/saffron/`. I'll check every file on a contact sheet first (lesson 43).

Not a travelling-object day (Day 10; the next one is Day 12): no traveller.

---

## Round 1 notes (as built)

- **Measured film beats (hero-plating.mp4):** rice lands 1.55 s · shank lands 3.0 s · jus pours 2.75 → 4.7 s (title fill window) · garnish 4.75 → 5.9 s · smoke from 6.0 s. Fire clip uses raw 0.5 → 5.6 s (flames climb ≈ 1–3 s, naan charred ≈ 4 s).
- **Watermarks:** films are cropped 1800×1013 from (60, 28) and scaled back to 1080p inside the frames pipeline (`site/frames.json` → `delogo`); stills are cropped identically per pair (courses 1920² from 64,64; 16:9 stills 2640×1474 from 56,31; pairing to exact 4:5, 1792×2240, which drops the sparkle).
- **Signature dish:** `dish-pushin.mp4` was not in `raw/` (or anywhere on the machine), so the section uses a tall crop of `hero-end.webp` as a stand-in; the `<img>` becomes the 0–7 s film when it arrives.
- **Record timeline:** hero 7.5 · tasting 0.8 + 3 × 2.2 · fire 0.8 + 3.2 · shank 1.2 + 1.8 hold · pairing 1.2 + 1.3 hold · reserve 1.0 + 2.0 hold (scripted booking) · footer 1.2 + 0.8 ≈ 29.4 s after the 2 s loader.

## Round 2 notes (as built)

- **Firelight (new, page-wide):** a very low-alpha warm light over the whole page whose strength wavers on an irregular linear CSS loop (2.3 s), from the first painted frame. It is what keeps every resting moment alive on camera (the record check needs ≥ 0.15 grey levels of change per frame at 160×90; the section glows alone measured 0.02–0.13). It never scales or shifts anything.
- **Hero:** Smoke ticks at 6.2 s and the caption rises at 6.0 s (later values were only on screen ≈ 0.4 s before the hero leaves).
- **Tasting burn:** the edge moves across the whole course (2 → 86 %), then cross-fades to the next raw plate (86 → 100 %); raw and cooked are sampled at the identical uv (no scale/drift).
- **Holds:** shank, pairing and reservations hold 1.2 s (none longer). Record timeline ≈ 27.9 s after the loader (≈ 30.8 s reel).
- **Loader:** curtain 0.9 s in all (rise 0.32 · flatten 0.08 · lift 0.5); the ember glow behind the words is already moving on frame 1.

## Round 3 notes (as built)

- **Signature dish:** no dark overlay any more. The candle-light is a warm screen-blend glow that only adds light; it is scroll-driven, all four notes are lit by 40 % of the section's travel, and at the record hold the picture measures 64–67 mean luma against 57.7 for the plain picture (Round 2: 37.8). dish-pushin.mp4 is still not in raw/: the picture is the hero end still.
- **Burn:** a centre-out fire front (distance from the plate centre leads, two noise layers roughen the rim), a thick soft glow (saffron core → ember → transparent), a thin char band just behind the edge, a light scorch ahead of it and a few tiny sparks; 75 % of the burn is spent on the plate (rim ≈ 0.42), the rest races over the slate.

## Round 4 notes (as built)

- **Transitions** (site/components/Handovers.tsx), each scrubbed over the next section's arrival (0.8–1.2 record s): X20 smoke band (pre-rendered `smoke.webp`, no live filter) · X12 fade through black with rising embers · X15 vignette (open again before the shank hold) · X2 colour wash charcoal → bone paper · X3 curled top-left corner of the booking sheet flattening as it lands · X16 footer press jolt.
- **S11:** every sheet arrives tilted ±0.8° (alternating, origin top) and is flat by the time its top reaches 18 %. The tilt pushed tall pinned sections ~58 px sideways and stretched the reel to 1278×900: `html, body { overflow-x: clip }` (clip keeps the sticky pins working).
- **M128** rail label drum · **M266** booking ticket flip cards + "Held" stamp on the button corner · **M222** footer wordmark (SVG text): outline draws → rises → fills, on the clock once the wordmark is on screen (scroll-tied, it finished off screen).
- **Details:** magnetic Reserve pill (calm power3 ease, not the kit's elastic) with a bone fill wipe; wordmark underline draw; cursor labels "Taste" (plates) and "Book" (pill, chips) checked with a real pointer; rail II tick bumps each time a course finishes cooking; price flips (hero on the curtain lift, tasting on enter, pairing in its timeline). Hands-free versions only in ?record=1 (the pill leans + wipes once as the booking sheet arrives).
- **Firelight:** now `mix-blend-mode: screen`: it can only add light, never dim the food. On the bone paper it adds almost nothing, so the pairing photo's push-in is a little stronger (1 → 1.1, 2.6 s).
- dish-pushin.mp4 still not in raw/: the signature dish keeps the photo.

## Round 5 notes (final)

- Footer: its own tight crop `footer-crop.webp` (rice + jus, the shank just entering at the top) with a soft top fade behind the nav; the Signature keeps the hero end still. dish-pushin.mp4 skipped for Day 10.
- Booking ticket separators end the part before them (non-breaking), so a wrapped line never starts with "·". Flip-digit cells size to their final digit ("14 h", "480 °C").
- Readability: smallest text 12 px; every small text ≥ 4.5:1 (rail ticks raised to 0.55 / 0.62 alpha, dark saffron on paper → `#8a5600`); large dim course names ≥ 3:1.
- Performance (headless, screencast on): normal + ?record=1 at 1440×900 and 1920×1080: p99 16.8 ms, max 33–50 ms, ≈ 0.1 % of frames over 25 ms, none over 50 ms; no console errors or warnings (a favicon was added: it 404'd).
- Final reel `recordings/day-10-saffron-final.mp4`: 1440×900, 30.7 s, PASS in two takes + an independent freezedetect.
