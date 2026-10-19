# Progress

2026-10-19: Inspected both reference apps and supplied EPUB table of contents; initialized repository. The entries below record completed chapter checkpoints.

- Chapter 1 complete: 6 lessons, 12 guided workshops, 34 stages. Schema, graph/formula/reference checks and Playwright desktop/mobile/offline checks passed. Corrected reference inaccuracies; independent expert review remains pending.
- Engine, strict answer validation, versioned persistence, progress backup, accessible graphs, Pages build and offline build implemented.

- Chapter 2 complete: 5 lessons, 5 workshops, 15 stages. Schema, graph/formula, unit/integration and Playwright desktop/mobile/offline checks passed.

- Chapter 3 complete: 3 lessons, 3 workshops, 9 stages. Draft 2020-12 schema, unit/integration, graph/formula, and chapter Playwright desktop/mobile/offline checks passed.

- Chapter 4 complete: 5 lessons, 5 workshops, 15 stages. Draft 2020-12 schema, unit/integration, graph/formula, and chapter Playwright desktop/mobile/offline checks passed.

- Chapter 5 complete: 4 lessons, 4 workshops, 12 stages. Draft 2020-12 schema, unit/integration, graph/formula, and chapter Playwright desktop/mobile/offline checks passed.

- Chapter 6 complete: 4 lessons, 4 workshops, 12 stages. Draft 2020-12 schema, unit/integration, graph/formula, and chapter Playwright desktop/mobile/offline checks passed.

- Chapter 7 complete: 4 lessons, 4 workshops, 12 stages. Draft 2020-12 schema, unit/integration, graph/formula, and chapter Playwright desktop/mobile/offline checks passed.

- Chapter 8 complete: 4 lessons, 4 workshops, 12 stages. Draft 2020-12 schema, unit/integration, graph/formula, and chapter Playwright desktop/mobile/offline checks passed.

- Chapter 9 complete: 3 lessons, 3 workshops, 9 stages. Draft 2020-12 schema, unit/integration, graph/formula, and chapter Playwright desktop/mobile/offline checks passed.

- Chapter 10 complete: 4 lessons, 4 workshops, 12 stages. Draft 2020-12 schema, unit/integration, graph/formula, and chapter Playwright desktop/mobile/offline checks passed.

- Chapter 11 complete: 4 lessons, 4 workshops, 12 stages. Draft 2020-12 schema, unit/integration, graph/formula, and chapter Playwright desktop/mobile/offline checks passed.

- Chapter 12 complete: 4 lessons, 4 workshops, 12 stages. Draft 2020-12 schema, unit/integration, graph/formula, and chapter Playwright desktop/mobile/offline checks passed.

## Final project status — 2026-10-19

- Complete: reusable engine; 12 chapter JSON files; 50 lessons; 56 workshops; 166 guided stages; 68 molecular graphs.
- Complete: GitHub Pages-compatible dist/ plus deployment workflow; self-contained offline HTML; documented authoring schemas; progress export/import.
- Passed: 13 JSON schema validations, 16 unit/integration groups, the full 12-chapter Playwright suite, and 12 final regression groups. Results are in artifacts/test-results.json; per-chapter records remain available.
- Mobile checks: all 50 concepts at 320/375/768 px; touch-friendly alternative atom controls; keyboard controls, reduced motion, and dark mode verified. Desktop/mobile and representative Fischer/Newman screenshots visually inspected.
- Offline checks: downloaded file executes and validates answers with the network disabled; file-to-file Save App works. Progress backup round-trip, reset, corrupt/blocked storage, and assisted-study accounting passed.
- Chapter checkpoints are committed separately. FINAL_REPORT.md and CHEMISTRY_REVIEW.md contain completion evidence, scientific-review status, assumptions, and external follow-ups.
- No unfinished chapter or software blocker remains. Independent chemistry expert sign-off, Safari/Firefox testing, screen-reader user testing, and deployment to a user-selected GitHub remote remain outside completed verification/deployment.

## Local PowerShell test setup repair

- Reproduced the missing Playwright module in a shell without NODE_PATH. Earlier automated runs used Codex's bundled package through NODE_PATH, which was not present in the user's PowerShell session.
- Added tests/playwright-runtime.mjs, shared by both browser runners. It prefers a project installation, then detects the existing Codex runtime under the user's home directory. Missing installations receive actionable setup instructions.
- Updated README.md and AGENTS.md. The application build and chemistry content are unchanged.
- Verified without NODE_PATH: full 12-chapter browser suite passed; all 12 final regression groups passed.

## Chapter review packages for local Llama and AI Studio

- Added 267 content-review cases across 12 chapters, with separate blind exercise solving, keyed exercise audits, lesson audits, molecular audits, and curriculum mapping.
- Generated 24 uploadable chapter PDFs: one blind exercise file and one full content/rendering review file per chapter. Full packets embed all original app teaching material, graph data, keys/hints/explanations, and actual rendered evidence. No textbook passages or figures are embedded.
- Captured 769 screenshots covering every lesson step, embedded challenge, guided-stage molecule/question/feedback state, completed workshop, and representative desktop/mobile/theme samples. Capture accepted encoded keys and rejected incorrect inputs; this remains an implementation check.
- Added a PowerShell Ollama runner with local-only requests, source freshness checks, context budgeting, structured response validation, explicit partial/truncated/error status, encoded-key comparison, resume signatures, and preserved raw results. No model response executes commands or edits curriculum.
- Validation: 8 audit infrastructure tests and 16 existing unit/integration tests passed; 13 schema documents passed; all 12 packet integrity checks passed. All 24 PDFs passed extracted-text coverage checks; 90 sample pages rendered through Poppler, with contact sheets and representative pages visually inspected. Pagination was repaired to keep stage prompts/options together.
- Real Ollama pilot: one blind case and one keyed case completed. The model made chemistry mistakes, recorded in review-results/SMOKE-TEST-NOTES.md; no chapter is marked independently verified. The full 267-case AI review has not been run and no files have been uploaded to AI Studio.
- Start with review-packets/START-HERE.md and review-packets/INDEX.md.

## Chapter 2 external-review revisions

- Adjudicated all six findings from the user's pasted audit against local chapter source and renderer behavior; decisions are in docs/CHAPTER_02_REVIEW_ADJUDICATION.md. No wrong key was established among the original 15 stages.
- Added specific/observed optical rotation with dimensionally explicit units and cm-to-dm conversion, enantiomeric-mixture calculations with new numbers, chiral resolution, strain/conformational detail, and relative/absolute-configuration caveats.
- Expanded explicit correct stereochemical aliases while retaining rejection of opposite descriptors and malformed names. Added the second-sphere ethyl carbon to highlights. Rotated Fischer drawings by 180 degrees to put C1 at the top, preserving S; active challenges were already unhighlighted and are now explicitly tested.
- Replaced the achiral-butene ee question with a structure-linked achirality question under new workshop ID ez-chirality, so old progress does not silently certify the changed workshop.
- Current totals: 51 lessons, 59 workshops, 175 stages; Chapter 2 has 6 lessons, 8 workshops and 24 stages. Regenerated both app builds and Chapter 2 PDFs/data/screenshots. Review packages now contain 274 model cases and 803 current screenshot records.
- Passed: 28 test groups across application, Chapter 2 revision and audit tests; 13 schema documents; full 12-chapter Playwright run; all 12 regression groups; packet integrity checks for all chapters. Revised PDF text and sampled visual rendering checked, including Fischer and optical exercises.
- Chapter 2 external report remains model evidence, not expert certification. Full independent chemistry review remains pending.

## Chapter 2 second-review checkpoint

- Preserved and inspected all eight completed local llama3.1:8b blind records (24 stages). Recorded 13 key matches and 11 disagreements, plus incorrect reasoning attached to some matching answers; no key was changed to follow the model. Detailed adjudication: docs/CHAPTER_02_FOLLOWUP_REVIEW.md.
- Addressed contradictory Fischer wording, hidden-index prose, Newman answer captions, the printed Z spoiler, two explicit parenthesized aliases, stage-to-molecule mismatch, and common PDF font glyphs. Added reusable stage molecule overrides with reference validation and blind-graph support.
- Open: the chair walkthrough still needs an actual chair/axial/equatorial visualization; the earlier Chapter 1 audit remains pending. Neither model review constitutes expert chemistry sign-off.
- Passed: 28 Node test groups, 13 schema documents, all 12 chapters in the full browser suite, and 13 regression groups covering offline/persistence/mobile behavior plus the new concealment, replacement graph and expanded optical cards. Repaired test assertions that initially read collapsed content or toggled an already-open card.
- Refreshed all 24 PDFs and all 12 source snapshots/captures. Packet integrity passed for 274 cases and 803 screenshot records. PDF extracted-text coverage and 90 sampled Poppler page renders passed; eight contact sheets, Chapter 2 printed subscripts/units, and mobile optical/transfer screenshots visually inspected. App counts remain 51 lessons, 59 workshops, 175 stages and 68 molecular graphs.
- Historical Llama source hashes remain intact. Resume will rerun stale cases; no automatic or additional model inference was started.

## Chapter 3 candidate-review implementation

- Adjudicated all seven submitted findings in docs/CHAPTER_03_REVIEW_ADJUDICATION.md. Re-derived all nine original answers; no original key changed. Corrected the acetamide question, distinguished charge-free composition from ionic charge, clarified atomic versus molecular models, and expanded node/energy/bond-strength coverage.
- Added reusable atomic-filling diagrams with accessible occupancy text, hydrogen-bearing labels on ethene/ethyne, net charge beside revealed ionic formulas, and wider multi-character atom highlights. Element text gains a transparent click target while the visible letter badge stays separate.
- Quantum practice now has six stages, invalidating previous three-stage completion while preserving earlier decisions. Current app totals: 51 lessons, 59 workshops, 178 stages, 68 molecular graphs.
- npm test, chapter checks, and the Pages build now include application review tests and audit-infrastructure tests. Current Node suite has 34 passing groups (26 application/review plus 8 audit); all 13 schema documents and the final full 12-chapter browser suite passed. Final regression and packet evidence are recorded below after execution.
- No external model was run and no files were uploaded. The existing untracked expert-review runner/results were preserved. Expert chemistry sign-off remains pending, as do the earlier Chapter 1 candidate audit and Chapter 2 chair visualization.

- Final runtime verification passed: all 14 regression groups, including direct NH2 text clicks, keyboard deselection, expanded orbital/cards/source disclosures, explicit acetate charge, mobile layouts and offline/persistence paths. All 12 regenerated packets passed provenance/integrity checks (274 cases, 814 screenshots, 24 PDFs). No extra model inference or upload was performed.
- Final PDF QA passed: 24 extracted-text coverage records and 90 sampled Poppler renders. Eight contact sheets and four detailed Chapter 3 pages visually inspected; the four final detail renders are identical to the inspected versions. Mobile orbital/card/source, amide and acetate screenshots also inspected. Chapter 3 upload PDFs are 5 blind pages and 34 full-review pages.
