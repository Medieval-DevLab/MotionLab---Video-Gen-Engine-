"""Redacted copies of the Marketo screenshots: personal columns blurred, other-project panes hidden, timestamps and
the Run-later fields masked, the Dashboard banner removed. Reads raw/, writes raw/redacted/ (both git-ignored).
Only the redacted copies are used in the film. Coordinates are screenshot pixels (1918 px wide).
usage: python -I films/marketo-kt/redact.py
"""
import os, subprocess

HERE = os.path.dirname(os.path.abspath(__file__)); RAW = os.path.join(HERE, 'raw'); OUT = os.path.join(RAW, 'redacted')
os.makedirs(OUT, exist_ok=True)

def colour(f, x, y):  # the screenshot's own colour at a point, to fill a mask invisibly
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(RAW, f), '-vf', f'crop=1:1:{x}:{y},format=rgb24', '-f', 'rawvideo', '-'], capture_output=True).stdout
    return '0x%02X%02X%02X' % tuple(b[:3])

BLUR, MASK, KEEP = 'blur', 'mask', 'keep'
JOBS = {  # file: [(kind, x, y, w, h[, sample point for a mask])]; 'keep' re-lays the original over a blur (a dialog)
    'Dashboard.png': [(MASK, 92, 90, 916, 176, (60, 300))],
    'Smart_List_People.png': [(BLUR, 729, 204, 302, 588), (BLUR, 1266, 204, 349, 588)],
    'Create_new_campaign.png': [(BLUR, 556, 52, 1362, 774)],
    'New_Smart_Campaign.png': [(BLUR, 556, 52, 1362, 774), (KEEP, 926, 238, 602, 409)],
    'Naming_the_Campaign.png': [(BLUR, 556, 52, 1362, 774), (KEEP, 926, 238, 602, 409)],
    'Smart_List_addes_to_campaign.png': [(MASK, 1660, 150, 246, 22, (1650, 161))],
    'Person_Attribute.png': [(MASK, 1660, 150, 246, 22, (1650, 161))],
    'Flow_step.png': [(MASK, 1660, 150, 246, 22, (1650, 161))],
    'Run_now.png': [(MASK, 1175, 427, 246, 24, (1165, 439))],
    'Campaign_Result.png': [(BLUR, 1459, 200, 422, 596)],
}
for f in sorted(os.listdir(RAW)):
    if not f.endswith('.png'): continue
    jobs, src, dst = JOBS.get(f, []), os.path.join(RAW, f), os.path.join(OUT, f)
    if not jobs:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, dst], check=True); continue
    chain, last, n = [], '0:v', 0
    for j in jobs:
        kind, x, y, w, h = j[:5]; n += 1
        if kind == BLUR:   # strong blur, then a light veil: unreadable, but the layout stays
            chain.append(f'[0:v]crop={w}:{h}:{x}:{y},boxblur=18:3,drawbox=0:0:{w}:{h}:color=0xF2F0F5@0.35:t=fill[b{n}];[{last}][b{n}]overlay={x}:{y}[v{n}]')
        elif kind == KEEP:
            chain.append(f'[0:v]crop={w}:{h}:{x}:{y}[k{n}];[{last}][k{n}]overlay={x}:{y}[v{n}]')
        else:
            chain.append(f'[{last}]drawbox={x}:{y}:{w}:{h}:color={colour(f, *j[5])}:t=fill[v{n}]')
        last = f'v{n}'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-filter_complex', ';'.join(chain), '-map', f'[{last}]', dst], check=True)
    print('redacted', f, f'({len(jobs)} regions)')
print('->', OUT)
