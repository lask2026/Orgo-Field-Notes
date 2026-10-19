import test from 'node:test';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import {buildCases,blindExercise,chapterSections,validateReview,hash,readJSON,casePrompt,systemPrompt,compareBlindAnswers} from '../../review/scripts/cases.mjs';import {parseArgs,inspectResponse} from '../../review/scripts/run-llama.mjs';
const molecules=readJSON('dev/chapters/molecules.json'),chapters=fs.readdirSync('dev/chapters').filter(f=>/^chapter-\d\d.json$/.test(f)).map(f=>readJSON('dev/chapters/'+f));
test('blind data structurally withholds keys, hints, names, formulas and answer overlays',()=>{
 const ex={id:'sentinel',graph:{atoms:[{e:'C',x:1,y:1}],bonds:[],name:'SECRET-NAME',formula:'SECRET-FORMULA',cond:'SECRET-COND',review:'SECRET-REVIEW'},summary:'SECRET-SUMMARY',title:'SECRET-TITLE',anatomy:['SECRET-ANATOMY'],stages:[{type:'text',prompt:'Solve this.',accepted:['SECRET-KEY'],hints:['SECRET-HINT'],explanation:'SECRET-EXPLANATION',highlights:{prin:[99]}}]};
 const raw=JSON.stringify(blindExercise(ex));assert.ok(!raw.includes('SECRET-'));assert.ok(!raw.includes('highlights'));assert.ok(!raw.includes('accepted'));
});
test('all chapters have complete, unique lesson/stage/molecule/scope review cases',()=>{
 for(const ch of chapters){const {cases,used}=buildCases(ch,molecules);assert.equal(new Set(cases.map(c=>c.id)).size,cases.length);assert.equal(cases.filter(c=>c.kind==='blind').length,ch.exercises.length);assert.equal(cases.filter(c=>c.kind==='lesson').length,ch.lessons.length);assert.equal(cases.filter(c=>c.kind==='molecule').length,used.length);assert.ok(chapterSections(ch.id).length>=2,'scope missing for '+ch.id);for(const c of cases){assert.ok(c.itemIds.length);assert.equal(new Set(c.itemIds).size,c.itemIds.length);if(c.dependsOn)assert.ok(cases.some(x=>x.id===c.dependsOn&&x.kind==='blind'));}}
});
test('review output cannot count duplicated/missing coverage or invented IDs as complete',()=>{
 const c={id:'c',kind:'blind',itemIds:['a','b']};const valid={caseId:'c',summary:'Candidate review',coverage:['a','b'].map(itemId=>({itemId,status:'uncertain',note:'No authoritative reference supplied'})),findings:[],answers:['a','b'].map(itemId=>({itemId,answer:'Candidate answer',reasoning:'Derivation'})),limitations:['No visual inspection']};
 assert.deepEqual(validateReview(valid,c),[]);assert.ok(validateReview({...valid,coverage:[valid.coverage[0],valid.coverage[0]]},c).length);assert.ok(validateReview({...valid,answers:[]},c).length);assert.ok(validateReview({...valid,caseId:'wrong'},c).length);assert.ok(validateReview({...valid,findings:[{itemId:'invented'}]},c).length);
});
test('runner accepts bounded local options and refuses remote inference endpoints',()=>{
 assert.equal(parseArgs(['--chapter','2','--limit','1','--resume']).resume,true);for(const args of [['--chapter','0'],['--mode','made-up'],['--limit','-1'],['--endpoint','https://example.com'],['--endpoint','http://192.168.1.5:11434']])assert.throws(()=>parseArgs(args));
});
test('package hashes detect changed content',()=>{assert.equal(hash('same'),hash('same'));assert.notEqual(hash('before'),hash('after'));});
test('truncated, incomplete and malformed model outputs cannot become completed reviews',()=>{
 const c={id:'c',kind:'blind',itemIds:['a']};assert.equal(inspectResponse({done:true,done_reason:'length',message:{content:'{}'}},c).executionStatus,'truncated');assert.equal(inspectResponse({done:false},c).executionStatus,'incomplete');assert.equal(inspectResponse({done:true,message:{content:'not json'}},c).executionStatus,'invalid-response');assert.equal(inspectResponse({done:true,message:{content:'{}'}},c).executionStatus,'invalid-response');
});
test('every base case fits the default conservative 8K context budget without dropping content',()=>{
 for(const ch of chapters)for(const c of buildCases(ch,molecules).cases){const estimate=Math.ceil(Buffer.byteLength(systemPrompt+casePrompt(c))/2)+2048+256;assert.ok(estimate<=8192,c.id+' estimated context '+estimate);}
});
test('blind answer comparison reports disagreements without asserting scientific truth',()=>{
 const exercise={id:'e',stages:[{type:'choice',options:['Ethanol only','Ether only'],answer:0},{type:'atoms',answer:[1,2]},{type:'text',accepted:['3-methylhexane']}]};
 const result=compareBlindAnswers({answers:[{itemId:'e:stage-1',answer:'Ether only'},{itemId:'e:stage-2',answer:'[2,1]'},{itemId:'e:stage-3',answer:'3methylhexane'}]},exercise);assert.deepEqual(result.map(r=>r.encodedKeyComparison),['differs-from-encoded-key','matches-encoded-key','differs-from-encoded-key']);assert.equal(compareBlindAnswers({answers:[]},exercise)[0].encodedKeyComparison,'unparsed');
});
