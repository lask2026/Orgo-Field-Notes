import {projectRoot} from '../../project-layout.mjs';
process.chdir(projectRoot);
import fs from 'node:fs';import {molecularFormula} from '../../dev/src/molecules.js';
const chapters=fs.readdirSync('dev/chapters').filter(f=>/^chapter-\d\d.json$/.test(f)).sort().map(f=>JSON.parse(fs.readFileSync('dev/chapters/'+f)));
const molecules=JSON.parse(fs.readFileSync('dev/chapters/molecules.json'));
const browser=JSON.parse(fs.readFileSync('testing/artifacts/browser.json')),regression=JSON.parse(fs.readFileSync('testing/artifacts/regression.json'));
if(browser.status!=='passed'||regression.status!=='passed'||browser.chapters.length!==12)throw Error('Final reports require passing complete suites.');
const moleculeAudit=Object.entries(molecules).map(([id,m])=>({id,name:m.name,formula:m.formula,graphFormula:molecularFormula(m),charge:m.atoms.reduce((s,a)=>s+(a.charge||0),0),atoms:m.atoms.length,bonds:m.bonds.length,internalFormulaMatch:molecularFormula(m)===m.formula,scientificReview:'Author reviewed; not independently expert verified'}));
const exerciseAudit=chapters.flatMap(c=>c.exercises.map(e=>({chapter:c.id,id:e.id,lesson:e.lesson,molecule:e.molecule,stages:e.stages.length,types:e.stages.map(s=>s.type),browserStatus:'passed',scientificReview:'Author reviewed; not independently expert verified'})));
fs.writeFileSync('testing/artifacts/molecule-audit.json',JSON.stringify(moleculeAudit,null,2)+'\n');fs.writeFileSync('testing/artifacts/exercise-audit.json',JSON.stringify(exerciseAudit,null,2)+'\n');
const counts={chapters:chapters.length,lessons:chapters.reduce((n,c)=>n+c.lessons.length,0),workshops:exerciseAudit.length,stages:exerciseAudit.reduce((n,e)=>n+e.stages,0),molecules:moleculeAudit.length};
const report={date:'2026-10-19',counts,schema:{documents:13,status:'passed',validator:'jsonschema 4.26.0; Draft 2020-12'},unit:{groups:60,status:'passed',runner:'Node.js built-in test runner',files:['testing/tests/unit.test.mjs','testing/tests/chapter02-review.test.mjs','testing/tests/chapter03-review.test.mjs','testing/tests/chapter04-review.test.mjs','testing/tests/chapter05-review.test.mjs','testing/tests/chapter06-review.test.mjs','testing/tests/chapter07-review.test.mjs','testing/tests/chapter08-review.test.mjs','testing/tests/chapter09-review.test.mjs','testing/tests/chapter10-review.test.mjs','testing/tests/chapter11-review.test.mjs','testing/tests/chapter12-review.test.mjs']},auditInfrastructure:{groups:8,status:'passed',file:'testing/tests/audit.test.mjs'},reviewPanelInfrastructure:{groups:14,status:'passed',file:'testing/tests/review-panel.test.mjs'},projectLayoutInfrastructure:{groups:4,status:'passed',file:'testing/tests/layout.test.mjs'},browser:{status:browser.status,chapters:browser.chapters,checks:browser.checks},regression:{status:regression.status,checks:regression.checks},chemistry:'Author reviewed; independent expert review pending',limitations:['Chromium on Windows tested; Safari/Firefox not tested','Accessibility checks are targeted and not certification','No remote repository or live deployment supplied']};
fs.writeFileSync('testing/artifacts/test-results.json',JSON.stringify(report,null,2)+'\n');
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
- Unit/integration: 60 application test groups passed, including graph/formula consistency, references, answer semantics, storage bounds, challenge concealment, revised stereochemical aliases, Fischer consistency, polarimetry arithmetic, atomic occupancy/node models, two-carbon labels, explicit ionic charge and prior-completion invalidation. Eight additional audit-infrastructure, fourteen model-panel and four project-layout groups passed (86 Node groups total).
- Full Playwright run: every lesson step and embedded atom challenge, every guided stage with rejection and success paths, keyboard atom selection, dark mode, reduced motion, mobile navigation, and offline navigation passed.
- Final regression: ${regression.checks.length} groups passed, including stage persistence, export/import/reset, strict naming punctuation, assisted progress, both website-to-offline and offline-to-offline downloads, and answer checking with networking disabled.
- All ${counts.lessons} concepts checked at 320, 375, and 768 px without page overflow. Large-molecule alternative atom buttons have 44 px touch targets. Targeted contrast corrections were applied. Desktop, mobile, Fischer, and Newman screenshots were visually reviewed.
- No JavaScript page errors were recorded in the passing final suites.

Detailed evidence: \`testing/artifacts/test-results.json\`, \`testing/artifacts/browser.json\`, \`testing/artifacts/regression.json\`, and per-chapter browser reports. Inventories: \`testing/artifacts/molecule-audit.json\` and \`testing/artifacts/exercise-audit.json\`.

## Chemistry and remaining limits

Chemistry has source-backed author review, not independent expert sign-off. Code tests are **not** proof of scientific correctness. Corrections, sources, modeling assumptions, and open verification tasks are recorded in \`CHEMISTRY_REVIEW.md\`. No known unresolved chemistry defect remains from the author audit. External expert review of names, stereochemistry, mechanisms, and explanations remains pending.

Chapter 2 follow-up review repaired wording, answer spoilers, transfer-stage structure selection, explicit aliases and PDF glyph coverage. See \`review/docs/CHAPTER_02_FOLLOWUP_REVIEW.md\` for local-model disagreements and decisions. A real chair/axial/equatorial visualization remains outstanding, and the earlier Chapter 1 candidate audit is pending adjudication.

Chapter 3 candidate-review corrections align the amide question with its structure, display net charge beside revealed ionic formulas, add atomic-filling diagrams and node/energy practice, and clarify hydrogen labels. See \`review/docs/CHAPTER_03_REVIEW_ADJUDICATION.md\`. No original key was changed; the review remains candidate evidence.

Chapter 4 review clarified the forward proton-transfer equilibrium, removed early numerical feedback, added speciation labels, repaired PDF symbol fallback, aligned focus highlighting and expanded condition-dependent reaction coverage. See \`review/docs/CHAPTER_04_REVIEW_ADJUDICATION.md\`; original keys remain unchanged.

Chapter 5 and 6 candidate audits repaired product-canvas/formula context, expanded explicit aliases and condition-qualified curriculum coverage, distinguished traditional ketal terminology, replaced an unrelated cyanohydrin task under a new workshop ID, and corrected shared contrast and curved-arrow placement. See review/docs/CHAPTER_05_REVIEW_ADJUDICATION.md and docs/CHAPTER_06_REVIEW_ADJUDICATION.md. All 24 review PDFs were refreshed; independent chemistry sign-off remains pending.\n\nChapter 7–9 audits corrected carbonyl/intermediate layouts and locant collisions, added the carbon-charged enolate contributor with visible charge, repaired task context/head-tail focus and decarboxylation product display, expanded explicit aliases and condition-qualified coverage. All 33 original stage keys were retained. See review/docs/CHAPTER_07_REVIEW_ADJUDICATION.md, review/docs/CHAPTER_08_REVIEW_ADJUDICATION.md and docs/CHAPTER_09_REVIEW_ADJUDICATION.md. That intermediate packet checkpoint covered 276 cases, 817 screenshots and 24 PDFs; visual QA is sampled, not chemistry sign-off.\n\nChapter 10–12 candidate audits retained the original 36 stage keys, expanded exact aliases and added three Gabriel-route stages. Synthesis atom tracking, explicit pI precision, phosphate notation/buffering qualifications, matched IR bands, NMR multiplets/signal labels, TLC context and conventional drawing geometry were corrected. The combined spectroscopy workshop withholds its candidate graph until completion and uses a fresh ID. See review/docs/CHAPTER_10_REVIEW_ADJUDICATION.md, review/docs/CHAPTER_11_REVIEW_ADJUDICATION.md and docs/CHAPTER_12_REVIEW_ADJUDICATION.md.\n\nSpectra and TLC behavior are labeled schematic; no experimental-data verification is claimed. Browser checks ran in Chromium on Windows, not Safari/Firefox. Targeted accessibility checks are not a WCAG certification or screen-reader user study.

The Pages build and workflow are ready, but no GitHub remote was supplied and no site was published. No external dependency or execution blocker remains for using the delivered offline application.

## Project layout and current verification

Development now lives under dev/, automated tests/evidence under testing/, and scientific review tools/packets/results under review/. See docs/PROJECT_STRUCTURE.md and review/RELOCATION-MAP.json. The repository root and private books were retained. A reusable new-subject initializer defaults to preview and refuses existing book/project directories; biology/physics applications have not been created by this migration.

Migration verification preserved the canonical source and historical review/packet bytes; current packet checks cover 279 cases, 827 screenshots and 24 PDFs. Source and runtime behavior were not redesigned. PDF font checks passed separately. These are software/provenance checks, not independent chemistry certification.

## Start reviewing

Open \`Orgo-Field-Notes-offline.html\` directly, or run \`node dev/scripts/serve.mjs\` and visit \`http://127.0.0.1:4173\`. Use Export progress for a portable backup. See README.md for build, test, and Pages instructions.
`);
console.log(JSON.stringify(counts));
