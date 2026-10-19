# Chapter 8 candidate-review adjudication

Reviewed 2026-10-19 against canonical JSON, molecular graphs, the current renderer, the supplied local curriculum body and the inspected sources below. Raw submitted audit preserved locally in review-results/ai-studio/chapter-08/submitted-review.txt (excluded from Git). Model agreement/confidence is candidate evidence, not independent chemistry verification. No textbook prose, figures or questions were copied into the app. Audit *_p2.html filenames and exact exercise/page claims were not adopted as local citations; local source files are chapter08b.xhtml.

## Answer derivations

All twelve original keys retained. Ethanoic acid's complete carboxyl group is [1,2,3]. Henderson–Hasselbalch gives A−/HA = 10^(6.8−4.8)=100, favoring carboxylate. The illustrated ester acyl carbon is 2; removing water favors Fischer ester formation, while acid plus amine in water initially favors an ammonium carboxylate salt. Acetoacetic acid loses carboxyl carbon 0 as CO2; three carbons remain and tautomerization gives acetone. Laurate oxygens [12,13] form the ionic head; hydrocarbon tails cluster toward an aqueous micelle interior. Triacylglycerol saponification yields glycerol and fatty-acid salts.

## Findings and decisions

| Finding | Adjudication |
|---|---|
| 1. Carbonyl troughs and crossing appearance | Confirmed layout defect. Flipped the acetoacetic-acid and laurate chain peaks/troughs; carbonyl oxygens point outward and the second acid oxygen lies across from the chain. Kept all bond orders, indices, composition formulas and laurate −1 charge. These remain conventional 2D drawings. |
| 2. Dark active-step contrast | Already repaired by the Chapter 5–6 shared CSS change. Retained the blue/white rule and existing measured contrast regression; refreshed Chapter 8 dark-mode capture to verify the current app. |
| 3. Acetone aliases | Added exact 2-propanone and dimethyl ketone aliases. Wrong structures and missing punctuation remain rejected. |
| 4. Ring wording | Clarified that a COOH substituent on a carbon ring has an exocyclic carboxyl carbon. Distinguished a lactone's endocyclic acyl carbon from free COOH. The old “need not” phrasing was too loose. |
| 5. Soap head/tail | Both steps now retain the complete carboxylate head [0,12,13]; hydrocarbon path is [1..11], excluding carbon 0. Focus groups and hydrocarbon path are disjoint. |
| 6. Empty highlights and completion | Empty highlights are not inherently a chemistry/state defect, so did not globally make all previous highlights sticky. Carried useful functional-group focus in acid-ratio/soap-head and the decarboxylation count. Naming/completion now shows acetone, with its own carbonyl focus and C3H6O formula. The general acid/amine transfer question beside an ester now has explicit context; its completion focus is intentionally empty. Shared completion labeling already identifies the displayed structure. |

## Sources and verification

- Supplied local chapter08b.xhtml body/summary inspected for terminal COOH, esterification, decarboxylation and soap scope; explanations are original.
- Product atom balance: C4H6O3 → C3H6O + CO2, zero charge on both organic acid and product; laurate C12H23O2 has net −1.

Three targeted Node groups check original keys/aliases/product formula and concealment, outward carbonyl geometry with preserved formula/charge, and disjoint head/tail focus. Full browser/regression and current PDF results are recorded in PROGRESS.md after execution. These checks establish internal software/graph consistency, not independent scientific certification.
