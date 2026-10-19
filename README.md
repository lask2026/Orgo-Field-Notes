# Orgo Field Notes

A reusable MCAT organic chemistry studio with **12 chapters, 51 lessons, 60 guided workshops, 181 stages, and 71 molecular graphs**. The only study modes are **Learn & Explore** and **Guided Practice**.

For applying the development/review process to biology, physics and other subjects, see [the reusable multi-subject plan](docs/MULTI_SUBJECT_REVIEW_PLAN.md) and the prompts/rubrics in [review/templates/](review/templates). These are a workflow and templates; the existing application and automated runner still use Orgo-specific data.

## Open the application

The project now separates [development](dev/README.md), [testing](testing/README.md) and [scientific review](review/README.md). See [the folder layout and new-subject starter](docs/PROJECT_STRUCTURE.md). Existing npm entry points remain available from this project root.

- Double-click **Orgo-Field-Notes-offline.html**. It contains all CSS, code, chapter content, and molecules and works without a network connection.
- For local website preview, run `node dev/scripts/serve.mjs` and open `http://127.0.0.1:4173`.
- For GitHub Pages, upload this repository, enable **Settings → Pages → Source: GitHub Actions**, and use the included workflow. Only `dist/` is published. No remote repository or deployment was created during this build.

The app stores chapter position, completed stages, assistance status, solved workshops, theme, and animation preference in browser-local storage. **Export progress** and **Import progress** transfer a backup between browsers or between the website and offline file. File-origin storage behavior varies by browser. Hints and revealed solutions count as assisted study, not independent solves.

## Visual notes and graph inspection

Lesson cards offer compact numbered panels and expandable full notes using the same canonical chapter text. Learn & Explore includes inline and fullscreen graph rotation; completed workshops inspect their final displayed graph. Active Guided Practice and atom-selection challenges retain their original 2D canvas.

The viewer is an offline **illustrative projection with arbitrary depth offsets**. It does not determine physical conformations, stereochemistry, bond angles or distances. Atom letters match the 2D graph; names/formulas stay concealed until revealed. Keyboard-operable sliders rotate and tilt the view, and Escape closes fullscreen inspection. No PubChem lookup, network request or chemistry-verification badge is added.

## Build and test

Runtime: a modern browser. Build: Node.js 20 or newer. Browser tests: Playwright 1.62.1 and Chromium/Chrome/Edge. Schema tests: Python with jsonschema 4.26.0.

```text
npm install
npx playwright install chromium
python -m pip install -r testing/requirements.txt
node dev/scripts/build.mjs
python testing/scripts/validate_schema.py
npm test
node testing/tests/browser.mjs
node testing/tests/regression.mjs
```

The test runners first use a project-installed Playwright (or one already available through `NODE_PATH`). On this machine they can also automatically use the installed Codex runtime under your user home directory, without setting environment variables. On another machine, use the installation commands above. If no installation is available, the tests print setup instructions. The test runner also recognizes standard Windows Chrome/Edge installations. Test scripts start and stop their own server on port 4173; do not run them concurrently or while the development server is using that port. `CHAPTER=6` limits the browser suite to Chapter 6; in PowerShell use `$env:CHAPTER='6'`.

`node testing/scripts/check-chapter.mjs 6` runs schema, unit/integration, build, and chapter browser checks in sequence, stops on failure, then appends the passed checkpoint to the logs. Git commits are separate explicit checkpoints.

## Independent content review packages

See [review/packets/START-HERE.md](review/packets/START-HERE.md) for chapter-by-chapter AI Studio PDF uploads and a local PowerShell Llama runner. Each chapter has a blind exercise PDF and a full content/rendering PDF. The packages include original app content and actual UI screenshots; they do not include textbook body passages. No files are uploaded automatically. Model output remains a candidate review requiring adjudication.

## Content and engine

- `dev/chapters/chapter-01.json` through `chapter-12.json`: canonical lessons, teaching cards, exercises, keys, and references.
- `dev/chapters/molecules.json`: shared graph repository with explicit coordinates, bonds, formulas, charges, and review notes.
- `dev/schema/README.md`: chapter authoring contract and schema documentation.
- `dev/src/`: reusable rendering, animations, learning, practice, validation, persistence, and schematic diagrams.
- `dist/`: static website and downloadable single-file app. Rebuild after editing source/content.
- `testing/artifacts/`: machine-readable chapter, full-suite, and regression results.
- `FINAL_REPORT.md`, `CHEMISTRY_REVIEW.md`, `PROGRESS.md`: completion, review limits, and checkpoints.

The `dev/scripts/author-NN.mjs` files preserve the original authoring process. JSON is the canonical editable content; rerunning an author script replaces its chapter with that draft. `dev/scripts/finalize-content.mjs` records later content refinements. The reference migration script is one-time scaffolding and should not be rerun during routine development.

The subsequent Chapter 2 review and corrections are documented in `review/docs/CHAPTER_02_REVIEW_ADJUDICATION.md`; `dev/scripts/revise-chapter-02-review.mjs` records that one-time revision. The current chapter JSON and regenerated review PDFs contain the updated material.

## Review limits

For unattended Ollama/Gemini API candidate reviews, see [the automated review guide](review/docs/AUTOMATED_CHEMISTRY_REVIEW.md). The PowerShell wrapper defaults to a no-request preview; execution is explicitly bounded and resumable. Existing AI Studio/ChatGPT chapter-PDF reviews remain a manual option using your current accounts. Neither workflow supplies human expert sign-off. The legacy `review/results/expert/` output was generated by copying keys and must not be treated as independent evidence.

Chemistry is original educational material following the supplied Kaplan outline, with source-backed author review. It has **not received independent expert sign-off**. Passing graph/formula and browser tests is not proof of chemical correctness. Spectra, TLC behavior, and speciation widgets are explicitly labeled illustrations or models. Answer concealment is a teaching feature, not security: all answer keys are included in the offline app and inspectable in its source.

Textbook assets are excluded from Git and builds. The original two reference HTML files are preserved for comparison. No textbook quotes, numbered exercise reproductions, or page-specific citation claims are added to the new lessons.
