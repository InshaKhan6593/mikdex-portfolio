# Mikdex: AI agency website

A premium, single-page AI agency website built with plain HTML, CSS and JavaScript: no framework, no build step.
The design system was measured 1:1 from a reference theme (layout, type scale, colour roles, hover states and motion),
then rebuilt from scratch with original artwork.

## Features
- **Design tokens.** Every colour, size, radius, easing and icon lives in [`assets/css/design-tokens.css`](assets/css/design-tokens.css).
- **Motion:**
  - headings rise in letter by letter
  - blocks reveal on scroll
  - the sticky header slides in
  - the ribbons scroll as a marquee
  - numbers count up
  - the hero slider changes with a fade
- **Liquid image distortion** that follows the cursor (WebGL via [OGL](https://github.com/oframe/ogl)): [`assets/js/flowmap.js`](assets/js/flowmap.js).
- **Navigation:** a mega menu, nested flyouts, a slide-in contact panel, a search bar and a mobile drawer.
- **Signature details:**
  - notched (concave) corners
  - slanted section edges
  - gradient-ring pill buttons with a coral hover
  - an arrow fly-through
  - outlined counters
  - "fingerprint" contour lines
- **Responsive** down to 375px, and it respects `prefers-reduced-motion`.

## Run locally
The flowmap module needs to be served over HTTP (not `file://`):

```bash
python -m http.server 5178
```

Then open http://localhost:5178/index.html.

## Structure
```
index.html                    markup
assets/css/design-tokens.css  all variables + keyframes (single source of truth)
assets/css/main.css           component styles
assets/js/main.js             interactions
assets/js/flowmap.js          WebGL liquid image effect (ES module)
assets/img/contours.svg       decorative contour lines
tools/make_contours.py        regenerates contours.svg
DESIGN-SYSTEM.md              full spec: rules, tokens, components, motion
```

## Contributing / extending
Read [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md), especially §0 (the rules and the new-section checklist), before adding anything.
Use tokens instead of raw values, reuse the existing components, and add a changelog entry when the design changes.

## Credits
- Fonts: [Sora](https://fonts.google.com/specimen/Sora) and [Manrope](https://fonts.google.com/specimen/Manrope) (SIL OFL).
- Icons: [Font Awesome Free](https://fontawesome.com) brands (CC BY 4.0).
- All imagery is original CSS, SVG or canvas art.
