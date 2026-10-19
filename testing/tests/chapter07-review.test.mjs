import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {drawMolecule,molecularFormula,netCharge,numberBadgePosition,hydrogens} from '../../dev/src/molecules.js';import {renderPractice} from '../../dev/src/practice.js';import {freshState} from '../../dev/src/progress.js';
const c=JSON.parse(fs.readFileSync('dev/chapters/chapter-07.json')),m=JSON.parse(fs.readFileSync('dev/chapters/molecules.json'));
const angle=(a,b,d)=>{const u=[b.x-a.x,b.y-a.y],v=[d.x-a.x,d.y-a.y];return Math.acos((u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v)))*180/Math.PI;};
test('Chapter 7 all twelve keys retained and alpha sites actually bear hydrogens',()=>{
 assert.deepEqual(c.exercises.flatMap(e=>e.stages.map(s=>s.answer)),[[0,2],0,0,[0],0,0,[2],0,[1,2],[1],[3],0]);for(const i of [0,2])assert.ok(hydrogens(m.ketone,i)>0);assert.ok(m.aldol.bonds.some(([a,b,n])=>a===1&&b===2&&n===1));
});
test('aldol carbonyl layouts and locant badges clear the incident bonds',()=>{
 for(const id of ['aldol','crotonaldehyde']){const g=m[id];assert.ok(angle(g.atoms[0],g.atoms[1],g.atoms[4])>110);assert.ok(angle(g.atoms[0],g.atoms[1],g.atoms[4])<130);}
 for(const g of [m.aldol,m.acetoaceticacid])for(let i=0;i<4;i++){const p=numberBadgePosition(g,i);for(const [a,b] of g.bonds.filter(([a,b])=>a===i||b===i)){const u=g.atoms[a],v=g.atoms[b],dx=v.x-u.x,dy=v.y-u.y,t=Math.max(0,Math.min(1,((p.x-u.x)*dx+(p.y-u.y)*dy)/(dx*dx+dy*dy)));assert.ok(Math.hypot(p.x-u.x-t*dx,p.y-u.y-t*dy)>12);}}
});
test('both enolate contributors preserve nuclei, hydrogens and net charge while moving electrons',()=>{
 const o=m['ethanal-enolate'],a=m['ethanal-enolate-carbon'];assert.equal(molecularFormula(a),'C2H3O');assert.equal(molecularFormula(a),molecularFormula(o));assert.equal(netCharge(a),-1);assert.equal(netCharge(o),-1);assert.deepEqual(a.atoms.map(x=>[x.e,x.x,x.y]),o.atoms.map(x=>[x.e,x.x,x.y]));assert.deepEqual(a.bonds.map(([u,v])=>[u,v]),o.bonds.map(([u,v])=>[u,v]));assert.equal(hydrogens(a,0),2);assert.equal(a.atoms[0].charge,-1);assert.ok(drawMolecule(a).includes('H₂C⁻'));assert.ok(drawMolecule(a).includes('charge -1'));
});
test('Michael transfer stage contrasts carbonyl and beta rather than highlighting beta alone',()=>{
 const e=c.exercises.find(e=>e.id==='michael-site');assert.deepEqual(e.stages[1].highlights,{prin:[1,4],sub:[3]});assert.deepEqual(e.stages[2].highlights,{prin:[1,4]});const html=renderPractice(c,m,{...freshState(),lesson:3,exercise:0,practice:{'7:michael-site':{stage:2,hints:0}}},{selected:[],value:''});assert.ok(html.includes('C=O site'));assert.ok(!html.includes('Formula:'));assert.ok(!html.includes('class="copt ok"'));assert.ok(!c.lessons[3].steps[0].text.includes('carbonyl carbon is B'));
});
