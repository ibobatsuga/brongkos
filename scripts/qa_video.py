#!/usr/bin/env python3
"""Check an actual rendered master using ffprobe. Exits nonzero on basic failures."""
import json,subprocess,sys
from fractions import Fraction
from pathlib import Path
if len(sys.argv)!=2: sys.exit('Usage: python3 scripts/qa_video.py RENDERS/final/your_video.mp4')
p=Path(sys.argv[1])
if not p.is_file():sys.exit(f'FAIL: no such file: {p}')
try:
 x=subprocess.run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)],capture_output=True,text=True,check=True)
except (FileNotFoundError,subprocess.CalledProcessError) as e:sys.exit(f'FAIL: ffprobe unavailable or broken: {e}')
data=json.loads(x.stdout);s=next((s for s in data['streams'] if s['codec_type']=='video'),None);a=next((s for s in data['streams'] if s['codec_type']=='audio'),None)
errors=[]
if not s: errors.append('Missing video stream')
else:
 rate=Fraction(s.get('avg_frame_rate','0/1'));duration=float(s.get('duration',data['format'].get('duration',0)) or 0);frames=int(s.get('nb_frames',0) or 0)
 for k,ok in [('resolution',s['width']==1080 and s['height']==1920),('fps',rate==30),('duration',abs(duration-60)<0.06),('codec',s.get('codec_name')=='h264'),('pixel format',s.get('pix_fmt')=='yuv420p'),('frames',not frames or frames==1800)]:
  print(('PASS' if ok else 'FAIL'),k)
  if not ok:errors.append(k)
 print('metadata:',{'duration':duration,'fps':str(rate),'frames':frames,'pix_fmt':s.get('pix_fmt'),'colorspace':s.get('color_space'),'color_primaries':s.get('color_primaries')})
if not a:errors.append('Missing audio stream');print('FAIL audio stream')
else:
 for k,ok in [('AAC',a.get('codec_name')=='aac'),('48 kHz',str(a.get('sample_rate'))=='48000')]:
  print(('PASS' if ok else 'FAIL'),k)
  if not ok:errors.append(k)
print('NOTE: human visual/audio QA, UI authenticity, claims, safe zones, bitrate and music licensing still require review')
print('RESULT:', 'FAIL '+', '.join(errors) if errors else 'PASS automatic metadata checks')
sys.exit(bool(errors))
