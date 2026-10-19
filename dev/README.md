# Development

`src/` is the reusable application engine and styling. `chapters/` is the canonical editable curriculum and molecule repository. `schema/` documents and validates the content contract. `scripts/` contains builds, the local server and historical authoring/revision utilities. `references/` preserves the two approved reference HTML applications; they are not release assets.

Run commands from the project root:

```powershell
npm run build
npm run dev
```

Build/serve entry points also resolve the project root when invoked from another directory. Generated website files stay in root `dist/`; root `Orgo-Field-Notes-offline.html` remains the convenient standalone application.

Do not rerun historical author/revision scripts as routine maintenance: they can replace canonical JSON with an earlier draft. Edit canonical content, update relevant assessments/IDs and validate it. Keep the locally supplied `organic_chemistry_kaplan/` outside Git/builds; it remains at its original project-root location. No sibling MCAT book directory has been moved.
