# Orgo Field Notes

A reusable MCAT organic chemistry studio with **12 chapters, 50 lessons, 56 guided workshops, 166 stages, and 68 molecular graphs**. The only study modes are **Learn & Explore** and **Guided Practice**.

## Open the application

- Double-click **Orgo-Field-Notes-offline.html**. It contains all CSS, code, chapter content, and molecules and works without a network connection.
- For local website preview, run `node scripts/serve.mjs` and open `http://127.0.0.1:4173`.
- For GitHub Pages, upload this repository, enable **Settings → Pages → Source: GitHub Actions**, and use the included workflow. Only `dist/` is published. No remote repository or deployment was created during this build.

The app stores chapter position, completed stages, assistance status, solved workshops, theme, and animation preference in browser-local storage. **Export progress** and **Import progress** transfer a backup between browsers or between the website and offline file. File-origin storage behavior varies by browser. Hints and revealed solutions count as assisted study, not independent solves.

## Build and test

Runtime: a modern browser. Build: Node.js 20 or newer. Browser tests: Playwright 1.62.1 and Chromium/Chrome/Edge. Schema tests: Python with jsonschema 4.26.0.

```text
npm install
npx playwright install chromium
python -m pip install -r requirements-dev.txt
node scripts/build.mjs
python scripts/validate_schema.py
node --test tests/unit.test.mjs
node tests/browser.mjs
node tests/regression.mjs
```

If Playwright is supplied by a shared runtime, set `NODE_PATH` to that runtime's `node_modules` directory instead of installing it. The test runner also recognizes standard Windows Chrome/Edge installations. Test scripts start and stop their own server on port 4173; do not run them concurrently or while the development server is using that port. `CHAPTER=6` limits the browser suite to Chapter 6; in PowerShell use `$env:CHAPTER='6'`.

`node scripts/check-chapter.mjs 6` runs schema, unit/integration, build, and chapter browser checks in sequence, stops on failure, then appends the passed checkpoint to the logs. Git commits are separate explicit checkpoints.

## Content and engine

- `chapters/chapter-01.json` through `chapter-12.json`: canonical lessons, teaching cards, exercises, keys, and references.
- `chapters/molecules.json`: shared graph repository with explicit coordinates, bonds, formulas, charges, and review notes.
- `schema/README.md`: chapter authoring contract and schema documentation.
- `src/`: reusable rendering, animations, learning, practice, validation, persistence, and schematic diagrams.
- `dist/`: static website and downloadable single-file app. Rebuild after editing source/content.
- `artifacts/`: machine-readable chapter, full-suite, and regression results.
- `FINAL_REPORT.md`, `CHEMISTRY_REVIEW.md`, `PROGRESS.md`: completion, review limits, and checkpoints.

The `scripts/author-NN.mjs` files preserve the original authoring process. JSON is the canonical editable content; rerunning an author script replaces its chapter with that draft. `scripts/finalize-content.mjs` records later content refinements. The reference migration script is one-time scaffolding and should not be rerun during routine development.

## Review limits

Chemistry is original educational material following the supplied Kaplan outline, with source-backed author review. It has **not received independent expert sign-off**. Passing graph/formula and browser tests is not proof of chemical correctness. Spectra, TLC behavior, and speciation widgets are explicitly labeled illustrations or models. Answer concealment is a teaching feature, not security: all answer keys are included in the offline app and inspectable in its source.

Textbook assets are excluded from Git and builds. The original two reference HTML files are preserved for comparison. No textbook quotes, numbered exercise reproductions, or page-specific citation claims are added to the new lessons.
