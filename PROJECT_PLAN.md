# Orgo Field Notes project plan

## Architecture

For future biology, physics and other educational apps, use docs/MULTI_SUBJECT_REVIEW_PLAN.md and review/templates/. They define reusable review procedures and prompts; they do not make the current Orgo engine/runner subject-neutral. Preserve this project's curriculum and tests while future subject adapters are designed and piloted.

- dev/src/molecules.js: reusable accessible SVG molecular graph renderer.
- dev/src/animations.js: animation preference and reduced-motion handling.
- dev/src/learn.js and dev/src/practice.js: data-driven learning modes.
- dev/src/validation.js: exact atom sets, controlled text aliases, finite numeric validation.
- dev/src/progress.js: versioned, bounded browser-local persistence.
- dev/src/diagrams.js: reusable schematic teaching diagrams.
- dev/chapters/chapter-NN.json: original lessons, cards, multistage exercises, provenance.
- dev/chapters/molecules.json: graph repository shared across chapters.
- dev/schema/: documented JSON Schema and authoring conventions.
- dev/scripts/build.mjs: dependency-free GitHub Pages and single-file offline builds.
- testing/tests/: unit/integration and Playwright browser coverage; Python jsonschema validation.

## Sequence

1. Extract and correct Chapter 1; preserve v5 styles and learning interactions.
2. Follow supplied Kaplan chapter headings for Chapters 2–12; original explanations and exercises.
3. Validate each chapter, run unit/integration/browser tests, update review log, commit.
4. Check all chapters, offline export, mobile, keyboard, dark mode, reduced motion, corrupt storage, answer concealment, and progress recovery.

## Scope and limits

GitHub Pages-compatible files are requested; no remote repository or deployment destination was supplied. Deliver local builds and deployment instructions. Textbook assets stay excluded from builds and Git. Chemistry review is source-backed author review plus automated structural consistency; a separate expert review remains a distinct activity.

## Completion status

- Engine extraction and Chapter 1 migration: complete.
- Chapters 2–12 authoring and chapter checks: complete.
- Twelve meaningful chapter commits: complete.
- Both local builds and GitHub Pages deployment workflow: complete.
- Final all-chapter regression, accessibility spot checks, chemistry review log, and completion report: complete.

## Remaining external work

- Independent chemistry expert sign-off has not been performed.
- GitHub Pages deployment requires a destination repository and Pages activation; no remote was supplied.
- Browser tests cover Chromium on this Windows host; Safari/Firefox and assistive-technology user testing are outside the completed validation.

## Follow-up review checkpoint

- Chapter 2 second-review decisions: docs/CHAPTER_02_FOLLOWUP_REVIEW.md. Eight local Llama blind responses preserved and assessed; model agreement is not sign-off.
- Added reusable stage molecule overrides and Guided Practice Newman answer concealment; refreshed the common PDF font.
- Outstanding visual teaching improvement: real chair/axial/equatorial drawings for the cyclohexane walkthrough.
- The earlier Chapter 1 candidate audit remains pending adjudication; do not treat its geometry concerns as resolved by the Chapter 2 changes.

## Chapter 3 review checkpoint

- Implemented all accepted corrections and documented qualified/rejected interpretations in docs/CHAPTER_03_REVIEW_ADJUDICATION.md.
- Added reusable atomic-filling schematics, revealed formula net-charge labels, clear two-carbon groups, and wider group highlights. Graph indices and composition metadata remain stable.
- Extended quantum practice to six stages; current app total is 178 stages. Prior three-stage completion is no longer counted as completion of the expanded workshop.
- Shared renderer changes require refreshed review packets for all chapters. Chapter 1 audit adjudication and a true Chapter 2 chair diagram remain outstanding.

## Chapter 4 review checkpoint

- Adjudicated all eleven reported findings: docs/CHAPTER_04_REVIEW_ADJUDICATION.md. Five lessons/five workshops/15 stages retained; an alpha-hydrogen walkthrough and challenge were appended.
- Added symbol-font fallback and unsupported-glyph failure, labeled acid-speciation species/range, clarified hypothetical equilibrium data and stereochemical transfer, aligned focus colors, and preserved valid graph/formula metadata.
- Shared changes require refreshed app builds and all review packets. Earlier Chapter 1 audit, true Chapter 2 chair visualization and external expert sign-off remain open.

## Chapters 5 and 6 candidate-review checkpoint

Adjudication and source limitations are documented in review/docs/CHAPTER_05_REVIEW_ADJUDICATION.md and docs/CHAPTER_06_REVIEW_ADJUDICATION.md. Chapter 5 keeps all 12 original keys; Chapter 6 keeps 11 original tasks and replaces one unrelated task with an actual cyanohydrin bond selection under a new workshop ID. Added explicit aliases, stage product graphs, labeled completion formulas, traditional/broad acetal terminology, named reagents with conditions, physical-property/naming coverage, corrected focus/coordinates, readable active/disabled controls, and shared electron-flow clearance. No new learning mode or graph repository entries were added. Independent expert chemistry sign-off, earlier Chapter 1 audit and Chapter 2 chair rendering remain outstanding. Test and packet results are recorded in PROGRESS.md after execution.

## Chapters 7–9 candidate-audit follow-up

See review/docs/CHAPTER_07_REVIEW_ADJUDICATION.md, review/docs/CHAPTER_08_REVIEW_ADJUDICATION.md and docs/CHAPTER_09_REVIEW_ADJUDICATION.md. All 33 original stage keys retained; explicit aliases expanded. Added a carbon-charged enolate contributor with visible carbon charge, bond-aware number badges, corrected carbonyl/soap/intermediate layouts, better task context/highlights, product display and condition-qualified curriculum coverage. Prior shared dark/arrow fixes were rechecked rather than undone. App now has 69 molecular graphs; lessons/workshops/stages remain 51/59/178. Numerical pKa examples were checked against the actual cited source. Source overgeneralizations on conjugation, racemization and imine/enamine relationships were not adopted. Test/packet results are recorded in PROGRESS.md after execution. Earlier Chapter 1 adjudication, actual Chapter 2 chair drawing and independent expert science sign-off remain open.

## Chapters 10–12 candidate-audit follow-up

See review/docs/CHAPTER_10_REVIEW_ADJUDICATION.md, review/docs/CHAPTER_11_REVIEW_ADJUDICATION.md and review/docs/CHAPTER_12_REVIEW_ADJUDICATION.md for every finding and scientific qualification. Original 36 keys retained, exact aliases expanded; new Gabriel workshop adds three stages. Combined spectroscopy task uses a new ID and conceals the candidate graph in active practice and blind inputs. Added phthalimide anion/propanal graphs, tracked synthesis colors, explicit pI precision, phosphate display notation with canonical composition preserved, qualified buffering, full chapter titles/Lesson numbering, clear badges, spectrum multiplets/broad bands, matched IR steps, labeled TLC spots and independent calculation context. Counts: 51 lessons, 60 workshops, 181 stages, 71 molecular graphs. Runtime/PDF checks and commits remain recorded in PROGRESS.md after execution. Earlier Chapter 1 audit, actual Chapter 2 chair visualization, independent expert science sign-off, Safari/Firefox and accessibility certification remain outstanding.

## Automated model-review panel

Implemented Ollama/Gemini requests with blind-first isolation, capped execution, strict response validation, source/config/model provenance, resume, adversarial challenge calls and unresolved-evidence queues. See review/docs/AUTOMATED_CHEMISTRY_REVIEW.md for existing-account manual reviews and PowerShell automation. The legacy expert runner copied keys and falsely asserted scientific verification; originals are preserved locally and explicitly disqualified. Live model pilots, source-backed adjudication and actual human expert sign-off remain outstanding. No consumer subscription grants API access through this runner, and no model ranking has been established on the chemistry cases. Existing application/curriculum and packet content are unchanged.

A subsequent four-request Qwen/Llama Chapter 1 blind pilot is complete (review/docs/CHAPTER_01_LOCAL_MODEL_PILOT.md). Qwen installation/default configuration and streaming transport now work locally. Qwen matched more keys here but produced incorrect chemical reasoning; no broad model ranking or chemistry sign-off is established. Further dev/chapters/case types, a live Gemini pilot, source-backed adjudication and human expert review remain outstanding. No curriculum or UI change followed from this pilot.

## Separated project layout

Implemented dev/ for canonical app/content/schema/authoring, testing/ for automated tests/helpers/software evidence, and review/ for scientific review scripts/config/packets/results/templates/docs. project-layout.json documents reusable subject/folder metadata; project-layout.mjs resolves contained paths. Updated runtime build/test/review/CI/documentation commands and verified both release builds, all current software suites and unchanged scientific evidence. See docs/PROJECT_STRUCTURE.md and PROGRESS.md for details.

The subject initializer now previews a new project under the existing MCAT parent and refuses existing book directories. Biology/Physics folder creation was tested in temporary locations only. Actual subject curriculum, scientific schemas/adapters and applications still require separate implementation using the supplied books; no completed biology/physics app is claimed. No source book directory was moved. The old Orgo scientific follow-ups remain open.
