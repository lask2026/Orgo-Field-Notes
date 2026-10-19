# Chapter 7 candidate-review adjudication

Reviewed 2026-10-19 against canonical JSON, molecular graphs, the current renderer, the supplied local curriculum body and the inspected sources below. Raw submitted audit preserved locally in review-results/ai-studio/chapter-07/submitted-review.txt (excluded from Git). Model agreement/confidence is candidate evidence, not independent chemistry verification. No textbook prose, figures or questions were copied into the app. Audit *_p2.html filenames and exact exercise/page claims were not adopted as local citations; local source files are chapter07b.xhtml.

## Answer derivations

All twelve original answers retained. Pentan-2-one carbonyl carbon 1 has alpha carbons 0 and 2, both bearing H. Removing alpha H gives a resonance-stabilized anion; resonance changes electron placement, not nuclei. Carbon 0 is the less hindered methyl-side kinetic site under the stated bulky-base conditions; low temperature and irreversible deprotonation favor kinetic trapping. Neutral keto/enol forms move H and a double bond, so are tautomers. In 3-hydroxybutanal, carbon 2 bears the beta OH, aldol addition gives the displayed product, and the new/retro-cleaved bond connects carbons 1 and 2. In methyl vinyl ketone, carbon 1 is carbonyl, carbon 3 is beta, and direct carbonyl attack is 1,2-addition.

## Findings and decisions

| Finding | Adjudication |
|---|---|
| 1. Acute aldehyde layout and badge collision | Confirmed drawing problem, not corrupted connectivity. Aldol and but-2-enal now start with a carbonyl peak and outward oxygen; beta OH was repositioned with the flipped chain. Shared numberBadgePosition searches around a vertex for a location clear of bonds and element labels instead of always placing the badge upward. Atom indices, formulas and unspecified stereochemistry remain intact. Tests measure carbonyl angles and badge-to-bond distance. |
| 2. Invisible letter references | Replaced B/C/D-only walkthrough references with structural positions and the actual focus colors. Carbonyl, alpha and beta remain identifiable by connectivity, not color alone. Interactive answer feedback can still use visible letter badges. |
| 3. Arrow/charge collision and missing contributor | The curved-arrow clearance was already repaired in the Chapter 5–6 shared work; retained it and checked fresh captures. Added the carbon-charged contributor as a separate walkthrough step with identical nuclei/composition/charge and explicit two-H carbanion metadata. Charged carbons now display their group and charge. Contributors describe a delocalized ion, not separate species interconverting in time. |
| 4. Michael highlight context | Stage 3 now explicitly distinguishes the carbonyl (C=O) site from beta, with green carbonyl and orange beta visible after the preceding answer. Its prompt does not require the color overlay, so blind graph-only cases remain self-contained. Final focus returns to carbonyl. Colors indicate current task roles rather than permanent alpha/beta identity; changed-focus descriptions now say so. No active atom-selection answer is highlighted in advance. |
| 5. Coverage | Added induction, qualified aldehyde/ketone alpha acidity and addition trends, condition-dependent alpha racemization/epimerization, and imine–enamine tautomerism. Did not adopt universal rapid racemization, universally favored imines, or the claim that every enamine has a neutral imine tautomer. Tertiary enamines lacking N–H instead protonate to iminium ions. |
| 6. Numerical pKa evidence request | Checked OpenStax 22.5 directly: its table gives approximate ethanal alpha-H pKa 17 and acetone 19; the prose acetone example gives 19.3. Replaced an unspecific 17–21 range with named approximate examples and an explicit solvent/scale caveat. This is a source-backed numerical cross-check, not a derivation or expert sign-off. The packet still does not embed textbook reference passages. |

## Sources and verification

- Supplied local chapter07b.xhtml body/summary, including acidity, racemization and enamine sections; overgeneralizations qualified rather than copied.
- [OpenStax 22.5, acidity and enolate formation](https://openstax.org/books/organic-chemistry/pages/22-5-acidity-of-alpha-hydrogen-atoms-enolate-ion-formation), table and prose inspected.
- [OpenStax 19.4, aldehyde/ketone addition](https://openstax.org/books/organic-chemistry/pages/19-4-nucleophilic-addition-reactions-of-aldehydes-and-ketones), inspected.

Four targeted Node groups cover unchanged keys/alpha H, graph geometry/badge clearance, contributor conservation and displayed carbon charge, and Michael context/concealment. Runtime and refreshed PDF results are recorded in PROGRESS.md after execution. Actual enolate solvation/metal coordination and stereochemistry are beyond the connectivity model. Independent expert verification remains open.
