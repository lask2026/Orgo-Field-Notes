# Reusable educational-app build and review plan

## Objective and present status

Use one repeatable process for MCAT biology, physics, organic chemistry and subsequent subjects. Reuse the review contracts, evidence formats and software checks; supply a subject-specific curriculum, visual representation and scientific rubric. Do not assume every subject has twelve chapters or that chemistry-specific atom rules apply to physics or biology.

This document and the prompts/rubrics in `review/templates/` are reusable now. The current application and `review/scripts/` runners remain Orgo-specific. A subject-neutral packet builder, adapters, report importer and AI Studio browser automation are proposed work, not completed features. Existing Orgo tests or model results do not certify another subject.

## Common application contract

Keep curriculum separate from reusable UI behavior. For Field Notes applications, retain Learn & Explore and Guided Practice; treat any future exam system as a separate product. Define each subject's actual chapter outline before writing content. Preserve original teaching language and do not distribute supplied textbook assets.

Give stable IDs to chapters, lessons, scientific assets, exercises and stages. Each stage should declare its prompt, givens, displayed asset/diagram, answer type, accepted alternatives or numeric constraints, progressive hints, feedback and explanation. Assets need a type, interpretation, provenance and review status. Distinguish a schematic, simulation, illustrative dataset and measured result. Do not force cells, circuits or free-body diagrams into a molecular-graph schema.

Keep browser behavior reusable where appropriate: navigation, theme, reduced motion, keyboard access, stage progression, answer submission, hint/reveal tracking and persistence. Change an assessment's ID/version when its substance changes so old progress cannot certify a replacement. Do not broaden normalization globally: chemical punctuation, biological name capitalization, vector signs and physical units can carry meaning.

## Four separate evidence tracks

| Track | What it establishes | What it cannot establish |
|---|---|---|
| Deterministic local tests | Schema validity, references, validation behavior, arithmetic/dimensional constraints where encoded, progress and UI behavior in the actual tested environment | Independent scientific correctness of lessons or expected answers |
| Blind model attempts | Candidate answers from only the original givens and permitted question diagrams | A ground truth, training-data independence, or expert approval |
| Keyed scientific audit | Candidate defects in teaching, graphs/diagrams, keys, hints, feedback and explanations | Independent blind solving, successful clicks, or live visual inspection from source text alone |
| Source checking and adjudication | A documented decision on each finding with derivation and inspected evidence; human reviewer identity if applicable | Blanket correctness of unreviewed material |

Local language models assist with attempts and candidate review. They do not replace deterministic tests. Calibrate the chosen model on each subject; the Orgo Qwen/Llama naming sample is not evidence of biology or physics competence.

## Workflow for every subject

1. **Inventory and scope.** Record the actual curriculum outline, level, learning objectives, asset types and chapter/item counts. Map objectives to lessons and exercises; record real gaps rather than inventing textbook references. Identify version-sensitive content and source needs.
2. **Validate the source and app locally.** Run schema, reference, answer-validator, integration, browser and offline checks appropriate to the project. Include incorrect/near-miss answers and reset/corrupt-storage behavior. Record browser, viewport, theme, environment and source version. Never use a current encoded key as the only oracle for a scientific calculation test.
3. **Freeze a review snapshot.** Build the app and review inputs from the same canonical source. Record hashes of curriculum, shared assets, relevant engine files, prompt and rubric, plus packet-generator version. Check those hashes before a run or result reuse. An attached file is a snapshot, not a live connection to the computer.
4. **Blind pass.** In a fresh conversation, give only question givens, required diagrams and answer-format instructions. Preserve the exact original response before comparison. Do not include keys, hints, lesson solutions, author answer-bearing labels or keyed reports. Do not redact legitimate givens such as numerical units, biological context or a formula supplied by the original question. Validate that redaction has not made the problem unsolvable.
5. **Keyed pass.** In a separate conversation, upload the subject's keyed source packet with the master keyed prompt and applicable rubric. Review every chapter in order, every teaching item and every assessment stage. The saved blind attempt may be added as candidate evidence. Re-derive answers and inspect explanations even when final answers match keys.
6. **Visual and interaction pass.** Use the actual app in local browser tests. Give a model chapter PDFs/screenshots with IDs when visual judgment is wanted. Treat source-only concerns, screenshot observations and actual runtime failures as different evidence. Verify any proposed contrast, layout or animation defect in the appropriate environment.
7. **Adjudicate.** Record each candidate finding as confirmed, rejected, uncertain or duplicate, with reasoning and evidence. Investigate both model errors and app errors; do not vote by model count. Check relevant primary/authoritative material actually available, and state when source access is missing. Never execute model output or apply curriculum edits automatically.
8. **Repair and recheck.** Make approved/authorized corrections, add a regression check where it meaningfully guards the defect, rerun affected and shared checks, rebuild affected packets and preserve earlier reports. Shared assets/engine changes require tracing all affected chapters, not just the chapter where a defect appeared. Commit recoverable checkpoints.
9. **Release with explicit status.** Publish software evidence, chapter-level scientific review coverage, unresolved questions and the exact remaining sign-off scope. A functioning app with pending expert review must be labeled accordingly. Never turn model coverage into scientific certification.

## Reusable upload kit

Default to two separate scientific-review inputs per subject, plus visual evidence where needed. Plain-text bundles should have explicit file/section boundaries and a chapter/item index. Do not depend on ZIP extraction or JavaScript execution by a chat interface.

| File | Contents | Conversation |
|---|---|---|
| `SUBJECT-BLIND.txt` or chapter blind PDFs | Blind manifest, original prompts/givens, permitted diagrams, stable IDs and response instructions; no solutions or keyed context | Fresh blind chat |
| `SUBJECT-KEYED-REVIEW.txt` | Keyed manifest, master prompt, subject rubric, canonical lessons/assets/exercises/keys and relevant source logic | Separate keyed chat |
| Chapter visual PDF(s) | Readable lesson/exercise text and actual screenshots, with snapshot and exact item IDs; label whether blind or keyed | Match the packet's disclosure status |
| Local evidence/report files | Original responses, runtime results, coverage ledger, findings, adjudication and corrections | Stored locally; selectively supplied for follow-up |

A subject's standalone HTML can provide the initial keyed-source snapshot, as with Orgo. A content-focused export is preferable when it reduces boilerplate without dropping teaching text, stage overrides, validation rules or diagrams. Keep full engine source available for shared behavior review.

If a complete subject exceeds practical context/output limits, split by chapter with a common versioned manifest and shared-asset appendix. Keep one subject-level coverage ledger. Uploading one large file does not demonstrate that a model has read every item. For AI Studio, manual attachments remain a usable baseline; browser-assisted uploading is a separate capability to verify. Paid API access is optional, not a prerequisite for this plan.

## Manifest contract for the future packet builder

The proposed manifest should include subject/target level, snapshot ID/date, actual chapter IDs/titles, objective mapping, lesson/stage/asset counts and IDs, asset disclosure types, source hashes, required shared assets, rubric/prompt versions and whether the packet is blind or keyed. Blind manifests must themselves be checked for answer-bearing labels. References need inspected source details and evidence status, not invented quotations or page claims.

Adapters should expose normalized review items and their dependencies without changing a subject's canonical data model. Keep domain-specific validation and blind redaction in the adapter; do not copy Orgo's atom/formula stripping into other subjects indiscriminately. Reject unresolved references and stale packets. Shared assets can be reviewed intrinsically once, but each use needs its own interpretation/highlight/task check.

## Standard report contract

Require an overall chapter table and a separate section per actual chapter. Each section contains scientific-content issues, answer/assessment issues, exact coverage and uncertainty, a verdict for every stage, and a proposed correction for each real concern. The reusable keyed prompt specifies the detailed format.

Use subject/chapter/finding IDs, exact source item IDs, claim/excerpt or asset coordinates, severity, evidence kind, derivation, proposed correction, confidence and adjudication status. Keep candidate findings distinct from confirmed defects. Count shared root causes once while listing all affected chapters. A finding affecting both science and answer logic has one ID and two category tags, not two independent defect counts.

Maintain separate status fields: software checks and their environment; model coverage; inspected-source coverage; unresolved high-severity findings; adjudication coverage; and human expert sign-off. Record model ID/digest or reported version, thinking settings, context/output budget, prompt/rubric version, request limits, completion/truncation and source hashes. Revalidate imported output and reject unknown/missing/duplicate item IDs. Plain-language web responses may require manual import/adjudication; a permissive parser must not silently invent missing coverage.

## Subject adapters and rubrics

| Subject | Scientific representations | Additional review emphasis |
|---|---|---|
| Biology | Labeled cells/anatomy, pathways, sequences, pedigrees, experimental plots | Biological level/location, causal versus correlational claims, regulation, context/species, sequence direction and experimental interpretation |
| Physics | Equations, vectors, circuits, ray/free-body diagrams, graphs and simulations | Units/dimensions, signs and conventions, assumptions, limiting cases, conservation, vector components, numerical tolerances and graph interpretation |
| Organic chemistry | Molecular graphs, stereochemical diagrams, reactions and spectra | Connectivity/formula/charge, stereochemical support, mechanism/conditions, nomenclature and stage-specific structures |
| General chemistry / biochemistry | Species, equilibria, energy diagrams, pathways and quantitative data | System conditions, conservation/stoichiometry, equilibrium versus kinetics, thermodynamic conventions, biochemical state and approximation validity |
| New subjects | Their own typed assets and objective map | Add a substantive rubric and validator tests before claiming subject support |

Detailed biology and physics checklists are in `review/templates/SUBJECT-RUBRICS.md`. These are audit questions, not a verified curriculum or a substitute for sources.

## Rollout plan

**Available now:** copy the universal keyed/blind prompts and the relevant rubric into manual AI Studio reviews. Keep each subject's source, snapshots and reports separate. Preserve Orgo's existing packet/runner contracts.

**Next implementation:** define the neutral manifest/item/report schemas and adapters; build the two-bundle exporter; add validator tests for disclosure, completeness, snapshot reuse and partial reports. Keep model transport separate from subject logic. The current Orgo runner cannot yet accept arbitrary subject manifests.

**First pilots:** use one representative biology chapter and one physics chapter from the user's actual supplied curriculum. Include narrative and diagram questions for biology, and quantitative plus conceptual/graph questions for physics. Include deliberately faulty small fixtures with known, separately justified defects to test whether the process detects mistakes; never distribute those fixtures as teaching content. Inspect the model's reasoning and reference handling, not just key agreement.

**Scale after pilot repair:** cover the complete supplied outline for each subject, reuse successful interaction components, and add new domain representations only where needed. Establish repeatable local/browser reports and per-chapter model coverage before attempting unattended browser workflows. If API access is available later, use the same manifest/prompt/report contract with explicit spending/request limits and no automatic content edits.

## Definition of a completed review cycle

All actual dev/chapters/items have explicit coverage, every stage has a verdict, local tests are recorded for the current source/environment, candidate findings have adjudication statuses, and regenerated packets match the repaired source. Uncertainty and external sign-off requirements remain visible. A cycle can be fully documented while scientific approval is still pending; it must not be reported as independent expert verification in that state.
