import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {drawDiagram} from '../src/diagrams.js';import {validateAnswer} from '../src/validation.js';import {molecularFormula} from '../src/molecules.js';import {renderPractice} from '../src/practice.js';import {freshState} from '../src/progress.js';
const c=JSON.parse(fs.readFileSync('chapters/chapter-12.json')),m=JSON.parse(fs.readFileSync('chapters/molecules.json'));
test('Chapter 12 twelve keys retained and Rf stage rejects unit-bearing or incorrect ratios without an unrelated numeric model',()=>{
 assert.deepEqual(c.exercises.flatMap(e=>e.stages.map(s=>s.answer)),[[6,7,8],0,0,0,0,0,.3,0,0,0,0,0]);const e=c.exercises[2];assert.equal(e.diagram,undefined);assert.ok(validateAnswer(e.stages[0],'0.30'));for(const v of ['0.33','0.3 cm','3.33'])assert.ok(!validateAnswer(e.stages[0],v));const html=renderPractice(c,m,{...freshState(),lesson:2,exercise:0},{selected:[],value:''});assert.ok(!html.includes('Model spot A'));assert.ok(html.includes('1.8 cm'));assert.ok(!html.includes('Rf = 0.30'));
});
test('TLC spots and both Rf values are identified at slider extremes without claiming measured results',()=>{
 const d=c.lessons[2].steps[0].diagram;for(const s of [0,30,100]){const h=drawDiagram(d,s),a=Math.min(.9,.15+s*.006),b=Math.min(.95,a+.2);assert.ok(h.includes('>A</text>'));assert.ok(h.includes('>B</text>'));assert.ok(h.includes(`spot A (blue, left) Rf = ${a.toFixed(2)}`));assert.ok(h.includes(`spot B (green, right) Rf = ${b.toFixed(2)}`));assert.ok(h.includes('aria-valuetext="Strength '+s));assert.ok(h.includes('does not predict experimental values'));}assert.equal(c.lessons[2].steps[1].diagram,undefined);
});
test('toluene substituent length matches ring bonds and all highlights remain within the expanded drawing',()=>{
 const g=m.toluene,d=(i,j)=>Math.hypot(g.atoms[i].x-g.atoms[j].x,g.atoms[i].y-g.atoms[j].y);assert.ok(Math.abs(d(0,6)/d(0,1)-1)<.001);assert.ok(g.atoms[6].y>=20);assert.ok(Math.max(...g.atoms.map(a=>a.y))+19<=g.h);assert.equal(molecularFormula(g),'C7H8');
});
