"""Builds a product-icon font from <dir>/svg/*.svg + <dir>/glyphs.json.

  python3 src/font.py [<dir> <out.woff> <family>]
  default: producticons hugeicons-ui.woff "Hugeicons UI"

Stroked icons (Hugeicons) are outlined with picosvg. Filled icons (Phosphor) are used as-is.
Duotone icons (paths with opacity) become COLRv1 colour glyphs: the faint layer is painted in the
text colour at its opacity, the main layer in the full text colour.
Needs: pip install picosvg fonttools
"""
import json
import re
import sys
from pathlib import Path

import pathops
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.svgLib.path import parse_path
from fontTools.ttLib.tables import otTables as ot

ROOT = Path(__file__).resolve().parent.parent
args = sys.argv[1:] or ["producticons", "hugeicons-ui.woff", "Hugeicons UI"]
PI = ROOT / args[0]
OUT = PI / args[1]
FAMILY = args[2]
UPM = 1000
FOREGROUND = 0xFFFF


def layers_of(svg_text):
    """Returns (viewBox, [(opacity, [(path d, fill_rule)...])]); strokes are outlined via picosvg."""
    from picosvg.svg import SVG
    if "opacity=" in svg_text and "stroke" not in svg_text:  # duotone layering (kept for completeness)
        vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', svg_text).group(1).replace(",", " ").split()]
        groups = {}
        for m in re.finditer(r"<path\b([^>]*)/?>", svg_text):
            attrs = m.group(1)
            d = re.search(r'\bd="([^"]+)"', attrs).group(1)
            op = re.search(r'\bopacity="([^"]+)"', attrs)
            groups.setdefault(float(op.group(1)) if op else 1.0, []).append((d, "nonzero"))
        return vb, sorted(groups.items())
    pico = SVG.fromstring(svg_text).topicosvg()
    vb = list(pico.view_box())
    return vb, [(1.0, [(s.d, getattr(s, "fill_rule", "nonzero") or "nonzero") for s in pico.shapes()])]


def glyph_from(ds, vb):
    minx, miny, w, h = vb
    scale = UPM / max(w, h)
    union = pathops.Path()
    for d, rule in ds:
        p = pathops.Path(fillType=pathops.FillType.EVEN_ODD if rule == "evenodd" else pathops.FillType.WINDING)
        parse_path(d, p.getPen())
        p.simplify(fix_winding=True)
        union = pathops.op(union, p, pathops.PathOp.UNION, fix_winding=True)
    pen = TTGlyphPen(None)
    # SVG y-down viewBox -> font y-up 0..UPM
    union.draw(TransformPen(Cu2QuPen(pen, 1.0, reverse_direction=True),
                            (scale, 0, 0, -scale, -minx * scale, (miny + h) * scale)))
    return pen.glyph()


glyphs = json.loads((PI / "glyphs.json").read_text())
by_icon = {g["icon"]: g["codepoint"] for g in glyphs.values()}

names, cmap, outlines, colr = [".notdef"], {}, {".notdef": TTGlyphPen(None).glyph()}, {}
failed = []
for icon, cp in sorted(by_icon.items(), key=lambda kv: kv[1]):
    text = (PI / "svg" / f"{icon}.svg").read_text()
    try:
        vb, layers = layers_of(text)
    except Exception as e:  # unparseable icon: leave the slot empty
        failed.append(f"{icon}: {e}")
        vb, layers = [0, 0, 24, 24], [(1.0, [])]
    name = f"uni{cp:04X}"
    names.append(name)
    cmap[cp] = name
    outlines[name] = glyph_from([d for _, ds in layers for d in ds], vb)
    if len(layers) > 1:
        paints = []
        for i, (opacity, ds) in enumerate(layers):
            lname = f"{name}.l{i}"
            names.append(lname)
            outlines[lname] = glyph_from(ds, vb)
            paints.append({
                "Format": ot.PaintFormat.PaintGlyph,
                "Paint": {"Format": ot.PaintFormat.PaintSolid, "PaletteIndex": FOREGROUND, "Alpha": opacity},
                "Glyph": lname,
            })
        colr[name] = {"Format": ot.PaintFormat.PaintColrLayers, "Layers": paints}
if failed:
    print("  could not convert:", "; ".join(failed))

fb = FontBuilder(UPM, isTTF=True)
fb.setupGlyphOrder(names)
fb.setupCharacterMap(cmap)
fb.setupGlyf(outlines)
fb.setupHorizontalMetrics({n: (UPM, 0) for n in names})
fb.setupHorizontalHeader(ascent=UPM, descent=0)
fb.setupNameTable({"familyName": FAMILY, "styleName": "Regular"})
fb.setupOS2(sTypoAscender=UPM, sTypoDescender=0, usWinAscent=UPM, usWinDescent=0)
fb.setupPost()
if colr:
    fb.setupCPAL([[(1.0, 1.0, 1.0, 1.0)]])
    fb.setupCOLR(colr, version=1)
fb.font.flavor = "woff"
fb.save(str(OUT))
print(f"wrote {len(cmap)} glyphs ({len(colr)} duotone) to {OUT.relative_to(ROOT)}")
