import fs from 'node:fs';import path from 'node:path';
import {root,readJSON,hash,casePrompt,systemPrompt,reviewSchema,validateReview,sourceSnapshot,compareBlindAnswers} from './cases.mjs';
process.chdir(root);
export function parseArgs(args){const o={chapter:2,model:'llama3.1:8b',mode:'all',limit:0,resume:false,context:8192,maxOutput:2048,timeout:300,endpoint:'http://127.0.0.1:11434',dryRun:false};
 const keys={'--chapter':'chapter','--model':'model','--mode':'mode','--limit':'limit','--context':'context','--max-output':'maxOutput','--timeout':'timeout','--endpoint':'endpoint'};
 for(let i=0;i<args.length;i++){if(args[i]==='--resume'){o.resume=true;continue;}if(args[i]==='--dry-run'){o.dryRun=true;continue;}if(!keys[args[i]]||args[i+1]===undefined)throw Error('Unknown or missing argument '+args[i]);const k=keys[args[i]];o[k]=['chapter','limit','context','maxOutput','timeout'].includes(k)?Number(args[++i]):args[++i];}
 if(!Number.isInteger(o.chapter)||o.chapter<1||o.chapter>12)throw Error('Chapter must be 1–12');
 if(!['all','blind','audit'].includes(o.mode))throw Error('Mode must be all, blind, or audit');
 for(const k of ['limit','context','maxOutput','timeout'])if(!Number.isInteger(o[k])||o[k]<(k==='limit'?0:1))throw Error('Invalid '+k);
 const u=new URL(o.endpoint);if(!['localhost','127.0.0.1','[::1]'].includes(u.hostname)||u.protocol!=='http:'||u.username||u.password)throw Error('Only a local loopback HTTP Ollama endpoint is accepted.');
 o.endpoint=u.origin;return o;
}
export function inspectResponse(response,c){
 if(response.done!==true)return {executionStatus:'incomplete'};
 if(response.done_reason==='length')return {executionStatus:'truncated'};
 try{const review=JSON.parse(response.message?.content||''),validationErrors=validateReview(review,c);return {executionStatus:validationErrors.length?'invalid-response':'completed',review,validationErrors};}
 catch(e){return {executionStatus:'invalid-response',validationErrors:[e.message]};}
}
export async function main(args){
 const o=parseArgs(args),dir=`review-packets/chapter-${String(o.chapter).padStart(2,'0')}`;
 if(!fs.existsSync(`${dir}/cases.json`))throw Error('Missing packet. Run node scripts/audit/build-packets.mjs --chapter '+o.chapter+' --text-only');
 const packet=readJSON(`${dir}/cases.json`),ch=readJSON(`chapters/chapter-${String(o.chapter).padStart(2,'0')}.json`),molecules=readJSON('chapters/molecules.json');
 if(packet.sourceSnapshot.sha256!==sourceSnapshot(ch,molecules).sha256)throw Error('Packet is stale. Regenerate it before review.');
 const selected=packet.cases.filter(c=>o.mode==='all'||(o.mode==='blind'?c.kind==='blind':c.kind!=='blind')),cases=o.limit?selected.slice(0,o.limit):selected;
 if(o.dryRun){console.log(JSON.stringify({dryRun:true,chapter:o.chapter,model:o.model,selected:cases.length,availableInMode:selected.length,caseIds:cases.map(c=>c.id),scientificVerification:false},null,2));return;}
 async function request(route,body,timeout=10000){let response;try{response=await fetch(o.endpoint+route,{...(body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(timeout)});}catch(e){throw Error(`Cannot reach local Ollama at ${o.endpoint}, or the request timed out. Start Ollama, confirm ollama list, and retry. ${e.message}`);}if(!response.ok)throw Error(`Ollama ${response.status}: ${(await response.text()).slice(0,500)}`);return response.json();}
 const tags=await request('/api/tags'),tag=tags.models?.find(m=>m.name===o.model||m.model===o.model);if(!tag)throw Error(`Model ${o.model} is not installed. Install it with ollama pull ${o.model}, then retry. No model was downloaded automatically.`);
 const slug=o.model.replace(/[^a-zA-Z0-9_.-]/g,'_'),out=`review-results/llama/chapter-${String(o.chapter).padStart(2,'0')}/${slug}`;fs.mkdirSync(out,{recursive:true});
 const records=[],known=new Map(),settings={model:o.model,modelDigest:tag.digest,context:o.context,maxOutput:o.maxOutput,temperature:0,sourceSha:packet.sourceSnapshot.sha256};
 for(const c of cases){
  const filename=`${out}/${c.id.replace(/[^a-zA-Z0-9_.-]/g,'_')}.json`;
  const prior=known.get(c.dependsOn);let blindResult=prior?.executionStatus==='completed'?prior.review:undefined;
  if(c.dependsOn&&!blindResult){const saved=`${out}/${c.dependsOn.replace(/[^a-zA-Z0-9_.-]/g,'_')}.json`;if(fs.existsSync(saved)){const r=readJSON(saved);if(r.executionStatus==='completed'&&r.settings.sourceSha===settings.sourceSha&&r.settings.modelDigest===settings.modelDigest)blindResult=r.review;}}
  const prompt=casePrompt(c,blindResult),signature=hash({settings,systemPrompt,prompt}),started=new Date().toISOString();
  if(o.resume&&fs.existsSync(filename)){const old=readJSON(filename);if(old.signature===signature&&old.executionStatus==='completed'){console.log('RESUME '+c.id);records.push(old);known.set(c.id,old);continue;}}
  const record={caseId:c.id,kind:c.kind,started,settings,signature,executionStatus:'pending',scientificVerification:false,hasIndependentAttempt:!!blindResult};
  console.log(`REVIEW ${c.id} (${records.length+1}/${cases.length})`);
  try{
   // Conservative UTF-8 byte budget avoids silently sending oversized chapters.
   const estimated=Math.ceil(Buffer.byteLength(systemPrompt+prompt)/2)+o.maxOutput+256;if(estimated>o.context)throw Error(`Estimated context budget ${estimated} exceeds ${o.context}. Retry with --context 16384 or reduce case size; nothing was silently truncated.`);
   const response=await request('/api/chat',{model:o.model,messages:[{role:'system',content:systemPrompt},{role:'user',content:prompt}],format:reviewSchema,stream:false,options:{temperature:0,num_ctx:o.context,num_predict:o.maxOutput}},o.timeout*1000);
   record.rawResponse=response;record.completed=new Date().toISOString();
   Object.assign(record,inspectResponse(response,c));
   if(c.kind==='blind'&&record.executionStatus==='completed')record.keyComparisons=compareBlindAnswers(record.review,ch.exercises.find(e=>e.id===c.payload.id));
  }catch(e){record.executionStatus='error';record.error=e.message;}
  if(fs.existsSync(filename)){const history=`${out}/history`;fs.mkdirSync(history,{recursive:true});const prior=fs.readFileSync(filename);fs.writeFileSync(`${history}/${path.basename(filename,'.json')}-${hash(prior).slice(0,16)}.json`,prior);}
  fs.writeFileSync(filename,JSON.stringify(record,null,2)+'\n');records.push(record);known.set(c.id,record);console.log('  '+record.executionStatus);
  // Stop on transport/setup problems, preserving prior work. Invalid model output
  // is recorded and remaining cases can still run.
  if(record.executionStatus==='error'){console.error(record.error);break;}
 }
 const summary={chapter:o.chapter,model:o.model,modelDigest:tag.digest,sourceSha:settings.sourceSha,requestedMode:o.mode,availableInMode:selected.length,requestedThisRun:cases.length,attempted:records.length,completed:records.filter(r=>r.executionStatus==='completed').length,executionStatus:records.length===selected.length&&records.every(r=>r.executionStatus==='completed')?'completed-for-selected-mode':'partial',scientificVerification:false,keyComparisons:records.flatMap(r=>r.keyComparisons||[]),findings:records.flatMap(r=>r.executionStatus==='completed'?r.review.findings.map(f=>({caseId:r.caseId,...f})):[]),cases:records.map(r=>({caseId:r.caseId,status:r.executionStatus,coverage:r.review?.coverage||[]}))};
 fs.writeFileSync(`${out}/summary-${o.mode}.json`,JSON.stringify(summary,null,2)+'\n');console.log(`Saved ${summary.completed}/${selected.length} completed cases in ${out}. Findings remain unverified.`);
 if(records.some(r=>r.executionStatus!=='completed'))process.exitCode=1;
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(import.meta.filename))main(process.argv.slice(2)).catch(e=>{console.error(e.message);process.exitCode=1;});
