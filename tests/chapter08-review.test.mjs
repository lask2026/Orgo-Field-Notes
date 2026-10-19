import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {validateAnswer} from '../src/validation.js';import {molecularFormula,netCharge} from '../src/molecules.js';import {renderPractice} from '../src/practice.js';import {freshState} from '../src/progress.js';
const c=JSON.parse(fs.readFileSync('chapters/chapter-08.json')),m=JSON.parse(fs.readFileSync('chapters/molecules.json'));
test('Chapter 8 original twelve keys and strict decarboxylation aliases retain atom balance',()=>{
 assert.deepEqual(c.exercises.flatMap(e=>e.stages.map(s=>s.answer)),[[1,2,3],100,1,[2],0,0,[0],3,undefined,[12,13],0,0]);const e=c.exercises.find(e=>e.id==='lose-co2'),s=e.stages[2];for(const v of ['acetone','propanone','propan-2-one','2-propanone','dimethyl ketone'])assert.ok(validateAnswer(s,v));for(const v of ['propanal','2 propanone','butanone'])assert.ok(!validateAnswer(s,v));assert.equal(s.molecule,'acetone');assert.equal(molecularFormula(m.acetoaceticacid),'C4H6O3');assert.equal(molecularFormula(m.acetone),'C3H6O');assert.equal(4-1,e.stages[1].answer);
 const state={...freshState(),lesson:2,exercise:0,practice:{'8:lose-co2':{stage:2,hints:0}}};assert.ok(!renderPractice(c,m,state,{selected:[],value:''}).includes('Formula:'));state.practice['8:lose-co2'].stage=3;assert.ok(renderPractice(c,m,state,{selected:[]}).includes('Displayed structure: propanone<br>Formula: C3H6O'));
});
test('beta keto acid and carboxylate oxygens point outside the chain troughs with formulas and charge preserved',()=>{
 for(const [id,centers] of [['acetoaceticacid',[[0,4],[2,6]]],['laurate',[[0,12]]]]){const g=m[id];for(const [i,o] of centers){assert.ok(g.atoms[o].y<g.atoms[i].y);for(const [a,b] of g.bonds.filter(([a,b])=>a===i||b===i)){const j=a===i?b:a;if(g.atoms[j].e==='C')assert.ok(g.atoms[j].y>g.atoms[i].y);}}}assert.equal(molecularFormula(m.laurate),'C12H23O2');assert.equal(netCharge(m.laurate),-1);
});
test('soap head and tail selections are disjoint and acid context does not imply an endocyclic free carboxyl carbon',()=>{
 const s=c.lessons.find(l=>l.id==='soap').steps;assert.deepEqual(s[0].highlights.prin,s[1].highlights.prin);assert.deepEqual(s[1].highlights.path,[1,2,3,4,5,6,7,8,9,10,11]);assert.ok(s[1].highlights.path.every(i=>!s[1].highlights.prin.includes(i)));assert.ok(c.lessons[0].cards.trap.includes('outside the ring'));assert.ok(!c.lessons[0].cards.trap.includes('need not'));
});
