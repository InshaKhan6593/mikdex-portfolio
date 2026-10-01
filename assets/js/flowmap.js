/* Liquid "flowmap" image distortion that follows the cursor.
   Same technique and constants as the Neuros theme (Home 7 hero):
   OGL Flowmap, falloff 0.6, displacement 0.15 * 0.7, canvas fades in .3s after a .3s delay.

   Usage: any element with  data-flowmap  becomes interactive.
     data-flowmap-src="img.jpg"   use an image (recommended for your real site)
     data-flowmap-art="cells"     or use a built-in generated artwork (cells | flow | sky | ember)
   The element needs position:relative and overflow:hidden; border-radius is inherited. */
import { Renderer, Program, Mesh, Triangle, Texture, Flowmap, Vec2, Vec4 } from "https://cdn.jsdelivr.net/npm/ogl@1.0.11/src/index.js";

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 0, 1); }`;

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform sampler2D tFlow;
  uniform vec4 res;          // xy = element size, zw = cover-fit scale
  varying vec2 vUv;
  void main() {
    vec3 flow = texture2D(tFlow, vUv).rgb;   // r,g = velocity, b = speed
    vec2 uv = (vUv - 0.5) * res.zw + 0.5;    // object-fit: cover
    uv -= flow.xy * (0.15 * 0.7);            // theme's displacement strength
    gl_FragColor = vec4(texture2D(tMap, uv).rgb, 1.0);
  }`;

/* ---------- generated artwork (so the demo needs no image files) ---------- */
export function paintArt(name, w = 1600, h = 900) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d");
  const radial = (x, y, r, stops) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); stops.forEach(([o, col]) => gr.addColorStop(o, col)); g.fillStyle = gr; g.fillRect(0, 0, w, h); };
  if (name === "cells") {
    g.fillStyle = "#0d0b10"; g.fillRect(0, 0, w, h);
    radial(w * .1, h * .6, w * .7, [[0, "rgba(226,76,74,.95)"], [.6, "rgba(120,20,25,.35)"], [1, "rgba(0,0,0,0)"]]);
    radial(w * .85, h * .2, w * .6, [[0, "rgba(56,107,183,.95)"], [.55, "rgba(30,50,110,.3)"], [1, "rgba(0,0,0,0)"]]);
    // honeycomb of dark cells fading out to the right
    const cw = 34, ch = 30;
    for (let y = -ch; y < h + ch; y += ch) for (let x = -cw; x < w + cw; x += cw) {
      const ox = (Math.round(y / ch) % 2) * cw / 2, fade = Math.max(0, 1 - (x / w) * 1.5);
      if (fade <= 0) continue;
      g.beginPath(); g.arc(x + ox, y, cw * .4, 0, Math.PI * 2); g.fillStyle = `rgba(0,0,0,${.55 * fade})`; g.fill();
      g.beginPath(); g.arc(x + ox - 3, y - 3, cw * .25, 0, Math.PI * 2); g.fillStyle = `rgba(255,120,110,${.08 * fade})`; g.fill();
    }
  } else if (name === "flow") {
    g.fillStyle = "#0d0d12"; g.fillRect(0, 0, w, h);
    const cg = g.createConicGradient ? g.createConicGradient(3.5, w * .7, h * .6) : null;
    if (cg) { [[0, "#f14f44"], [.1, "#6b1d1a"], [.3, "#0d0d12"], [.55, "#386bb7"], [.7, "#0d0d12"], [1, "#f14f44"]].forEach(([o, col]) => cg.addColorStop(o, col)); g.fillStyle = cg; g.fillRect(0, 0, w, h); }
    g.strokeStyle = "rgba(255,255,255,.08)"; g.lineWidth = 2;
    for (let i = -h; i < w; i += 22) { g.beginPath(); g.moveTo(i, h); g.lineTo(i + h * .47, 0); g.stroke(); }
  } else if (name === "sky") {
    g.fillStyle = "#121014"; g.fillRect(0, 0, w, h);
    radial(w * .2, h * .3, w * .55, [[0, "#e24c4a"], [1, "rgba(0,0,0,0)"]]);
    radial(w * .9, h * .7, w * .6, [[0, "#386bb7"], [1, "rgba(0,0,0,0)"]]);
  } else { // ember
    const lg = g.createLinearGradient(0, 0, w, h); lg.addColorStop(0, "#141015"); lg.addColorStop(1, "#2b1212"); g.fillStyle = lg; g.fillRect(0, 0, w, h);
    radial(w * .3, h, w * .5, [[0, "#f14f44"], [1, "rgba(0,0,0,0)"]]);
    radial(w * .9, h * .1, w * .4, [[0, "#386bb7"], [1, "rgba(0,0,0,0)"]]);
  }
  return c;
}

/* ---------- the effect ---------- */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

export function flowmap(el) {
  if (el._flow) return el._flow;
  const art = el.dataset.flowmapArt, src = el.dataset.flowmapSrc;
  // static fallback / pre-activation look = exactly the texture that WebGL will distort
  let source = art ? paintArt(art) : null;
  if (source) el.style.backgroundImage = `url(${source.toDataURL("image/jpeg", .9)})`;
  if (src) el.style.backgroundImage = `url("${src}")`;
  el.style.backgroundSize = "cover"; el.style.backgroundPosition = "center";
  if (reduce) return null;

  let gl, renderer, program, mesh, flow, texture, aspect = 1, imgW = 1600, imgH = 900, running = false, visible = true, raf;
  const mouse = new Vec2(-1), velocity = new Vec2(), last = new Vec2(); let lastTime = 0;

  function fit() {
    const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h); aspect = w / h;
    const imageAspect = imgH / imgW; let a1, a2;
    if (h / w < imageAspect) { a1 = 1; a2 = (h / w) / imageAspect; } else { a1 = (w / h) * imageAspect; a2 = 1; }
    program.uniforms.res.value = new Vec4(w, h, a1, a2);
  }
  function setSource(img) { imgW = img.naturalWidth || img.width; imgH = img.naturalHeight || img.height; texture.image = img; fit(); }

  function start() {
    renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), alpha: true });
    gl = renderer.gl;
    Object.assign(gl.canvas.style, { position: "absolute", inset: "0", width: "100%", height: "100%", borderRadius: "inherit", opacity: "0", transition: "opacity .3s .3s", pointerEvents: "none", zIndex: "0" });
    el.prepend(gl.canvas);
    flow = new Flowmap(gl, { falloff: 0.6 });
    texture = new Texture(gl, { minFilter: gl.LINEAR, magFilter: gl.LINEAR, generateMipmaps: false });
    program = new Program(gl, { vertex, fragment, uniforms: { tMap: { value: texture }, tFlow: flow.uniform, res: { value: new Vec4(1, 1, 1, 1) } } });
    mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    if (source) setSource(source);
    else { const img = new Image(); img.crossOrigin = "anonymous"; img.onload = () => setSource(img); img.src = src; }
    addEventListener("resize", fit); fit();
    requestAnimationFrame(() => gl.canvas.style.opacity = "1");
    running = true; raf = requestAnimationFrame(tick);
  }

  function move(e) {
    const p = e.changedTouches ? e.changedTouches[0] : e, r = el.getBoundingClientRect();
    const x = p.clientX - r.left, y = p.clientY - r.top;
    mouse.set(x / r.width, 1 - y / r.height);
    const now = performance.now();
    if (!lastTime) { lastTime = now; last.set(x, y); }
    const dt = Math.max(10.4, now - lastTime); lastTime = now;      // theme clamps dt at 10.4ms
    velocity.set((x - last.x) / dt, (y - last.y) / dt); last.set(x, y);
    velocity.needsUpdate = true;
  }

  function tick() {
    raf = requestAnimationFrame(tick);
    if (!visible) return;
    if (!velocity.needsUpdate) { mouse.set(-1); velocity.set(0); }
    velocity.needsUpdate = false;
    flow.aspect = aspect; flow.mouse.copy(mouse);
    flow.velocity.lerp(velocity, 0.15);   // theme writes `velocity.len ? .15 : .1`; .len is a method, so it is always .15
    flow.update(); renderer.render({ scene: mesh });
  }

  const host = el.closest("[data-flowmap-host]") || el;          // listen on a bigger area if wanted
  host.addEventListener("mouseover", () => running || start(), { once: true });
  host.addEventListener("touchstart", () => running || start(), { once: true, passive: true });
  host.addEventListener("mousemove", move);
  host.addEventListener("touchmove", move, { passive: true });
  new IntersectionObserver(([en]) => visible = en.isIntersecting).observe(el);   // pause offscreen

  el._flow = {
    setArt(name) { source = paintArt(name); el.style.backgroundImage = `url(${source.toDataURL("image/jpeg", .9)})`; if (running) setSource(source); },
    setSrc(url) { el.style.backgroundImage = `url("${url}")`; if (!running) { el.dataset.flowmapSrc = url; return; } const img = new Image(); img.crossOrigin = "anonymous"; img.onload = () => setSource(img); img.src = url; }
  };
  return el._flow;
}

document.querySelectorAll("[data-flowmap]").forEach(flowmap);
window.flowmap = flowmap;
