import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateAnswer} from '../../dev/src/validation.js';
import {molecularFormula,hydrogens} from '../../dev/src/molecules.js';
const ch=JSON.parse(fs.readFileSync('dev/chapters/chapter-01.json'));
const m=JSON.parse(fs.readFileSync('dev/chapters/molecules.json'));

test('Chapter 1 feedback describes available evidence and intermediate hints follow each task',()=>{
 const stages=ch.exercises.flatMap(e=>e.stages.slice(0,-1));
 assert.equal(stages.length,22);
 for(const s of stages){
  assert.equal(s.hints.length,2);
  assert.notEqual(s.hints[0],s.hints[1]);
  assert.ok(!s.hints.some(h=>/Use the molecular connectivity, then apply the rule|Identify the principal group or the longest required parent/.test(h)));
 }
 assert.equal(new Set(stages.map(s=>s.hints.join('|'))).size,22);
 assert.ok(!JSON.stringify(ch.exercises).includes('Red counter-example shown'));
 const alpha=ch.exercises.find(e=>e.id==='gp5a').stages[0];
 assert.ok(alpha.hints[0].includes('carbonyl carbon itself is excluded'));
 assert.ok(validateAnswer(alpha,[0,2]));assert.ok(!validateAnswer(alpha,[0,1,2]));
 const cue=ch.lessons[0].cards.cue;
 assert.ok(cue.includes('parent name is not part'));assert.ok(cue.includes('(1,1-dimethylethyl)'));
});

test('explicit aldehydic H remains a valid graph vertex, not an accepted carbon answer',()=>{
 const g=m.hyald,s=ch.exercises.find(e=>e.id==='gp5b').stages[0];
 assert.equal(g.atoms[5].e,'H');assert.equal(g.atoms[6].e,'O');
 assert.ok(g.bonds.some(([a,b,n])=>a===3&&b===5&&n===1));
 assert.equal(hydrogens(g,3),0);assert.equal(hydrogens(g,5),0);
 assert.equal(molecularFormula(g),'C4H8O2');
 assert.ok(validateAnswer(s,[3]));assert.ok(!validateAnswer(s,[5]));assert.ok(!validateAnswer(s,[3,5]));
});
