# Development, testing and review layout

Orgo remains at `C:\AI\projects\MCAT\Orgo` with its existing Git history. The existing books at sibling `biology`, `physicsmath`, `biochemistry` and `genchem` directories were inspected by directory name only and were not moved or edited. The private Orgo book stays at its original location.

```text
Orgo/
├── dev/
│   ├── src/                 application engine and styles
│   ├── chapters/            canonical curriculum and scientific assets
│   ├── schema/              subject content contracts
│   ├── scripts/             build/server/authoring utilities
│   ├── references/          approved HTML references
│   └── templates/           new-subject starter documentation
├── testing/
│   ├── tests/               Node, browser, layout and PDF tests
│   ├── scripts/             schema/report/test helpers
│   ├── artifacts/           test evidence and screenshots
│   └── requirements.txt
├── review/
│   ├── scripts/             packet/export/capture/model tools
│   ├── config/              examples and ignored local settings
│   ├── packets/             upload files, chapter PDFs and visual evidence
│   ├── results/             original reviewer responses
│   ├── docs/                scientific adjudications and review guides
│   ├── templates/           reusable prompts and subject rubrics
│   ├── run-chemistry-review.ps1
│   ├── run-llama-review.ps1
│   ├── build-review-packets.ps1
│   ├── RELOCATION-MAP.json
│   └── requirements.txt
├── dist/                    deployable website and offline download
├── project-layout.json      shared directory/subject manifest
├── project-layout.mjs       project-root and contained-path resolver
├── package.json             stable npm entry points
├── Orgo-Field-Notes-offline.html
└── docs/                    project-wide design and reuse plans
```

Root README/AGENTS/PROJECT_PLAN/PROGRESS/CHEMISTRY_REVIEW/FINAL_REPORT files remain convenient entry points. `tmp/` is ignored scratch space. Deployment publishes only `dist/`.

## Daily commands

Existing npm entry points remain stable: `npm run build`, `npm run dev`, `npm test`, `npm run test:schema`, `npm run test:browser`, `npm run test:regression`, `npm run audit:build`, `npm run audit:check` and `npm run audit:panel`. Added `npm run test:layout`, `npm run test:pdf`, `npm run report` and `npm run subject:new`.

Direct legacy paths have changed. For example, `node scripts/build.mjs` becomes `node dev/scripts/build.mjs`; `node tests/browser.mjs` becomes `node testing/tests/browser.mjs`; review wrappers are now under `review/`. Do not keep a second editable source copy in the old folders. See the relocation map for every moved directory/script.

## Reusing the layout for biology and physics

The initializer defaults to a **preview** under the parent MCAT directory. It rejects existing folders, including the user's book directories; use new names such as `Biology-Field-Notes` and `Physics-Field-Notes`.

```powershell
npm run subject:new -- --name Biology-Field-Notes --subject Biology
npm run subject:new -- --name Physics-Field-Notes --subject Physics
```

After inspecting the preview, add `--create` to create that starter. No actual sibling project was created during Orgo's migration; initializer creation was tested in temporary directories only.

The starter supplies the same folder layout, root/path helper, subject metadata, README and reusable scientific-review prompts/rubrics. It copies no textbook, Orgo lesson, molecular graph or chemistry-specific test. It explicitly says `scaffold-only` and `adapter: not-implemented`: it is not a completed application or a passing science test suite.

Before implementing a new subject, inspect its actual supplied book outline, choose appropriate typed scientific assets and schemas, implement representative chapters and add meaningful local/browser/scientific-review checks. Do not force biology pathways or physics vectors into Orgo's molecule model. The neutral review transport/manifest/report contracts can be developed further without mixing each subject's canonical curriculum or evidence.

## Evidence preservation and verification

The migration inventoried files before moving them, updated live imports/CLI/Python/PowerShell/CI/documentation paths and kept historical review results as original bytes. Scientific source fingerprints retain the same logical identities and still hash the actual source/data, so untouched packets remain valid; this is not a bypass of stale-source checks. Future real content/renderer changes still require packet regeneration.

The migration evidence is `testing/artifacts/layout-migration.json`; full pre-move inventory is local at `review/results/reorganization-before.json`. Historical model records can retain former paths/signatures; `review/RELOCATION-MAP.json` provides current physical locations. Test-suite reruns and their environment are recorded in PROGRESS.md and the current software reports. Passing software checks is not independent scientific verification.
