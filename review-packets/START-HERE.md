# Chapter review packages

These packages let you review the same app chapter with local Llama or Google AI Studio. They contain original application material, graph data, review cases, and actual local Chromium captures. They contain no textbook body passages or textbook figures. Source links and section headings do not establish scientific correctness.

**No chapter has been independently verified just because a package exists.** Model findings need adjudication against a reliable source or a sound derivation. No files are automatically uploaded to AI Studio.

## AI Studio: two upload files per chapter, in separate passes

Start with `chapter-02/`:

The [chapter upload index](INDEX.md) links all 24 PDFs and shows their page counts and sizes. Each full packet is approximately 0.7–2.7 MiB; you upload one chapter PDF, not the entire project.

1. Open a fresh AI Studio chat and upload **01-BLIND-EXERCISES.pdf** only. Ask: “Independently solve every stage. Give its item ID, your answer, reasoning, and uncertainty. The molecular graph and task data are supplied. Do not assume missing stereochemistry or invent reference evidence.” Save the response.
2. In a separate chat, upload **02-CHAPTER-REVIEW.pdf**, paste the chapter's **AI-STUDIO-PROMPT.txt**, and optionally paste the saved independent attempt for comparison.
3. Ask for findings with exact item IDs, evidence, severity, and proposed corrections. Require a coverage checklist and an explicit list of unreviewed/uncertain items. For long packets, review the lessons first, then the exercises and molecular appendix in follow-up requests; keep an item-ID checklist so unfinished parts are not mistaken for complete review.
4. Add relevant authoritative excerpts yourself if the reviewer cannot substantiate a claim. The supplied source list is not a set of retrieved reference passages.
5. Save AI Studio output under `review-results/ai-studio/chapter-02/` and bring confirmed or suspected findings back for investigation. Model disagreement is a lead, not an automatic bug.

Repeat with chapters 01 through 12. You do not need to upload the repository, HTML application, PNG directory, or all chapters together. PDFs contain screenshot evidence and readable content. Upload one chapter at a time.

**Blind-pass limitation:** avoid giving the full packet, answer keys, or lesson material in the same chat before the independent attempt. Visible question wording and diagram captions remain available; if those reveal an answer, that is itself reviewable task design.

## Local Llama from PowerShell

Ollama must be running with your chosen model installed. This machine already has `llama3.1:8b`. The runner talks only to a loopback Ollama endpoint, does not upload anything, and never executes model-generated commands.

From `C:\AI\projects\MCAT\Orgo`, first preview the work without calling the model:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\run-llama-review.ps1 -Chapter 2 -DryRun
```

Try a short run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\run-llama-review.ps1 -Chapter 2 -Mode blind -Limit 1
```

Then review all cases for that chapter:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\run-llama-review.ps1 -Chapter 2 -Resume
```

The default mode processes blind exercise attempts first, then keyed exercise audits, lesson audits, molecule audits, and curriculum mapping. Each case is a separate request so earlier lesson keys are not in the blind-solving chat. Keyed audits can receive the previously completed independent attempt. `-Mode audit` skips blind calls; it uses a matching previously completed blind result when available and otherwise records that no independent attempt was supplied.

For all chapters sequentially, once the pilot behaves well:

```powershell
1..12 | ForEach-Object {
    powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\run-llama-review.ps1 -Chapter $_ -Resume
    if ($LASTEXITCODE -ne 0) { throw "Chapter $_ needs attention; inspect its saved results." }
}
```

There are 279 cases overall. Runtime depends on hardware and output length; this can be a lengthy run. Start with one case before attempting all chapters. No automatic model downloads or repeated retries occur.

The initial local pilot produced chemistry mistakes, including an incorrect hydrogen-bond donor selection. See [the smoke-test notes](../review-results/SMOKE-TEST-NOTES.md). Do not equate a completed response, high model confidence, or model agreement with a scientifically correct result.

Results are written to `review-results/llama/chapter-02/llama3.1_8b/` as separate case records plus `summary-all.json`, `summary-blind.json`, or `summary-audit.json`. A limited run is explicitly partial. Raw responses, model digest, source hash, settings, output-validation errors, coverage declarations, and findings are preserved. `-Resume` reuses only completed matching records; stale or failed results are retried.

When a case is retried, the previous record is archived under the model folder's `history/` directory before replacement. Summaries describe the selected invocation; inspect the case records and history for earlier attempts.

Blind answers are also compared with the app's encoded keys when their format can be parsed. Results say `matches-encoded-key`, `differs-from-encoded-key`, or `unparsed`. A match is not scientific verification; a mismatch can be a model error, ambiguous question, missing alias, or an actual app error. Inspect the derivations and source evidence before deciding.

If an output is marked `truncated`, try `-MaxOutput 4096 -Context 16384 -Resume`. If the context estimate exceeds the budget, increase `-Context` subject to your available memory. Incomplete/malformed output is not counted as a completed review. Model-declared “reviewed” status remains a model assertion, not expert sign-off. A text-only model cannot assess actual screenshot appearance, animation timing, or clicks.

## Case types

| Type | Input and purpose |
|---|---|
| Blind exercise | Questions, choices, unit, context, spatial diagram specification, and anonymous graph; no keys/hints/author molecule name/formula/answer overlays |
| Keyed exercise | Full exercise, graph, accepted aliases, tolerance, distractor feedback, hints and explanations; independent attempt when available |
| Lesson | Every teaching card, walkthrough step, diagram specification, molecule and highlight reference |
| Molecule | Derive formula/charge/name from graph, compare to author claims, flag stereochemical ambiguity |
| Curriculum | Map actual supplied section headings to lessons/exercises and identify missing or shallow coverage |

Screenshots cover every lesson step, embedded challenge, guided-stage molecule/question/correct-feedback state, and completed workshop. Each chapter also has first-concept desktop-light, mobile-light and mobile-dark layout samples. These layout samples are not exhaustive coverage of every responsive state. Animation is disabled during capture so diagrams are stable; animation timing needs a live test.

## Regenerate after app/content edits

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\build-review-packets.ps1
```

Use `-Chapter 2` to rebuild just Chapter 2. Node and Playwright are required for capture. PDF generation uses Python with `requirements-audit.txt`; on this machine the script can use the existing bundled Python libraries. On other machines run `python -m pip install -r requirements-audit.txt`. Set `ORGO_AUDIT_PYTHON` to select a different Python interpreter if needed.

For Llama cases without rebuilding PDFs/screenshots, add `-TextOnly`. That does **not** refresh existing PDFs; regenerate full packets before uploading updated content to AI Studio.

Validate the audit infrastructure with:

```powershell
node --test tests/audit.test.mjs
node scripts/audit/check-packets.mjs
```

Existing local behavioral tests remain available: `node tests/browser.mjs` and `node tests/regression.mjs`. Package capture checks the selected paths against encoded keys; it does not replace independent content review.

## Documentation

- [Ollama chat API](https://docs.ollama.com/api/chat): local structured-output requests.
- [Gemini PDF document understanding](https://ai.google.dev/gemini-api/docs/document-processing): visual and textual PDF input.

No API keys are required for the local runner. AI Studio model availability and upload constraints depend on your account and selected model.

PDF font regression checks (with requirements-audit.txt installed): `python scripts/audit/test_pdf_fonts.py`. The generator uses Segoe UI Symbol on Windows or DejaVu Sans as a fallback for chemical symbols, and fails on unsupported text glyphs. A decorative hand icon is printed as “Hands-on:” in audit text; the app retains its icon.
