/* AI agency site: interactions (header, panels, reveals, slider, accordion, hover tag, scroll effects).
   Loaded at the end of <body>. Spec: DESIGN-SYSTEM.md §8. */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
$("#header").append($("#hdr").content.cloneNode(true)); $("#sticky").append($("#hdr").content.cloneNode(true));


/* panels share one overlay */
const closeAll = () => $$(".side,.search,.drawer,.overlay").forEach(e => e.classList.remove("on"));
document.addEventListener("click", e => {
  const o = e.target.closest("[data-open]");
  if (o) { closeAll(); $("#" + o.dataset.open).classList.add("on"); $("#overlay").classList.add("on"); if (o.dataset.open === "search") setTimeout(() => $("#search input").focus(), 50); }
  if (e.target.closest("[data-close]") || e.target.id === "overlay") closeAll();
});
addEventListener("keydown", e => e.key === "Escape" && closeAll());

/* chevrons as inline vector SVG (crisper than a masked bitmap at small sizes) */
const CHEV = { "i-r": ["0 0 8 13", "M1.6 1.6 6.3 6.5 1.6 11.4"], "i-l": ["0 0 8 13", "M6.4 1.6 1.7 6.5 6.4 11.4"],
               "i-d": ["0 0 10 6", "M1.3 1.3 5 4.7 8.7 1.3"], "i-u": ["0 0 10 6", "M1.3 4.7 5 1.3 8.7 4.7"] };
function vectorIcons(root = document) { $$(".i-r,.i-l,.i-d,.i-u", root).forEach(el => { const k = Object.keys(CHEV).find(c => el.classList.contains(c)); const [vb, d] = CHEV[k];
  el.classList.add("svg"); el.innerHTML = `<svg viewBox="${vb}" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`; }); }

/* letter split: delay = index / 50 s; gradient stays continuous across letters */
function split(h) {
  let i = 0;
  const walk = n => [...n.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) { f.append(" "); return; }
        const wd = document.createElement("span"); wd.className = "word";
        [...w].forEach(ch => { const l = document.createElement("span"); l.className = "letter"; l.textContent = ch; l.style.animationDelay = (i++ / 50) + "s"; wd.append(l); });
        f.append(wd); });
      c.replaceWith(f);
    } else if (c.nodeType === 1 && !c.classList.contains("sub") && c.tagName !== "BR") walk(c);
  });
  walk(h); h.classList.add("split");
  $$("del", h).forEach(g => { const b = g.getBoundingClientRect(); $$(".letter", g).forEach(l => { l.style.setProperty("--gw", b.width + "px"); l.style.setProperty("--gx", (l.getBoundingClientRect().left - b.left) + "px"); }); });
}
function countUp(el) { const to = +el.dataset.count, t0 = performance.now(); const f = t => { const p = Math.min(1, (t - t0) / 2000); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }
const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; e.target.classList.add("in"); if (e.target.dataset.count) countUp(e.target); io.unobserve(e.target); }), { threshold: .15 });

/* hero slider: 1.2s fade, red tint flash, content re-staggers .3/.6/.9s */
const slides = [
  { t: 'Harness the Power of <del>Artificial Intelligence</del>', c: "Highlight the potential benefits of Neural Networks, such as improved decision-making, predictive analytics, and automation.", a: "art-cells" },
  { t: 'Revolutionize your business with <del class="rev">Neural Networks</del>', c: "Cutting-edge Neural Network solutions, designed, trained and deployed by one team.", a: "art-flow" } ];
let cur = 0;
function go(d) { cur = (cur + d + slides.length) % slides.length; const s = slides[cur], ht = $("#heroText"), p = $("#panel");
  ht.classList.remove("slide-on"); p.classList.add("changing");
  setTimeout(() => { $("#heroTitle").innerHTML = s.t; $("#heroCopy").textContent = s.c; const fm = window.flowmap && flowmap($("#slideArt")); if (fm) fm.setArt(s.a.replace("art-", "")); else { $("#slideArt").style.backgroundImage = ""; $("#slideArt").className = "art " + s.a; } p.classList.remove("changing"); requestAnimationFrame(() => ht.classList.add("slide-on")); }, 600); }
$("#prev").onclick = () => go(-1); $("#next").onclick = () => go(1);

/* accordion: one open, 300ms slide */
$$(".qa").forEach(q => { const c = $(".qa-c", q); if (q.classList.contains("open")) c.style.height = "auto";
  $(".qa-t", q).onclick = () => { const was = q.classList.contains("open");
    $$(".qa.open").forEach(o => { const oc = $(".qa-c", o); oc.style.height = oc.scrollHeight + "px"; requestAnimationFrame(() => oc.style.height = 0); o.classList.remove("open"); });
    if (!was) { q.classList.add("open"); c.style.height = c.scrollHeight + "px"; c.addEventListener("transitionend", () => q.classList.contains("open") && (c.style.height = "auto"), { once: true }); } }; });

/* hover-text cursor */
const tag = $("#hoverTag"), hi = $("#hoverImg");
// mouseleave never fires when the page scrolls the image away under a still mouse,
// so the tag's visibility is re-checked against the last pointer position on scroll/resize too.
let px = -1, py = -1;
const overImg = () => { const r = hi.getBoundingClientRect(); return px >= r.left && px <= r.right && py >= r.top && py <= r.bottom; };
const desktopMouse = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1025px)");   // theme: desktop only
const syncTag = () => tag.classList.toggle("on", desktopMouse.matches && overImg());
addEventListener("pointermove", e => { px = e.clientX; py = e.clientY; if (overImg()) { tag.style.left = px + "px"; tag.style.top = py + "px"; } syncTag(); }, { passive: true });
addEventListener("scroll", syncTag, { passive: true });
addEventListener("resize", syncTag);
document.addEventListener("pointerleave", () => { px = py = -1; syncTag(); });
addEventListener("blur", () => { px = py = -1; syncTag(); });

/* scroll: sticky header, scroll-top, parallax (0.3x) */
function onScroll() { const y = scrollY; $("#sticky").classList.toggle("on", y > 300); $("#top").classList.toggle("show", y > 600);
  const p = $("#parallax"); if (innerWidth >= 992) { const r = p.parentElement.getBoundingClientRect(); p.style.transform = `translateY(${-r.top * .3}px)`; } else p.style.transform = ""; }
addEventListener("scroll", onScroll, { passive: true }); $("#top").onclick = () => scrollTo({ top: 0, behavior: "smooth" });

/* palette */
const pal = [["Page","#ffffff"],["Hero zone","#f0f2f4"],["Card grey","#e9ebed"],["Dark","#1f1f1f"],["Button dark","#333333"],["Headings","#111111"],["Body","#333333"],["Meta","#9b9b9b"],["Input line","#adadad"],["Coral","#f14f44"],["Coral hover","#fb827b"],["Grad red","#e24c4a"],["Grad blue","#386bb7"],["Counter stroke","#cb515a"]];
$("#swatches").innerHTML = pal.map(([n, v]) => `<div class="sw"><div style="background:${v}"></div><p><b>${n}</b><code>${v}</code></p></div>`).join("") +
  `<div class="sw"><div style="background:var(--gradient-brand)"></div><p><b>Brand gradient</b><code>262deg</code></p></div><div class="sw"><div style="background:var(--gradient-dark)"></div><p><b>Dark card</b><code>136deg</code></p></div>`;

addEventListener("load", () => {
  vectorIcons();
  $$(".anim").forEach(split);
  $$("[data-rv], .anim, [data-count]").forEach(el => io.observe(el));
  onScroll();
  const l = $("#loader"); setTimeout(() => { l.style.opacity = 0; setTimeout(() => l.remove(), 300); }, 300);
});
