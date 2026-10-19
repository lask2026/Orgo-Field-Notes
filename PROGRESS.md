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
