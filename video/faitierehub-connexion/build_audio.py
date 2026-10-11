"""Bande-son complète d'une vidéo : musique originale + bruitages calés + voix off, avec atténuation sous la voix.
Usage : python3 build_audio.py v1|v2   ->  out/<v>_audio.wav
"""
import json, sys, wave, subprocess
import numpy as np

VID = sys.argv[1]
T = json.load(open('timing.json'))[VID]
S = {s['id']: s for s in T['scenes']}
SR, DUR = 44100, T['total']
N = int(SR * DUR)
rng = np.random.default_rng(5)
mus = np.zeros((N, 2)); sfx = np.zeros((N, 2)); vo = np.zeros((N, 2))
BEAT = 60 / 98

def hz(m): return 440 * 2 ** ((m - 69) / 12)
def put(buf, sig, t, g=1.0, pan=0.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if i < 0 or i >= N or j <= i: return
    s = sig[: j - i] * g
    buf[i:j, 0] += s * np.sqrt((1 - pan) / 2) * 1.414; buf[i:j, 1] += s * np.sqrt((1 + pan) / 2) * 1.414
def env(n, a, r):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.clip((n / SR - t) / max(r, 1e-4), 0, 1)
def tone(f, d, harm=(1, .5, .25, .12), det=0.0):
    t = np.arange(int(d * SR)) / SR
    return sum(a * np.sin(2 * np.pi * f * (k + 1) * t * (1 + det)) for k, a in enumerate(harm))
def noise(d, lo, hi):
    n = int(d * SR); X = np.fft.rfft(rng.standard_normal(n)); f = np.fft.rfftfreq(n, 1 / SR)
    X[(f < lo) | (f > hi)] = 0; y = np.fft.irfft(X, n); return y / (np.abs(y).max() + 1e-9)
def pad(notes, t, d, g):
    for m in notes:
        put(mus, (tone(hz(m), d, (1, .35, .15)) + tone(hz(m), d, (1, .3), .003)) * env(int(d * SR), .8, 1.2), t, g, ((m % 5) - 2) / 4)
def pluck(m, t, g=.1, pan=0):
    n = int(.6 * SR); tt = np.arange(n) / SR
    put(mus, tone(hz(m), .6, (1, .6, .3, .15, .08)) * np.exp(-tt * 7) * env(n, .003, .05), t, g, pan)
def kick(t, g=.5, buf=None):
    tt = np.arange(int(.45 * SR)) / SR; f = 45 + 80 * np.exp(-tt * 30)
    put(mus if buf is None else buf, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9), t, g)
def hat(t, g=.04, pan=.3): put(mus, noise(.06, 7000, 16000) * np.exp(-np.arange(int(.06 * SR)) / SR * 70), t, g, pan)
def clap(t, g=.08): put(mus, noise(.2, 900, 5000) * np.exp(-np.arange(int(.2 * SR)) / SR * 22), t, g)
def tick(t, g=.05): put(sfx, noise(.03, 2500, 9000) * np.exp(-np.arange(int(.03 * SR)) / SR * 150), t, g)
def whoosh(t, d=.6, g=.14):
    n = int(d * SR); put(sfx, noise(d, 300, 6000) * np.sin(np.pi * np.arange(n) / n) ** 2, t - d * .55, g)
def pop(t, f=880, g=.16):
    tt = np.arange(int(.12 * SR)) / SR; ff = f * (1 + .6 * np.exp(-tt * 60))
    put(sfx, np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-tt * 35), t, g)
def chime(t, notes, g=.16, gap=.08):
    for k, m in enumerate(notes):
        tt = np.arange(int(1.3 * SR)) / SR
        put(sfx, tone(hz(m), 1.3, (1, .2, .05)) * np.exp(-tt * 3.5) * env(len(tt), .005, .3), t + k * gap, g, (k - 1) * .3)
def key(t, g=.05): put(sfx, noise(.025, 1500, 7000) * np.exp(-np.arange(int(.025 * SR)) / SR * 200), t, g, .2)
def typing(t0, n, cps): [key(t0 + i / cps) for i in range(n)]
def beep(t, f=1760, g=.07): put(sfx, tone(f, .09, (1,)) * env(int(.09 * SR), .005, .02), t, g)

def music(t0, t1, mood):
    """mood: 'tension' (mineur, tic-tac) ou 'up' (majeur, rythmique)"""
    bar = 4 * BEAT
    if mood == 'tension':
        chords = [[45, 57, 60, 64], [41, 53, 57, 60]]; k = 0
        while t0 + k * bar < t1:
            t = t0 + k * bar; pad(chords[k % 2], t, min(bar + .8, t1 - t + .6), .05)
            for b in range(4):
                if t + b * BEAT < t1: tick(t + b * BEAT, .045)
            if t < t1 - .5: kick(t, .3)
            for e in range(8):
                if t + e * BEAT / 2 < t1 - .2: pluck([69, 72, 76, 72][e % 4], t + e * BEAT / 2, .05, .4 if e % 2 else -.4)
            k += 1
    else:
        prog = [[48, 60, 64, 67], [43, 55, 62, 67], [45, 57, 60, 64], [41, 53, 57, 65]]
        arp = [[72, 76, 79, 76], [71, 74, 79, 74], [69, 72, 76, 72], [69, 72, 77, 72]]; k = 0
        while t0 + k * bar < t1:
            t = t0 + k * bar; ci = k % 4
            pad(prog[ci], t, bar + .8, .045)
            put(mus, tone(hz(prog[ci][0] - 12), bar, (1, .3)) * env(int(bar * SR), .05, .3), t, .12)
            for e in range(8): pluck(arp[ci][e % 4], t + e * BEAT / 2, .08, .35 if e % 2 else -.35)
            for b in range(4):
                kick(t + b * BEAT, .4 if b % 2 == 0 else .25)
                if b % 2: clap(t + b * BEAT, .07)
                hat(t + b * BEAT + BEAT / 2, .035)
            k += 1

a = lambda sid, off=0: S[sid]['start'] + off
if VID == 'v1':
    music(0, a('s3'), 'tension')
    kick(a('s3'), .9, sfx); chime(a('s3', .1), [72, 76, 79, 84], .13)
    music(a('s3'), DUR - 2.5, 'up')
    pad([48, 60, 64, 67, 72], a('s10'), DUR - a('s10'), .055)
    whoosh(a('s1', .5), .9, .14)
    whoosh(a('s2', .1)); pop(a('s2', 1.0), 260, .2)
    for i in range(4): whoosh(a('s2', 1.6 + i * .15), .35, .06)
    whoosh(a('s3', .3)); whoosh(a('s3', 2.0)); pop(a('s3', 3.2), 900, .14)
    whoosh(a('s4', .3), .8, .1); beep(a('s4', 1.6), 1760, .1); chime(a('s4', 1.65), [84, 88], .1, .05)
    whoosh(a('s5')); chime(a('s5', 1.3), [76, 79, 84], .14)
    for i in range(8): pop(a('s5', 1.7 + i * .05), 900 + i * 40, .04)
    whoosh(a('s6', .2)); whoosh(a('s7', .3)); pop(a('s7', .6), 700, .16)
    pop(a('s8', .4), 160, .28)
    for i in range(6): put(sfx, tone(220, .05, (1, .5)) * env(int(.05 * SR), .005, .02), a('s8', 1.1 + i * .06), .05)
    for i in range(6):
        beep(a('s9', .8 + i * .8 + .25), 1760, .06); pop(a('s9', .8 + i * .8 + .3), 1000, .05)
    chime(a('s10', .05), [72, 79, 84, 88], .16, .11); kick(a('s10', .05), .6, sfx)
elif VID == 'v3':
    music(0, a('s2'), 'tension')
    kick(a('s2'), .9, sfx); chime(a('s2', .1), [72, 76, 79, 84], .13)
    music(a('s2'), DUR - 2.5, 'up')
    pad([48, 60, 64, 67, 72], a('s12'), DUR - a('s12'), .055)
    for i in range(3): pop(a('s1', .4 + i * .35), 500 + i * 150, .14)
    pop(a('s1', 2.6), 300, .2)
    whoosh(a('s2', .2)); typing(a('s2', .8), 34, 24); pop(a('s2', 2.4), 800, .14); pop(a('s2', 3.1), 300, .2); chime(a('s2', 3.4), [76, 81], .12)
    whoosh(a('s3', .2)); pop(a('s3', 1.3), 300, .2); whoosh(a('s3', 1.7))
    whoosh(a('s4', .3)); chime(a('s4', 1.4), [76, 79, 84], .14)
    for i in range(3): pop(a('s4', 1.8 + i * .15), 900, .06)
    whoosh(a('s5', .1)); pop(a('s5', 1.6), 600, .14)
    whoosh(a('s6', .3))
    for i in range(7): pop(a('s6', 1.0 + i * .32), 1000 + i * 30, .06)
    pop(a('s6', 4.1), 300, .2)
    for i in range(8): tick(a('s7', .3 + i * .08), .05)
    chime(a('s7', 1.4), [72, 76, 79, 84], .14)
    for i in range(3): pop(a('s7', 2.4 + i * .3), 900, .12)
    for i in range(6): key(a('s8', .7 + i * .08), .07)
    pop(a('s8', 2.6), 300, .18)
    whoosh(a('s9', .3)); pop(a('s9', 1.4), 300, .18); chime(a('s9', 1.6), [79, 84], .1); pop(a('s9', 2.8), 300, .18)
    whoosh(a('s9', 2.6), 1.2, .1)
    chime(a('s10', .5), [76, 79, 84, 88], .16, .09)
    whoosh(a('s11', .2))
    for i in range(12): tick(a('s11', 1.0 + i * .1), .035)
    for i in range(4): pop(a('s12', .1 + i * .25), 600 + i * 150, .12)
    chime(a('s12', 1.3), [72, 79, 84, 88], .16, .11); kick(a('s12', 1.3), .6, sfx)
else:
    music(0, DUR - 3.0, 'up')
    pad([48, 60, 64, 67, 72], a('s7'), DUR - a('s7'), .055)
    whoosh(a('s1', .1)); pop(a('s1', 2.5), 300, .16); pop(a('s1', 3.5), 900, .18)
    whoosh(a('s2', .2)); beep(a('s2', .9)); beep(a('s2', 1.6)); whoosh(a('s2', 2.4), .5, .12); chime(a('s2', 3.2), [76, 79, 84], .14)
    whoosh(a('s3', .2))
    for i in range(6): key(a('s3', 1.7 + i * .42), .09)
    for i in range(6): tick(a('s3', 4.4 + i * .12), .03)
    pop(a('s4'), 260, .22); chime(a('s4', .4), [72, 76, 79, 84], .16)
    for i in range(4): pop(a('s4', .7 + i * .08), 900 + i * 60, .06)
    pop(a('s5', 1.15), 600, .18); put(sfx, tone(1318, .12, (1, .3)) * env(int(.12 * SR), .005, .05), a('s5', 2.1), .1)
    put(sfx, tone(1568, .14, (1, .3)) * env(int(.14 * SR), .005, .06), a('s5', 2.22), .1)
    for i in range(6): key(a('s5', 3.0 + i * .07), .06)
    pop(a('s6', .1), 300, .2); pop(a('s6', .95), 180, .25)
    for i in range(3): pop(a('s7', .6 + i * .7), 700 + i * 150, .14)
    chime(a('s7', 2.9), [72, 79, 84, 88], .16, .11)

for sc in T['scenes']:           # voix off
    with wave.open(f"vo/{VID}_{sc['id']}.wav") as w:
        sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32768
    x = np.interp(np.arange(0, len(x), sr / SR), np.arange(len(x)), x)
    put(vo, x, sc['vo'], .9, 0)

def norm(b, peak): return b / (np.abs(b).max() + 1e-9) * peak
fade = np.ones(N); fl = int(1.5 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 1.5
mus *= fade[:, None]; sfx *= fade[:, None]
for name, b, pk in (('mus', mus, .8), ('sfx', sfx, .7), ('vo', vo, .95)):
    b = np.tanh(norm(b, pk) * 1.2) / np.tanh(1.2)
    with wave.open(f'out/{VID}_{name}.wav', 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((b * 32767).astype('<i2').tobytes())

# mixage : réverbe sur musique + bruitages, la musique s'efface sous la voix (sidechain), loudness réseaux sociaux
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'out/{VID}_mus.wav', '-i', f'out/{VID}_sfx.wav', '-i', f'out/{VID}_vo.wav', '-filter_complex',
  '[0]aecho=0.8:0.55:70|150:0.22|0.12,volume=0.55[m];[2]asplit=2[v1][v2];'
  '[m][v1]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[md];'
  '[1]aecho=0.8:0.5:60:0.18,volume=0.75[s];'
  '[v2]highpass=f=80,equalizer=f=3000:t=q:w=1:g=2,acompressor=threshold=0.1:ratio=3:attack=5:release=80,volume=1.35[v];'
  '[md][s][v]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=8',
  '-ar', '48000', f'out/{VID}_audio.wav'], check=True)
print('ok', VID, DUR)
