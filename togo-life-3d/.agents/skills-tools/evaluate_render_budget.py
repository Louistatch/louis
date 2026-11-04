"""Review measured render counts separately from hardware performance targets.

Applies the installed performance-optimization skill to existing browser evidence.
Only Python's standard library is used. Missing counters never become a pass.
This tool does not run a browser or invent CPU/GPU timings.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path


BUDGETS = {'calls': 150, 'triangles': 300000, 'textures': 40}


def count_check(value, maximum):
    valid = type(value) is int and value >= 0
    return {'observed': value, 'maximum': maximum,
            'status': 'unknown' if not valid else 'pass' if value <= maximum else 'fail'}


def evaluate(data):
    profiles = data.get('profiles')
    if data.get('status') != 'pass' or not isinstance(profiles, dict) or not profiles:
        raise ValueError('A successful measured profile report is required')
    rows = {}
    for name, profile in profiles.items():
        renderer = profile.get('renderer', {})
        memory = renderer.get('memory', {})
        counts = {k: count_check(memory.get(k) if k == 'textures' else renderer.get(k), v)
                  for k, v in BUDGETS.items()}
        states = {c['status'] for c in counts.values()}
        budget = 'fail' if 'fail' in states else 'unknown' if 'unknown' in states else 'pass'
        performance = profile.get('state', {}).get('performance', {})
        fps = performance.get('fps')
        valid_fps = type(fps) in (int, float) and math.isfinite(fps) and fps > 0
        gpu = profile.get('gpu', {}).get('renderer', '')
        software = any(x in gpu.lower() for x in ['swiftshader', 'llvmpipe', 'software'])
        rows[name] = {
            'counts': counts, 'renderCountBudget': budget,
            'measuredFPS': fps, 'reportedFrameMs': performance.get('frameMs'),
            'gpu': gpu, 'softwareRenderer': software,
            'observed30FPS': bool(valid_fps and fps >= 30),
            'observed60FPS': bool(valid_fps and fps >= 60),
            'targetHardwareValidation': 'not_validated',
            'cpuGpuBottleneck': 'unknown: no subsystem CPU/GPU timing in this input',
        }
    return {'status': 'review_complete', 'sourceSha': data.get('sourceSha'),
            'entrySha256': data.get('entrySha256'), 'profiles': rows,
            'limitations': [
                'Counts within budget do not prove smooth gameplay or absence of memory leaks.',
                'No physical Android or hardware-GPU target is certified by these reports.',
                'Sequential samples with evolving NPCs do not establish a ranking of quality profiles.',
                'This analysis reuses archived measurements; it does not capture new frames.',
            ]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    source = Path(args.input)
    raw = source.read_bytes()
    review = evaluate(json.loads(raw))
    review['inputSha256'] = hashlib.sha256(raw).hexdigest()
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(review, indent=2) + '\n')
    print(json.dumps({name: {'countBudget': row['renderCountBudget'],
                            'fps': row['measuredFPS'],
                            'targetHardware': row['targetHardwareValidation']}
                      for name, row in review['profiles'].items()}))


if __name__ == '__main__':
    main()
