# AI Agency Design System

**Status:** current, and matches `index.html` as built. Last synced **2026-10-02**.
**Reference:** Neuros theme (demo.artureanec.com/themes/neuros), measured 1:1 at a 1440px viewport from computed styles, matched `:hover` rules and the theme's JS.

> **This file is the spec. `design-tokens.css` is the code version of it. `index.html` is the reference implementation.**
> If any of the three disagree, fix them so they agree again, then add a line to the changelog (§12).

---

## 0. Rules for keeping the design consistent

Follow these whenever you add or change anything.

1. **Use tokens, never raw values.** Colours, font sizes, radii, shadows, easings, gutters and icons come from `design-tokens.css` (`var(--…)`). Need a value that doesn't exist? Add a token, documented here, and don't hard-code it.
2. **Reuse existing components** (§6) before inventing new ones. A new section should be built from: section title (`.sub` + `.h-60`), buttons (`.btn` variants), cards (`.tile`), notch shapes (§5) and the reveal attributes (§8).
3. **Only these colours appear:** white page, `--hero` grey, `--card` grey, `--dark`, `--btn-dark`, text greys, coral `--accent` and the brand gradient. Coral is for **hover, markers and small accents**, never for large fills (exceptions: the coral ribbon and the scroll-top pill).
4. **Hover language is fixed:**
   - buttons fill **solid coral** with white text and shadow `--shadow-button`
   - text links turn **coral**
   - round arrow buttons turn **coral** and the arrow flies through
   - images zoom 1.05
   - everything transitions over `--dur` (.3s)
5. **Corners:** big things use 25px, dropdowns and the FAQ box 20px, buttons are pills. Anything sitting *in* a corner of an image or card uses the **notch** pattern (§5.2), and the covered corner must be square (§10).
6. **Type:** Sora for headings (weight 400; 600 only for prices and the ghost word), Manrope for everything else. Section titles always use `.h-60` with a `/ lowercase` `.sub` above.
7. **Motion:** section titles rise in letter by letter (`.anim`); other blocks fade up (`data-rv`). Don't add new easing curves; use the motion tokens.
8. **Class names must be unique to their component.** Prefix new classes (e.g. `.team-card`, `.team-card__name`). Never use `.in` (the reveal script adds it) or 1–2 letter names. See §10.
9. **After any change:** check desktop (1440), tablet (≤1024) and mobile (375); check hover states; and update this file plus the changelog.

### Checklist for a new section
- [ ] `<section>` inside `<main class="wrap">`. The spacing comes from `--section-gap`.
- [ ] Title: `<h2 class="h-60 anim"><span class="sub">label</span>Title text</h2>`. Use `<del>` (or `<del class="rev">`) for gradient words.
- [ ] Cards use `--r-lg` (25px), `--card` / `--dark` / image backgrounds, and white or `#111` text.
- [ ] Buttons are `.btn` (outline), `.btn.dark`, or `.btn.white` on dark backgrounds. Arrows are `<span class="a l i i-r"></span>…<span class="a r i i-r"></span>`.
- [ ] Corner widgets use the notch pattern, and the card corner underneath is square.
- [ ] Reveals: `data-rv` on blocks (stagger with `style="--d:.1s"`), `.anim` on titles.
- [ ] Responsive: one column at ≤1024px.
- [ ] Documented here (§6) plus a changelog line.

---

## 1. Files

| File | Role |
|---|---|
| `assets/css/design-tokens.css` | **All variables + keyframes.** The single source of truth for values. Load first. |
| `assets/css/main.css` | Component styles (uses tokens only). |
| `assets/js/main.js` | Interactions: header, panels, reveals, slider, accordion, hover tag, scroll effects. |
| `assets/js/flowmap.js` | Liquid cursor distortion on images (WebGL / OGL ES module). Opt-in via `data-flowmap`. |
| `assets/img/contours.svg` | "Fingerprint" hairline decoration (generated). |
| `tools/make_contours.py` | Regenerates `contours.svg` (`python tools/make_contours.py`). |
| `index.html` | Markup / reference implementation of every component (serve with `python -m http.server 5178`). |
| `DESIGN-SYSTEM.md` | This spec. |
| `CLAUDE.md` | Instructions for AI assistants working in this repo. |

---

## 2. Colour (tokens)

| Token | Value | Use |
|---|---|---|
| `--page` | `#ffffff` | Page background. **The site is white.** |
| `--hero` | `#f0f2f4` | Hero zone, FAQ box, slider tabs, "See demo" chip, nav hover pill |
| `--card` | `#e9ebed` | Light cards, icon tiles, "Popular" plan |
| `--dark` | `#1f1f1f` | Dropdowns, side panel, about block, quote card, footer, dark ribbon, overlay (60%) |
| `--btn-dark` | `#333333` | Dark buttons, active nav pill, top info bar, card-arrow circle |
| `--ink` | `#111111` | Headings |
| `--text` | `#333333` | Body copy, button labels |
| `--muted` / `--meta` | `#6b6b6b` / `#9b9b9b` | Secondary text / dates, tags, placeholders |
| `--on-dark` | `#f5f5f5` | Text on dark |
| `--rule` | `#333333` | .8px rules (FAQ, outlined plan, footer divider) |
| `--input-line` | `#adadad` | Underline inputs |
| `--ring-grey` | `#aeb5bf` | Thin decorative rings |
| `--body-line` | `#eceef1` | The 4 fixed vertical page hairlines |
| `--accent` | `#f14f44` | Coral: hovers, markers, ribbon, scroll-top |
| `--accent-hover` | `#fb827b` | Scroll-top hover |
| `--stroke-rose` | `#cb515a` | Outlined counter on light cards |
| `--gradient-brand` | `262deg #e24c4a → #386bb7` | Gradient words (blue on the left, red on the right), footer statement |
| `--gradient-brand-rev` | reversed | Alternate gradient words |
| `--gradient-button` | same, stops 14.51% / 95.96% | Button rings |
| `--gradient-dark` | `136deg #542f2f → #111 45%` | Warm dark card |

Dark-mode values exist in the tokens file as a reference block only; they're **not wired up**.

---

## 3. Typography

| Role | Token | Font | Size / line-height | Weight | Tracking |
|---|---|---|---|---|---|
| Intro statement | `--fs-intro` | Sora | 100 / 110 (mobile 40) | 400 | -0.05em |
| Hero headline | `--fs-hero` | Sora | 80 / 90, max-width 664px (mobile 40) | 400 | -0.03em |
| Ghost word "Neuro" | `--fs-mega` | Sora | 170 / 170 | 600 | -0.05em |
| Ribbon | `--fs-ribbon` | Sora | 80 / 144 (1.8) | 400 | -0.03em |
| Section title `.h-60` | `--fs-title` | Sora | 60 / 70 (mobile 36) | 400 | **-0.05em** |
| Footer statement | `--fs-statement` | Sora | 60 / 70, gradient | 400 | -0.03em |
| FAQ question | `--fs-faq` | Sora | 30 / 35 | 400 | -0.03em |
| Card / blog title, quote | `--fs-h3` | Sora | 25 / 35 | 400 | -0.03em |
| Plan name / price | `--fs-plan` / `--fs-price` | Sora | 40 / 1 · 60 / 76 | 400 / 600 | -0.03em |
| Counter | `--fs-counter` | Manrope | 80 (100 on dark) | 800 (700) | -0.03em (-0.05em) |
| Subtitle `.sub` | `--fs-sub` | Manrope | 16 / 28, prefixed `/` | 500 | **normal** (must reset) |
| Body | `--fs-body` | Manrope | 16 / 30 | 500 | normal |
| Nav pill | `--fs-nav` | Manrope | 14 / 40, uppercase | 700 | normal |
| Button | `--fs-btn` | Manrope | 14 / 27 (16 / 27, 600 for CTA, hero and chip) | 500 | normal |
| Small (meta, top bar, tags) | `--fs-small` | Manrope | 14 | 500 | normal |
| Micro label | `--fs-label` | Manrope | 12, uppercase | 700 | normal |

**Gradient words:** wrap them in `<del>` (or `<del class="rev">`). The letter-split script keeps the gradient continuous across letters.

---

## 4. Layout

- **Gutters:** `--gutter` 40px (20 at ≤1024, 12 at ≤575); content inset `--inner` 40px.
- **Vertical rhythm:** `--section-gap` 150px (90 on mobile).
- **Page stack:**
  - top info bar at `top: 8px`, height 40
  - floating header at `--header-top` (58px), height 101
  - hero text starts at 225px
- **Body lines:** 4 fixed 1px hairlines in `--body-line` at centre offsets -884, -227, +360 and +740px (hidden ≤1024).
- **Breakpoints:** 1180 (tighter nav), **1024** (mobile header, single columns, no top bar), 767, 575.
- **Grids used:**
  - hero 830 / 395
  - intro 542 / 803
  - bento 3 × 420 + full-width card, gap 40
  - features 4 columns
  - pricing 433 / 1fr
  - testimonial 694 / 1fr
  - blog 650 / 420 / 420
  - footer 1fr / 613

---

## 5. Shapes

### 5.1 Radii
`--r-pill` (buttons, pills, tags) · `--r-lg` 25 (cards, images, panels, header, footer) · `--r-md` 20 (dropdowns, FAQ box) · `--r-sm` 15 (icon tiles, top bar) · `--r-xs` 10 (hover tag).

### 5.2 The notch (signature shape)
A concave corner joining a widget to the surface it's cut into:
```css
.x::before { content:""; position:absolute; width:20px; height:40px;
             border-bottom-right-radius:20px;            /* pick the corner */
             box-shadow: 0 20px 0 0 var(--surface-colour); }   /* 0 -20px for top notches */
```
Used on:
- hero slider tabs
- the "See demo" chip
- the card-arrow block
- the "Popular" plan label
- the testimonial nav tab
- the blog date chip
- the footer bottom bar
- the hover-tag joint

**Rules:**
- the notch colour = the surface it merges into
- put the widget **outside** any rounded `overflow:hidden` element
- make the covered corner square (§10)

### 5.3 Slants and tilts
- **Hero zone bottom:** a 130px `--hero` band rotated `-var(--tilt)` (−2.07°), radius 25 (`.slant`).
- **Dark block top:** a 110px `--dark` band rotated −2.07° (`.dark-top`); the block itself rounds only its bottom corners.
- **Ribbons:** +2.07° coral and −2.07° dark.

### 5.4 Elevation
Almost flat:
- `--shadow-soft` (drawer)
- `--shadow-float` (sticky header)
- `--shadow-button` (button hover only)

---

## 6. Components (as built: class names refer to `index.html`)

### Top info bar `.topbar`
- **Bar:** `--btn-dark`, 40px tall, `--r-sm` radius, padding `0 40px`.
- **Left:** "Call us" and "Email" (`--fs-small` white, 45px apart; links turn coral).
- **Right:** four 13px Font Awesome brand icons, 21px apart, turning coral on hover.
- **Mobile:** hidden at ≤1024.

### Header `.header` / sticky clone `.sticky`
- **Bar:** white, 101px tall, `--r-lg`, at `--header-top`.
- **Contents, left to right:**
  - grid trigger `.grid-t` (four outlined rounded squares that cross-fade to filled)
  - logo
  - centred nav `.nav`
  - search `.search-t`
  - CTA `.btn.cta`
- **Nav pills:**
  - 40px tall, padding `0 21 0 22`, 10px gap, `--fs-nav` `#333`
  - active: `--btn-dark` with white text
  - hover: `--hero` with `#111` text, plus the label roll (`.roll` / `.roll2`)
  - indicator `.tri`: tiny ◢ (5px, the `--tri` glyph) on the baseline
- **Sticky:**
  - a separate clone, fixed at the top, radius `0 0 25 25`, `--shadow-float`
  - slides in `translateY(-150%)→0` over .5s linear after 300px of scroll
  - its contents arrive .5s later

### Dropdowns `.dd`
- **Panel:** `--dark`, 265px wide, `--r-md`, padding `25px 0`. Opens with `opacity` + `translateY(10px→0)`, `--dur-fast` ease-in.
- **Items:**
  - 17/25 w400 white, padding `10 31 10 37`
  - **hover:** coral text, padding-left 53px, and a coral `--tri` marker fades in at 37px (`--dur-fly`)
- **Parent items `.has-sub`:**
  - thin `--chev-d` arrow at right 31px
  - on hover it rotates −90° (pointing right) in coral, and the **nested `.dd`** opens at `left: 265px; top: -25px; margin-left: 1px` (a 1px gap)
  - an invisible 2px bridge keeps hover alive across the gap
- **Home mega menu `.dd.mega`:**
  - 850px wide, padding `25 31 25 37`, four columns of 195.5px
  - three link columns (current page coral)
  - one preview card (thumbnail + "Dark Version")

### Side panel `.side`
- **Card:** 389px wide, 15px margin, `--dark`, `--r-lg`, padding `62px 68px`; slides in `left` over `--dur-slow` `--ease-panel`.
- **Layout:** logo at the top · `.side-contacts` vertically centred · `.side-soc` at the bottom.
- **Contacts:**
  - "CONTACTS" micro label
  - address, phones and email at 18/28 w500 `--on-dark`; links turn coral
  - the email has a 1px underline that **shrinks to the right** on hover (`background-size 100%→0`, .4s)
  - `.btn.cta` 198×58
- **Close strip:** a 68px textured strip 3px to the right (`::before`, radius 25). The `.side-close` "Close" label is rotated 90° on it; its ✕ spins 180° on hover.
- **Glow `.side-glow`:** a coral ellipse at the bottom, 200% wide, blur 50px, rotated −10°.
- **Overlay `.overlay`:** `--dark` at 60%; it, the ✕ and Esc all close the panel.

### Search `.search` and mobile drawer `.drawer`
- **Search:** a white bar that drops from the top (`top:-120px→0` + fade, .3s) and autofocuses.
- **Drawer:** 320px, slides in from the right (.3s), with uppercase 16/700 links.

### Buttons `.btn`
- **Technique:** the gradient ring is a **real border**: `border: var(--bw) solid transparent; background: linear-gradient(var(--btn-bg),var(--btn-bg)) padding-box, var(--ring) border-box`. The hover fill is a `::before` covering the border, opacity 0→1.
- **Default:** 14/27 w500 `#333`, padding `10 24 11 43` (`--side` 43), 50px tall, 1px ring.
- **Hover (every variant):** **coral fill**, white text, `--shadow-button`; padding flips to `10 43 11 24`; the left chevron exits −1em and the right one enters from +1em.
- **Variants:**

| Variant | Spec |
|---|---|
| `.btn.dark` | `--btn-dark` |
| `.btn.white` | white 1px ring on dark |
| `.btn.lg` | hero, 16px, `--side` 63, 179×60 |
| `.btn.price` | padding `10 34 11 43` |
| `.btn.cta` | 2px ring, 16/600 `#111`, min-width 158, no arrows; hover fades in the **brand gradient** |

- **Surface rule:** on a non-white surface set `--btn-bg` to that surface (FAQ box: `#f0f2f4`; side panel: `#1f1f1f`).

### Hero (grey zone `.zone`)
- **Text `.hero-text`:**
  - headline (`--fs-hero`, max 664)
  - copy in a 395px column + `.btn.dark.lg`
  - content staggers `.3/.6/.9s` (`.cw1–3`)
- **Image `.panel`:**
  - 384px tall, radius `25 25 0 25`, inside `.panel-wrap`
  - liquid flowmap (`data-flowmap`)
  - slide change: 1.2s fade with a `--slide-tint` flash
- **Slider tabs `.snav`:** two 60×67 `--hero` tabs notched into the left edge; hover turns **only the chevron coral**.
- **Chip `.chip`:** "See demo", outside the panel, notched bottom-right; 16/600 `#333`, padding `33 112 20`, radius `25 0 0 0`; hover turns the **text** coral.
- **Intro `.intro`:**
  - a giant pale logo mark on the left
  - the `--fs-intro` statement with a gradient word
  - partner logos below
- **Bottom edge:** `.slant` (§5.3).

### Section title
`<h2 class="h-60 anim"><span class="sub">label</span>…</h2>`: the subtitle fades in .3s, then the letters rise.

### Bento cards `.bento` / `.tile`
- **Grid:** 3 columns, gap 40.
- **Cards:**
  - `.t1`: image card, padding `64 40 90`
  - `.t2`: `--gradient-dark`, content at the bottom
  - `.t3`: `--card` with a counter
  - `.t4`: small image card
  - `.wide`: full width, 291px
- **Card hover:** the image scales to 1.05 (.6s).
- **Card arrow `.go` › `.go-c`:**
  - a `--page` block notched into the bottom-right (radius `30px 0 0 0`, notches above and to the left)
  - holds a 49px `--btn-dark` circle with a white arrow
  - **hover:** the circle turns coral (.3s) and the arrow flies out right / in from the left (.4s `--ease-fly-out` / `--ease-fly-in`)
  - the card's bottom-right radius is 0
- **Counter `.counter`:** `--fs-counter` w800, **outlined via the SVG filter `#outline`** (not text-stroke); `--stroke-rose` on light cards, `.counter.w` white 100/700 on dark. Counts 0→N over 2s.

### Ribbons `.ribbons` / `.rib`
Two crossing full-width bands: coral `#111` text at +2.07°, `--dark` white text at −2.07° with `translateY(-42%)`. The text runs at `--fs-ribbon` and marquees in opposite directions over 20s linear.

### Dark about block `.dark-top` + `.darkb`
- **Shape:** the slanted top band, then a `--dark` block with radius `0 0 25 25` and a faint wave texture.
- **Left:** title + image (flowmap + hover tag).
- **Right:** ghost word "Neuro" (`--fs-mega`, filled `--dark` with a 1px faint stroke) + "AI" 25px superscript, copy, `.btn.white`.
- **Hover tag `.hover-tag`:**
  - a coral tab plus card that follows the cursor over the image (desktop mouse only)
  - revealed by a clip-path wipe (.4s)
  - notch joint `.ht-tab::after`
  - hidden when the pointer leaves the image, including during scroll

### Features `.feats` / `.feat`
4 columns: title 20/35 w600, body copy, then a 56px `--card` icon tile (`--r-sm`) that turns coral with a white icon on hover.

### Pricing `.pricing` / `.plan`
- **Layout:** a 433px title column + stacked plans (gap 10).
- **Plan:** `.8px --rule` outline, radius 25, padding `96 76`; columns: name/description · dot list · price + `.btn.price`.
- **`.plan.pop`:** a `--card` fill with a **white** "Popular" tab `.lbl` notched into the top edge.

### Testimonial `.testi`
- **Frame:** an image background (flowmap + 0.3× parallax), radius 25, padding-top 135.
- **Left:** the `--dark` quote card `.qcard` (694px, quote at `--fs-h3`) with a white nav tab `.qnav` notched bottom-right.
- **Right:** white title + white outlined counter.

### FAQ `.faqbox`
- **Box:** `--hero`, radius 20, padding `150px var(--inner)`, with the `.contours` fingerprint decoration top-right.
- **Accordion `.qa`:** `.8px --rule` dividers; the number `01…` sits at the left and the question (`--fs-faq`) is indented 34.3%; one open at a time, 300ms height slide.

### Blog `.posts` / `.post`
- **Image `.ph`:** 309px tall, radius `25 25 25 0`; zooms `scale(1.05) translateX(2%)` on hover.
- **Date chip `.meta`:** white, notched into the bottom-left.
- **Title:** `--fs-h3`, with a 2px underline that grows on hover (.5s).
- **Tags:** pills that fill coral on hover.

### Footer
- **Container `.fdark`:** `--dark`, radius `25 25 0 0`.
- **`.ftop`:** white title + contacts grid `.fcont` (20/700 titles, 16/30 values; email underline shrinks on hover; brand icons `.soc`) | white form card `.form` (613px, radius 25, padding `72 86`, floating-label underline inputs `.fl`, `.btn.dark` submit).
- **`.fmid`:** gradient statement + two link lists (20/600 titles, 16/30 links turning coral).
- **`.fbar`:** a white bottom bar notched into the base.

### Utilities
- **Scroll-top `.top`:** a 50×73 coral pill, shown after 600px, arrow nudges up on hover.
- **Preloader `.loader`:** a pulsing logo that fades out .3s after load.
- **Icons `.i.i-r/.i-l/.i-u/.i-d`:** converted to inline SVG chevrons at load.
- **Brand icons:** Font Awesome 6 brands (cdnjs).

---

## 7. Decorations
- **Body hairlines** (§4).
- **Fingerprint contours:** `<div class="contours">` inside a `position:relative; overflow:hidden` block (top −70, right −70, 744×1024). Regenerate with `python tools/make_contours.py` (`SEED`, `LINES`, `STROKE`).
- **Partner logos:** greyed, 75% opacity.

---

## 8. Motion (as built)

| Effect | How to use | Spec |
|---|---|---|
| Title letter rise | `.anim` on the heading | each letter `translateY(120%)→0` over .7s `--ease-heading` + fade .35s, staggered **20ms**; `.sub` fades in after .3s |
| Block reveal | `data-rv` (+ `style="--d:.1s"`) | `fadeInUpCustom` 40px, 1s `--ease-soft-out` |
| Count-up | `data-count="250"` | 0→N over 2s, ease-out cubic |
| Liquid image | `data-flowmap` + `data-flowmap-src` or `-art`, `data-flowmap-host` on a wider parent | OGL Flowmap, falloff .6, strength .105, canvas fades in .3s after a .3s delay; pauses offscreen; respects reduced motion |
| Parallax | `#parallax` | background moves at 0.3× scroll (≥992px) |
| Hover tag | `.hover-tag` + image | follows the cursor, clip wipe .4s |
| Button | `.btn` | coral fill + arrow swap + padding flip, .3s |
| Card arrow | `.go-c` | coral circle + arrow fly-through, .4s |
| Nav roll | `.roll` / `.roll2` | label `−150%` out / `150%→0` in, .3s |
| Dropdown | `.dd` | opacity + 10px rise, .2s ease-in |
| Side panel | `.side` | `left` .6s `--ease-panel` |
| Sticky header | `.sticky` | slide .5s linear; contents arrive after .5s |
| Hero slide | `#prev` / `#next` | 1.2s fade, tint flash, content stagger .3/.6/.9s |
| Ribbons | `.rib .t` | `text_move_left` 20s linear infinite (one band reversed) |
| Preloader | `.loader` | `pulsate` 1.5s |
| Global | | `transition: .3s` |

**Theme effects documented but not built here** (they were on other demo pages):
- scroll clip reveal: `clip-path inset(350px→0 round r)` (Home 15)
- 3D image tilt: `rotateX(15→0)` (Home 13)
- stacking cards: scale `1-(n-1-i)*.05`, brightness .6
- moving list: GSAP scrub .5 (Home 10)
- gallery drag cursor
- team-card glow
- service title roll

---

## 9. Responsive
- **≤1180:** tighter nav padding.
- **≤1024:**
  - burger + drawer; no top bar, grid trigger, search or header CTA
  - header 70px tall at `top:10px`
  - every grid goes to one column
  - body lines hidden; hover tag disabled
- **≤767:** section gap 90; smaller ribbons; plan cards stack.
- **≤575:** gutter 12; features in one column; side panel narrows.
- **No horizontal scroll** at 375 (verified).

---

## 10. Rendering rules (learned the hard way)
- **Edge bleed:** a widget sitting in a rounded, clipped corner leaves a hairline arc of the image behind it. Put the widget outside the clipped element and square that corner.
- **Gradient rings:** use a real border with `padding-box` / `border-box` backgrounds, not a masked overlay. A masked overlay looks uneven on 125% / 150% displays.
- **Outlined numbers:** don't use `-webkit-text-stroke` on variable fonts (overlap seams). Use the SVG `#outline` filter.
- **Icons:** use inline SVG / mask glyphs, not text characters.
- **Class collisions:** shared short names broke three components (`.t2`, `.sw`, `.in`). Prefix classes per component.
- **Clip reveals:** observe the parent (a fully clipped element never counts as intersecting).
- **Hover state on scroll:** re-check pointer-driven UI on `scroll`, because `mouseleave` doesn't fire when content moves under a still cursor.

---

## 11. Licensing
- **Inspiration only:** the layout, palette, type pairing and motion values are taken as inspiration.
- **Original assets:** all imagery here is original CSS / SVG / canvas art. Don't copy the theme's logo, photos, renders, PNG decorations or demo copy.
- **Fonts and icons:** Manrope, Sora (OFL) and Font Awesome brands are free to use.

---

## 12. Changelog
- **2026-10-02:** codebase cleaned for GitHub. Inline CSS/JS split into `assets/css/main.css` and `assets/js/main.js`, files moved under `assets/` and `tools/`, dead rules removed (`.art-grey`, `.i-d`), README and .gitignore added.
- **2026-10-02:** consolidated into a single spec. `design-tokens.css` is now the only place variables are defined (the duplicate `:root` block was removed from `index.html`). Corrected the outdated entries: white page, type scale, ghost word, buttons, menus.
- **2026-10-02:** top info bar; header moved to 58px; top-menu ◢ indicators.
- **2026-10-02:** side panel rebuilt (close strip, glow, contacts, brand icons); card-arrow notch block with coral hover.
- **2026-10-01:** menus (mega menu, nested flyouts with 1px gap, triangle marker); "See demo" chip; edge-bleed fixes.
- **2026-10-01:** liquid flowmap; hover-tag scroll fix; fingerprint contours; button real-border rings; SVG outline counters.
- **2026-10-01:** initial extraction and 1:1 rebuild.
