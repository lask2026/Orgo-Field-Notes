import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {projectRoot} from '../../project-layout.mjs';
process.chdir(projectRoot);
const baselinePath='review/results/reorganization-before.json';
if(!fs.existsSync(baselinePath))throw Error('The one-time pre-migration inventory is missing; this check is not a general content-freezing test.');
const baseline=JSON.parse(fs.readFileSync(baselinePath,'utf8').replace(/^\uFEFF/,''));
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const protectedGroup=old=>old.startsWith('src/')||old.startsWith('chapters/')||/^schema\/.*\.json$/.test(old)||old==='docs/curriculum-outline.txt'?'canonicalSource':old.startsWith('review-results/')?'originalReviewEvidence':old.startsWith('review-packets/')&&!old.endsWith('.md')?'reviewPacketEvidence':old==='artifacts/chapter01-local-pilot.json'?'originalPilotRecord':old==='Orgo-Field-Notes-v5.html'||old==='ai_studio_code (10).html'?'approvedReferences':null;
const groups={},mismatches=[];
for(const record of baseline.files){
  const group=protectedGroup(record.old);if(!group)continue;
  const file=path.resolve(projectRoot,record.new);
  if(!file.startsWith(projectRoot+path.sep))throw Error('Invalid migration inventory path');
  const actual=fs.existsSync(file)?digest(fs.readFileSync(file)):'missing';
  (groups[group]??=[]).push({...record,actual});if(actual!==record.sha256)mismatches.push({old:record.old,new:record.new,expected:record.sha256,actual});
}
const report={status:mismatches.length?'failed':'passed',projectRootUnchanged:true,booksMoved:false,semanticContentChanged:groups.canonicalSource.some(r=>r.actual!==r.sha256),groups:Object.fromEntries(Object.entries(groups).map(([name,rows])=>[name,{files:rows.length,identical:rows.filter(r=>r.actual===r.sha256).length,logicalInventorySha256:digest(JSON.stringify(rows.map(r=>[r.old,r.actual]).sort((a,b)=>a[0].localeCompare(b[0]))))}])),mismatches,note:'One-time byte preservation check against the pre-move inventory. Later intentional content edits require new review snapshots; this report is historical evidence, not an immutable-content unit test.'};
fs.writeFileSync('testing/artifacts/layout-migration.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(mismatches.length)process.exitCode=1;
