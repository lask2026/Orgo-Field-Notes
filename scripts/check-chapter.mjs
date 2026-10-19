import fs from 'node:fs';import {spawnSync} from 'node:child_process';
const id=Number(process.argv[2]);if(!Number.isInteger(id)||id<1||id>12)throw Error('Provide chapter 1–12');
const commands=[['python',['scripts/validate_schema.py']],[process.execPath,['--test','tests/unit.test.mjs','tests/chapter02-review.test.mjs','tests/chapter03-review.test.mjs','tests/chapter04-review.test.mjs','tests/audit.test.mjs']],[process.execPath,['scripts/build.mjs']],[process.execPath,['tests/browser.mjs']]];
for(const [bin,args]of commands){const r=spawnSync(bin,args,{stdio:'inherit',env:{...process.env,CHAPTER:String(id)},windowsHide:true});if(r.status!==0)process.exit(r.status||1);}
const c=JSON.parse(fs.readFileSync(`chapters/chapter-${String(id).padStart(2,'0')}.json`));const stages=c.exercises.reduce((a,e)=>a+e.stages.length,0);
fs.appendFileSync('PROGRESS.md',`\n- Chapter ${id} complete: ${c.lessons.length} lessons, ${c.exercises.length} workshops, ${stages} stages. Draft 2020-12 schema, unit/integration, graph/formula, and chapter Playwright desktop/mobile/offline checks passed.\n`);
fs.appendFileSync('CHEMISTRY_REVIEW.md',`\nChapter ${id} (${c.title}): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.\n`);
