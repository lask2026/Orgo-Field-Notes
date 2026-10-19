import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {validateAnswer} from '../src/validation.js';import {molecularFormula} from '../src/molecules.js';import {renderPractice} from '../src/practice.js';import {freshState} from '../src/progress.js';
const ch=JSON.parse(fs.readFileSync('chapters/chapter-05.json')),m=JSON.parse(fs.readFileSync('chapters/molecules.json')),ex=id=>ch.exercises.find(e=>e.id===id);
const html=(id,stage,correct=false)=>{const e=ex(id);return renderPractice(ch,m,{...freshState(),lesson:ch.lessons.findIndex(l=>l.id===e.lesson),exercise:0,practice:{[`5:${id}`]:{stage,hints:0}}},{selected:[],correct,value:''});};
test('Chapter 5 explicit aliases accept valid names and reject altered structures',()=>{
 for(const a of ['propanone','propan-2-one','2-propanone','acetone','dimethyl ketone'])assert.ok(validateAnswer(ex('oxidize-secondary').stages[2],a));
 for(const a of ['propanal','2 propanone','propan-1-one'])assert.ok(!validateAnswer(ex('oxidize-secondary').stages[2],a));
 for(const a of ['tertiary','3°','tertiary alcohol','3° alcohol'])assert.ok(validateAnswer(ex('classify-alcohol').stages[2],a));
 assert.deepEqual(ch.exercises.flatMap(e=>e.stages.map(s=>s.answer)),[[1],3,undefined,[1],0,undefined,[1],0,0,[6,7],0,2]);
});
test('Chapter 5 product graphs preserve carbon skeleton and reveal the displayed formula only on completion',()=>{
 assert.equal(ex('oxidize-secondary').stages[2].molecule,'acetone');assert.equal(molecularFormula(m.isopropanol),'C3H8O');assert.equal(molecularFormula(m.acetone),'C3H6O');
 assert.deepEqual(m.isopropanol.bonds.filter(b=>b[1]!==3),m.acetone.bonds.filter(b=>b[1]!==3));
 assert.ok(!html('oxidize-secondary',2).includes('Formula:'));assert.ok(html('oxidize-secondary',3).includes('Displayed structure: propanone<br>Formula: C3H6O'));
 assert.equal(ex('protection').stages[2].molecule,'mesylate');assert.ok(html('protection',3).includes('Displayed structure: ethyl methanesulfonate'));
});
test('sulfonate focus includes every mesylate atom and symmetric oxygen positions retain formula',()=>{
 const focus=ch.lessons.find(l=>l.id==='activation').steps[0].highlights.prin;assert.deepEqual(focus,[2,3,4,5,6]);
 assert.equal(m.mesylate.atoms[5].y,m.mesylate.atoms[6].y);assert.equal(m.mesylate.atoms[5].x+m.mesylate.atoms[6].x,2*m.mesylate.atoms[3].x);assert.equal(molecularFormula(m.mesylate),'C3H8O3S');
});
test('quinone balance uses the reduced product and correct-choice styling appears only after success',()=>{
 const e=ex('quinone-redox');assert.equal(e.stages[2].molecule,'hydroquinone');assert.equal(molecularFormula(m.quinone),'C6H4O2');assert.equal(molecularFormula(m.hydroquinone),'C6H6O2');assert.equal(e.stages[2].answer,2);
 assert.ok(!html('quinone-redox',1).includes('class="copt ok"'));assert.ok(html('quinone-redox',1,true).includes('class="copt ok"'));assert.ok(html('quinone-redox',3).includes('Formula: C6H6O2'));
});
