"""Bande-son originale (musique + bruitages) synthétisée, calée sur la timeline de index.html.
Usage : python3 music.py out/audio_raw.wav
"""
import sys, wave
import numpy as np

SR, DUR = 44100, 58.0
N = int(SR * DUR)
rng = np.random.default_rng(3)
L = np.zeros(N); R = np.zeros(N)
BEAT = 60 / 96

def hz(m): return 440 * 2 ** ((m - 69) / 12)

def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if i >= N or j <= i: return
    s = sig[: j - i] * gain
    L[i:j] += s * np.sqrt((1 - pan) / 2) * 1.414; R[i:j] += s * np.sqrt((1 + pan) / 2) * 1.414

def env(n, a, r, sustain=True):
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4))
    rel = np.clip((n / SR - t) / max(r, 1e-4), 0, 1)
    return e * rel

def tone(f, d, harm=(1, .5, .25, .12), detune=0.0):
    t = np.arange(int(d * SR)) / SR
    return sum(a * np.sin(2 * np.pi * f * (k + 1) * t * (1 + detune)) for k, a in enumerate(harm))

def band_noise(d, lo, hi):
    n = int(d * SR); x = rng.standard_normal(n); X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR); X[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(X, n); return y / (np.abs(y).max() + 1e-9)

def pad(notes, t, d, g):
    for m in notes:
        s = (tone(hz(m), d, (1, .35, .15)) + tone(hz(m), d, (1, .3), 0.003)) * env(int(d * SR), 0.8, 1.2)
        add(s, t, g, pan=((m % 5) - 2) / 4)

def pluck(m, t, g=.18, pan=0):
    d = .6; n = int(d * SR); tt = np.arange(n) / SR
    s = tone(hz(m), d, (1, .6, .3, .15, .08)) * np.exp(-tt * 7) * env(n, .003, .05)
    add(s, t, g, pan)

def kick(t, g=.9):
    d = .45; tt = np.arange(int(d * SR)) / SR
    f = 45 + 80 * np.exp(-tt * 30); ph = 2 * np.pi * np.cumsum(f) / SR
    add(np.sin(ph) * np.exp(-tt * 9), t, g)

def hat(t, g=.05, pan=.3):
    d = .06; s = band_noise(d, 7000, 16000) * np.exp(-np.arange(int(d * SR)) / SR * 70); add(s, t, g, pan)

def clap(t, g=.12):
    d = .2; s = band_noise(d, 900, 5000) * np.exp(-np.arange(int(d * SR)) / SR * 22); add(s, t, g)

def whoosh(t, d=.6, g=.22, up=True):
    n = int(d * SR); s = band_noise(d, 300, 6000)
    e = np.sin(np.pi * np.arange(n) / n) ** 2; add(s * e, t - d * .55, g, pan=-.3 if up else .3)

def pop(t, f=880, g=.25):
    d = .12; tt = np.arange(int(d * SR)) / SR
    ff = f * (1 + .6 * np.exp(-tt * 60)); s = np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-tt * 35); add(s, t, g)

def tick(t, g=.07):
    d = .03; add(band_noise(d, 2500, 9000) * np.exp(-np.arange(int(d * SR)) / SR * 150), t, g)

def chime(t, notes, g=.2, gap=.09):
    for k, m in enumerate(notes):
        d = 1.4; tt = np.arange(int(d * SR)) / SR
        add(tone(hz(m), d, (1, .2, .05)) * np.exp(-tt * 3.5) * env(int(d * SR), .005, .3), t + k * gap, g, pan=(k - 1) * .3)

# ---------- Partie A : le constat / le problème (0 → 15 s), tension retenue ----------
for k, ch in enumerate([[45, 57, 60, 64], [41, 53, 57, 60], [45, 57, 60, 64]]):
    pad(ch, k * 5.0, 5.6, .05)
for b in range(int(15 / BEAT)):                       # pulsation "horloge"
    tick(b * BEAT, .05)
    if b % 4 == 0 and b * BEAT < 13: kick(b * BEAT, .35)
for b, m in enumerate([69, 72, 76, 72] * 7):          # arpège discret mineur
    if 3.0 + b * BEAT / 2 < 14: pluck(m, 3.0 + b * BEAT / 2, .07, pan=.4 if b % 2 else -.4)
for i in range(3):                                    # compteurs 426 / 391 / 347
    for k in range(14): tick(3.2 + i + k * .065, .06)
pop(6.15, 180, .35); whoosh(6.55, .5, .12)
for i in range(4): pop(9.55 + i * .14, 520, .18)       # cartes problème
for t0 in (10.4, 10.65): pop(t0, 700, .14)
# montée + impact
n = int(2.0 * SR); tt = np.arange(n) / SR
riser = band_noise(2.0, 400, 9000) * (tt / 2.0) ** 2
add(riser, 13.0, .25)
add(np.sin(2 * np.pi * np.cumsum(200 + 600 * (tt / 2) ** 2) / SR) * (tt / 2) ** 2, 13.0, .08)
kick(15.0, 1.1); add(band_noise(1.5, 60, 2500) * np.exp(-np.arange(int(1.5 * SR)) / SR * 3), 15.0, .25)

# ---------- Partie B : la solution (15 → 58 s), majeur et lumineux ----------
prog = [[48, 60, 64, 67], [43, 55, 62, 67], [45, 57, 60, 64], [41, 53, 57, 65]]   # C G Am F
arp = [[72, 76, 79, 76], [71, 74, 79, 74], [69, 72, 76, 72], [69, 72, 77, 72]]
t0, bar = 15.0, 4 * BEAT
k = 0
while t0 + k * bar < 56.0:
    t = t0 + k * bar; ci = k % 4
    pad(prog[ci], t, bar + .8, .05)
    add(tone(hz(prog[ci][0] - 12), bar, (1, .3)) * env(int(bar * SR), .05, .3), t, .14)   # basse
    if t >= 15.6:
        for e in range(8): pluck(arp[ci][e % 4] + (12 if e >= 4 and t > 40 else 0), t + e * BEAT / 2, .1, pan=.35 if e % 2 else -.35)
    if t >= 19.4 and t < 52.0:
        for b in range(4):
            kick(t + b * BEAT, .55 if b % 2 == 0 else .35)
            if b % 2: clap(t + b * BEAT, .09)
            hat(t + b * BEAT + BEAT / 2, .045)
            if t > 32: hat(t + b * BEAT, .025, -.3)
    k += 1

chime(16.0, [72, 76, 79, 84], .18)                    # logo
for sc in (19.5, 26.5, 32.5, 40.5, 47.5, 52.5): whoosh(sc, .6, .16)
for i in range(4): pop(20.95 + i * .1, 760 + i * 60, .16)
for i in range(16): pop(21.85 + i * .025, 1200 + i * 30, .04)
for i in range(12): tick(23.1 + i * .1, .05)
whoosh(27.3, .9, .14); chime(28.1, [84, 88], .06, .05); pop(28.9, 900, .18)
add(band_noise(.8, 3000, 12000) * np.sin(np.pi * np.arange(int(.8 * SR)) / int(.8 * SR)), 29.3, .07)
for b in (33.7, 34.5): add(tone(1760, .09, (1,)) * env(int(.09 * SR), .005, .02), b, .09)   # bip scanner
chime(35.4, [76, 79, 84], .22, .07)                   # vérifié
whoosh(37.0, .5, .14)
for i in range(16): tick(41.3 + i * .07, .045)
for i in range(4): pop(43.3 + i * .7, 660 + i * 110, .2)
pop(47.9, 520, .25)
for i in range(4): pop(49.1 + i * .12, 980, .12)
chime(52.6, [72, 79, 84, 88], .2, .11)
pad([48, 60, 64, 67, 72], 52.5, 5.5, .06)
kick(52.6, .7)
for at in (55.2, 56.4, 57.6): pop(at, 700, .08)

# ---------- master ----------
mix = np.stack([L, R], 1)
fade = np.ones(N); fl = int(1.6 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 1.5
fade[: int(.05 * SR)] = np.linspace(0, 1, int(.05 * SR))
mix *= fade[:, None]
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix /= np.abs(mix).max() / .9
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('ok', DUR)
