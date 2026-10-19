# Chapter 3 candidate-review adjudication

Reviewed 2026-10-19 against the current chapter JSON, graph repository, local curriculum and rendered application. The submitted report is preserved locally under `review-results/ai-studio/chapter-03/submitted-review.txt` (excluded from Git). This is source-backed author adjudication of candidate model evidence, not independent expert sign-off. The report's repeated “100% confidence” statements are not adopted as certainty estimates.

## Independent derivations

All nine original encoded answers remain unchanged after derivation:

| Stage | Answer | Check |
|---|---|---|
| quantum:stage-1 | Option 0: n=2, l=1 | For 2p, n=2 and p means l=1; l must be less than n. |
| quantum:stage-2 | 3 orbitals | m_l = −1, 0, +1. |
| quantum:stage-3 | 6 electrons | Three orbitals, each with capacity two. |
| bond-count:stage-1 | [0,1] | The explicit order-3 graph edge joins those two carbons. |
| bond-count:stage-2 | 2 pi bonds | One triple bond contains two pi components. |
| bond-count:stage-3 | 3 sigma bonds | One C–C sigma plus two implicit C–H sigma bonds. |
| amide-resonance:stage-1 | [3] | Atom 3 is N, directly attached to the acyl carbon. |
| amide-resonance:stage-2 | Option 0 | Nitrogen lone-pair conjugation accounts for approximate planarity. |
| amide-resonance:stage-3 | Option 1 | Contributors differ in electron placement, with the same atomic framework. The original key was correct even though the prompt named the wrong species. |

The three added quantum stages have keys 1 radial node for hydrogen-like 3p (3−1−1), 1 angular node (l=1), and 3s lowest among 3s/3p/3d in the stated usual multielectron model. These are original questions. The hydrogen-like degeneracy exception is explicit in cards and feedback.

## Findings and decisions

| Finding | Decision | Action and scope |
|---|---|---|
| 1: Acetate question beside acetamide | Confirmed mismatch | Changed the third amide prompt to “For acetamide…”. The graph, formula, key and workshop subject now agree. |
| 2: Acetate formula lacks a minus sign | Graph is correct; composition metadata follows the project's documented convention. A student-facing clarity improvement is warranted. | Kept `formula: C2H3O2` as charge-free atom counts and the −1 formal charge on oxygen. Added a shared formula display helper showing `C2H3O2; net charge −1` when revealed. Full PDF graph summaries now show net charge explicitly. A composition string alone does not assert a neutral radical; the graph charge must be read. Blind inputs retain atom charges but omit author formula labels. |
| 3: Atomic concepts beside unlabeled ethene; no automatic name reveal | Confirmed pedagogical gap; the manual Reveal button already worked, so the name was not inaccessible. | Both orbital lesson steps now identify and reveal ethene as a companion bonding example. Added a reusable atomic orbital-filling diagram for isolated neutral carbon, with spin arrows and an accessible occupancy disclosure. The text distinguishes this atomic model from ethene's molecular bonding model. Quantum practice explicitly identifies the molecular drawing as a companion example; the filling diagram is withheld there to avoid revealing answers. |
| 4: Hidden C–H bonds in two-carbon structures | Valid skeletal convention, but poor clarity for this counting lesson | Shared rendering now labels two-carbon all-carbon graphs as hydrogen-bearing terminal groups (H2C/CH2 for ethene, HC/CH for ethyne). No H atom indices were added. Text explicitly explains that the C–H bonds are not separate drawn lines. Counts and formulas stay unchanged. |
| 5: Offset D badge and crowded NH2 highlight | Split decision: the badge offset is intentional; label crowding merits improvement | The letter badge remains a separate control beside the element label, with an equivalent large HTML button. Moving the chemical bond to the control badge would misrepresent the atom's position and is not adopted. Multi-character groups now get a wider elliptical highlight, with stable atom coordinates and selection indices. A transparent hit region at each labeled atom also makes the element text clickable; pointer selection at the NH2 text and keyboard deselection are tested. |
| 6: Relative bond strength, subshell energies and nodes missing | Accepted MCAT coverage improvements with model qualifications | Added the weaker individual pi contribution versus stronger overall multiple-bond distinction, restricted to comparable carbon–carbon bonds. Did not claim universal additive component energies. Added within-shell multielectron energy order, hydrogen-like degeneracy, orbital shapes and node formulas. Extended the quantum workshop from three to six stages. |
| 7: ml/ms typography | Accepted | Uses Unicode subscript l and s in the cards and relevant explanation. Both regular and bold PDF fonts must support these code points in the common glyph preflight. |

## Sources and scientific boundaries

- Inspected the locally supplied `organic_chemistry_kaplan/OEBPS/chapter03b.xhtml` on orbitals, quantum numbers, bonding and hybridization. The report's `chapter03*_p2.html` names and page/question citations were not copied into the app as verified references. No textbook prose, figures, questions or keys were distributed.
- Opened [OpenStax quantum theory](https://openstax.org/books/chemistry-atoms-first-2e/pages/3-3-development-of-quantum-theory) for orbital shapes, node counts and quantum numbers.
- Opened [OpenStax electronic structure](https://openstax.org/books/chemistry-atoms-first-2e/pages/3-4-electronic-structure-of-atoms-electron-configurations) for filling and within-shell energy splitting.
- Opened [OpenStax valence-bond theory](https://openstax.org/books/chemistry/pages/8-1-valence-bond-theory) for sigma/pi overlap and relative strengths.
- The carbon diagram shows 1s² 2s² 2p² in an isolated ground-state atom. Boxes are orbitals and arrows are spin states; neither is a trajectory. The diagram is not an energy-scale plot or a claim that ethene's bonded atoms retain that atomic filling.
- Node formulas are framed for hydrogen-like orbitals. The statement s < p < d < f is limited to the usual multielectron model within a given shell and allowed subshells. It is not a universal ordering across shells.
- No new known incorrect original answer key was established. External subject-matter review remains pending; passing software tests and model agreement cannot establish scientific correctness.

## Runtime, persistence and packet evidence

The chapter retains three lessons and three workshops, with 12 stages after extension. A saved three-stage quantum completion is no longer an independent completion of the revised six-stage workshop; completed earlier decisions are preserved. Existing atom indices, stored workshop IDs and chemical graph connectivity remain stable.

Targeted tests cover the original keys, atom counts and bond counts, charge display and concealment, carbon filling, new model-specific answers, old completion invalidation and N control mapping. Full browser and regression suites cover all chapters, offline downloads, progress, narrow layouts, pointer/keyboard behavior, expanded cards, orbital occupancy and charge disclosures. Exact execution results are recorded in PROGRESS.md after running them.

All chapter packets must be regenerated because shared rendering changed. Static packet screenshots remain evidence of particular states, not proof of animation timing, every click, or screen-reader usability. Chromium testing does not establish Safari/Firefox compatibility or accessibility certification. The Chapter 1 candidate audit and Chapter 2 chair visualization remain separate outstanding work.
