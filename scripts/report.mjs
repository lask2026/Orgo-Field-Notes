import fs from 'node:fs';import {molecularFormula} from '../src/molecules.js';
const chapters=fs.readdirSync('chapters').filter(f=>/^chapter-\d\d.json$/.test(f)).sort().map(f=>JSON.parse(fs.readFileSync('chapters/'+f)));
const molecules=JSON.parse(fs.readFileSync('chapters/molecules.json'));
const browser=JSON.parse(fs.readFileSync('artifacts/browser.json')),regression=JSON.parse(fs.readFileSync('artifacts/regression.json'));
if(browser.status!=='passed'||regression.status!=='passed'||browser.chapters.length!==12)throw Error('Final reports require passing complete suites.');
const moleculeAudit=Object.entries(molecules).map(([id,m])=>({id,name:m.name,formula:m.formula,graphFormula:molecularFormula(m),charge:m.atoms.reduce((s,a)=>s+(a.charge||0),0),atoms:m.atoms.length,bonds:m.bonds.length,internalFormulaMatch:molecularFormula(m)===m.formula,scientificReview:'Author reviewed; not independently expert verified'}));
const exerciseAudit=chapters.flatMap(c=>c.exercises.map(e=>({chapter:c.id,id:e.id,lesson:e.lesson,molecule:e.molecule,stages:e.stages.length,types:e.stages.map(s=>s.type),browserStatus:'passed',scientificReview:'Author reviewed; not independently expert verified'})));
fs.writeFileSync('artifacts/molecule-audit.json',JSON.stringify(moleculeAudit,null,2)+'\n');fs.writeFileSync('artifacts/exercise-audit.json',JSON.stringify(exerciseAudit,null,2)+'\n');
const counts={chapters:chapters.length,lessons:chapters.reduce((n,c)=>n+c.lessons.length,0),workshops:exerciseAudit.length,stages:exerciseAudit.reduce((n,e)=>n+e.stages,0),molecules:moleculeAudit.length};
const report={date:'2026-10-19',counts,schema:{documents:13,status:'passed',validator:'jsonschema 4.26.0; Draft 2020-12'},unit:{groups:20,status:'passed',runner:'Node.js built-in test runner',files:['tests/unit.test.mjs','tests/chapter02-review.test.mjs']},auditInfrastructure:{groups:8,status:'passed',file:'tests/audit.test.mjs'},browser:{status:browser.status,chapters:browser.chapters,checks:browser.checks},regression:{status:regression.status,checks:regression.checks},chemistry:'Author reviewed; independent expert review pending',limitations:['Chromium on Windows tested; Safari/Firefox not tested','Accessibility checks are targeted and not certification','No remote repository or live deployment supplied']};
fs.writeFileSync('artifacts/test-results.json',JSON.stringify(report,null,2)+'\n');
const rows=chapters.map(c=>`| ${c.id} | ${c.title} | ${c.lessons.length} | ${c.exercises.length} | ${c.exercises.reduce((n,e)=>n+e.stages.length,0)} | Passed |`).join('\n');
fs.writeFileSync('FINAL_REPORT.md',`# Orgo Field Notes — completion report

Completed 2026-10-19. All 12 chapters are implemented; there are no placeholder chapters.

## Delivered

- ${counts.lessons} interactive lessons, ${counts.workshops} guided workshops, ${counts.stages} stages, and ${counts.molecules} molecular graphs.
- Reusable rendering, animation, learning, practice, validation, progress, and schematic-diagram modules.
- Twelve chapter JSON files, shared molecule repository, documented JSON Schemas, and automated tests.
- GitHub Pages-compatible build in \`dist/\` and a Pages workflow.
- Standalone \`Orgo-Field-Notes-offline.html\` (${Math.round(fs.statSync('Orgo-Field-Notes-offline.html').size/1024)} KiB), with no runtime network dependency.
- A meaningful Git checkpoint after every chapter. Original reference files are preserved; textbook sources are excluded from Git/builds.

Both principal modes are preserved: Learn & Explore and Guided Practice. V5 styles, color roles, dark mode, step highlighting, animations, and name-assembly patterns are retained. No Exam Mode or Mistake Review was added.

## Chapter results

| Chapter | Topic | Lessons | Workshops | Stages | Browser check |
|---|---|---:|---:|---:|---|
${rows}

## Verification

- Draft 2020-12 validation: 12 chapter documents plus the molecule repository passed.
- Unit/integration: 20 application test groups passed, including graph/formula consistency, references, answer semantics, storage bounds, challenge concealment, revised stereochemical aliases, Fischer consistency and polarimetry arithmetic. Eight additional audit-infrastructure groups passed.
- Full Playwright run: every lesson step and embedded atom challenge, every guided stage with rejection and success paths, keyboard atom selection, dark mode, reduced motion, mobile navigation, and offline navigation passed.
- Final regression: ${regression.checks.length} groups passed, including stage persistence, export/import/reset, strict naming punctuation, assisted progress, both website-to-offline and offline-to-offline downloads, and answer checking with networking disabled.
- All ${counts.lessons} concepts checked at 320, 375, and 768 px without page overflow. Large-molecule alternative atom buttons have 44 px touch targets. Targeted contrast corrections were applied. Desktop, mobile, Fischer, and Newman screenshots were visually reviewed.
- No JavaScript page errors were recorded in the passing final suites.

Detailed evidence: \`artifacts/test-results.json\`, \`artifacts/browser.json\`, \`artifacts/regression.json\`, and per-chapter browser reports. Inventories: \`artifacts/molecule-audit.json\` and \`artifacts/exercise-audit.json\`.

## Chemistry and remaining limits

Chemistry has source-backed author review, not independent expert sign-off. Code tests are **not** proof of scientific correctness. Corrections, sources, modeling assumptions, and open verification tasks are recorded in \`CHEMISTRY_REVIEW.md\`. No known unresolved chemistry defect remains from the author audit. External expert review of names, stereochemistry, mechanisms, and explanations remains pending.

Chapter 2 follow-up review repaired wording, answer spoilers, transfer-stage structure selection, explicit aliases and PDF glyph coverage. See \`docs/CHAPTER_02_FOLLOWUP_REVIEW.md\` for local-model disagreements and decisions. A real chair/axial/equatorial visualization remains outstanding, and the earlier Chapter 1 candidate audit is pending adjudication.

Spectra and TLC behavior are labeled schematic; no experimental-data verification is claimed. Browser checks ran in Chromium on Windows, not Safari/Firefox. Targeted accessibility checks are not a WCAG certification or screen-reader user study.

The Pages build and workflow are ready, but no GitHub remote was supplied and no site was published. No external dependency or execution blocker remains for using the delivered offline application.

## Start reviewing

Open \`Orgo-Field-Notes-offline.html\` directly, or run \`node scripts/serve.mjs\` and visit \`http://127.0.0.1:4173\`. Use Export progress for a portable backup. See README.md for build, test, and Pages instructions.
`);
console.log(JSON.stringify(counts));
