# Chemistry review — 2026-10-19

## Review standard

Software checks validate schema, graph references, valence/formula consistency, and encoded answer behavior. They do not independently verify scientific correctness. Source-backed author review and external expert review are recorded separately. No external expert has signed off this application.

All twelve chapters have undergone source-backed author review. No known unresolved chemistry defect remained after the final author audit. External verification tasks remain open below. Tests cannot establish that an encoded graph matches its name, that a mechanism is correct, or that an explanation is scientifically complete.

## Sources inspected

- Supplied `organic_chemistry_kaplan/OEBPS/toc.xhtml`: actual chapter sequence and section headings, Chapters 1–12.
- Supplied chapter body files, selectively read for curricular scope and disputed points. No quotations, textbook questions, or figures are included in distributed builds.
- IUPAC Blue Book P-1, P-4 and P-6: https://iupac.qmul.ac.uk/BlueBook/contents.html (nomenclature rules, accessed 2026-10-19).
- OpenStax Organic Chemistry, carbonyl overview and enolate acidity: https://openstax.org/books/organic-chemistry/pages/18-preview-of-carbonyl-chemistry and https://openstax.org/books/organic-chemistry/pages/22-5-acidity-of-alpha-hydrogen-atoms-enolate-ion-formation (cross-checks, accessed 2026-10-19).

## Chapter 1 corrections implemented

- The alternative name for the graph described as “2,3-diethylpentane” is 3-ethyl-4-methylhexane, not 2,4-dimethylhexane. The separately drawn fake_pent graph remains 2,4-dimethylhexane.
- Principal suffix locants outrank ring double-bond locants. C1=C2 is the simple cycloalkene rule when no senior suffix controls numbering.
- Functional-group naming seniority is a convention, not an algorithm based on oxidation state.
- Retinal is the aldehyde form of vitamin A; steroid numbering uses established parent conventions, not the simple monocycle rule alone.
- Remove unsupported Kaplan figure/question/mnemonic attributions and unsupported numerical hydration constants.
- Avoid calling but-3-en-2-ol an enol: OH is not attached to an alkene carbon. The internal legacy molecule identifier is retained only for migration.

## Open review questions

1. Independent expert review of names/graphs, stereochemical assignments, mechanism arrows, and every answer explanation remains pending.
2. Experimental spectra could supplement the schematic spectroscopy material later; none is claimed here.
3. Additional browser and assistive-technology testing could assess how effectively the visual chemistry reaches more learners. Keyboard controls and textual connectivity are implemented and tested, but this is not a full accessibility certification.

Chapter 1: corrections implemented and graph/formula checks passed. Per-step atom challenges now follow the displayed molecule. Names and formulas are concealed in practice until completion/reveal; SVG accessibility descriptions expose connectivity without leaking names.

Chapter 2: author-reviewed CIP ranking, E/Z graphs, Fischer (S) assignment, meso count, and butane conformations. Flat connectivity diagrams explicitly do not claim stereochemistry or chair geometry. Independent expert review pending.

Chapter 3 (Bonding): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 4 (Analyzing Organic Reactions): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 5 (Alcohols): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 6 (Aldehydes and Ketones I): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 7 (Aldehydes and Ketones II: Enolates): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 8 (Carboxylic Acids): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 9 (Carboxylic Acid Derivatives): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 10 (Nitrogen- and Phosphorus-Containing Compounds): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 11 (Spectroscopy): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 12 (Separations and Purifications): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

## Additional external cross-checks

Accessed 2026-10-19:

- [OpenStax SN1](https://openstax.org/books/organic-chemistry/pages/11-4-the-sn1-reaction): racemization and ion-pair qualifications.
- [OpenStax IR regions](https://openstax.org/books/organic-chemistry/pages/12-8-infrared-spectra-of-some-common-functional-groups): approximate functional-group absorptions.
- [OpenStax proton splitting](https://openstax.org/books/organic-chemistry/pages/13-6-spin-spin-splitting-in-1h-nmr-spectra): the first-order n+1 model.
- [OpenStax conjugation and UV](https://openstax.org/books/organic-chemistry/pages/14-8-interpreting-ultraviolet-spectra-the-effect-of-conjugation): relative wavelength and energy trends.
- [Waters size-exclusion primer](https://www.waters.com/nextgen/us/en/education/primers/beginners-guide-to-size-exclusion-chromatography/gpc-basic-chemistry.html): pore access and elution order.

## Additional corrections and distinctions

No separate historical bug list was supplied; fixes were based on inspection of the two reference files and curriculum.

- Preserve chemical punctuation in answer validation rather than using the additional reference's punctuation-stripping normalization. Accepted aliases are explicit.
- Bind each Learn challenge to its displayed molecule. Switching from vicinal to geminal diol, or among acid derivatives, changes target atoms and explanation.
- Qualify oxo/formyl and ring-carbaldehyde naming: simple acyclic examples do not establish universal rules.
- Avoid claims that naming priority determines reaction selectivity, that SN1 must give exactly 50:50 products, or that inversion always changes the R/S letter.
- Distinguish hydroquinone from hydroxyquinone; aldol addition from dehydration; fatty-acid neutralization from ester saponification.
- Require activation/appropriate conditions for efficient amide formation from acids and amines. Do not imply spontaneous peptide formation in water.
- Distinguish overall ATP hydrolysis free energy from the energy required to break a bond.
- The formula check caught and prompted repair of the dimethyl phosphate monoanion formula to C2H6O4P; the neutral acid would contain one additional H. This is an internal-consistency repair, not independent chemistry verification.

## Modeling assumptions

Chapter 2 external-review follow-up: adjudicated six findings from the user's pasted model report. Added optical-rotation coverage, strain/resolution detail and original exercises; improved explicit aliases and highlights; preserved correct Fischer stereochemistry under a 180-degree redraw. Active challenge highlighting was already concealed and is now regression-tested. See review/docs/CHAPTER_02_REVIEW_ADJUDICATION.md for the finding-by-finding decisions, source checks, and limitations. The report is not treated as expert sign-off or verification of every molecular graph.

- Skeletal structures omit ordinary implicit H atoms; ions omit counterions. Formulas count atoms without a charge suffix; formal charges appear on atoms.
- Flat connectivity drawings do not assign tetrahedral stereochemistry or represent equilibrium chair geometry. Fischer and E/Z diagrams specify spatial conventions separately.
- Curved arrows illustrate particular electron-pair movements. Partial mechanisms are described as partial; the renderer is not a mechanistic simulator.
- Spectra are illustrative positions, not experimental measurements. The NMR plot labels multiplicities in its caption rather than simulating full multiplet line shapes.
- IR regions, proton shifts, and pKa values are approximate. Speciation assumes a simple monoprotic model. TLC sliders illustrate a trend and do not predict a real Rf.
- Reagent selectivity, equilibria, and chromatography depend on substrate and conditions. Conditions and limitations accompany the rules.

## Chapter 2 second candidate review and local Llama results

See review/docs/CHAPTER_02_FOLLOWUP_REVIEW.md for adjudication of seven new findings and all 11 disagreements in the eight completed local blind cases. The 13 matching keys out of 24 do not measure scientific accuracy: some matching answers have false reasoning. No answer key was changed to follow Llama. Confirmed wording and answer spoilers were repaired, explicit parenthesized aliases added, the chair-transfer graph corrected, and PDF glyph support repaired. The actual chair/axial/equatorial visualization remains open; the lessons disclose that their hexagons show connectivity only. External expert chemistry review remains pending.

## Chapter 3 candidate review

Adjudication: docs/CHAPTER_03_REVIEW_ADJUDICATION.md. Re-derived all nine original keys; none changed. Fixed the acetamide/acetate prompt mismatch, made revealed ionic charge explicit without changing charge-free composition metadata, improved two-carbon hydrogen labels and multi-character highlights, and added a carbon orbital-filling diagram. Expanded node/energy/bond-strength coverage with hydrogen-like versus multielectron qualifications and three original practice stages. The offset letter badge remains a separate control rather than a chemical bond endpoint. The candidate report is not expert verification.

## Chapter 4 candidate review

See review/docs/CHAPTER_04_REVIEW_ADJUDICATION.md for all three major and eight minor findings. All 15 original keys were re-derived and retained. The acetate metadata convention was already handled by Chapter 3; the app continues to show net ionic charge explicitly. Clarified the forward equilibrium, removed early arithmetic feedback, retained condition-based chemoselectivity over the textbook shortcut, and expanded qualified acid/base, nucleophilicity, redox and alpha-site coverage. Corrected highlights, speciation labels, dimensionless answer wording, 2D drawing clarity and PDF symbol fallback. These changes remain source-backed author review, not expert sign-off.

## Chapters 5 and 6 candidate-review checkpoint

Adjudication and source limitations are documented in review/docs/CHAPTER_05_REVIEW_ADJUDICATION.md and docs/CHAPTER_06_REVIEW_ADJUDICATION.md. Chapter 5 keeps all 12 original keys; Chapter 6 keeps 11 original tasks and replaces one unrelated task with an actual cyanohydrin bond selection under a new workshop ID. Added explicit aliases, stage product graphs, labeled completion formulas, traditional/broad acetal terminology, named reagents with conditions, physical-property/naming coverage, corrected focus/coordinates, readable active/disabled controls, and shared electron-flow clearance. No new learning mode or graph repository entries were added. Independent expert chemistry sign-off, earlier Chapter 1 audit and Chapter 2 chair rendering remain outstanding. Test and packet results are recorded in PROGRESS.md after execution.

## Chapters 7–9 candidate-audit follow-up

See review/docs/CHAPTER_07_REVIEW_ADJUDICATION.md, review/docs/CHAPTER_08_REVIEW_ADJUDICATION.md and docs/CHAPTER_09_REVIEW_ADJUDICATION.md. All 33 original stage keys retained; explicit aliases expanded. Added a carbon-charged enolate contributor with visible carbon charge, bond-aware number badges, corrected carbonyl/soap/intermediate layouts, better task context/highlights, product display and condition-qualified curriculum coverage. Prior shared dark/arrow fixes were rechecked rather than undone. App now has 69 molecular graphs; lessons/workshops/stages remain 51/59/178. Numerical pKa examples were checked against the actual cited source. Source overgeneralizations on conjugation, racemization and imine/enamine relationships were not adopted. Test/packet results are recorded in PROGRESS.md after execution. Earlier Chapter 1 adjudication, actual Chapter 2 chair drawing and independent expert science sign-off remain open.

## Chapters 10–12 candidate-audit follow-up

See review/docs/CHAPTER_10_REVIEW_ADJUDICATION.md, review/docs/CHAPTER_11_REVIEW_ADJUDICATION.md and review/docs/CHAPTER_12_REVIEW_ADJUDICATION.md for every finding and scientific qualification. Original 36 keys retained, exact aliases expanded; new Gabriel workshop adds three stages. Combined spectroscopy task uses a new ID and conceals the candidate graph in active practice and blind inputs. Added phthalimide anion/propanal graphs, tracked synthesis colors, explicit pI precision, phosphate display notation with canonical composition preserved, qualified buffering, full chapter titles/Lesson numbering, clear badges, spectrum multiplets/broad bands, matched IR steps, labeled TLC spots and independent calculation context. Counts: 51 lessons, 60 workshops, 181 stages, 71 molecular graphs. Runtime/PDF checks and commits remain recorded in PROGRESS.md after execution. Earlier Chapter 1 audit, actual Chapter 2 chair visualization, independent expert science sign-off, Safari/Firefox and accessibility certification remain outstanding.

## Independent-review provenance correction and automation

The old untracked expert runner performed no model or expert review: it copied curriculum keys into alleged blind records and wrote invalid scientificVerification:true assertions. Original outputs/source are preserved locally with an invalidity notice; none of them qualifies as independent solving, source-backed verification or human sign-off. See review/docs/AUTOMATED_CHEMISTRY_REVIEW.md for provenance and the replacement workflow.

The replacement collects genuine provider responses when explicitly executed, isolates blind inputs, retains derivations/disagreements/source gaps and keeps scientificVerification:false and humanExpertSignoff:pending. Curated notes are assertions pending source checking; the runner does not retrieve chemistry references. Challenge responses and model agreement never close findings or modify content. No live model chemistry review was run during its implementation. Mocked workflow tests and browser/schema checks supply software evidence only. Independent expert verification of every chapter remains outstanding.

## Live Chapter 1 local-model sample

Qwen3.5:9b and Llama3.1:8b independently attempted two Chapter 1 naming exercises using identical blind inputs. Qwen matched 6/6 encoded answers, Llama 4/6. Author inspection still found Qwen reverse-numbering and stereocenter errors, six non-defect observations in its findings, and contradictory Llama naming explanations. These are model errors; no app key was changed. Full original submitted reviews and evidence hashes are preserved in testing/artifacts/chapter01-local-pilot.json; author adjudication and timing limits are in docs/CHAPTER_01_LOCAL_MODEL_PILOT.md. Qwen thinking was disabled in the completed bounded sample. The earlier thinking-enabled attempt failed in transport and provides no completed review. A two-exercise result does not certify a chapter or rank chemistry models generally; independent expert sign-off and the earlier Chapter 1 candidate-audit adjudication remain pending.

## Layout-only migration

Source/content now lives under dev/, deterministic tests and their reports under testing/, and scientific review materials under review/. The migration preserved every canonical source/data/schema/outline byte and every original packet/review-evidence byte checked by testing/artifacts/layout-migration.json. No molecule, answer, lesson, assessment ID or scientific conclusion was changed. Original model outputs retain their original signatures and paths; review/RELOCATION-MAP.json maps current locations. Updated model tools and their new signatures do not retroactively verify historical output. All previously unresolved scientific questions and expert sign-off remain unresolved; passing migrated software and provenance checks is not a new chemistry review.


## 2026-10-19 — Conservative visual-card and 3D interaction port

Adapted the supplied AI Studio remix's compact-card/full-note and inline/fullscreen inspection patterns. Teaching text remains entirely in canonical chapter JSON; no parallel curriculum, new answer keys, cached PubChem database claims, accuracy dashboard, model sign-off or replacement test tools were imported. The two study modes and v5 color roles remain intact.

The offline SVG viewer uses the displayed graph with stable zero-based indices, bond multiplicities and explicit carbon charges. Its depth offsets are arbitrary display offsets: it is explicitly a schematic projection, not VSEPR geometry, an optimized conformer, a stereochemical assignment or experimental data. It supplies keyboard rotation/tilt, larger spheres, reset and fullscreen inspection. No network or new runtime dependency is required. Names, formulas and author review notes remain concealed until revealed. Active Guided Practice and learn atom challenges keep their 2D answer-bearing canvas; inspection is available after workshop completion and uses the final stage's molecule override. Existing progress and workshop IDs remain valid because assessments are unchanged.

The remix's independent molecular-geometry, chair-energy and stereochemical claims were not adopted. A future physically meaningful conformer feature needs source-backed coordinates, graph/atom mapping and chemistry review. Independent chemistry sign-off remains pending. Historical review results and provenance notices are preserved; current packets are regenerated because rendering changed.


Validation checkpoint: schema validation passed for 13 documents; npm test passed all 94 tests (existing suites retained, four interface tests added); the full browser suite passed all 12 chapters/181 stages; regression passed 25 groups. Current packet checks passed 279 cases, 863 screenshots and 24 PDFs. Chemistry font tests passed; PDF QA checked all 24 records and rendered 93 sample pages. Desktop/light and mobile/dark viewer screenshots and a sample PDF contact sheet were visually inspected. These are software, provenance and sampled layout checks, not independent chemistry verification.


## 2026-10-19 — Distinct schematic summaries and stable note controls

Corrected the first port's limitation: compact cards had repeated the full-note prose and their controls lost state on redraw. Added 204 concise original schematic summaries to `visualCards` in canonical chapter JSON across all 51 lessons. Reusable rendering now supplies flow/checklist diagrams, unconnected comparisons for classifications, selectable cue cases with outcomes, trap contrasts and application maps. Full notes remain available separately with all original qualifications. These are author summaries based on the existing lesson cards, not imported unreviewed chemistry prose, molecular structures, measured data or independent chemistry verification. No existing curriculum strings, exercise IDs, keys, hints, explanations or molecular graphs were changed.

Individual and bulk note controls now use shared per-lesson state, preserve disclosure/branch selection across theme and walkthrough changes, and keep keyboard focus on the selected control. Visual schema constraints, all-lesson browser toggles and regression checks cover distinct summary/full views and cue behavior. Keyed review payloads, PDFs and lesson screenshots include the new summaries; blind inputs remain isolated. Independent chemistry sign-off remains pending.


Validation checkpoint: 13 schema documents and all 95 npm tests passed. Full browser checks passed all 12 chapters and exercised the four visual/full-note switches in every lesson; all 26 regression groups passed, including independent note toggles, cue outcomes, and state retention through theme/step redraws. Packet checks passed 279 cases, 914 screenshots and 24 PDFs. All three chemistry-font tests passed. PDF QA checked 24 records and rendered 93 sampled pages; a targeted visual-summary PDF page and desktop/light and mobile/dark card captures were also inspected. Historical review results were not changed. These checks establish software behavior and provenance, not independent chemistry sign-off.


## 2026-10-19 — Diagram-first chemistry visual cards

Replaced the text-box-first presentation with actual chemistry figures on all 51 rule cards and additional relevant cue/trap/application cards. Molecular panels resolve existing canonical walkthrough graphs, stable indices and highlights rather than copying the remix's untracked molecular doodles. Reaction/resonance arrows have explicit scope captions: distinct comparison examples are not presented as reactions, enolate contributors are one species, and the separate imine/enamine examples are not tautomers. Matched IR/NMR/TLC panels reuse the associated molecule and canonical illustrative diagrams. Other figures show isolated-atom spin occupancy, orbital-phase overlap, polarimetry, distillation, extraction, micelles and size exclusion as labeled schematics, not experimental data or optimized molecular geometries.

Names/formulas/review notes follow the walkthrough reveal; carbon charges and explicit H overrides remain visible in drawings. Filled card figures are suppressed during learn atom challenges and remain absent from Guided Practice. The text key is subordinate to the drawing; full-note and branch controls retain their previous behavior. Molecular graphs, existing teaching strings and all assessment IDs/keys remain unchanged. Independent chemistry sign-off is still pending. New canonical figure references and captions are included in keyed review inputs/PDFs; blind exercise isolation is retained.


Validation checkpoint: 68 chemistry figure specifications cover all 51 lessons. Schema validation passed 13 documents; all 97 npm tests, the full 12-chapter browser suite and all 28 regression groups passed. Drawing-panel metadata meets measured 4.5:1 contrast in both themes at mobile/desktop sizes. Packet checks passed 279 cases, 914 screenshots and 24 PDFs; chemistry-font tests and PDF QA passed, with 93 sampled PDF pages rendered. Representative numbered skeleton, redox, enolate, atomic, spectral and apparatus cards were visually inspected. Existing molecular graphs, assessment data and historical review results were preserved. These are software/layout/provenance checks, not independent chemistry sign-off.

## 2026-10-19 — Restore supplied remix card design

Restored the remix's chips, colored rule ladders, comparison tables, interactive memory branches, wrong/right trap panels and application grids across 51 lessons. Full Note adds the canonical note beneath the visual; compacting hides only that note. Removed the repeated generic summary/scope treatment. Kept canonical graph-backed molecular drawings where the remix's freehand structures lacked graph/formula/review metadata; retained applicable original nonmolecular SVG graphics. Existing guided-practice concealment, strict answer checking, assisted-state rules and offline illustrative 3D remain.

Targeted imported-text corrections cover suffix-controlled ring numbering, hydrate equilibrium scope, partial SN1 racemization, model-dependent orbital claims, oxidation scope, substrate-dependent imine pH, acyl activation exceptions, achiral glycine, peptide planarity, UV increments and normal-phase TLC trends. Review cases now separate each rich card from walkthrough steps to preserve all supplied content within the unchanged 8K budget. Independent chemistry review remains pending; these edits and automated checks are not scientific sign-off.
