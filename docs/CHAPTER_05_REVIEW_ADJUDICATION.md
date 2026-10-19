# Chapter 5 candidate-review adjudication

Reviewed 2026-10-19. The raw submitted audit is preserved locally in review-results/ai-studio/chapter-05/submitted-review.txt, excluded from Git. This is source-backed author adjudication of candidate findings, not independent expert sign-off.

## Answer derivations

All twelve original stage answers are retained. The tert-butanol OH-bearing carbon is atom 1, with three carbon neighbors, hence tertiary. In propan-2-ol atom 1 is oxidized; retaining the C–C skeleton gives a ketone, propanone. The central ketal carbon is atom 1; aqueous acid regenerates the ketone. Sulfonylation occurs at sulfur and retains the alcohol C–O bond; a later displacement can instead invert carbon. Quinone oxygens are atoms 6 and 7; reduction adds two hydrogen equivalents: C6H4O2 + 2 H+ + 2 e− → C6H6O2. Atom/charge balance gives two electrons, not four.

## Decisions

| Finding | Decision and repair |
|---|---|
| 1. Dark active step | Confirmed: the old dark theme inherited a light background with white text. Added an explicit blue/white active-step rule at the actual .sbar location; browser tests measure contrast in both themes at mobile and desktop widths. |
| 2. Product aliases | Added exact 2-propanone and dimethyl ketone aliases. Punctuation and wrong regioisomers remain strictly rejected. No fuzzy name stripping. |
| 3. Ketal terminology | Teach the traditional aldehyde-derived acetal versus ketone-derived ketal distinction and broad IUPAC usage. The drawn example is explicitly a ketal. The audit's universal claim about AAMC naming conventions is not treated as a sourced official rule. |
| 4. Product/canvas mismatch | Final oxidation naming stage displays acetone; the reduction-count stage displays hydroquinone. The sulfonate stage displays mesylate with explicit analogous tosylate wording. Completion identifies the displayed structure by name before its formula; names/formulas remain concealed while solving. Existing stage-molecule overrides were reused. |
| 5. Curriculum gaps | Added qualified aqueous alcohol acidity and solvation, inductive effects, comparative diol/branching properties, -ol/-diol/hydroxy and ring locants, named Cr(VI)/PCC conditions and hydrate overoxidation, MsCl/TsCl plus base, carbonyl protection compatible with many bases/hydrides, vitamin K and CoQ context. Sulfonates remain activated leaving groups rather than universal alcohol protection. Hydroxyquinone formation remains condition-dependent, not a universal second oxidation step; hydroquinone is not hydroxyquinone. |
| 6. Mesylate highlight | Included the S-bound methyl carbon 4 in the complete sulfonate-group focus [2,3,4,5,6]. Stable atom indices retained. |
| 7. Crowded sulfonate | Repositioned both terminal S=O oxygens symmetrically around sulfur; graph, formula and bond orders unchanged. A connectivity diagram does not assign real bond angles. |
| 8. Class aliases | Added tertiary alcohol and 3° alcohol explicitly. |
| 9. Redox hint | Progressive hints now compare hydrogen counts and balance H+ and charge without stating the electron count. |
| 10. Disabled options | Keep disabled choice opacity at 1 and mark the correct option with the established green success style only after successful submission. No correctness class appears before an answer. |

## Verification and limits

Four targeted Node groups cover aliases/rejections, unchanged answers, product formula and concealment, graph/highlight geometry, redox balance, and correct-option state. Full browser and regression evidence is recorded in artifacts/test-results.json and PROGRESS.md after successful execution. Runtime checks cannot certify scientific accuracy. Local curriculum files are chapter05b.xhtml and its companion files, not the audit's *_p2.html filenames; quoted page/question references were not adopted as app citations. Original explanations only; no textbook figures or questions are redistributed.

## Inspected references

- Supplied local Kaplan chapter body and section scope; no passages distributed.
- [IUPAC Gold Book, acetals (search-index definition inspected; direct page fetch unavailable)](https://goldbook.iupac.org/terms/view/A00062)
- [OpenStax 17.2, alcohol properties](https://openstax.org/books/organic-chemistry/pages/17-2-properties-of-alcohols-and-phenols)
- [OpenStax 17.6, alcohol reactions](https://openstax.org/books/organic-chemistry/pages/17-6-reactions-of-alcohols)
- [OpenStax 17.7, alcohol oxidation](https://openstax.org/books/organic-chemistry/pages/17-7-oxidation-of-alcohols)
- [NIH ODS, vitamin K](https://ods.od.nih.gov/factsheets/VitaminK-HealthProfessional/)
- [PubChem BioCyc human ubiquinol-10 pathway, indexed description](https://pubchem.ncbi.nlm.nih.gov/pathway/BioCyc%3AHUMAN_PWY-5872)
