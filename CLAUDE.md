# Working in this folder

This is the design system for the user's AI agency website (Neuros-inspired, measured 1:1).

Before changing or adding anything:
1. Read `DESIGN-SYSTEM.md`, starting with §0 (rules + new-section checklist). It is the spec.
2. Use only variables from `assets/css/design-tokens.css`. Add new tokens there, and only there, if needed; never hard-code colours, sizes, radii or easings.
3. Build new UI from the existing components (markup in `index.html`, styles in `assets/css/main.css`, behaviour in `assets/js/main.js`) (section title, `.btn` variants, `.tile`, the notch pattern, `data-rv` / `.anim` reveals).
4. Give new classes a component prefix. Never use `.in` or 1–2 letter class names (they have collided before).
5. When matching the original theme, measure the live demo (computed styles + `:hover` rules) instead of guessing from screenshots.

After a change:
- Check 1440px, ≤1024px and 375px, plus hover states. There must be no horizontal scroll.
- Update `DESIGN-SYSTEM.md` (the relevant section + a changelog line in §12) so the three files stay in sync.

Preview: `python -m http.server 5178` in the repo root, then open http://localhost:5178/index.html (the flowmap module needs http, not file://).
