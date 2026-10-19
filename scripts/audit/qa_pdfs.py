"""Render representative packet pages and verify extracted content coverage."""
import json, subprocess, shutil, hashlib, argparse
from pathlib import Path
from pypdf import PdfReader
from PIL import Image, ImageOps, ImageDraw
ROOT=Path(__file__).resolve().parents[2]
out=ROOT/'tmp/pdfs';out.mkdir(parents=True,exist_ok=True)
poppler=shutil.which('pdftoppm')
if not poppler:raise SystemExit('pdftoppm is required for visual PDF QA.')
parser=argparse.ArgumentParser();parser.add_argument('--chapter',type=int);args=parser.parse_args()
existing=json.loads((ROOT/'review-packets/pdf-qa.json').read_text(encoding='utf-8')) if (ROOT/'review-packets/pdf-qa.json').exists() else {}
checks=[c for c in existing.get('checks',[]) if args.chapter and c['chapter']!=args.chapter];previews=[]
for directory in sorted((ROOT/'review-packets').glob('chapter-*')):
 ch=json.loads((directory/'chapter-data.json').read_text(encoding='utf-8'))
 if args.chapter and ch['id']!=args.chapter:continue
 for filename in ['01-BLIND-EXERCISES.pdf','02-CHAPTER-REVIEW.pdf']:
  pdf=directory/filename;reader=PdfReader(pdf);text='\n'.join(page.extract_text() or '' for page in reader.pages)
  for ex in ch['exercises']:
   for i in range(len(ex['stages'])):
    if f"{ex['id']}:stage-{i+1}" not in text:raise ValueError('Missing stage in PDF: '+str(pdf))
  if filename.startswith('02'):
   for lesson in ch['lessons']:
    for k in ['rule','cue','trap','app']:
     if f"{lesson['id']}:{k}" not in text:raise ValueError('Missing card in PDF')
  selected=sorted(set([1,2,len(reader.pages)//2 or 1,len(reader.pages)]))
  for p in selected:
   prefix=out/f"ch{ch['id']:02d}-{'blind' if filename.startswith('01') else 'full'}-p{p:03d}"
   subprocess.run([poppler,'-f',str(p),'-l',str(p),'-scale-to','1100','-singlefile','-png',str(pdf),str(prefix)],check=True,capture_output=True)
   png=prefix.with_suffix('.png')
   with Image.open(png) as im:
    if im.width<100 or im.height<100:raise ValueError('Bad page render')
    thumb=Image.new('RGB',(320,445),'#e2e8f0');fitted=ImageOps.contain(im.convert('RGB'),(308,407));thumb.paste(fitted,((320-fitted.width)//2,25));ImageDraw.Draw(thumb).text((8,7),prefix.name,fill='black');previews.append(thumb)
  checks.append({'chapter':ch['id'],'file':filename,'pages':len(reader.pages),'textCoverage':'passed','renderedPages':selected,'sha256':hashlib.sha256(pdf.read_bytes()).hexdigest()})
for start in range(0,len(previews),12):
 chunk=previews[start:start+12];sheet=Image.new('RGB',(1280,445*((len(chunk)+3)//4)),'white')
 for i,im in enumerate(chunk):sheet.paste(im,((i%4)*320,(i//4)*445))
 sheet.save(out/(f"contact-ch{args.chapter:02d}-{start//12+1:02d}.png" if args.chapter else f"contact-{start//12+1:02d}.png"))
(ROOT/'review-packets/pdf-qa.json').write_text(json.dumps({'status':'passed','checks':checks,'note':'Text coverage and sampled Poppler renders passed. Contact sheets need visual inspection; this is not chemistry verification.'},indent=2)+'\n',encoding='utf-8',newline='\n')
print(f'PASS PDF QA: {len(checks)} current PDF records, {len(previews)} sample pages rendered this run; contact sheets in tmp/pdfs/.')
