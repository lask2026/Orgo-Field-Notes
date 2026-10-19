import {projectRoot} from '../../project-layout.mjs';
process.chdir(projectRoot);
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {readJSON,sourceSnapshot,hash} from './cases.mjs';
const molecules=readJSON('dev/chapters/molecules.json'),rows=[];
for(let id=1;id<=12;id++){
 const dir=`review/packets/chapter-${String(id).padStart(2,'0')}`,ch=readJSON(`dev/chapters/chapter-${String(id).padStart(2,'0')}.json`),packet=readJSON(`${dir}/cases.json`),e=readJSON(`${dir}/evidence.json`),pdf=readJSON(`${dir}/pdf-manifest.json`);
 assert.equal(packet.sourceSnapshot.sha256,sourceSnapshot(ch,molecules).sha256,'stale chapter '+id);assert.equal(e.captureStatus,'passed');assert.equal(e.sourceSnapshot.sha256,packet.sourceSnapshot.sha256);assert.equal(pdf.sourceSnapshot.sha256,packet.sourceSnapshot.sha256);assert.deepEqual(e.pageErrors,[]);
 for(const s of e.screenshots){assert.equal(hash(fs.readFileSync(path.join(dir,s.file))),s.sha256,s.id);assert.ok(s.width>0&&s.height>0);}
 const ids=new Set(e.screenshots.map(s=>s.id));
 for(const l of ch.lessons)assert.ok(ids.has(l.id+'-visuals'),'missing visual summary capture '+l.id);
 for(const l of ch.lessons)for(let i=0;i<l.steps.length;i++){assert.ok(ids.has(`${l.id}-step-${i+1}`));if(l.steps[i].diagram)assert.ok(ids.has(`${l.id}-step-${i+1}-diagram`));if(l.steps[i].challenge)assert.ok(ids.has(`${l.id}-step-${i+1}-challenge`));}
 for(const ex of ch.exercises){assert.ok(ids.has(ex.id+'-complete'));for(let i=0;i<ex.stages.length;i++)for(const suffix of ['molecule','question','feedback'])assert.ok(ids.has(`${ex.id}-stage-${i+1}-${suffix}`));}
 for(const p of pdf.files){assert.equal(hash(fs.readFileSync(`${dir}/${p.file}`)),p.sha256);assert.ok(p.pages>0);}
 rows.push({chapter:id,cases:packet.cases.length,screenshots:e.screenshots.length,pdfs:pdf.files});
}
const report={status:'passed',chapters:rows,scientificVerification:false,note:'Packet completeness, provenance, screenshots and PDF integrity checked. This does not run AI reviews or verify chemistry.'};fs.writeFileSync('review/packets/package-checks.json',JSON.stringify(report,null,2)+'\n');console.log(`PASS 12 chapter packets: ${rows.reduce((n,r)=>n+r.cases,0)} model cases, ${rows.reduce((n,r)=>n+r.screenshots,0)} screenshots, 24 PDFs.`);
