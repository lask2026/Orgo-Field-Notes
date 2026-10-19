import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {validateAnswer} from '../../dev/src/validation.js';import {molecularFormula,electronFlowGeometry} from '../../dev/src/molecules.js';import {renderPractice} from '../../dev/src/practice.js';import {freshState,cleanState} from '../../dev/src/progress.js';
const ch=JSON.parse(fs.readFileSync('dev/chapters/chapter-06.json')),m=JSON.parse(fs.readFileSync('dev/chapters/molecules.json')),ex=id=>ch.exercises.find(e=>e.id===id);
test('Chapter 6 original eleven tasks remain keyed, reduction aliases are explicit and product graph is consistent',()=>{
 assert.deepEqual(ch.exercises.flatMap(e=>e.stages.map(s=>s.answer)),[[1],0,0,[1],0,0,[4],4,[1,4],[1],0,undefined]);
 const s=ex('hydride-product').stages[2];for(const a of ['isopropyl alcohol','isopropanol','propan-2-ol','2-propanol'])assert.ok(validateAnswer(s,a));for(const a of ['propan-1-ol','propan2ol','propanone'])assert.ok(!validateAnswer(s,a));assert.equal(s.molecule,'isopropanol');assert.equal(molecularFormula(m[s.molecule]),'C3H8O');
 const state={...freshState(),lesson:3,exercise:0,practice:{'6:hydride-product':{stage:2,hints:0}}};assert.ok(!renderPractice(ch,m,state,{selected:[],value:''}).includes('Formula:'));state.practice['6:hydride-product'].stage=3;assert.ok(renderPractice(ch,m,state,{selected:[]}).includes('Formula: C3H8O'));
});
test('replacement cyanohydrin assessment selects the actual new bond and invalidates prior workshop completion',()=>{
 const e=ex('cyanohydrin-bond'),s=e.stages[2];assert.equal(ex('cyanohydrin-count'),undefined);assert.deepEqual(e.stages[0].highlights,{prin:[4],sub:[5]});assert.deepEqual(s.answer,[1,4]);assert.ok(m.cyanohydrin.bonds.some(([a,b,n])=>a===1&&b===4&&n===1));for(const i of s.answer)assert.equal(m.cyanohydrin.atoms[i].e,'C');assert.ok(validateAnswer(s,[4,1]));assert.ok(!validateAnswer(s,[1,4,5]));
 const cleaned=cleanState({...freshState(),chapter:6,practice:{'6:cyanohydrin-count':{stage:3,solved:true}}},[ch]);assert.equal(Object.keys(cleaned.practice).length,0);
});
test('ketal and hydrate layouts are symmetric without changing oxygen substitution chemistry',()=>{
 assert.ok(ch.lessons[0].cards.trap.includes('alkane &lt; aldehyde/ketone &lt; alcohol'));const g=m.acetal;assert.equal(g.atoms[3].x+g.atoms[4].x,2*g.atoms[1].x);assert.equal(g.atoms[5].x+g.atoms[6].x,2*g.atoms[1].x);assert.equal(molecularFormula(g),'C5H12O2');assert.equal(g.bonds.filter(([a,b])=>(a===1&&g.atoms[b].e==='O')||(b===1&&g.atoms[a].e==='O')).length,2);
 assert.equal(m.geminal.atoms[3].x+m.geminal.atoms[4].x,2*m.geminal.atoms[1].x);assert.notEqual(molecularFormula(m.imine),molecularFormula(m.enamine));
});
test('curved electron flow clears carbonyl oxygen glyph and retains finite geometry for every authored flow',()=>{
 const g=m.acetaldehyde,p=electronFlowGeometry(g,{fromBond:1,toAtom:2}),o=g.atoms[2];assert.ok(Math.hypot(p.end.x-o.x,p.end.y-o.y)>=24);
 for(let t=0;t<=1;t+=.01){const x=(1-t)**2*p.start.x+2*(1-t)*t*p.control.x+t*t*p.end.x,y=(1-t)**2*p.start.y+2*(1-t)*t*p.control.y+t*t*p.end.y;assert.ok(Math.hypot(x-o.x,y-o.y)>20);}
 for(let n=1;n<=12;n++){const c=JSON.parse(fs.readFileSync(`dev/chapters/chapter-${String(n).padStart(2,'0')}.json`));for(const parent of [...c.lessons,...c.exercises])for(const step of parent.steps||parent.stages)for(const f of step.highlights?.flow||[]){const q=electronFlowGeometry(m[step.molecule||parent.molecule],f);assert.ok(Object.values(q).every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));}}
});
