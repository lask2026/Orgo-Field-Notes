"""Build chapter upload packets from original content and captured local UI.
No textbook prose or figures are copied. PDF creation does not perform AI review.
"""
import argparse, json, re, hashlib
from pathlib import Path
from html import unescape
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader
from PIL import Image as PILImage

ROOT=Path(__file__).resolve().parents[2]
font_candidates=[(Path('C:/Windows/Fonts/segoeui.ttf'),Path('C:/Windows/Fonts/segoeuib.ttf')),
 (Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'),Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))]
fonts=next(((a,b) for a,b in font_candidates if a.exists() and b.exists()),None)
if not fonts: raise SystemExit('A Unicode font is required: install Segoe UI or DejaVu Sans.')
pdfmetrics.registerFont(TTFont('Audit',str(fonts[0])))
pdfmetrics.registerFont(TTFont('AuditBold',str(fonts[1])))
pdfmetrics.registerFontFamily('Audit',normal='Audit',bold='AuditBold',italic='Audit',boldItalic='AuditBold')
for name in ['Audit','AuditBold']:
 missing=[hex(c) for c in [0x207b,0x2082,0x2083,0x2097,0x209b] if c not in pdfmetrics.getFont(name).face.charToGlyph]
 if missing: raise SystemExit(f'{name} lacks required chemistry glyphs: {missing}')
styles=getSampleStyleSheet()
for name in ['Normal','BodyText','Title','Heading1','Heading2','Heading3']:
 styles[name].fontName='AuditBold' if name in ['Title','Heading1','Heading2','Heading3'] else 'Audit'
styles['BodyText'].fontSize=9.5;styles['BodyText'].leading=13;styles['BodyText'].spaceAfter=6
styles['Title'].fontSize=23;styles['Title'].leading=28
styles['Heading1'].fontSize=17;styles['Heading1'].leading=22
styles['Heading2'].fontSize=12;styles['Heading2'].leading=16
styles['Heading3'].fontSize=10;styles['Heading3'].leading=14
styles.add(ParagraphStyle('SmallAudit',fontName='Audit',fontSize=8,leading=11,spaceAfter=5,textColor=HexColor('#334155'),wordWrap='CJK'))

def load(p):return json.loads(p.read_text(encoding='utf-8'))
def plain(t):return unescape(re.sub('<[^>]+>',' ',str(t)).replace('\xa0',' ')).strip()
def para(t,style='BodyText'):return Paragraph(escape(plain(t)).replace('\n','<br/>'),styles[style])
def add(story,t,style='BodyText'):story.append(para(t,style))
def json_text(story,data):add(story,json.dumps(data,ensure_ascii=False,separators=(', ',': ')),'SmallAudit')

def footer(canvas,doc):
 canvas.saveState();canvas.setStrokeColor(HexColor('#cbd5e1'));canvas.line(42,38,570,38)
 canvas.setFont('Audit',7);canvas.setFillColor(HexColor('#475569'))
 canvas.drawString(42,25,'ORGO FIELD NOTES | Candidate review packet | Not scientific verification')
 canvas.drawRightString(570,25,str(doc.page));canvas.restoreState()

def picture(story,directory,shots,sid,maximum=300):
 shot=next((x for x in shots if x['id']==sid),None)
 if not shot:return
 p=directory/shot['file']
 if hashlib.sha256(p.read_bytes()).hexdigest()!=shot['sha256']:raise ValueError('Screenshot hash mismatch: '+str(p))
 with PILImage.open(p) as im:w,h=im.size
 scale=min(528/w,maximum/h)
 story.append(KeepTogether([para('Screenshot: '+sid,'SmallAudit'),Image(str(p),width=w*scale,height=h*scale),Spacer(1,8)]))

def graph(story,m,blind=False):
 if not blind:add(story,f"Author claims: {m['name']} | formula {m['formula']} | net charge {sum(a.get('charge',0) for a in m['atoms']):+d}")
 add(story,'Graph uses zero-based indices; A=0, B=1, etc. Coordinates are drawing positions, not 3D coordinates.','SmallAudit')
 for i,a in enumerate(m['atoms']):
  add(story,f"{i} ({chr(65+i)}): {a['e']}; x={a['x']:.2f}, y={a['y']:.2f}; charge={a.get('charge',0)}; explicit H override={a.get('h','none')}",'SmallAudit')
 add(story,'Bonds [atom A, atom B, order]: '+json.dumps(m['bonds']),'SmallAudit')
 if m.get('stereo'):json_text(story,{'stereo':m['stereo']})

def cover(story,ch,packet,blind):
 add(story,f"CHAPTER {ch['id']:02d}",'Heading2');add(story,ch['title'],'Title')
 add(story,'Independent exercise solving' if blind else 'Content and rendering review packet','Heading1')
 add(story,'Original app content and actual Chromium screenshots. No textbook passages or textbook figures are embedded. Source labels and curriculum headings are not evidence of factual correctness.')
 add(story,'Source snapshot SHA-256: '+packet['sourceSnapshot']['sha256'],'SmallAudit')
 if blind:
  add(story,'BLIND PASS: answer keys, author molecule names/formulas, hints, explanations and answer overlays are withheld. Solve every numbered stage independently. Report the stage ID, answer, derivation, and uncertainty. Question wording and displayed diagram captions are retained because they are visible task data.')
  add(story,'Do not open the full review packet in this chat before saving your independent attempt. The full packet contains keys and lessons that would contaminate a blind attempt.')
 else:
  add(story,'Review all claims, molecule graphs, lessons, exercises, hints and displayed states. Keys are author claims, not ground truth. Screenshots show static states with reduced motion: they do not prove animation timing or persistence behavior.')
  add(story,'For every finding: item ID/page; severity (critical/major/minor); exact claim; derivation or reference evidence; proposed correction; confidence. List unreviewed/uncertain items. Model agreement is not scientific verification.')
  add(story,'Coverage checklist','Heading2')
  for c in packet['cases']:
   if c['kind']!='blind':add(story,c['id']+' | '+', '.join(c['itemIds']),'SmallAudit')
 story.append(PageBreak())

def build(directory):
 packet=load(directory/'cases.json');ch=load(directory/'chapter-data.json');molecules=load(directory/'molecules.json');evidence=load(directory/'evidence.json')
 if evidence['captureStatus']!='passed' or evidence['sourceSnapshot']!=packet['sourceSnapshot']:raise ValueError('Missing/stale passing capture evidence')
 shots=evidence['screenshots'];out=[]
 for blind,filename in [(True,'01-BLIND-EXERCISES.pdf'),(False,'02-CHAPTER-REVIEW.pdf')]:
  story=[];cover(story,ch,packet,blind)
  if not blind:
   add(story,'Curriculum scope','Heading1');scope=next(c for c in packet['cases'] if c['kind']=='curriculum')
   for section in scope['payload']['sections']:add(story,section['itemId']+': '+section['title'])
   for o in ch['objectives']:add(story,'Objective: '+o)
   for s in ch['sources']:add(story,s['label']+' | '+s['location'],'SmallAudit')
   add(story,'No source passage is included. Request relevant authoritative excerpts when a claim cannot be checked by derivation.','SmallAudit')
   story.append(PageBreak())
   for lesson in ch['lessons']:
    add(story,lesson['id']+' | '+lesson['title'],'Heading1');add(story,lesson['tag'])
    for key,label in [('rule','Core Rules'),('cue','Memory Cues'),('trap','Common Mistakes / MCAT Traps'),('app','MCAT Applications')]:
     add(story,f"{lesson['id']}:{key} | {label}",'Heading2');add(story,lesson['cards'][key])
    for i,s in enumerate(lesson['steps']):
     sid=f"{lesson['id']}-step-{i+1}";add(story,f"{lesson['id']}:step-{i+1} | {s['label']}",'Heading2');add(story,s['text'])
     add(story,'Displayed molecule ID: '+s.get('molecule',lesson['molecule']),'SmallAudit');json_text(story,{'highlights':s['highlights'],'revealName':s['reveal']})
     picture(story,directory,shots,sid,225);picture(story,directory,shots,sid+'-diagram',230)
     if s.get('diagram'):json_text(story,{'diagramSpecification':s['diagram']})
     if s.get('anatomy'):json_text(story,{'nameAssembly':s['anatomy']})
     if s.get('challenge'):add(story,'Embedded challenge: '+s['challenge']['prompt']);json_text(story,s['challenge']);picture(story,directory,shots,sid+'-challenge',300)
    story.append(PageBreak())
  for ex in ch['exercises']:
   add(story,ex['id']+(' | Independent exercise' if blind else ' | '+ex['title']),'Heading1')
   if ex.get('context'):add(story,ex['context'])
   picture(story,directory,shots,ex['id']+'-stage-1-molecule',230);picture(story,directory,shots,ex['id']+'-diagram',230)
   if ex.get('diagram'):json_text(story,{'diagramSpecification':ex['diagram']})
   if blind:graph(story,molecules[ex['molecule']],True)
   for i,s in enumerate(ex['stages']):
    sid=f"{ex['id']}-stage-{i+1}";group=[]
    if s.get('molecule'):
     add(story,'This stage uses a different molecule (connectivity shown).','SmallAudit')
     if blind:
      picture(story,directory,shots,sid+'-molecule',190);graph(story,molecules[s['molecule']],True)
    add(group,f"{ex['id']}:stage-{i+1} | {s['prompt']}",'Heading2')
    add(group,'Answer type: '+s['type']+((' | unit: '+s['unit']) if s.get('unit') else ''),'SmallAudit')
    for oi,o in enumerate(s.get('options',[])):add(group,f"Option {oi} ({chr(65+oi)}): {o}")
    story.append(KeepTogether(group))
    if not blind:
     if i>0:picture(story,directory,shots,sid+'-molecule',190)
     picture(story,directory,shots,sid+'-question',230)
     json_text(story,{'authorAnswer':s.get('answer',s.get('accepted')),'tolerance':s.get('tolerance'),'highlightsAfterCorrectAnswer':s['highlights']})
     for hi,h in enumerate(s['hints']):add(story,f"Hint {hi+1}: {h}")
     add(story,'Explanation: '+s['explanation'])
     for fi,f in enumerate(s.get('feedback',[])):add(story,f"Option {fi} feedback: {f}",'SmallAudit')
     picture(story,directory,shots,sid+'-feedback',230)
   if not blind:
    add(story,'Completion summary: '+ex['summary']);picture(story,directory,shots,ex['id']+'-complete',340)
   story.append(PageBreak())
  if not blind:
   add(story,'Molecular repository: author claims to verify','Heading1')
   for mid,m in molecules.items():add(story,mid,'Heading2');graph(story,m)
   story.append(PageBreak());add(story,'Layout samples','Heading1')
   add(story,'These overview images are scaled for page fit. Detailed structure and stage images appear earlier. Samples cover the first concept on desktop and mobile in both themes, not every responsive state.','SmallAudit')
   for sid in ['layout-desktop-light','layout-mobile-light','layout-mobile-dark']:picture(story,directory,shots,sid,600)
   group=[];add(group,'Execution evidence','Heading1');add(group,f"{len(shots)} screenshots and {len(evidence['interactions'])} recorded interactions. Incorrect answers rejected and encoded keys accepted for captured guided stages. This checks implementation against its data; it does not validate chemistry independently. Static screenshots do not verify animation timing, arbitrary clicks, or screen-reader experience.");story.append(KeepTogether(group))
  dest=directory/filename
  doc=SimpleDocTemplate(str(dest),pagesize=(612,792),rightMargin=42,leftMargin=42,topMargin=40,bottomMargin=48,title=f"Orgo Field Notes Chapter {ch['id']} - {'blind exercises' if blind else 'full review'}",author='Orgo Field Notes')
  doc.build(story,onFirstPage=footer,onLaterPages=footer)
  reader=PdfReader(dest);text='\n'.join(p.extract_text() or '' for p in reader.pages)
  if len(text)<500:raise ValueError('PDF text extraction failed')
  out.append({'file':filename,'pages':len(reader.pages),'bytes':dest.stat().st_size,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'blind':blind})
 (directory/'pdf-manifest.json').write_text(json.dumps({'chapter':ch['id'],'sourceSnapshot':packet['sourceSnapshot'],'files':out},indent=2)+'\n',encoding='utf-8',newline='\n')
 print(f"PDF chapter {ch['id']}: "+', '.join(f"{p['pages']} pages / {p['bytes']//1024} KiB" for p in out),flush=True)

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--chapter',type=int);args=parser.parse_args()
 for directory in sorted((ROOT/'review-packets').glob('chapter-*')):
  if args.chapter and directory.name!=f'chapter-{args.chapter:02d}':continue
  build(directory)
