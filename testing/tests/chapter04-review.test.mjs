import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {validateAnswer} from '../../dev/src/validation.js';import {drawDiagram} from '../../dev/src/diagrams.js';import {renderLearn} from '../../dev/src/learn.js';import {renderPractice,solutionText} from '../../dev/src/practice.js';import {freshState} from '../../dev/src/progress.js';import {hydrogens,formulaLabel,molecularFormula} from '../../dev/src/molecules.js';
const ch=JSON.parse(fs.readFileSync('dev/chapters/chapter-04.json')),m=JSON.parse(fs.readFileSync('dev/chapters/molecules.json'));
const lesson=id=>ch.lessons.find(l=>l.id===id),ex=id=>ch.exercises.find(e=>e.id===id);
test('Chapter 4 keeps all fifteen re-derived keys and signed/scientific numeric parsing',()=>{
 assert.deepEqual(ch.exercises.flatMap(e=>e.stages.map(s=>s.answer)),[[2,3],1,100000,[1],0,1,0,4,0,[1],1,0,[0],[3],0]);
 assert.ok(validateAnswer(ex('pka-equilibrium').stages[2],'1e5'));assert.ok(!validateAnswer(ex('pka-equilibrium').stages[2],'1e-5'));
 const g=m.acetaldehyde,oxidation=g.bonds.reduce((n,[a,b,order])=>n+((a===1&&g.atoms[b].e==='O')||(b===1&&g.atoms[a].e==='O')?order:0),0)-hydrogens(g,1);
 assert.equal(oxidation,1);assert.ok(validateAnswer(ex('carbon-redox').stages[1],'+1'));assert.ok(!validateAnswer(ex('carbon-redox').stages[1],'1 oxidation state'));assert.equal(solutionText(ex('carbon-redox').stages[1]),'1');
 assert.equal(ex('sn2-rate').stages[1].answer,2*2);
});
test('forward acid-base direction is explicit and stage-two feedback does not disclose the later computation',()=>{
 const e=ex('pka-equilibrium');assert.ok(e.stages[1].prompt.includes('HA + B ⇌ A− + BH+'));assert.ok(e.context.includes('hypothetical'));assert.ok(!e.stages[1].explanation.includes('10^'));assert.ok(!e.stages[1].explanation.includes('100000'));
 const state={...freshState(),lesson:0,exercise:0,practice:{'4:pka-equilibrium':{stage:1,hints:0}}},html=renderPractice(ch,m,state,{selected:[],correct:true,feedback:e.stages[1].explanation});assert.ok(!html.includes('100000'));assert.ok(!html.includes(e.stages[2].explanation));assert.ok(!html.includes('Formula:'));
 assert.equal(e.stages[2].answer,10**(10-5));assert.equal(10**(5-10),1/e.stages[2].answer);
});
test('steric and redox focus colors track the intended atoms and alpha challenge uses the displayed graph',()=>{
 const steps=lesson('substitution').steps;assert.deepEqual(steps[0].highlights.sub,[0,2,3]);assert.deepEqual(steps[1].highlights.sub,[0]);
 for(const step of steps)for(const a of step.highlights.sub)assert.equal(m[step.molecule].atoms[a].e,'C');
 assert.deepEqual(ex('carbon-redox').stages[0].highlights,{prin:[1],sub:[2]});
 const alpha=lesson('acids').steps.at(-1),g=m[alpha.molecule],a=alpha.challenge.answer[0];assert.equal(g.atoms[a].e,'C');assert.ok(hydrogens(g,a)>0);assert.ok(g.bonds.some(([u,v])=>(u===a&&v===1)||(v===a&&u===1)));
 assert.ok(ex('sn2-rate').stages[2].prompt.includes('bromoethane is achiral'));
});
test('speciation legend identifies both species and conservation holds at midpoint and slider extremes',()=>{
 const d=lesson('acids').steps[0].diagram;
 for(const ph of [0,4.8,6.8,14]){const f=1/(1+10**(d.pKa-ph)),html=drawDiagram(d,ph);assert.ok(html.includes(`Green: A⁻ (deprotonated), ${(100*f).toFixed(1)}%`));assert.ok(html.includes(`HA (protonated), ${(100*(1-f)).toFixed(1)}%`));assert.ok(html.includes('range 0–14'));assert.ok(html.includes(`aria-valuetext="pH ${ph};`));}
 assert.ok(drawDiagram(d,4.8).includes('50.0% deprotonated'));assert.ok(drawDiagram(d,6.8).includes('99.0% deprotonated'));
});
test('acetate remains charged in revealed UI and tert-butyl drawing changes coordinates without changing chemistry',()=>{
 const html=renderLearn(ch,m,{...freshState(),lesson:0,step:1},{selected:[]});assert.ok(html.includes('Formula: C2H3O2; net charge −1'));assert.equal(formulaLabel(m.acetate),'C2H3O2; net charge −1');
 const g=m.tbutylbromide;assert.equal(molecularFormula(g),'C4H9Br');assert.deepEqual(g.bonds,[[0,1,1],[1,2,1],[1,3,1],[1,4,1]]);assert.equal(g.atoms[0].y,g.atoms[1].y);assert.equal(g.atoms[2].y,g.atoms[1].y);assert.equal(g.atoms[3].x,g.atoms[1].x);assert.equal(g.atoms[4].x,g.atoms[1].x);assert.ok(lesson('substitution').steps[0].text.includes('not a claim of 90°'));
});
