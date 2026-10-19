# Chapter 9 candidate-review adjudication

Reviewed 2026-10-19 against canonical JSON, molecular graphs, the current renderer, the supplied local curriculum body and the inspected sources below. Raw submitted audit preserved locally in review-results/ai-studio/chapter-09/submitted-review.txt (excluded from Git). Model agreement/confidence is candidate evidence, not independent chemistry verification. No textbook prose, figures or questions were copied into the app. Audit *_p2.html filenames and exact exercise/page claims were not adopted as local citations; local source files are chapter09b.xhtml.

## Answer derivations

All nine original keys retained. The beta-lactam ring amide endpoints are [0,1]; its ring contains nitrogen and three carbons (four atoms), so the family is lactam. Methyl ethanoate's electrophilic carbon is 1; tetrahedral intermediate collapse reforms C=O with leaving-group departure. Among comparable ordinary anhydride/ester/amide examples, amide is least reactive. O-methyl carbon 4 leaves with the alkoxy fragment; excess aqueous NaOH gives acetate/ethanoate and protonation of the leaving methoxide gives methanol. CH3OH and MeOH identify that same alcohol; CH3O− is methoxide, not methanol.

## Findings and decisions

| Finding | Adjudication |
|---|---|
| 1. Conjugation contradiction | Expanded the explanation rather than adopting the curriculum's universal shortcut. Delocalization can stabilize reactants as well as intermediates/transition states; relative activation free energies set rates. Enones support separate 1,2 and 1,4 sites. Amide lone-pair donation reduces electrophilicity. Induction and steric effects were added with condition dependence. The supplied local source does contain the broad conjugation-reactivity heuristic, but alignment does not justify teaching it as universal scientific fact. |
| 2. Arrow crowding and intermediate layout | Atom-label clearance already fixed by the Chapter 5–6 renderer; kept the source/target references and inspected current arrows. Spread the intermediate's four single bonds into an uncluttered 2D projection while preserving indices, graph, C3H7O3 and net −1 charge. Explicitly stated that its projected 90-degree directions do not represent physical tetrahedral bond angles. The first arrow is intentionally a partial mechanism, already labeled as such; no claim to draw the incoming nucleophile was added. |
| 3. Alcohol aliases | Prompt now explicitly permits name or condensed formula; added exact CH3OH/MeOH aliases. No fuzzy formula stripping or automatic inference. Did not add every historical synonym, which is not necessary to repair the confirmed gap. |
| 4. Heading mismatch | Renamed step 1 “Acyclic ester” and added the direct O-versus-N comparison. |
| 5. Naming consistency | Option/summary now state acetate (ethanoate). Both are valid names; this was a teaching-clarity issue, not an incorrect original answer. Completion explicitly states that the canvas retains starting ester while the products are described in text. |
| 6. Coverage | Added condensation/Fischer equilibrium, ester/amide/anhydride naming, beta/gamma/delta ring sizes, ordinary amide acylation requirements and tertiary-amine acylammonium caveat, saponification, condition-dependent cyclic anhydride formation, induction/sterics/protection, and angle/torsional strain with substrate-dependent orbital distortion. Did not claim Fischer conditions require absolutely zero water, that all tertiary amines are inert, that all diacids cyclize, or that all beta-lactam nitrogens have identical pyramidalization. |

## Sources and verification

- Supplied local chapter09b.xhtml body/summary inspected, including electronic effects, condensation, naming and strain.
- [OpenStax 21.1, derivative naming](https://openstax.org/books/organic-chemistry/pages/21-1-naming-carboxylic-acid-derivatives), inspected.
- [OpenStax 21.2, nucleophilic acyl substitution](https://openstax.org/books/organic-chemistry/pages/21-2-nucleophilic-acyl-substitution-reactions), inspected.
- [OpenStax 21.3, acid reactions and esterification](https://openstax.org/books/organic-chemistry/pages/21-3-reactions-of-carboxylic-acids), inspected.

Three targeted Node groups exercise unchanged keys and explicit aliases/rejections, four separated intermediate bonds with composition/charge balance, and qualified reaction/naming teaching. Live browser tests submit formula aliases and reject methoxide; fresh captures are reviewed for arrow/glyph separation. Final evidence is recorded in PROGRESS.md. No automated or model result constitutes expert chemistry sign-off.
