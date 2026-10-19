import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {readJSON,root,buildCases,sourceSnapshot} from '../../review/scripts/cases.mjs';
import {parsePanelArgs,validateConfig,makePrompt,requestSpec,checkModelResponse,invokeReviewer,decodeProviderBody,summarizeChapter,runPanel} from '../../review/scripts/review-panel.mjs';

const config={version:1,contextTokens:32768,maxOutputTokens:4096,timeoutSeconds:2,reviewers:[{id:'local',provider:'ollama',model:'test:8b'}],challengeReviewer:'local'};
const ch=readJSON(path.join(root,'dev/chapters/chapter-01.json')),molecules=readJSON(path.join(root,'dev/chapters/molecules.json')),cases=buildCases(ch,molecules).cases;
const response=c=>({caseId:c.id,summary:'Synthetic test response, not a chemistry review',coverage:c.itemIds.map(itemId=>({itemId,status:'uncertain',note:'Fixture only'})),findings:[],answers:c.kind==='blind'?c.itemIds.map(itemId=>({itemId,answer:'unsolved',reasoning:'Fixture; no scientific derivation'})):[],limitations:['No chemistry verification']});
const raw=c=>({done:true,done_reason:'stop',model:'test:8b',message:{content:JSON.stringify(response(c))}});
function fixture(t){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'orgo-panel-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 fs.mkdirSync(path.join(dir,'dev/chapters'),{recursive:true});fs.copyFileSync(path.join(root,'dev/chapters/molecules.json'),path.join(dir,'dev/chapters/molecules.json'));
 for(let n=1;n<=12;n++){const nn=String(n).padStart(2,'0'),chapter=readJSON(path.join(root,`dev/chapters/chapter-${nn}.json`));fs.writeFileSync(path.join(dir,`dev/chapters/chapter-${nn}.json`),JSON.stringify(chapter));fs.mkdirSync(path.join(dir,`review/packets/chapter-${nn}`),{recursive:true});fs.writeFileSync(path.join(dir,`review/packets/chapter-${nn}/cases.json`),JSON.stringify({sourceSnapshot:sourceSnapshot(chapter,molecules),cases:buildCases(chapter,molecules).cases}));}
 fs.writeFileSync(path.join(dir,'panel.json'),JSON.stringify(config));return dir;
}
function provider(calls,{fail=false}={}){return async(url,opts)=>{
 if(url.endsWith('/api/tags'))return {ok:true,json:async()=>({models:[{name:'test:8b',digest:'fixture-digest'}]})};
 calls.push(JSON.parse(opts.body));if(fail)return {ok:false,status:429};
 const prompt=calls.at(-1).messages.at(-1).content,c=cases.find(c=>prompt.includes('Case ID: '+c.id+'\n'));
 assert.ok(c,'request uses a known case');return {ok:true,text:async()=>JSON.stringify(raw(c))};
};}
test('panel defaults to preview, caps requests and rejects unsafe configuration',()=>{
 assert.equal(parsePanelArgs([]).execute,false);assert.equal(parsePanelArgs([]).maxRequests,1);assert.equal(parsePanelArgs(['--chapter','all']).chapter,'all');
 for(const args of [['--max-requests','0'],['--chapter','13'],['--phase','fake'],['--execute','--dry-run']])assert.throws(()=>parsePanelArgs(args));
 assert.doesNotThrow(()=>validateConfig(config));
 for(const r of [{id:'../escape',provider:'ollama',model:'x'},{id:'r',provider:'ollama',model:'x',endpoint:'https://attacker.invalid'},{id:'r',provider:'gemini',model:'x',apiKeyEnv:'KEY',endpoint:'https://attacker.invalid'}])assert.throws(()=>validateConfig({...config,reviewers:[r]}));
 assert.throws(()=>validateConfig({...config,reviewers:[config.reviewers[0],config.reviewers[0]]}));
});
test('blind prompts ignore supplied keys, references and peer reviews',()=>{
 const blind=cases.find(c=>c.kind==='blind'),text=makePrompt(blind,[{notes:'SECRET-REFERENCE'}],{answer:'SECRET-OWN-KEY'},[{answer:'SECRET-PEER'}]);assert.ok(!text.includes('SECRET-'));assert.ok(!text.includes('accepted'));assert.ok(!text.includes('explanation'));
 const audit=cases.find(c=>c.kind==='exercise');assert.ok(makePrompt(audit,[],{summary:'OWN-ATTEMPT'}).includes('OWN-ATTEMPT'));
});
test('strict model response checks reject truncation, invented coverage and duplicate answers',()=>{
 const c=cases.find(c=>c.kind==='blind');assert.equal(checkModelResponse('ollama',raw(c),c).executionStatus,'completed');
 assert.equal(checkModelResponse('ollama',{...raw(c),done_reason:'length'},c).executionStatus,'truncated');assert.equal(checkModelResponse('gemini',{candidates:[{finishReason:'MAX_TOKENS'}]},c).executionStatus,'truncated');
 for(const alter of [r=>r.answers.push(r.answers[0]),r=>r.coverage[0].itemId='invented',r=>r.scientificVerification=true]){const r=response(c);alter(r);assert.equal(checkModelResponse('ollama',{done:true,message:{content:JSON.stringify(r)}},c).executionStatus,'invalid-response');}
 const google={candidates:[{finishReason:'STOP',content:{parts:[{thought:true,text:'PRIVATE THOUGHT'},{text:JSON.stringify(response(c))}]}}]};assert.equal(checkModelResponse('gemini',google,c).executionStatus,'completed');
});
test('Gemini key stays in a header and provider errors do not echo response bodies',async()=>{
 const reviewer={id:'cloud',provider:'gemini',model:'test-model',apiKeyEnv:'TEST_KEY'},spec=requestSpec(reviewer,config,'original content',{TEST_KEY:'secret-fixture'});
 assert.equal(spec.headers['x-goog-api-key'],'secret-fixture');assert.ok(!spec.url.includes('secret-fixture'));assert.ok(!JSON.stringify(spec.body).includes('secret-fixture'));assert.throws(()=>requestSpec(reviewer,config,'x',{}));
 await assert.rejects(invokeReviewer(reviewer,config,'x',{env:{TEST_KEY:'secret-fixture'},fetchImpl:async()=>({ok:false,status:429,text:async()=>{throw Error('Body must not be read');}})}),/HTTP 429/);
});
test('dry run makes no requests and writes no review results',async t=>{
 const dir=fixture(t),r=await runPanel(['--config','panel.json'],{projectRoot:dir,fetchImpl:()=>{throw Error('network forbidden');}});assert.equal(r.plan.dryRun,true);assert.equal(r.plan.primaryRequestsForFullCoverage,cases.length);assert.ok(!fs.existsSync(path.join(dir,'review/results')));
});
test('partial run saves raw outputs and resume audit never issues blind requests',async t=>{
 const dir=fixture(t),calls=[],opts={projectRoot:dir,fetchImpl:provider(calls)};
 const first=await runPanel(['--config','panel.json','--execute'],opts);assert.equal(calls.length,1);assert.equal(first.summary.status,'partial');assert.equal(first.summary.scientificVerification,false);
 const second=await runPanel(['--config','panel.json','--execute','--resume','--phase','audit'],opts);assert.equal(calls.length,2);assert.ok(calls[1].messages.at(-1).content.includes('Audit all keys'));assert.equal(second.out,first.out);assert.equal(second.summary.chapters[0].completed,2);assert.equal(second.summary.chapters[0].challengeStatus,'not-requested');
});
test('HTTP failure stops new calls and reports partial results without scientific approval',async t=>{
 const dir=fixture(t),calls=[],r=await runPanel(['--config','panel.json','--execute','--max-requests','10'],{projectRoot:dir,fetchImpl:provider(calls,{fail:true})});assert.equal(calls.length,1);assert.equal(r.summary.status,'partial');assert.equal(r.summary.chapters[0].completed,0);assert.ok(r.summary.chapters[0].queue.some(x=>x.reason==='missing-or-failed-review'));
});
test('stale or tampered packet is rejected before network or output',async t=>{
 const dir=fixture(t),file=path.join(dir,'review/packets/chapter-01/cases.json'),packet=readJSON(file);packet.cases[0].payload.id='modified';fs.writeFileSync(file,JSON.stringify(packet));await assert.rejects(runPanel(['--config','panel.json','--execute'],{projectRoot:dir,fetchImpl:()=>{throw Error('must not call');}}),/Stale or modified/);
});
test('full synthetic run records challenge status and leaves disagreements unresolved',async t=>{
 const dir=fixture(t),calls=[],r=await runPanel(['--config','panel.json','--execute','--max-requests','1000'],{projectRoot:dir,fetchImpl:provider(calls)}),s=r.summary.chapters[0];assert.equal(s.status,'model-coverage-complete');assert.equal(s.challengeStatus,'completed');assert.ok(s.challenges.length>0);assert.ok(s.queue.length>0);assert.equal(s.scientificVerification,false);assert.equal(s.humanExpertSignoff,'pending');
 const resumed=[];await runPanel(['--config','panel.json','--execute','--resume','--phase','challenge','--max-requests','1000'],{projectRoot:dir,fetchImpl:provider(resumed)});assert.equal(resumed.length,0);
});
test('summary retains source gaps, uncertainty and limited independence even for matching reviewers',()=>{
 const c=cases.find(c=>c.kind==='blind'),r={reviewer:'local',caseId:c.id,phase:'blind',executionStatus:'completed',review:response(c),keyComparisons:[{encodedKeyComparison:'differs-from-encoded-key'}]},s=summarizeChapter(ch,[c],[r],config.reviewers,[]);assert.equal(s.status,'model-coverage-complete');assert.match(s.independence,/single-model/);assert.ok(s.queue.some(x=>x.reason==='blind-key-disagreement-or-unparsed'));assert.ok(s.modelDeclaredUncertainItems>0);
});
test('request budget cannot mark an unfinished challenge pass complete',async t=>{
 const dir=fixture(t),calls=[],r=await runPanel(['--config','panel.json','--execute','--max-requests',String(cases.length)],{projectRoot:dir,fetchImpl:provider(calls)});assert.equal(r.summary.chapters[0].status,'model-coverage-complete');assert.equal(r.summary.chapters[0].challengeStatus,'partial');assert.equal(r.summary.status,'partial');assert.equal(calls.length,cases.length);
});
test('context rejection makes no inference request and never truncates a case',async t=>{
 const dir=fixture(t);fs.writeFileSync(path.join(dir,'panel.json'),JSON.stringify({...config,contextTokens:4096,maxOutputTokens:4000}));const calls=[],r=await runPanel(['--config','panel.json','--execute'],{projectRoot:dir,fetchImpl:provider(calls)});assert.equal(calls.length,0);assert.equal(r.summary.status,'partial');assert.ok(r.summary.chapters[0].entries.every(e=>e.reviewers[0].status==='context-rejected'));
});
test('Ollama streaming retains fragments, terminal metadata and explicit thinking setting',async()=>{
 const c=cases.find(c=>c.kind==='blind'),text=JSON.stringify({...response(c),summary:'Chemical glyphs: α, β, −, Δ'}),frames=[{model:'test:8b',done:false,message:{content:text.slice(0,20)}},{model:'test:8b',done:false,message:{content:text.slice(20)}},{model:'test:8b',done:true,done_reason:'stop',eval_count:123,message:{content:''}}],wire=frames.map(x=>JSON.stringify(x)).join('\n')+'\n';
 const spec=requestSpec({...config.reviewers[0],think:false},config,'blind prompt');assert.equal(spec.body.stream,true);assert.equal(spec.body.think,false);
 const decoded=decodeProviderBody('ollama',wire);assert.equal(decoded.message.content,text);assert.equal(decoded.eval_count,123);assert.equal(decoded.streamFrames.length,3);assert.equal(checkModelResponse('ollama',decoded,c).executionStatus,'completed');
 assert.equal(checkModelResponse('ollama',decodeProviderBody('ollama',frames.slice(0,2).map(x=>JSON.stringify(x)).join('\n')),c).executionStatus,'incomplete');
 assert.throws(()=>decodeProviderBody('ollama',wire+'{broken'),/malformed/);assert.throws(()=>decodeProviderBody('ollama',wire+JSON.stringify(frames[0])),/after completion/);
 const data=new TextEncoder().encode(wire),split=Buffer.from(data).indexOf(Buffer.from('α'))+1;const result=await invokeReviewer(config.reviewers[0],config,'x',{fetchImpl:async()=>({ok:true,body:(async function*(){yield data.slice(0,split);yield data.slice(split);})()})});assert.equal(result.message.content,text);
 assert.throws(()=>validateConfig({...config,reviewers:[{...config.reviewers[0],think:'false'}]}));
});
test('interrupted Ollama stream preserves partial text without certifying it',async()=>{
 try{await invokeReviewer(config.reviewers[0],config,'x',{fetchImpl:async()=>({ok:true,body:(async function*(){yield new TextEncoder().encode('{"done":false}\n');throw Error('socket closed');})()})});assert.fail('must reject incomplete transport');}catch(error){assert.match(error.message,/stream\/timeout/);assert.equal(error.partialResponseText,'{"done":false}\n');}
});
