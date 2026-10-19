import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {validateAnswer,normalizeText} from '../../dev/src/validation.js';
import {molecularFormula,valences,drawMolecule} from '../../dev/src/molecules.js';
import {freshState,cleanState,readProgress,writeProgress,getProgress} from '../../dev/src/progress.js';
import {renderPractice} from '../../dev/src/practice.js';
const chapters=fs.readdirSync('dev/chapters').filter(f=>/^chapter-\d\d.json$/.test(f)).sort().map(f=>JSON.parse(fs.readFileSync('dev/chapters/'+f))),molecules=JSON.parse(fs.readFileSync('dev/chapters/molecules.json'));
test('strict text validation preserves chemical punctuation and descriptors',()=>{
 const s={type:'text',accepted:['2,4-dimethylhexane']};assert.ok(validateAnswer(s,' 2,4–dimethylhexane '));for(const a of ['24dimethylhexane','2-4-dimethylhexane','2,4dimethylhexane','2,4-dimethylhexane extra','(R)-2,4-dimethylhexane',''])assert.equal(validateAnswer(s,a),false,a);
 assert.notEqual(normalizeText('N-ethyl-N-methylpropanamide'),normalizeText('NethylNmethylpropanamide'));
});
test('exact atom sets and finite numeric validation',()=>{
 const s={type:'atoms',answer:[0,2]};assert.ok(validateAnswer(s,[2,0]));for(const v of [[0],[0,2,3],[0,0,2],['0',2],null])assert.equal(validateAnswer(s,v),false);
 const n={type:'number',answer:.5,tolerance:.001};assert.ok(validateAnswer(n,'0.500'));for(const v of ['','0.5 cm','0.5junk','Infinity','NaN','0x0','1/2'])assert.equal(validateAnswer(n,v),false);
});
test('storage handles missing, corrupt, blocked and out-of-bounds state',()=>{
 assert.equal(readProgress({getItem:()=>'{bad'},chapters).error,true);assert.equal(writeProgress({setItem(){throw Error();}},freshState()),false);
 const s=cleanState({...freshState(),chapter:999,lesson:-8,step:999,mode:'exam',practice:{'1:gp1a':{stage:999,solved:true}}},chapters);assert.equal(s.chapter,1);assert.equal(s.lesson,0);assert.equal(s.step,0);assert.equal(s.mode,'learn');assert.equal(s.practice['1:gp1a'].solved,false);
});
test('molecule graph integrity, valence, formula, connectivity and geometry bounds',()=>{
 for(const [id,m] of Object.entries(molecules)){
  const seen=new Set(),v=valences(m);assert.equal(molecularFormula(m),m.formula,id+' formula');if(m.displayFormula){const counts=f=>[...f.matchAll(/([A-Z][a-z]?)([0-9]*)/g)].map(x=>[x[1],Number(x[2]||1)]).sort((a,b)=>a[0].localeCompare(b[0]));assert.deepEqual(counts(m.displayFormula),counts(m.formula),id+' display composition');}
  m.bonds.forEach(([a,b,n])=>{assert.ok(m.atoms[a]&&m.atoms[b]&&a!==b,id+' endpoints');assert.ok([1,2,3].includes(n));const key=[a,b].sort((a,b)=>a-b).join(':');assert.ok(!seen.has(key),id+' duplicate');seen.add(key);});
  m.atoms.forEach((a,i)=>{assert.ok(a.x>=0&&a.x<=m.w&&a.y>=0&&a.y<=m.h,id+' bounds');assert.ok(v[i]<=({C:4,N:a.charge===1?4:3,O:a.charge===-1?1:2,H:1,S:6,P:5,F:1,Cl:1,Br:1,I:1}[a.e]),id+' valence');});
  const reached=new Set([0]);for(let i=0;i<m.atoms.length;i++)for(const [a,b] of m.bonds){if(reached.has(a))reached.add(b);if(reached.has(b))reached.add(a);}assert.equal(reached.size,m.atoms.length,id+' disconnected');
  for(const st of m.stereo||[])assert.ok(m.bonds[st.bond]?.[2]===1,id+' stereo');
 }
});
function checkHighlights(h,m,where){for(const [key,indices] of Object.entries(h||{})){if(key==='flow'){for(const flow of indices)for(const [kind,i]of Object.entries(flow))assert.ok(kind.endsWith('Atom')?m.atoms[i]:m.bonds[i],where+' electron flow');continue;}assert.equal(new Set(indices).size,indices.length,where);for(const i of indices)assert.ok(m.atoms[i],where+' atom '+i);if(key==='path')for(let j=1;j<indices.length;j++)assert.ok(m.bonds.some(([a,b])=>(a===indices[j-1]&&b===indices[j])||(b===indices[j-1]&&a===indices[j])),where+' path');}}
for(const ch of chapters)test(`Chapter ${ch.id}: references, keys, lessons, concealment, stage answers`,()=>{
 const ids=new Set(ch.lessons.map(l=>l.id));assert.equal(ids.size,ch.lessons.length);assert.equal(new Set(ch.exercises.map(e=>e.id)).size,ch.exercises.length);
 for(const l of ch.lessons){assert.ok(molecules[l.molecule]);assert.ok(ch.exercises.some(e=>e.lesson===l.id),l.id+' needs practice');
  for(const c of Object.values(l.cards))assert.ok(!/<(?:script|iframe|img)|\bon\w+\s*=/i.test(c),'unsafe HTML');
  for(const s of l.steps){const m=molecules[s.molecule||l.molecule];assert.ok(m,l.id+' molecule');checkHighlights(s.highlights,m,l.id);if(s.challenge)for(const a of s.challenge.answer)assert.ok(m.atoms[a]);}
 }
 for(const ex of ch.exercises){assert.ok(ids.has(ex.lesson));const m=molecules[ex.molecule];assert.ok(m);
  for(const s of ex.stages){const m=molecules[s.molecule||ex.molecule];assert.ok(m);checkHighlights(s.highlights,m,ex.id);const answer=s.type==='text'?s.accepted[0]:s.type==='number'?String(s.answer):s.answer;assert.ok(validateAnswer(s,answer),ex.id+' key');if(s.type==='choice'){assert.ok(s.answer<s.options.length);assert.equal(new Set(s.options).size,s.options.length);for(let i=0;i<s.options.length;i++)if(i!==s.answer)assert.equal(validateAnswer(s,i),false);}if(s.type==='atoms')for(const a of s.answer)assert.ok(m.atoms[a]);}
  const state={...freshState(),chapter:ch.id,mode:'guided',lesson:ch.lessons.findIndex(l=>l.id===ex.lesson),exercise:ch.exercises.filter(e=>e.lesson===ex.lesson).indexOf(ex)},ui={selected:[],value:''};const html=renderPractice(ch,molecules,state,ui);
  assert.ok(!html.includes('<span class="final-merged">'),'name concealment');assert.ok(!html.includes('Formula:'),'formula concealment');assert.ok(!html.includes(ex.stages.at(-1).explanation),'future explanation concealed');
 }
});
