# Chapter 4 candidate-review adjudication

Reviewed 2026-10-19 against canonical chapter content, molecular graphs, the current renderer, the local curriculum and the sources below. The submitted report is preserved locally in `review-results/ai-studio/chapter-04/submitted-review.txt` (excluded from Git). Model confidence labels and agreement with the author keys are not scientific certification.

## Original answer derivations

All 15 original keys remain unchanged. The carboxyl oxygens are [2,3]; for the explicitly written forward reaction HA + B ⇌ A− + BH+, the higher-pKa product acid gives a product-favored equilibrium and K approximately 10^(10−5) = 100000. Reversing the written equation would invert K.

Bromoethane's electrophilic carbon is [1]; hydroxide is the lone-pair donor among the choices, and bromine takes the C–Br pair in the specified leaving-group cleavage. The primary halide favors SN2 under the stated favorable conditions; doubling each concentration gives a factor of four, and a separate stereogenic SN2 center undergoes geometric inversion. The displayed bromoethane is achiral.

Ethanal's carbonyl carbon is [1]; its double bond to O contributes +2, implicit C–H contributes −1, and C–C contributes zero, giving oxidation state +1. NaBH4 reduction followed by protonation gives ethanol, a primary alcohol. In the ketoester, [0] is the ester acyl carbon and [3] is the ketone carbonyl carbon preferred under ordinary NaBH4 conditions. Naming seniority does not set reaction rate.

## Findings and decisions

| Finding | Adjudication and action |
|---|---|
| M-1: Acetate formula omits ionic charge | Already addressed in the shared Chapter 3 renderer and full packet generator. Charge-free `C2H3O2` is the documented composition field, with −1 charge stored on oxygen. The revealed UI displays `C2H3O2; net charge −1`, and full PDF graph summaries state net charge. Kept correct metadata and charges; did not append a charge to atom-count strings. The claim that this metadata by itself specifies a neutral radical is not adopted. |
| M-2: Missing reaction direction and early arithmetic feedback | Confirmed. The stage prompt now writes HA + B ⇌ A− + BH+. Added context separating Stage 1's ethanoic-acid drawing from the hypothetical, comparable-scale pKa data. Removed the numerical K expression from Stage 2 feedback; the quantitative formula and result appear in Stage 3's own explanation. |
| M-3: Textbook naming-priority shortcut conflicts with chemoselectivity | Retained the scientifically defensible app example. The local source really does use this overbroad shortcut, but curriculum alignment is not a reason to reproduce it. Clarified ester/amide lone-pair resonance donation, acid–base competition and condition dependence. Acetal protection changes the functional group's electronic reactivity, not just steric bulk. No textbook passages or figures were copied into the app. |
| m-1: Missing equilibrium glyph in PDF | Confirmed in the Windows font character maps: regular and bold Segoe UI lack U+21CC. Added Segoe UI Symbol (or DejaVu Sans) fallback, selecting a supported font for each missing paragraph glyph. Generation now fails explicitly for unsupported characters instead of silently emitting a .notdef box. Emoji presentation selectors have no printed glyph; the decorative hand icon is typeset as “Hands-on:” in PDF text to avoid a ReportLab supplementary-character mapping defect. The app icon and scientific wording are unchanged. Three PDF font regression tests cover the arrow, decorative-icon normalization and rejection of unmapped supplementary characters. |
| m-2: Speciation colors and pH bounds unlabeled | Confirmed clarity issue. Added a persistent text legend identifying green A− and light-blue HA, both percentages, visible 0–14 bounds and an accessible slider value description. Added the concentration-model/activity-correction limitation; did not call the model universally exact. |
| m-3: Crowded tert-butyl drawing | Accepted a legibility correction, not proof of an impossible chemical graph. Changed only coordinates to a conventional 2D cross, keeping connectivity, atom indices, valence and C4H9Br. The walkthrough explicitly says this does not assert 90-degree physical bond angles; the carbon remains tetrahedral. |
| m-4: Alkyl-neighbor highlights inconsistent | Confirmed. Orange now identifies three carbon neighbors in the tertiary example versus one carbon neighbor in the primary example. Bromine remains identified by its element label rather than taking over the comparison color. |
| m-5: Carbon and oxygen share the focus color after selecting carbon | Accepted. The carbonyl carbon alone stays green, with oxygen orange as the partner in oxidation-state reasoning. The correct atom-selection key [1] is unchanged. |
| m-6: “1 oxidation state” displayed as if it were a unit | Confirmed wording issue. The numeric metadata now says dimensionless; the prompt requests a signed number. Shared completed-answer formatting omits the word “dimensionless” after the number, while meaningful physical units remain displayed. Input validation remains strict. |
| m-7: Chiral SN2 principle beside achiral bromoethane | Accepted clarification. The prompt explicitly transfers the rule to a separate chiral center and states that the displayed bromoethane is achiral. Feedback retains the distinction between geometric inversion and an R/S letter change. No stereocenter was invented in the graph. |
| m-8: Curriculum omissions | Added amphoteric water/bicarbonate, coordinate covalent donor logic, qualified acidity trends, four nucleophilicity factors, conditional acyl-derivative reactivity, named aqueous strong oxidants, LiAlH4 amide-to-amine reduction, and alpha acidity/enolate nucleophilicity. Added an original alpha-hydrogen walkthrough with an atom challenge. Did not adopt an unconditional free-acid-versus-ester reactivity order. These are introductory connections; Chapters 6, 7 and 9 develop the mechanisms in detail. |

## Sources inspected and interpretation limits

- Local `organic_chemistry_kaplan/OEBPS/chapter04b.xhtml`: chapter headings, amphoteric species, nucleophilicity factors, reducing/oxidizing agents and the naming-priority discussion. The report's `chapter04b_p2.html` filename and page/exercise references were not added as independently verified citations.
- [OpenStax SN1](https://openstax.org/books/organic-chemistry/pages/11-4-the-sn1-reaction): ion pairing and incomplete racemization. Opened the actual page; no source passage is embedded in the packets.
- [OpenStax SN2 characteristics](https://openstax.org/books/organic-chemistry/pages/11-3-characteristics-of-the-sn2-reaction): donor, steric and solvent effects.
- [OpenStax acyl substitution](https://openstax.org/books/organic-chemistry/pages/21-2-nucleophilic-acyl-substitution-reactions): leaving groups, resonance and acyl-derivative reactivity.
- [OpenStax aldehyde oxidation](https://openstax.org/books/organic-chemistry/pages/19-3-oxidation-of-aldehydes-and-ketones) and [amide chemistry](https://openstax.org/books/organic-chemistry/pages/21-7-chemistry-of-amides): condition-dependent oxidation and amide reduction to amines.

The reagent examples are MCAT-level summaries, not laboratory procedures or a complete reaction database. Free acids can protonate nucleophiles; catalysis, activation, substrate substitution, solvent and temperature can change observed chemoselectivity. K estimates require comparable pKa scales. The speciation bar is a simple monoprotic concentration model. A flat cross is a connectivity convention, not a 3D measurement.

## Recovery, execution and review status

Chapter 4 keeps five lessons, five workshops and 15 guided stages. The new alpha-hydrogen step is appended to the acids lesson, preserving existing step indices; original exercise IDs and answers remain stable. No saved solved workshop is silently substituted with a different question/key. Shared font, graph-coordinate and diagram changes require refreshed packets for all chapters.

Targeted checks cover original keys, signed/scientific numeric parsing, forward versus reverse equilibrium, feedback concealment, focus references, alpha-carbon connectivity, speciation conservation and endpoints, revealed ionic charge, and preserved tert-butyl formula/connectivity. Browser regressions additionally exercise the pH slider, expanded cards, alpha challenge, `1e5`, `+1` and rejection of appended unit text. Actual execution and PDF QA results are recorded in PROGRESS.md after they run.

Passing software checks do not establish independent chemistry verification. External expert sign-off, the earlier Chapter 1 candidate audit and the Chapter 2 chair visualization remain outstanding. Static screenshots cannot certify screen-reader usability, print dialogs, every animation timing or untested browsers.
