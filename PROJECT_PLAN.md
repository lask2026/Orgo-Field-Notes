# Orgo Field Notes project plan

## Architecture

- src/molecules.js: reusable accessible SVG molecular graph renderer.
- src/animations.js: animation preference and reduced-motion handling.
- src/learn.js and src/practice.js: data-driven learning modes.
- src/validation.js: exact atom sets, controlled text aliases, finite numeric validation.
- src/progress.js: versioned, bounded browser-local persistence.
- src/diagrams.js: reusable schematic teaching diagrams.
- chapters/chapter-NN.json: original lessons, cards, multistage exercises, provenance.
- chapters/molecules.json: graph repository shared across chapters.
- schema/: documented JSON Schema and authoring conventions.
- scripts/build.mjs: dependency-free GitHub Pages and single-file offline builds.
- tests/: unit/integration and Playwright browser coverage; Python jsonschema validation.

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

Adjudication and source limitations are documented in docs/CHAPTER_05_REVIEW_ADJUDICATION.md and docs/CHAPTER_06_REVIEW_ADJUDICATION.md. Chapter 5 keeps all 12 original keys; Chapter 6 keeps 11 original tasks and replaces one unrelated task with an actual cyanohydrin bond selection under a new workshop ID. Added explicit aliases, stage product graphs, labeled completion formulas, traditional/broad acetal terminology, named reagents with conditions, physical-property/naming coverage, corrected focus/coordinates, readable active/disabled controls, and shared electron-flow clearance. No new learning mode or graph repository entries were added. Independent expert chemistry sign-off, earlier Chapter 1 audit and Chapter 2 chair rendering remain outstanding. Test and packet results are recorded in PROGRESS.md after execution.
