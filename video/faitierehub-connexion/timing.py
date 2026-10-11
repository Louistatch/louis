"""Minutage des scènes à partir de la durée réelle de chaque voix off -> timing.json"""
import json
d = json.load(open('vo/durations.json'))
MIN = {'v1': [5.2, 4.6, 5.6, 3.8, 5.0, 4.6, 4.6, 4.6, 6.4, 4.4],
       'v2': [5.4, 5.0, 7.2, 3.6, 5.6, 4.2, 5.6],
       'v3': [5.0, 5.4, 5.4, 4.4, 4.4, 4.8, 5.2, 3.6, 4.8, 3.0, 4.6, 4.2]}
LEAD = .45   # la voix démarre 0,45 s après le début de la scène (le visuel annonce, la voix confirme)
out = {}
for v, mins in MIN.items():
    t, scenes = 0.0, []
    for i, m in enumerate(mins):
        sid = f's{i+1}'; vo = d[f'{v}_{sid}']
        dur = round(max(m, LEAD + vo + .55), 2)
        scenes.append({'id': sid, 'start': round(t, 2), 'dur': dur, 'vo': round(t + LEAD, 2), 'voDur': vo})
        t += dur
    out[v] = {'scenes': scenes, 'total': round(t + .4, 2)}
json.dump(out, open('timing.json', 'w'), indent=1)
for v in out: print(v, out[v]['total'], [(s['id'], s['start'], s['dur']) for s in out[v]['scenes']])
