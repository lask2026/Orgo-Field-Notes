import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {validateAnswer} from '../../dev/src/validation.js';import {molecularFormula,netCharge,hydrogens,electronFlowGeometry} from '../../dev/src/molecules.js';
const c=JSON.parse(fs.readFileSync('dev/chapters/chapter-09.json')),m=JSON.parse(fs.readFileSync('dev/chapters/molecules.json'));
test('Chapter 9 all nine keys retained and only explicit methanol names/formulas accepted',()=>{
 assert.deepEqual(c.exercises.flatMap(e=>e.stages.map(s=>s.answer)),[[0,1],4,0,[1],0,2,[4],0,undefined]);const s=c.exercises[2].stages[2];for(const v of ['methanol','methyl alcohol','CH3OH','MeOH',' ch3oh ','CH3-OH','H3COH','H3C-OH','HOCH3','HO-CH3','Me-OH','carbinol','CH₃–OH'])assert.ok(validateAnswer(s,v));for(const v of ['ethanol','CH3O-','CH3O−','HOCH3+','CH3-O-','CH4O extra','meth oxide','CH3=OH','CH3 OH'])assert.ok(!validateAnswer(s,v));assert.equal(c.exercises[2].stages[1].options[0],'Acetate (ethanoate)');
});
test('tetrahedral intermediate has four separated bonds and addition conserves atoms and charge',()=>{
 const g=m['ester-intermediate'];assert.equal(molecularFormula(g),'C3H7O3');assert.equal(netCharge(g),-1);assert.equal(g.bonds.filter(([a,b])=>a===1||b===1).length,4);assert.ok(g.bonds.filter(([a,b])=>a===1||b===1).every(b=>b[2]===1));
 const neighbors=g.bonds.filter(([a,b])=>a===1||b===1).map(([a,b])=>g.atoms[a===1?b:a]),angles=neighbors.map(a=>Math.atan2(a.y-g.atoms[1].y,a.x-g.atoms[1].x)).sort((a,b)=>a-b);for(let i=0;i<4;i++)assert.ok(((angles[(i+1)%4]-angles[i]+2*Math.PI)%(2*Math.PI))>1.4);
 assert.equal(molecularFormula(m.methylacetate),'C3H6O2');assert.equal(hydrogens(g,5),1);assert.equal(hydrogens(g,2),0);for(const step of c.lessons[1].steps)for(const f of step.highlights.flow||[])assert.ok(Object.values(electronFlowGeometry(m[step.molecule],f)).every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
});
test('derivative teaching distinguishes condensation equilibrium and rate stabilization from a universal shortcut',()=>{
 assert.equal(c.lessons[0].steps[0].label,'1. Acyclic ester');const cards=c.lessons.map(l=>Object.values(l.cards).join(' ')).join(' ');for(const term of ['activation free-energy','Fischer','Saponification','five- or six-membered','acylammonium']){assert.ok(cards.includes(term),term);}assert.ok(cards.includes('beta = four'));assert.ok(cards.includes('gamma = five'));assert.ok(cards.includes('delta = six'));assert.ok(cards.includes('Water need not be completely absent'));
});
