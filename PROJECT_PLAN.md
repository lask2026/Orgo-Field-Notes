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
