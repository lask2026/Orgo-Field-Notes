# Chapter 10 candidate-review adjudication

Reviewed 2026-10-19 against canonical JSON, molecular graphs, current renderer, supplied local chapter body and inspected references. The candidate report is preserved locally in review-results/ai-studio/chapter-10/submitted-review.txt, excluded from Git. Model confidence and key agreement are not independent scientific verification. The local source is chapter10b.xhtml; exact page/question claims tied to *_p2.html filenames were not adopted as app citations. No textbook passages, questions or figures are redistributed.

## Answer derivations and new assessment

All twelve original keys retained. Glycine has formal charges +1 and −1, summing to zero, and two alpha H, so is achiral. The supplied neutral-side-chain pKa model gives pI=(2.30+9.60)/2=5.95; the prompt now explicitly requests two decimals. Glycylglycine's internal peptide bond joins carbon 2 to nitrogen 4, amide resonance restricts rotation, and sequences run N to C. The aminonitrile carbon 2 becomes carboxyl carbon; its methyl remains the alanine side chain and achiral conditions give racemic chiral product. Phosphorus is atom 0; two P–O–C links make the model a phosphodiester. ATP hydrolysis is favorable because of the overall free-energy difference, not energy from isolated bond breaking.

Added Gabriel workshop: phthalimide anion nitrogen 7 is the protected N nucleophile; a deprotonated protected aminomalonate alkylates a suitable primary halide by SN2; one malonate-derived carboxyl carbon is lost in the usual single decarboxylation. This addition has its own ID and cannot inherit old solved progress.

## Findings and decisions

| Finding | Action and qualification |
|---|---|
| J-1: nitrile N highlighted with tracked carbon | Corrected success focus to carbon [2] only. Stage 2 success identifies retained methyl [0]. Active methyl question does not disclose its answer by pre-highlighting it. |
| J-2: synthesis colors and unrelated product canvas | Consistent carbon-source colors: future carboxyl carbon green, alpha carbon red, retained methyl orange across aminonitrile and alanine. Gabriel overview now displays the actual phthalimide anion reagent rather than unexplained alanine, with counterion omission explicit. It remains a route overview rather than a complete reaction simulator. |
| J-3: coverage | Added amphoteric behavior, qualified side-chain classes including Met/Cys/Pro/Phe/Trp, peptide condensation and hydrolysis, named Strecker reagent recognition, Gabriel reaction sequence and assessment, organic versus inorganic phosphate/Pi/PPi. Did not adopt uniformly effective phosphate buffering throughout the pH scale: useful regions cluster near the separate pKa values and depend on concentration and component ratios. |
| M-1: Fischer text below skeletal graph | Explicitly refers to the separate Fischer diagram below and states that the skeletal graph leaves configuration unspecified. |
| M-2: oxygen badge on bond | Shared badge placement now searches clear of bonds and element labels with a larger radius and boundary constraints. Direct element hit targets and letter/keyboard/alternative buttons retain stable indices; transparent connector hit regions preserve usable click area. Letter H in an atom badge is explicitly an identifier, not hydrogen. |
| M-3: incomplete carboxylate focus | Included both terminal oxygens: [0,6,7,8]. |
| M-4: pI rounding | Supplied pKa values now 2.30 and 9.60, with an explicit two-decimal instruction. Kept the correct key and strict tolerance rather than accepting a broad numerical interval. |
| M-5: phosphate typography | Uses H₂PO₄⁻/HPO₄²⁻ consistently. |
| M-6: Hill order | Kept canonical atom-count field H3O4P; new optional displayFormula H3PO4 supplies conventional notation in revealed UI and full packets. Unit checks require identical elemental counts; net charge handling is unchanged. |
| M-7: narrow native selector and textbook numbering | Wrapped chapter introduction now contains the full title; concept tabs explicitly say Lesson 1, Lesson 2, etc., avoiding false textbook section correspondence. Native select options may abbreviate at narrow widths, but the complete title remains visible in the page. |

## Sources and checks

- Supplied chapter10b.xhtml body, synthesis and phosphate scope inspected; original educational wording retained.
- [OpenStax Chemistry 2e 14.6, buffers](https://openstax.org/books/chemistry-2e/pages/14-6-buffers), inspected for buffer components/capacity. The source's pKa span does not establish uniform buffering between pKa values.

Four targeted Node groups cover keys/precision, tracked indices, complete termini, phosphate display atom counts, Gabriel graph charge/hydrogens and carbonyl badge clearance. Browser and PDF results are recorded in PROGRESS.md after execution. Source-backed author review remains distinct from expert sign-off.
