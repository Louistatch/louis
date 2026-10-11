"""Découpe une planche de 4 poses (fond blanc) en 4 PNG détourés : python3 cutout.py planche.png prefixe"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

src, prefix = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
W, H = im.size
work = im.copy()
KEY = (255, 0, 255)
seeds = [(x, y) for x in range(0, W, max(1, W // 40)) for y in (0, H - 1)] + [(x, y) for y in range(0, H, max(1, H // 20)) for x in (0, W - 1)]
for s in seeds:
    if sum(work.getpixel(s)) > 690:
        ImageDraw.floodfill(work, s, KEY, thresh=38)
a = np.array(work)
alpha = np.where((a[..., 0] == 255) & (a[..., 1] == 0) & (a[..., 2] == 255), 0, 255).astype(np.uint8)
mask = Image.fromarray(alpha).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.8))
rgba = im.copy(); rgba.putalpha(mask)
cols = (np.array(mask) > 40).any(axis=0)
# segments de colonnes occupées -> 4 personnages
segs, on, st = [], False, 0
for x, c in enumerate(cols):
    if c and not on: on, st = True, x
    if not c and on:
        on = False
        if x - st > W * .04: segs.append((st, x))
if on: segs.append((st, W))
segs = sorted(segs, key=lambda s: s[1] - s[0], reverse=True)[:4]
segs.sort()
for i, (x0, x1) in enumerate(segs, 1):
    crop = rgba.crop((max(0, x0 - 6), 0, min(W, x1 + 6), H))
    bb = crop.getbbox(); crop = crop.crop(bb)
    crop.save(f'{prefix}_{i}.png')
    print(f'{prefix}_{i}.png', crop.size)
