"""Generates contours.svg: hairlines that morph from a big outer circle into an
organic blob, cropped at the right edge (the 'fingerprint' decoration used behind
the demo grid on the Neuros intro page, redrawn from scratch as original vector art).

Run:  python tools/make_contours.py   (tweak LINES / SEED / colours below)"""
import math, random, pathlib

W, H = 744, 1024          # same footprint as the theme's decoration
CX, CY = 640, 470         # centre sits near the right edge so the shape is cropped there
R_OUT = 560               # outermost circle radius
LINES = 26                # number of hairlines
STEPS = 220               # points per line
SEED = 5
STROKE = "#c4c9d0"
WIDTH = 0.9

random.seed(SEED)
# a few low-frequency waves give the inner blob its organic, lobed outline
waves = [(k, amp * random.uniform(0.8, 1.2), random.uniform(0, math.tau)) for k, amp in ((2, .10), (3, .085), (4, .05), (5, .025))]

def blob(a):
    """Inner shape radius at angle a: about 0.40 of the circle, wobbling between lobes."""
    return R_OUT * (0.40 + sum(amp * math.sin(k * a + ph) for k, amp, ph in waves))

def ease(t):                       # lines bunch together towards the blob, like the original
    return 1 - (1 - t) ** 1.3

paths = []
for i in range(LINES):
    t = ease(i / (LINES - 1))
    pts = []
    for s in range(STEPS + 1):
        a = s / STEPS * math.tau
        r = (1 - t) * R_OUT + t * blob(a)
        pts.append((CX + r * math.cos(a), CY + r * math.sin(a)))
    d = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + " Z"
    paths.append(f'<path d="{d}"/>')

svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
       f'fill="none" stroke="{STROKE}" stroke-width="{WIDTH}" vector-effect="non-scaling-stroke">\n'
       + "\n".join(paths) + "\n</svg>\n")
out = pathlib.Path(__file__).resolve().parent.parent / "assets" / "img" / "contours.svg"
out.write_text(svg, encoding="utf-8")
print(f"{out} written: {LINES} lines, {len(svg)//1024} KB")
