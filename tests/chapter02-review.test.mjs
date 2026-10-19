import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {validateAnswer} from '../src/validation.js';import {renderLearn} from '../src/learn.js';
const ch=JSON.parse(fs.readFileSync('chapters/chapter-02.json')),molecules=JSON.parse(fs.readFileSync('chapters/molecules.json'));
test('CIP alias expansion accepts equivalent correct descriptors and rejects inverted stereochemistry',()=>{
 const f=ch.exercises.find(e=>e.id==='fischer-cip').stages[2],z=ch.exercises.find(e=>e.id==='ez-chirality').stages[1];
 for(const value of ['S','(2S)','(2S)-butan-2-ol','(S)-2-butanol'])assert.ok(validateAnswer(f,value),value);
 for(const value of ['R','(2R)','(R)-butan-2-ol','S-butane','(S) butan-2-ol'])assert.equal(validateAnswer(f,value),false,value);
 for(const value of ['Z','(2Z)','(Z)-2-butene'])assert.ok(validateAnswer(z,value));
 for(const value of ['E','(2E)','(E)-but-2-ene','2Zbutene'])assert.equal(validateAnswer(z,value),false);
});
test('the C1-top Fischer drawing preserves the S assignment and mirrored step reverses it',()=>{
 const d=ch.exercises.find(e=>e.id==='fischer-cip').diagram;assert.equal(d.top,'CH₃');
 const assignment=d=>{const coords={right:[1,0],left:[-1,0],top:[0,1],bottom:[0,-1]},pos=label=>Object.keys(coords).find(k=>d[k]===label);const [a,b,c]=['OH','CH₂CH₃','CH₃'].map(label=>coords[pos(label)]);const cross=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);const toward=['left','right'].includes(pos('H'));return (cross<0)!==toward?'R':'S';};
 assert.equal(assignment(d),'S');assert.equal(assignment(ch.lessons.find(l=>l.id==='configuration').steps[2].diagram),'R');
});
test('active atom challenges remove walkthrough highlights and expose lettered selectable atoms',()=>{
 const index=ch.lessons.findIndex(l=>l.id==='chirality'),state={lesson:index,step:0};
 const walkthrough=renderLearn(ch,molecules,state,{tryMode:false,selected:[]});assert.ok(walkthrough.includes('class="anim-halo"'));
 const challenge=renderLearn(ch,molecules,state,{tryMode:true,selected:[],checked:false});assert.ok(!challenge.includes('class="anim-halo"'));assert.ok(challenge.includes('aria-label="Atom B, C"'));assert.ok(challenge.includes('aria-label="Select atom B, C"'));
});
test('polarimetry practice uses dm conversion and consistent normalized rotation',()=>{
 const e=ch.exercises.find(e=>e.id==='specific-rotation');const dm=5/10,specific=2.4/(.080*dm),observed=specific*.040*2;
 for(const [i,n]of [dm,specific,observed].entries())assert.ok(validateAnswer(e.stages[i],String(n)));
 assert.equal(validateAnswer(e.stages[1],String(2.4/(.080*5))),false,'reject use of cm as if dm');
 assert.ok(!ch.exercises.some(e=>e.id==='ez-ee'),'old solve status must not count for revised workshop');
});
