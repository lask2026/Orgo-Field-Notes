# Automated testing

`tests/` contains all application, browser, audit-infrastructure, layout and PDF-font tests. `scripts/` contains schema validation, test/report helpers and the one-time migration verifier. `artifacts/` contains software evidence, screenshots and preserved historical reports. Model-review packets and raw model responses belong under `review/`, not here.

From the project root:

```powershell
npm run test:schema
npm test
npm run build
npm run test:browser
npm run test:regression
npm run test:pdf
npm run audit:check
```

Browser and regression suites both start a server on port 4173: run them sequentially and stop a manual dev server first. To limit browser checks temporarily, set `$env:CHAPTER='6'`; clear it before the complete suite with `Remove-Item Env:CHAPTER`.

Install schema dependencies using `python -m pip install -r testing/requirements.txt`. PDF checks need `review/requirements.txt`; the PDF test helper uses a compatible configured/default Python or the installed Codex runtime when available. It does not install dependencies automatically. `ORGO_AUDIT_PYTHON` can select a compatible Python.

`npm run report` summarizes completed current checks; it does not run them. Follow AGENTS.md and run it only after current schema/Node/full browser/regression checks pass. Historical per-chapter reports do not substitute for a fresh complete suite.

The one-time `node testing/scripts/verify-layout-migration.mjs` uses a locally preserved pre-move inventory to check byte preservation. It is intentionally not part of permanent tests: legitimate future content edits must not be blocked by a historical migration hash. Preserved scientific/model evidence may contain historical paths; resolve them using `review/RELOCATION-MAP.json`.
