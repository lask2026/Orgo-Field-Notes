import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {drawMolecule,formulaLabel,molecularFormula,netCharge,hydrogens} from '../../dev/src/molecules.js';
import {drawDiagram} from '../../dev/src/diagrams.js';import {renderLearn} from '../../dev/src/learn.js';import {renderPractice} from '../../dev/src/practice.js';import {freshState,cleanState} from '../../dev/src/progress.js';import {validateAnswer} from '../../dev/src/validation.js';
const ch=JSON.parse(fs.readFileSync('dev/chapters/chapter-03.json')),m=JSON.parse(fs.readFileSync('dev/chapters/molecules.json'));
const chapters=fs.readdirSync('dev/chapters').filter(f=>/^chapter-\d\d.json$/.test(f)).sort().map(f=>JSON.parse(fs.readFileSync('dev/chapters/'+f)));
test('Chapter 3 retains the nine re-derived original answers and aligns the amide prompt',()=>{
 const keys=ch.exercises.flatMap(e=>e.stages.slice(0,3).map(s=>s.answer));assert.deepEqual(keys,[0,3,6,[0,1],2,3,[3],0,1]);
 const amide=ch.exercises.find(e=>e.id==='amide-resonance');assert.equal(amide.molecule,'acetamide');assert.ok(amide.stages[2].prompt.includes('acetamide'));assert.ok(!amide.stages[2].prompt.includes('acetate'));
});
test('ionic formulas retain composition metadata and explicitly display net charge only when revealed',()=>{
 assert.equal(molecularFormula(m.acetate),'C2H3O2');assert.equal(m.acetate.formula,'C2H3O2');assert.equal(netCharge(m.acetate),-1);assert.equal(formulaLabel(m.acetate),'C2H3O2; net charge −1');
 assert.equal(formulaLabel({formula:'X',atoms:[{charge:1},{charge:1}]}),'X; net charge +2');assert.equal(formulaLabel(m.ethene),'C2H4');
 const state={...freshState(),lesson:2,step:2};assert.ok(renderLearn(ch,m,state,{selected:[]}).includes('Formula: C2H3O2; net charge −1'));
 const ex=ch.exercises.find(e=>e.id==='amide-resonance'),guided={...state,exercise:0,practice:{}};assert.ok(!renderPractice(ch,m,guided,{selected:[]}).includes('Formula:'));guided.practice={'3:amide-resonance':{stage:ex.stages.length}};assert.ok(renderPractice(ch,m,guided,{selected:[]}).includes('Formula: C2H5NO'));
});
test('two-carbon unsaturated structures show hydrogen groups without changing atom indices or bond counts',()=>{
 for(const [id,sigma,pi,group]of [['ethene',5,1,'H₂C'],['ethyne',3,2,'HC']]){const g=m[id],h=g.atoms.reduce((n,_,i)=>n+hydrogens(g,i),0);assert.equal(g.atoms.length,2);assert.equal(g.bonds.length+h,sigma);assert.equal(g.bonds.reduce((n,b)=>n+b[2]-1,0),pi);const html=drawMolecule(g,{click:true});assert.ok(html.includes('>'+group+'</text>'));assert.ok(html.includes('aria-label="Select atom B, C"'));assert.ok(!html.includes('data-idx="2"'));}
});
test('atomic filling diagram obeys carbon occupancy and is absent from active quantum practice',()=>{
 const l=ch.lessons[0],d=l.steps[0].diagram;assert.equal(d.type,'orbitals');assert.deepEqual(d.subshells.map(r=>r.electrons),[[2],[2],[1,1,0]]);assert.equal(d.subshells.flatMap(r=>r.electrons).reduce((a,b)=>a+b),6);
 const html=drawDiagram(d);assert.equal((html.match(/<rect /g)||[]).length,5);assert.ok(html.includes('Accessible orbital occupancy'));assert.ok(html.includes('1s: 2 electrons'));assert.ok(html.includes('2p: 1 electron, 1 electron, 0 electrons'));
 assert.ok(l.steps.every(s=>s.reveal));assert.ok(l.steps[0].text.includes('isolated neutral carbon'));
 const guided=renderPractice(ch,m,{...freshState(),lesson:0},{selected:[]});assert.ok(!guided.includes('Accessible orbital occupancy'));assert.ok(guided.includes('companion bonding example only'));assert.ok(!guided.includes('Formula:'));
});
test('added node and energy decisions reject incorrect numbers and invalidate old three-stage completion',()=>{
 const q=ch.exercises.find(e=>e.id==='quantum');assert.equal(q.stages.length,6);
 for(const s of q.stages.slice(3,5)){assert.ok(validateAnswer(s,'1'));assert.equal(validateAnswer(s,'2'),false);assert.equal(validateAnswer(s,'1 node'),false);}
 assert.equal(q.stages[5].options[q.stages[5].answer],'3s');assert.ok(q.stages[5].explanation.includes('hydrogen-like'));
 const state=cleanState({...freshState(),practice:{'3:quantum':{stage:3,solved:true,assisted:false}}},chapters);assert.equal(state.practice['3:quantum'].stage,3);assert.equal(state.practice['3:quantum'].solved,false);
});
test('amide multi-character highlights have room for NH2 and atom badges retain their element mapping',()=>{
 const html=drawMolecule(m.acetamide,{prin:[3],click:true});assert.ok(html.includes('rx="25" ry="19"'));assert.ok(html.includes('>NH₂</text>'));assert.ok(html.includes('class="atom-label-hit" cx="175" cy="115"'));assert.ok(html.includes('aria-label="Atom D, N"'));assert.ok(html.includes('aria-label="Select atom D, N"'));
});
