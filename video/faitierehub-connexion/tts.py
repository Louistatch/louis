"""Voix off : synthétise chaque réplique (Piper, voix fr siwis) et écrit vo/<video>_<scene>.wav + vo/durations.json"""
import json, subprocess, sys, wave, os
MODEL = sys.argv[1]
os.makedirs('vo', exist_ok=True)
lines = json.load(open('vo_lines.json')); dur = {}
for vid, items in lines.items():
    for sid, text in items:
        out = f'vo/{vid}_{sid}.wav'
        subprocess.run([sys.executable, '-m', 'piper', '-m', MODEL, '-f', out, '--length-scale', os.environ.get('LS', '1.02'),
                        '--noise-scale', '0.6', '--noise-w-scale', '0.75', '--sentence-silence', '0.25'],
                       input=text.encode(), check=True, capture_output=True)
        with wave.open(out) as w: dur[f'{vid}_{sid}'] = round(w.getnframes() / w.getframerate(), 3)
json.dump(dur, open('vo/durations.json', 'w'), indent=1)
print(json.dumps(dur, indent=1))
