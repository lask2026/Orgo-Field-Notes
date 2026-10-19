import fs from 'node:fs';
import path from 'node:path';
import {root,readJSON,hash,sourceSnapshot,buildCases,casePrompt,systemPrompt,reviewSchema,validateReview,compareBlindAnswers} from './cases.mjs';

export const PANEL_VERSION=1;
export const panelSystem=systemPrompt+' You are one independent MODEL reviewer, not a credentialed human expert. Re-derive before comparing. Do not infer correctness from author confidence. Supplied reference notes are human-curated assertions, not retrieved passages. Cite their IDs when used; distinguish unverified source claims from derivations. Never claim to have browsed, executed the application, or obtained human expert sign-off.';
const safeId=/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/;
const strictKeys=(o,allowed,label)=>{for(const k of Object.keys(o))if(!allowed.includes(k))throw Error(`Unknown ${label} field: ${k}`);};
export function parsePanelArgs(args){
  const o={config:'review-config/panel.local.json',chapter:'1',phase:'all',execute:false,resume:false,maxRequests:1};
  const fields={'--config':'config','--chapter':'chapter','--phase':'phase','--max-requests':'maxRequests'};
  for(let i=0;i<args.length;i++){const a=args[i];if(a==='--execute'){o.execute=true;continue;}if(a==='--resume'){o.resume=true;continue;}if(a==='--dry-run'){continue;}if(!fields[a]||args[i+1]===undefined)throw Error('Unknown or missing argument '+a);o[fields[a]]=args[++i];}
  if(o.chapter!=='all'&&(!/^\d+$/.test(o.chapter)||+o.chapter<1||+o.chapter>12))throw Error('Chapter must be 1–12 or all');
  if(!['all','blind','audit','challenge'].includes(o.phase))throw Error('Phase must be all, blind, audit, or challenge');
  o.maxRequests=Number(o.maxRequests);if(!Number.isInteger(o.maxRequests)||o.maxRequests<1||o.maxRequests>10000)throw Error('max-requests must be 1–10000');
  if(args.includes('--dry-run')&&o.execute)throw Error('Choose dry-run or execute');return o;
}
export function validateConfig(c){
  if(!c||typeof c!=='object'||Array.isArray(c))throw Error('Expected panel config object');
  strictKeys(c,['version','reviewers','challengeReviewer','referenceFile','contextTokens','maxOutputTokens','timeoutSeconds'],'config');
  if(c.version!==1||!Array.isArray(c.reviewers)||c.reviewers.length<1||c.reviewers.length>4)throw Error('Configure 1–4 reviewers, version 1');
  for(const [k,lo,hi] of [['contextTokens',4096,1000000],['maxOutputTokens',256,32768],['timeoutSeconds',1,3600]])if(!Number.isInteger(c[k])||c[k]<lo||c[k]>hi)throw Error('Invalid '+k);
  if(c.maxOutputTokens>=c.contextTokens)throw Error('Output must be smaller than context budget');
  const ids=new Set();for(const r of c.reviewers){
    strictKeys(r,['id','provider','model','endpoint','apiKeyEnv','think'],'reviewer');
    if(!safeId.test(r.id)||ids.has(r.id))throw Error('Reviewer IDs must be unique safe names');ids.add(r.id);
    if(!['ollama','gemini'].includes(r.provider)||typeof r.model!=='string'||!r.model||r.model.length>150||!/^[\w.:-]+$/.test(r.model)||r.model.includes('CHOOSE'))throw Error('Choose an explicit valid model for '+r.id);
    if(r.provider==='ollama'){
      const u=new URL(r.endpoint||'http://127.0.0.1:11434');if(u.protocol!=='http:'||!['127.0.0.1','localhost','[::1]'].includes(u.hostname)||u.username||u.password||u.search||u.hash||u.pathname!=='/')throw Error('Ollama endpoint must be loopback HTTP origin');
      if(r.apiKeyEnv)throw Error('Ollama does not use an API key here');
      if(r.think!==undefined&&typeof r.think!=='boolean')throw Error('Ollama think must be boolean when specified');
    }else if(r.think!==undefined||r.endpoint||!/^[A-Z][A-Z0-9_]{1,80}$/.test(r.apiKeyEnv||''))throw Error('Gemini uses the fixed Google endpoint and a named environment variable; think is Ollama-only');
  }
  if(c.challengeReviewer&&!ids.has(c.challengeReviewer))throw Error('challengeReviewer must name a configured reviewer');
  if(c.referenceFile!==undefined&&typeof c.referenceFile!=='string')throw Error('Invalid referenceFile');return c;
}
export function loadReferences(config,caseIds){
  if(!config.referenceFile)return [];
  const f=path.resolve(root,config.referenceFile);if(!f.startsWith(root+path.sep))throw Error('Reference notes must be inside the project');
  const data=readJSON(f);if(data.version!==1||!Array.isArray(data.references))throw Error('Invalid reference-notes file');
  strictKeys(data,['version','references'],'reference file');const seen=new Set();
  for(const r of data.references){strictKeys(r,['id','title','url','checkedOn','caseIds','notes'],'reference');
    if(!safeId.test(r.id)||seen.has(r.id))throw Error('Duplicate or invalid reference ID');seen.add(r.id);
    if(typeof r.title!=='string'||!r.title.trim()||typeof r.notes!=='string'||!r.notes.trim()||r.notes.length>12000||!/^\d{4}-\d\d-\d\d$/.test(r.checkedOn))throw Error('Reference needs title, checkedOn and bounded original notes');
    if(new URL(r.url).protocol!=='https:')throw Error('Reference needs an HTTPS source URL');
    if(!Array.isArray(r.caseIds)||!r.caseIds.length||r.caseIds.some(id=>!caseIds.has(id)||id.includes(':blind:')))throw Error('References must target known non-blind case IDs');
  }return data.references;
}
export function makePrompt(c,references=[],ownBlind,peerReviews){
  // No reference notes, keyed answers, peer reviews, or prior sessions enter blind calls.
  if(c.kind==='blind')return casePrompt(c);
  return casePrompt(c,ownBlind)+(references.length?'\nCURATED SOURCE NOTES (not fetched passages):\n'+JSON.stringify(references):'\nNo curated source evidence supplied. Derivations may be attempted; source-based claims remain unverified.')+(peerReviews?'\nADVERSARIAL CHECK: Investigate these candidate reviews and blind comparisons; agreement is not proof. Re-derive disputed claims using the original data. Return the original case ID and coverage IDs. Do not silently resolve uncertainty by voting.\n'+JSON.stringify(peerReviews):'');
}
export function checkModelResponse(provider,raw,c){
  let text,finish;
  if(provider==='gemini'){
    const candidate=raw.candidates?.[0];finish=candidate?.finishReason;
    if(finish!=='STOP')return {executionStatus:finish==='MAX_TOKENS'?'truncated':raw.promptFeedback?.blockReason?'blocked':'incomplete',finishReason:finish||raw.promptFeedback?.blockReason||'missing'};
    text=candidate.content?.parts?.filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join('');
  }else{finish=raw.done_reason;if(raw.done!==true)return {executionStatus:'incomplete'};if(finish==='length')return {executionStatus:'truncated'};text=raw.message?.content;}
  try{
    const review=JSON.parse(text);const errors=validateReview(review,c);
    strictKeys(review,reviewSchema.required,'response');
    for(const k of ['coverage','findings','answers'])if(Array.isArray(review[k]))for(const item of review[k])strictKeys(item,Object.keys(reviewSchema.properties[k].items.properties),k);
    if(c.kind==='blind'&&(review.answers.length!==c.itemIds.length||new Set(review.answers.map(a=>a.itemId)).size!==c.itemIds.length))errors.push('Duplicated or surplus blind answers');
    return {executionStatus:errors.length?'invalid-response':'completed',review,validationErrors:errors};
  }catch{return {executionStatus:'invalid-response',validationErrors:['Malformed or nonconforming model JSON']};}
}
export function requestSpec(r,config,prompt,env=process.env){
  if(r.provider==='gemini'){
    const key=env[r.apiKeyEnv];if(!key)throw Error('Missing environment variable '+r.apiKeyEnv+'; never put a key in JSON or chat');
    return {url:`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(r.model)}:generateContent`,headers:{'Content-Type':'application/json','x-goog-api-key':key},body:{systemInstruction:{parts:[{text:panelSystem}]},contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{temperature:0,maxOutputTokens:config.maxOutputTokens,responseMimeType:'application/json',responseJsonSchema:reviewSchema}}};
  }
  // Streaming supplies headers immediately instead of hitting fetch's default
  // five-minute headers timeout during a slow local generation.
  return {url:new URL(r.endpoint||'http://127.0.0.1:11434').origin+'/api/chat',headers:{'Content-Type':'application/json'},body:{model:r.model,messages:[{role:'system',content:panelSystem},{role:'user',content:prompt}],stream:true,...(r.think!==undefined?{think:r.think}:{}),format:reviewSchema,options:{temperature:0,num_ctx:config.contextTokens,num_predict:config.maxOutputTokens}}};
}
export function decodeProviderBody(provider,text){
  try{return JSON.parse(text);}catch{}
  if(provider!=='ollama')throw Error('Provider returned malformed JSON');
  let frames;try{frames=text.split(/\r?\n/).filter(x=>x.trim()).map(x=>JSON.parse(x));}catch{throw Error('Provider returned malformed streaming JSON');}
  if(!frames.length||frames.some(x=>!x||typeof x!=='object'||Array.isArray(x)||x.error))throw Error('Ollama stream failed');
  if(frames.slice(0,-1).some(x=>x.done===true))throw Error('Ollama stream contains data after completion');
  const last=frames.at(-1);
  return {...last,message:{role:'assistant',content:frames.map(x=>x.message?.content||'').join(''),thinking:frames.map(x=>x.message?.thinking||'').join('')},streamFrames:frames};
}
export async function invokeReviewer(r,config,prompt,{fetchImpl=fetch,env=process.env}={}){
  const spec=requestSpec(r,config,prompt,env);
  let response;try{response=await fetchImpl(spec.url,{method:'POST',headers:spec.headers,body:JSON.stringify(spec.body),redirect:'error',signal:AbortSignal.timeout(config.timeoutSeconds*1000)});}catch{throw Error(`Transport/timeout failure for ${r.id}; no automatic retry`);}
  // Do not log provider error bodies: these may echo supplied credentials or data.
  if(!response.ok)throw Error(`Provider HTTP ${response.status} for ${r.id}; no automatic retry`);
  let text='';const decoder=new TextDecoder();let size=0;
  try{
    if(response.body?.[Symbol.asyncIterator]){
      for await(const chunk of response.body){size+=chunk.byteLength;if(size>8000000)throw Error('Provider response exceeds 8MB retention limit');text+=decoder.decode(chunk,{stream:true});}text+=decoder.decode();
    }else{text=await response.text();if(Buffer.byteLength(text)>8000000)throw Error('Provider response exceeds 8MB retention limit');}
  }catch(error){const failure=Error(error.message==='Provider response exceeds 8MB retention limit'?error.message:`Response stream/timeout failure for ${r.id}; no automatic retry`);if(r.provider==='ollama')failure.partialResponseText=text;throw failure;}
  return decodeProviderBody(r.provider,text);
}
export function summarizeChapter(ch,cases,records,reviewers,references){
  const main=records.filter(r=>r.phase!=='challenge'),lookup=new Map(main.map(r=>[r.reviewer+':'+r.caseId,r])),queue=[];
  let completed=0,uncertain=0;const entries=cases.map(c=>{
    const rows=reviewers.map(r=>{const rec=lookup.get(r.id+':'+c.id);if(rec?.executionStatus==='completed')completed++;return {reviewer:r.id,status:rec?.executionStatus||'not-run'};});
    for(const r of reviewers){const rec=lookup.get(r.id+':'+c.id);if(!rec||rec.executionStatus!=='completed'){queue.push({caseId:c.id,reviewer:r.id,reason:'missing-or-failed-review'});continue;}
      for(const x of rec.review.coverage)if(x.status!=='reviewed'){uncertain++;queue.push({caseId:c.id,reviewer:r.id,itemId:x.itemId,reason:'model-declared-'+x.status,note:x.note});}
      for(const f of rec.review.findings)queue.push({caseId:c.id,reviewer:r.id,reason:'candidate-finding',...f,evidenceStatus:f.evidenceKind==='provided-reference'&&references.some(ref=>ref.caseIds.includes(c.id)&&f.evidence.includes(ref.id))?'cites-supplied-note-not-independently-verified':f.evidenceKind==='derivation'?'model-derivation-unverified':'source-evidence-unverified'});
      for(const k of rec.keyComparisons||[])if(k.encodedKeyComparison!=='matches-encoded-key')queue.push({caseId:c.id,reviewer:r.id,reason:'blind-key-disagreement-or-unparsed',...k});
    }
    if(c.kind==='blind')for(const itemId of c.itemIds){const answers=reviewers.map(r=>lookup.get(r.id+':'+c.id)).filter(r=>r?.executionStatus==='completed').map(r=>({reviewer:r.reviewer,answer:r.review.answers.find(a=>a.itemId===itemId)?.answer}));if(new Set(answers.map(a=>a.answer)).size>1)queue.push({caseId:c.id,itemId,reason:'reviewer-answers-differ-textually',answers,note:'Formatting differences can also differ; investigate rather than vote.'});}
    const sourceNotes=c.kind==='blind'?0:references.filter(r=>r.caseIds.includes(c.id)).length;
    if(c.kind!=='blind'&&!sourceNotes)queue.push({caseId:c.id,reason:'no-curated-source-evidence'});
    return {caseId:c.id,kind:c.kind,sourceNotes,reviewers:rows};
  });
  const identities=new Set(reviewers.map(r=>r.provider+':'+r.model));
  return {chapter:ch.id,title:ch.title,status:completed===cases.length*reviewers.length?'model-coverage-complete':'partial',completed,expected:cases.length*reviewers.length,modelDeclaredUncertainItems:uncertain,independence:identities.size>1?'separate-model-requests; independence of training/data not established':'single-model-or-repeated-model; not an independent panel',scientificVerification:false,humanExpertSignoff:'pending',entries,queue,challenges:records.filter(r=>r.phase==='challenge').map(r=>({caseId:r.caseId,status:r.executionStatus,review:r.review})),note:'Coverage is a software/model-output status, not scientific approval. All queue items require adjudication.'};
}
function writeJSON(file,data){fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=file+'.tmp';fs.writeFileSync(tmp,JSON.stringify(data,null,2)+'\n');fs.renameSync(tmp,file);}
export async function runPanel(args,{fetchImpl=fetch,env=process.env,projectRoot=root}={}){
  const o=parsePanelArgs(args),configFile=path.resolve(projectRoot,o.config);
  if(!fs.existsSync(configFile))throw Error('Missing panel config. Copy review-config/panel.ollama.example.json or panel.hybrid.example.json to review-config/panel.local.json and choose models.');
  const config=validateConfig(readJSON(configFile)),molecules=readJSON(path.join(projectRoot,'chapters/molecules.json'));
  const chapters=Array.from({length:12},(_,i)=>readJSON(path.join(projectRoot,`chapters/chapter-${String(i+1).padStart(2,'0')}.json`))).filter(c=>o.chapter==='all'||c.id===+o.chapter);
  const bundles=chapters.map(ch=>{const packet=readJSON(path.join(projectRoot,`review-packets/chapter-${String(ch.id).padStart(2,'0')}/cases.json`));if(packet.sourceSnapshot.sha256!==sourceSnapshot(ch,molecules).sha256||hash(packet.cases)!==hash(buildCases(ch,molecules).cases))throw Error('Stale or modified packet for chapter '+ch.id+'; regenerate before review');return {ch,packet};});
  const allIds=new Set(Array.from({length:12},(_,i)=>readJSON(path.join(projectRoot,`review-packets/chapter-${String(i+1).padStart(2,'0')}/cases.json`))).flatMap(p=>p.cases.map(c=>c.id)));
  const references=loadReferences(config,allIds),total=bundles.reduce((n,b)=>n+b.packet.cases.length,0)*config.reviewers.length;
  const plan={dryRun:!o.execute,chapters:chapters.map(c=>c.id),reviewers:config.reviewers,primaryRequestsForFullCoverage:total,possibleAdditionalChallenges:config.challengeReviewer?bundles.reduce((n,b)=>n+b.packet.cases.filter(c=>c.kind!=='blind').length,0):0,maxInferenceRequestsThisInvocation:o.maxRequests,phase:o.phase,curatedReferenceNotes:references.length,uploads:'Original case text and explicitly configured notes only; no textbook/PDF/screenshot uploads',scientificVerification:false,humanExpertSignoff:'pending'};
  if(!o.execute)return {plan};
  // Validate credentials before writing results or issuing paid requests.
  for(const r of config.reviewers)if(r.provider==='gemini'&&!env[r.apiKeyEnv])throw Error('Missing environment variable '+r.apiKeyEnv);
  const identities={};for(const r of config.reviewers){
    if(r.provider==='ollama'){
      let resp;try{resp=await fetchImpl(new URL(r.endpoint||'http://127.0.0.1:11434').origin+'/api/tags',{redirect:'error',signal:AbortSignal.timeout(10000)});}catch{throw Error('Cannot reach local Ollama; start it and check ollama list');}
      if(!resp.ok)throw Error('Ollama model inventory failed');const data=await resp.json(),tag=data.models?.find(m=>m.name===r.model||m.model===r.model);if(!tag?.digest)throw Error('Ollama model is not installed: '+r.model+'; no automatic download');identities[r.id]=tag.digest;
    }else identities[r.id]=r.model;
  }
  const runHash=hash({version:PANEL_VERSION,config,references,panelSystem,sources:bundles.map(b=>b.packet.sourceSnapshot.sha256),caseEngine:hash(fs.readFileSync(new URL('./cases.mjs',import.meta.url))),runner:hash(fs.readFileSync(import.meta.filename))});
  const out=path.join(projectRoot,'review-results/panel',runHash.slice(0,20));fs.mkdirSync(out,{recursive:true});
  writeJSON(path.join(out,'manifest.json'),{...plan,dryRun:false,runHash,identities,started:new Date().toISOString(),sourceHashes:bundles.map(b=>({chapter:b.ch.id,sha256:b.packet.sourceSnapshot.sha256}))});
  const ledger=new Map(),summaries=[];let requests=0,stopped=false;
  for(const {ch,packet}of bundles){
    const records=[];
    const runOne=async(c,r,phase,peers,allowRequest=true)=>{
      const refs=references.filter(ref=>ref.caseIds.includes(c.id)),ownBlind=c.dependsOn?ledger.get(ch.id+':'+r.id+':'+c.dependsOn):undefined;
      const prompt=makePrompt(c,refs,ownBlind?.executionStatus==='completed'?ownBlind.review:undefined,peers);
      const signature=hash({runHash,modelIdentity:identities[r.id],case:c,prompt,reviewer:r.id,phase}),file=path.join(out,`chapter-${String(ch.id).padStart(2,'0')}`,r.id,phase,c.id.replace(/[^\w.-]/g,'_')+'.json');
      if(o.resume&&fs.existsSync(file)){try{const old=readJSON(file),checked=checkModelResponse(r.provider,old.rawResponse||{},c);if(old.signature===signature&&old.executionStatus==='completed'&&old.scientificVerification===false&&checked.executionStatus==='completed'&&hash(old.review)===hash(checked.review)){if(c.kind==='blind')old.keyComparisons=compareBlindAnswers(checked.review,ch.exercises.find(e=>e.id===c.payload.id));records.push(old);if(phase!=='challenge')ledger.set(ch.id+':'+r.id+':'+c.id,old);return old;}}catch{}}
      if(!allowRequest||requests>=o.maxRequests||stopped)return;
      const rec={caseId:c.id,chapter:ch.id,reviewer:r.id,provider:r.provider,model:r.model,modelIdentity:identities[r.id],phase,signature,sourceSha:packet.sourceSnapshot.sha256,started:new Date().toISOString(),scientificVerification:false,humanExpertSignoff:'pending',referenceIds:refs.map(x=>x.id),hasIndependentAttempt:ownBlind?.executionStatus==='completed',executionStatus:'pending'};
      if(Math.ceil(Buffer.byteLength(panelSystem+prompt)/2)+config.maxOutputTokens+256>config.contextTokens){rec.executionStatus='context-rejected';rec.error='Conservative context estimate exceeds configured budget; nothing truncated';}
      else try{
        requests++;const raw=await invokeReviewer(r,config,prompt,{fetchImpl,env});rec.rawResponse=raw;Object.assign(rec,checkModelResponse(r.provider,raw,c));rec.reportedModelVersion=raw.modelVersion||raw.model;rec.usage=raw.usageMetadata||{inputTokens:raw.prompt_eval_count,outputTokens:raw.eval_count};
        if(c.kind==='blind'&&rec.executionStatus==='completed')rec.keyComparisons=compareBlindAnswers(rec.review,ch.exercises.find(e=>e.id===c.payload.id));
      }catch(e){rec.executionStatus='error';rec.error=e.message;if(typeof e.partialResponseText==='string')rec.partialResponseText=e.partialResponseText;stopped=true;}
      rec.finished=new Date().toISOString();if(fs.existsSync(file)){const previous=fs.readFileSync(file);writeJSON(file+'.history-'+hash(previous).slice(0,16)+'.json',JSON.parse(previous));}writeJSON(file,rec);records.push(rec);if(phase!=='challenge')ledger.set(ch.id+':'+r.id+':'+c.id,rec);console.log(`${r.id} ${phase} ${c.id}: ${rec.executionStatus}`);return rec;
    };
    // All reviewers independently solve blind cases before any keyed content is sent.
    // Audit/challenge invocations still load only matching stored blind calls through runOne.
    for(const c of packet.cases.filter(c=>c.kind==='blind'))for(const r of config.reviewers)await runOne(c,r,'blind',undefined,o.phase==='all'||o.phase==='blind');
    for(const c of packet.cases.filter(c=>c.kind!=='blind'))for(const r of config.reviewers)await runOne(c,r,'audit',undefined,o.phase==='all'||o.phase==='audit');
    const challengeCases=[];
    if(config.challengeReviewer&&(o.phase==='all'||o.phase==='challenge')){
      const reviewer=config.reviewers.find(r=>r.id===config.challengeReviewer),pre=summarizeChapter(ch,packet.cases,records,config.reviewers,references);
      for(const c of packet.cases.filter(c=>c.kind!=='blind')){
        const ids=[c.id,c.dependsOn].filter(Boolean),flagged=pre.queue.some(q=>ids.includes(q.caseId)&&['candidate-finding','blind-key-disagreement-or-unparsed','reviewer-answers-differ-textually','model-declared-uncertain','model-declared-not-reviewed'].includes(q.reason));
        const peers=records.filter(r=>r.phase!=='challenge'&&ids.includes(r.caseId));
        if(flagged&&peers.filter(r=>r.caseId===c.id&&r.executionStatus==='completed').length===config.reviewers.length){challengeCases.push(c.id);await runOne(c,reviewer,'challenge',peers.map(r=>({reviewer:r.reviewer,review:r.review,keyComparisons:r.keyComparisons})));}
      }
    }
    const summary=summarizeChapter(ch,packet.cases,records,config.reviewers,references);summary.challengeStatus=!config.challengeReviewer?'not-configured':!['all','challenge'].includes(o.phase)?'not-requested':challengeCases.some(id=>!summary.challenges.some(r=>r.caseId===id&&r.status==='completed'))?'partial':summary.status!=='model-coverage-complete'?'awaiting-primary-coverage':'completed';summary.expectedChallenges=challengeCases;writeJSON(path.join(out,`chapter-${String(ch.id).padStart(2,'0')}/summary.json`),summary);summaries.push(summary);
  }
  const summary={runHash,inferenceRequestsThisInvocation:requests,requestLimit:o.maxRequests,status:summaries.every(s=>s.status==='model-coverage-complete'&&!['partial','awaiting-primary-coverage'].includes(s.challengeStatus))?'model-coverage-complete':'partial',scientificVerification:false,humanExpertSignoff:'pending',chapters:summaries};writeJSON(path.join(out,'summary.json'),summary);
  fs.writeFileSync(path.join(out,'REPORT.md'),'# Automated chemistry model review\n\nHuman expert sign-off: pending. Scientific verification: false.\n\n'+`Status: ${summary.status}. New inference requests: ${requests}/${o.maxRequests}.\n\n`+summaries.map(s=>`## Chapter ${s.chapter}: ${s.title}\n\n${s.completed}/${s.expected} case reviews completed; ${s.queue.length} queue entries. Challenge pass: ${s.challengeStatus}. ${s.independence}. Challenge responses are in summary.json and never close findings automatically.\n\n`+s.queue.map(q=>`- ${JSON.stringify(q)}`).join('\n')).join('\n\n')+'\n');
  return {plan,out,summary};
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(import.meta.filename))runPanel(process.argv.slice(2)).then(r=>{console.log(JSON.stringify(r.summary?{out:r.out,status:r.summary.status,requests:r.summary.inferenceRequestsThisInvocation}:r.plan,null,2));if(r.summary?.status==='partial')process.exitCode=2;}).catch(e=>{console.error(e.message);process.exitCode=1;});
