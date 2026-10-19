import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {validateAnswer} from '../src/validation.js';import {molecularFormula,formulaLabel,netCharge,hydrogens,drawMolecule,numberBadgePosition} from '../src/molecules.js';
const c=JSON.parse(fs.readFileSync('chapters/chapter-10.json')),m=JSON.parse(fs.readFileSync('chapters/molecules.json'));
test('Chapter 10 original twelve keys retained and explicit two-decimal pI precision rejects rounding and unit text',()=>{
 assert.deepEqual(c.exercises.slice(0,4).flatMap(e=>e.stages.map(s=>s.answer)),[0,0,5.95,[2,4],0,0,[2],0,0,[0],0,0]);const s=c.exercises[0].stages[2];assert.ok(Math.abs(s.answer-(2.30+9.60)/2)<1e-12);assert.ok(s.prompt.includes('two decimal places'));assert.ok(validateAnswer(s,'5.95'));for(const v of ['6.0','5.9','5.95 pH'])assert.ok(!validateAnswer(s,v));assert.equal(netCharge(m.glycine),0);assert.equal(hydrogens(m.glycine,1),2);
});
test('Strecker color tracking keeps carbon origins separate and complete peptide terminus includes both oxygens',()=>{
 const l=c.lessons[2];assert.deepEqual(l.steps[0].highlights,{prin:[2],sub:[0],alpha:[1]});assert.deepEqual(l.steps[1].highlights,{prin:[2],sub:[5],alpha:[1]});assert.equal(m.aminonitrile.atoms[2].e,'C');assert.equal(m.alanine.atoms[2].e,'C');assert.deepEqual(c.exercises[2].stages[0].highlights,{prin:[2]});assert.deepEqual(c.exercises[2].stages[1].highlights,{sub:[0]});assert.deepEqual(c.lessons[1].steps[0].highlights.sub,[0,6,7,8]);
});
test('phosphate display notation preserves atom counts and protected-N graph supports the new Gabriel task',()=>{
 assert.equal(molecularFormula(m.phosphoricacid),'H3O4P');assert.equal(formulaLabel(m.phosphoricacid),'H3PO4');const g=m['phthalimide-anion'];assert.equal(molecularFormula(g),'C8H4NO2');assert.equal(netCharge(g),-1);assert.equal(hydrogens(g,7),0);const e=c.exercises.find(e=>e.id==='gabriel-route');assert.deepEqual(e.stages.map(s=>s.answer),[[7],0,1]);assert.equal(g.atoms[e.stages[0].answer[0]].e,'N');assert.equal(g.atoms[7].charge,-1);assert.ok(drawMolecule(g).includes('N⁻'));
});
test('carbonyl oxygen selection badge clears its bond while letter and direct-element actions remain mapped',()=>{
 const g=m.glycylglycine,p=numberBadgePosition(g,7,42),a=g.atoms[7],b=g.atoms[6];assert.ok(Math.hypot(p.x-a.x,p.y-a.y)>=41.9);const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));assert.ok(Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)>17);const h=drawMolecule(g,{click:true});assert.ok(h.includes('aria-label="Atom H, O"'));assert.ok(h.includes('class="atom-label-hit" cx="310" cy="20"'));assert.ok(p.y>=-10);
});
