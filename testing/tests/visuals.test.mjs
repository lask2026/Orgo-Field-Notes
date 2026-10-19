import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderVisualCardBody} from '../../dev/src/visuals.js';
import {formulaLabel} from '../../dev/src/molecules.js';
import {renderChemicalFigure} from '../../dev/src/cardchemistry.js';
import {projectGraph,renderProjection} from '../../dev/src/viewer3d.js';
import {renderLearn} from '../../dev/src/learn.js';
import {renderPractice} from '../../dev/src/practice.js';
import {freshState} from '../../dev/src/progress.js';
const molecules=JSON.parse(fs.readFileSync('dev/chapters/molecules.json'));
const chapters=Array.from({length:12},(_,i)=>JSON.parse(fs.readFileSync(`dev/chapters/chapter-${String(i+1).padStart(2,'0')}.json`)));
test('visual cards retain full canonical notes alongside the remix layouts',()=>{
 for(const ch of chapters)for(const l of ch.lessons)for(const k of ['rule','cue','trap','app'])assert.ok(renderVisualCardBody(l,k).includes(l.cards[k]));
});
test('all 204 visual summaries have distinct remix content, valid branches and escaped labels',()=>{
 let count=0;for(const ch of chapters)for(const l of ch.lessons)for(const k of ['rule','cue','trap','app']){
  const spec=l.visualCards[k],key=`${ch.id}:${l.id}:${k}`,compact=renderVisualCardBody(l,k,{},key),full=renderVisualCardBody(l,k,{fullNotes:{[key]:true}},key);
  assert.ok(compact.includes('visual-diagram'));assert.ok(compact.includes('aria-expanded="false"'));assert.ok(full.includes('aria-expanded="true"'));
  assert.ok(spec.items.length>=1);assert.notEqual(spec.items.map(i=>i.text).join(' '),l.cards[k]);
  if(k==='cue'){assert.ok(renderVisualCardBody(l,k,{cueBranches:{[key]:1}},key).includes(spec.items[1].text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')));}
  count++;
 }assert.equal(count,204);
 const x=renderVisualCardBody({id:'safe',title:'Safe',cards:{rule:'Original'},visualCards:Object.fromEntries(['rule','cue','trap','app'].map(k=>[k,{title:'A < B',items:[{label:'<script>',text:'<img onerror=bad>'},{label:'B',text:'Safe'}]}]))},'rule');assert.ok(!x.includes('<script>'));assert.ok(x.includes('&lt;script&gt;'));

});
test('projections retain zero-based graph identity, bond order and explicit carbon charge',()=>{
 for(const m of Object.values(molecules)){
  const before=JSON.stringify(m),p=projectGraph(m,-180,80),svg=renderProjection(m,35,20);
  assert.deepEqual(p.map(a=>a.i),m.atoms.map((_,i)=>i));assert.ok(p.every(a=>[a.x,a.y,a.z].every(Number.isFinite)));
  assert.equal((svg.match(/<line /g)||[]).length,m.bonds.reduce((n,b)=>n+b[2],0));assert.equal(JSON.stringify(m),before);
  assert.ok(!svg.includes(m.name));
 }
 const charged={atoms:[{e:'C',x:0,y:0,charge:-1}],bonds:[]};assert.ok(renderProjection(charged,0,0).includes('C−'));
});
test('3D stays absent throughout active practice including concealed candidates and stage overrides',()=>{
 for(const ch of chapters)for(const ex of ch.exercises){
  const state={...freshState(),chapter:ch.id,mode:'guided',lesson:ch.lessons.findIndex(l=>l.id===ex.lesson),exercise:ch.exercises.filter(e=>e.lesson===ex.lesson).indexOf(ex)};
  for(let i=0;i<ex.stages.length;i++){
   state.practice[`${ch.id}:${ex.id}`]={stage:i,assisted:false,solved:false,hints:0};
   const html=renderPractice(ch,molecules,state,{selected:[],value:'',stage3d:true});assert.ok(!html.includes('data-act="open3d"'));assert.ok(!html.includes('inlineProjectionViewport'));
  }
 }
});
test('learn atom challenges retain selectable 2D graph even with a stale 3D preference',()=>{
 for(const ch of chapters)for(let li=0;li<ch.lessons.length;li++)for(let si=0;si<ch.lessons[li].steps.length;si++){
  if(!ch.lessons[li].steps[si].challenge)continue;
  const html=renderLearn(ch,molecules,{...freshState(),lesson:li,step:si},{tryMode:true,stage3d:true,selected:[]});assert.ok(html.includes('data-act="selectAtom"'));assert.ok(!html.includes('inlineProjectionViewport'));assert.ok(!html.includes('data-act="open3d"'));assert.ok(!html.includes('chem-figure'));
 }
});

test('all diagram-first cards resolve canonical graphs/projections and retain formula/review provenance',()=>{
 let figures=0;for(const ch of chapters)for(const l of ch.lessons){
  assert.ok(l.visualCards.rule.figure,'missing chemistry graphic: '+l.id);
  for(const card of Object.values(l.visualCards))if(card.figure){
   const f=card.figure;assert.ok(f.caption.length>20);for(const i of f.steps)assert.ok(l.steps[i]);
   const hidden=renderChemicalFigure(f,l,{molecules},`${ch.id}:${l.id}`),shown=renderChemicalFigure(f,l,{molecules,revealed:true},`${ch.id}:${l.id}`);
   assert.ok(hidden.includes('<svg'));assert.ok(!hidden.includes('data-control="diagram"'));
   assert.ok(!hidden.includes('data-act="selectAtom"'));assert.equal(renderChemicalFigure(f,l,{molecules,conceal:true}), '');
   for(const i of f.steps){
    const step=l.steps[i],m=molecules[step.molecule||l.molecule];
    if(f.type==='projection'&&step.diagram?.type==='orbitals')continue;
    assert.ok(shown.includes(formulaLabel(m)));assert.ok(shown.includes('Graph review note'));
   }
   const labels=[...hidden.matchAll(/aria-label="([^"]*)"/g)].map(m=>m[1]);
   for(const i of f.steps){const m=molecules[l.steps[i].molecule||l.molecule];assert.ok(labels.every(a=>!a.includes(m.name)));}
   figures++;
  }
 }assert.ok(figures>=51);
});
test('chemistry graphic text remains schematic, with distinct reaction and resonance relations',()=>{
 const alpha=chapters[6].lessons.find(l=>l.id==='alpha'),f=alpha.visualCards.rule.figure;
 assert.equal(f.type,'resonance');assert.equal(f.steps.length,2);const html=renderChemicalFigure(f,alpha,{molecules,revealed:true});assert.ok(html.includes('↔'));assert.ok(html.includes('net charge −1'));
 const imine=chapters[5].lessons.find(l=>l.id==='nitrogen-addition');assert.equal(imine.visualCards.rule.figure.type,'structures');assert.ok(imine.visualCards.rule.figure.caption.includes('not a displayed tautomer pair'));
});
