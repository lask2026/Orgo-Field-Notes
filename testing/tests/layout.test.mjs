import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {projectRoot,projectLayout,projectPath} from '../../project-layout.mjs';
import {scaffoldSubject} from '../../dev/scripts/new-subject.mjs';

function removeFixture(dir){
  const target=fs.realpathSync(dir),tempRoot=fs.realpathSync(os.tmpdir());
  if(!target.startsWith(tempRoot+path.sep)||!path.basename(target).startsWith('subject-'))throw Error('Refusing cleanup outside the named test fixture');
  fs.rmSync(target,{recursive:true,force:true});
}

test('project paths stay inside their declared dev/testing/review folders',()=>{
  assert.equal(projectLayout.subject.id,'orgo');
  for(const key of Object.keys(projectLayout.paths))assert.ok(fs.statSync(projectPath(key)).isDirectory(),key);
  assert.throws(()=>projectPath('unknown'));assert.throws(()=>projectPath('content','../../outside.json'));
  assert.ok(fs.existsSync(projectPath('content','chapter-01.json')));assert.ok(fs.existsSync(projectPath('reviewPackets','chapter-01','01-BLIND-EXERCISES.pdf')));
  for(const old of ['src','chapters','tests','review-packets','review-results'])assert.ok(!fs.existsSync(path.join(projectRoot,old)),'duplicate old source root '+old);
});
test('review CLI resolves relocated packets from a different working directory without inference',()=>{
  const result=spawnSync(process.execPath,[projectPath('reviewTools','review-panel.mjs'),'--config',projectPath('reviewConfig','panel.ollama.example.json'),'--chapter','all'],{cwd:os.tmpdir(),encoding:'utf8',windowsHide:true});
  assert.equal(result.status,0,result.stderr);const plan=JSON.parse(result.stdout);assert.equal(plan.dryRun,true);assert.equal(plan.primaryRequestsForFullCoverage,483);assert.equal(plan.scientificVerification,false);
});
test('subject scaffold preview writes nothing and refuses existing book folders or path traversal',t=>{
  const parent=fs.mkdtempSync(path.join(os.tmpdir(),'subject-preview-'));t.after(()=>removeFixture(parent));
  const before=fs.readdirSync(parent),plan=scaffoldSubject(['--name','Biology-Field-Notes','--subject','Biology'],{defaultParent:parent});assert.equal(plan.dryRun,true);assert.deepEqual(fs.readdirSync(parent),before);
  fs.mkdirSync(path.join(parent,'biology'));fs.writeFileSync(path.join(parent,'biology/book.txt'),'preserve this reference');
  assert.throws(()=>scaffoldSubject(['--name','biology','--subject','Biology','--create'],{defaultParent:parent}));assert.equal(fs.readFileSync(path.join(parent,'biology/book.txt'),'utf8'),'preserve this reference');
  assert.throws(()=>scaffoldSubject(['--name','../outside','--subject','Physics','--create'],{defaultParent:parent}));
});
test('biology and physics scaffolds receive reusable review contracts without Orgo content',async t=>{
  const parent=fs.mkdtempSync(path.join(os.tmpdir(),'subject-create-'));t.after(()=>removeFixture(parent));
  for(const subject of ['Biology','Physics']){
    const plan=scaffoldSubject(['--name',subject+'-Field-Notes','--subject',subject,'--create'],{defaultParent:parent}),dir=plan.destination;
    const local=await import(pathToFileURL(path.join(dir,'project-layout.mjs')).href);assert.equal(local.projectRoot,dir);assert.equal(local.projectLayout.status,'scaffold-only');
    assert.deepEqual(fs.readdirSync(local.projectPath('content')),[]);assert.deepEqual(fs.readdirSync(local.projectPath('source')),[]);
    assert.ok(fs.readFileSync(path.join(dir,'README.md'),'utf8').includes(subject));assert.equal(local.projectLayout.subject.adapter,'not-implemented');
    assert.equal(fs.readFileSync(local.projectPath('reviewTemplates','BLIND-SUBJECT-REVIEW-PROMPT.txt'),'utf8'),fs.readFileSync(projectPath('reviewTemplates','BLIND-SUBJECT-REVIEW-PROMPT.txt'),'utf8'));
    assert.throws(()=>scaffoldSubject(['--name',subject+'-Field-Notes','--subject',subject,'--create'],{defaultParent:parent}));
  }
});
