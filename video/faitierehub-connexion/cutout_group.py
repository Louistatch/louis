"""Détoure une image de groupe (fond blanc) en un seul PNG : python3 cutout_group.py src.png dst.png"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
im = Image.open(sys.argv[1]).convert('RGB'); W, H = im.size; work = im.copy()
seeds = [(x, y) for x in range(0, W, max(1, W // 60)) for y in (0, H - 1)] + [(x, y) for y in range(0, H, max(1, H // 30)) for x in (0, W - 1)]
for s in seeds:
    if sum(work.getpixel(s)) > 690: ImageDraw.floodfill(work, s, (255, 0, 255), thresh=38)
a = np.array(work)
alpha = np.where((a[..., 0] == 255) & (a[..., 1] == 0) & (a[..., 2] == 255), 0, 255).astype(np.uint8)
mask = Image.fromarray(alpha).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.8))
out = im.copy(); out.putalpha(mask); out = out.crop(out.getbbox()); out.save(sys.argv[2]); print(sys.argv[2], out.size)
