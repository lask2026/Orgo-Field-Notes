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

## Chapter 4 candidate-review checkpoint

- Adjudicated all three major and eight minor findings in docs/CHAPTER_04_REVIEW_ADJUDICATION.md. Re-derived all 15 original answers and retained the keys. Acetate charge display was already corrected by the shared Chapter 3 work; composition metadata remains charge-free with explicit atom charges.
- Added the forward equation and hypothetical-data context, removed early numerical feedback, clarified general chiral SN2 reasoning beside achiral bromoethane, aligned steric/carbonyl highlights, repaired dimensionless answer wording, and redrew tert-butyl bromide as a clearly qualified 2D cross.
- Expanded original teaching on amphoteric/coordinate-bond behavior, qualified acidity/nucleophilicity/acyl-reactivity trends, named oxidants, amide reduction, alpha acidity/enolate formation and electronic protection. App chemoselectivity teaching remains reagent/condition based rather than adopting the textbook priority shortcut. Added an alpha-carbon walkthrough and challenge.
- Added text identification of both speciation species, percentages, slider bounds and accessible values. Tests exercise midpoint/extremes, expanded mobile cards, the new alpha challenge, no early K result, scientific-notation 1e5, signed +1, and rejected appended unit text.
- Passed 39 Node groups (31 application/review, 8 audit), all 13 schema documents, the complete 12-chapter browser suite and all 15 regression groups. Both app builds refreshed. Counts remain 51 lessons, 59 workshops, 178 stages and 68 molecular graphs.
- PDF preflight confirmed U+21CC missing from the body fonts and now uses a supported fallback; unsupported text fails explicitly. Repaired a decorative emoji selector/supplementary PDF text-mapping issue discovered during generation. Three dedicated PDF font regression tests passed. Rebuilt all 24 PDFs and 12 packet captures: integrity/provenance passed for 274 cases and 816 screenshot records. Final sampled PDF QA is recorded below.
- Submitted raw review is preserved locally; no model inference or external uploads were performed. Existing untracked expert-review files remain untouched. Earlier Chapter 1 audit, Chapter 2 chair visualization and external expert chemistry sign-off remain outstanding.
- Final PDF QA passed: extracted-text coverage for all 24 PDFs and 90 sampled Poppler renders. Visually inspected all eight contact sheets and Chapter 4 full page 3/blind page 2, including the actual equilibrium arrow. Confirmed real PDF text retains U+21CC and the blind page omits the numerical key. Also inspected speciation/mobile cards, steric comparison and redox input/focus captures. Chapter 4 upload packets are 6 blind pages and 44 full-review pages.

## Chapter 5 candidate-review checkpoint

- Adjudicated all ten findings in docs/CHAPTER_05_REVIEW_ADJUDICATION.md. All twelve original answer keys retained; exact valid naming/classification aliases expanded.
- Added condition-qualified acidity/naming/reagent/protection/quinone teaching; repaired product and sulfonate canvas selection, completion structure/formula labels, sulfonate highlight and geometry, progressive redox hints, dark active steps and disabled-choice readability.
- Four targeted Chapter 5 Node groups passed as part of 47 total groups. Full twelve-chapter Playwright suite and all 17 cross-chapter regression groups passed, including measured 4.5:1 text contrast at mobile/desktop in light/dark and actual alias/rejection submission. Schema validation passed for all 13 documents. Both app builds were refreshed.
- Generated review PDFs and visual checks are recorded with the Chapter 6 checkpoint; science remains source-backed author review, not independent expert verification.

## Chapter 6 candidate-review checkpoint and final packet QA

- Adjudicated all six findings in docs/CHAPTER_06_REVIEW_ADJUDICATION.md. Retained eleven original stage tasks; replaced the unrelated enamine question with cyanohydrin C–C bond endpoints [1,4]. Workshop ID cyanohydrin-bond prevents old completion from certifying the new assessment.
- Added exact isopropyl alcohol alias, product display, hemiacetal/hemiketal/acetal/ketal distinctions, qualified naming/oxidant/protection/imine-enamine teaching, clear starting-material context, differentiated nitrile highlight, and symmetric ketal/hydrate coordinates.
- All 13 schema documents, 47 Node groups (39 application/review plus 8 audit), all twelve chapter browser checks, 17 regression groups and three PDF font tests passed. App totals remain 51 lessons, 59 workshops, 178 stages and 68 graphs.
- Refreshed website/offline builds and all twelve review packets after shared renderer changes. Package integrity/provenance passed for 275 cases, 816 screenshot records and 24 PDFs. Extracted coverage passed for all PDFs; 92 sampled pages rendered. Visually inspected all eight contact sheets plus Chapter 5/6 full pages 3–4 and targeted Chapter 6/7/9 arrows, mesylate and mobile-dark product completion. No clipping or glyph boxes observed in inspected samples. The documented limits remain; visual sampling and code checks do not independently verify chemistry.
- Updated AI Studio upload files: Chapter 5 has 8 blind/36 full-review pages; Chapter 6 has 6 blind/37 full-review pages. Raw submitted audits preserved locally; no model inference or uploads performed. Existing untracked expert review files remain untouched. Earlier Chapter 1 adjudication, Chapter 2 chair teaching and independent expert sign-off remain outstanding.

- Visual PDF inspection caught literal less-than comparators being swallowed as HTML in the new Chapter 6 boiling-point trend. Escaped them in canonical content, added a regression assertion and rebuilt/rechecked the affected packet; this demonstrates why code/schema passes alone are insufficient.

## Chapter 7 candidate-review checkpoint

- Adjudicated all six findings in docs/CHAPTER_07_REVIEW_ADJUDICATION.md. All twelve original keys retained. Fixed aldol/but-2-enal carbonyl layout, added bond-aware number placement, replaced invisible letter references and clarified Michael carbonyl/beta focus; its prompt remains self-contained without color overlays in blind inputs.
- Added the carbon-charged ethanal enolate contributor, explicitly preserving hydrogen count, composition and net charge, and made charged carbon labels visible. App now has 69 graphs; 51 lessons, 59 workshops and 178 stages remain unchanged.
- Added qualified induction/acidity/addition, alpha-racemization/epimerization and imine/enamine teaching. Rechecked source numerical examples instead of treating model agreement as verification. Prior shared arrow clearance retained.
- Four targeted Chapter 7 groups passed within 57 Node groups; 13 schema documents, full twelve-chapter browser suite and all 20 final regression groups passed. The final blind-compatible wording also passed the affected Chapter 7 browser rerun. The first new regression attempt exposed an invalid SVG innerText test accessor; corrected to textContent and reran the suite successfully. No app failure was attributed to that test-harness error.
- Both app builds and all chapter review packets refreshed; final PDF/package results follow with the Chapter 9 checkpoint. Independent expert chemistry verification remains pending.

## Chapter 8 candidate-review checkpoint

- Adjudicated all six findings in docs/CHAPTER_08_REVIEW_ADJUDICATION.md. Retained all twelve original keys and added exact 2-propanone/dimethyl ketone aliases.
- Corrected beta-keto acid/laurate drawing geometry, exocyclic COOH wording and disjoint complete-head/hydrocarbon-tail focus. Carried useful context focus without making every empty highlight sticky. Added explicit transfer-question context for acid/amine reasoning beside an illustrative ester.
- Decarboxylation naming/completion now displays acetone and C3H6O instead of retaining the starting beta-keto acid. Strict rejections and concealed formulas remain intact. Three targeted Chapter 8 groups passed within 57 Node tests; all 13 schema documents, the full twelve-chapter browser suite and 20 regression groups passed. Prior shared dark-active-step repair remains covered by measured contrast checks.
- App builds refreshed. Final packet provenance and sampled PDF visual checks are recorded with the Chapter 9 checkpoint. Source-backed author review is not independent expert sign-off.

## Chapter 9 candidate-review checkpoint and final export QA

- Adjudicated all six findings in docs/CHAPTER_09_REVIEW_ADJUDICATION.md. Retained all nine original keys, added explicit CH3OH/MeOH aliases with rejection of methoxide, clarified acetate/ethanoate, renamed the ester step and distinguished displayed starting material from hydrolysis products.
- Expanded original condition-qualified teaching of conjugation/activation energy, induction/sterics, derivative/ring naming, condensation/Fischer equilibrium, ordinary amide formation versus tertiary-amine acylammonium behavior, saponification, thermal cyclic anhydride formation, protecting groups and small-ring strain. Did not copy the source's universal conjugation-rate shortcut. Spread tetrahedral-intermediate bonds in a clearly qualified 2D projection; prior arrow clearance retained and visually checked.
- Three targeted Chapter 9 groups passed. Final evidence: 57 Node groups (49 application/review, 8 audit), 13 schema documents, full twelve-chapter browser suite plus affected Chapter 7 rerun, 20 regression groups and three PDF font checks passed. Both website and offline builds refreshed; totals 51 lessons/59 workshops/178 stages/69 graphs.
- Refreshed all twelve packets: provenance/integrity passed for 276 cases, 817 screenshot records and 24 PDFs. PDF text coverage passed; rendered 92 samples across all PDFs and re-rendered seven Chapter 7 samples after final prompt wording. Inspected all eight contact sheets, refreshed Chapter 7 contact sheet, full Chapter 7/8/9 pages 3–4 at 1500px and targeted structure/flow/mobile captures. All final PDF QA hashes match current PDFs. No clipping/missing text/glyph boxes observed in inspected current samples. Sampling and software tests are not independent chemistry verification.
- Current upload PDFs: Chapter 7 = 5 blind/36 full pages; Chapter 8 = 8 blind/35 full; Chapter 9 = 4 blind/30 full. Raw submitted reviews preserved locally; no model inference or uploads performed. Existing untracked expert-review work remains untouched. Earlier Chapter 1 adjudication, actual Chapter 2 chair visualization, external expert sign-off, other browser engines and accessibility certification remain open.

## Chapter 10 candidate-review checkpoint

- Adjudicated all ten detailed findings (J-1–3, M-1–7) in docs/CHAPTER_10_REVIEW_ADJUDICATION.md. Retained twelve original keys and added a three-stage Gabriel-route workshop using the actual phthalimide-anion graph. Current totals: 51 lessons, 60 workshops, 181 stages, 71 molecular graphs.
- Aligned Strecker carbon-source focus across substrate/product, removed nitrile-N success focus, completed peptide terminal highlights and clarified the separate Fischer diagram. Added amphoteric/side-chain/peptide-reaction/synthesis/phosphate terms with condition qualifications. Phosphate buffers near separate pKa values; no uniformly effective full-scale claim adopted.
- Preserved canonical Hill composition H3O4P while revealing conventional H3PO4 through optional displayFormula; atom-count test enforces equivalence. Explicit two-decimal pI instructions retain the correct 5.95 key and strict validation. Selection badges now clear bonds/element labels, retaining stable identifiers/direct-element hit targets and 44px alternatives. Full wrapped chapter title and explicit Lesson labels avoid native-select truncation and textbook-section confusion.
- Four Chapter 10 groups passed within 68 Node groups; all 13 schema documents, the complete twelve-chapter browser suite and 23 regression groups passed. New live checks cover badge click mapping, rejected 6.0/successful 5.95, all three Gabriel decisions and phosphate notation. A floating-point exact-equality assertion in the new arithmetic test was corrected to a numerical epsilon; no chemistry key was changed.
- Work resumed after a temporary automatic-approval-review usage limit prevented browser execution in the earlier attempt. Browser/tests subsequently ran successfully through the normal approval flow. Final packet/export/visual results are recorded with Chapter 12. No model inference or upload performed; independent expert verification remains pending.

## Chapter 11 candidate-review checkpoint

- Adjudicated all six findings and subitems in docs/CHAPTER_11_REVIEW_ADJUDICATION.md. Retained twelve original keys and added exact acetone aliases. Combined evidence now withholds its structure/accessible graph throughout active practice and blind JSON/PDF inputs, reveals it on completion, and uses a fresh ID to invalidate prior answer-bearing completion.
- Added schema-documented reusable broad bands and binomial multiplets, distinct Signal 1/2/3 labels, matched ketone/alcohol/acid IR diagrams, appropriate proton-site focus and ethyl path, HOMO/LUMO and qualified spin/TMS/J/upfield terms. Added propanal with explicit aldehydic CH for a same-formula alternative; centered small shared graphs without changing connectivity.
- Four targeted Chapter 11 groups passed within 68 Node groups. Full twelve-chapter browser suite and 23 regression groups passed, including no active candidate graph, graph reveal only on completion, actual alias submission/rejection, eight NMR lines and IR diagram switching. Visual inspection caught adjacent signal labels running together; staggered them, regenerated all packets and reran the affected Chapter 11 browser check successfully. Original renderer did not persist ketone diagrams on diagram-free steps; the candidate audit's suspected persistence was not a confirmed runtime defect.
- Schematics remain explicitly illustrative: band width/line spacing are not measured spectra, peak height is not integration, and spacing is not an inferred experimental J. Final PDF/provenance checks follow with Chapter 12; independent expert science verification remains open.

## Chapter 12 candidate-review checkpoint and final exports

- Adjudicated all four findings in docs/CHAPTER_12_REVIEW_ADJUDICATION.md. Retained all twelve original keys. Corrected toluene exocyclic bond length/padding, labeled both TLC spots and values with accessible slider output, removed the unrelated trend widget from numerical Rf practice, and added qualified distillation, superheating/nucleation, paper/TLC visualization, preparative/flash chromatography and GC–MS coverage.
- Three targeted Chapter 12 groups passed within 68 Node groups (60 application/review plus 8 audit). All 13 schema documents, complete twelve-chapter browser suite, 23 regression groups, and three PDF font tests passed. After visual label correction, all Node/schema checks and the affected Chapter 11 browser suite passed again. Both website and single-file offline builds refreshed.
- Rebuilt all twelve review packets after shared renderer and repository changes: provenance/integrity passed for 279 cases, 827 screenshot records and 24 PDFs. Extracted coverage passed and 93 representative pages rendered; inspected all eight contact sheets, Chapter 10/11/12 full pages 3–4, and targeted reagent/badge/spectrum/concealment/toluene/TLC images. No remaining missing text, clipping or glyph boxes in inspected samples; final PDF QA hashes match every current PDF. One text check incorrectly expected screenshot text to appear in extraction; visual inspection verifies the withheld-candidate screenshot while extraction separately verifies the absence of graph listings. No app/content defect was attributed to that assertion error.
- Current AI Studio PDFs: Chapter 10 = 7 blind / 44 full pages; Chapter 11 = 7 blind / 41 full; Chapter 12 = 8 blind / 35 full. Model output remains candidate evidence; no model inference or external upload performed. Independent expert chemistry review remains pending. Earlier Chapter 1 adjudication, actual Chapter 2 chair visualization, Safari/Firefox and accessibility certification remain open.
- Existing unrelated untracked expert-review files were preserved untouched. All implemented changes are recoverable in the chapter checkpoints; final totals are 51 lessons, 60 workshops, 181 stages and 71 molecular graphs.

## Automated chemistry model-review checkpoint

- Added a real Ollama/Gemini review runner, strict config templates, PowerShell wrapper and account/setup guide at docs/AUTOMATED_CHEMISTRY_REVIEW.md. Default is preview with no inference or result writes; explicit execution defaults to a one-request cap. Isolated blind solving precedes keyed audits; optional challenge calls preserve all disputes for adjudication. Config/model/source signatures, raw responses, phase-restricted resume, context rejection, partial coverage and pending human sign-off are retained.
- Inspected the pre-existing untracked expert runner: it copied encoded keys into alleged blind attempts and asserted scientificVerification:true without making model calls. Preserved its source/hash and original outputs under ignored review-results/expert/, added VALIDITY-NOTICE.md, and replaced the old entry point with the supported dry-run-first runner. Those legacy assertions are disqualified; they are not independent review evidence.
- Passed 80 Node groups (60 application/review, 8 existing audit, 12 new mocked panel tests), all 13 JSON schema documents, the full twelve-chapter Chromium browser suite and packet integrity (279 cases / 827 screenshot records / 24 PDFs). Verified all-chapter PowerShell preview reports the correct request counts and performs no inference. Initial mocked tests hit Windows sandbox EPERM on temporary-file renames; the same tests passed with normal approved Windows filesystem access. No runtime code, curriculum, distributed builds or chapter PDFs changed. Regression suite was not rerun for this tooling-only change; earlier results remain historical.
- No live chemistry inference, paid API request, key configuration, model download or expert sign-off performed in this checkpoint. API provider success is tested with mocks, not live credentials. Inspected hardware reports 31 GB usable RAM and AMD Radeon graphics; Qwen3.5:9b is a proposed pilot, not a demonstrated chemistry winner. Manual chapter-PDF review can use existing AI Studio/ChatGPT accounts; unattended Gemini requests require separately configured project access/quota/billing. Prior science/UI follow-ups remain open.
