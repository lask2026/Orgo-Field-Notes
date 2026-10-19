# Chapter 6 candidate-review adjudication

Reviewed 2026-10-19. Raw candidate report is preserved locally in review/results/ai-studio/chapter-06/submitted-review.txt, excluded from Git. Candidate confidence labels are not expert certification.

## Answer derivations

The original twelve keys were re-derived and found chemically defensible in isolation. Eleven original tasks remain unchanged. Ethanal is attacked at carbon 1; its pi pair shifts toward oxygen, allowing a tetrahedral addition center without five carbon bonds. The hemiacetal carbon is 1 and bears OH plus OR; acid catalysis and water removal favor further acetal formation. Cyanohydrin nitrile carbon is 4, and the molecule contains four carbons. Hydride attacks acetone carbon 1, giving a secondary alcohol, propan-2-ol, after protonation. The former secondary-amine → enamine question was correct chemistry but unrelated to its cyanohydrin canvas; it was replaced with a new C–C bond-selection task [1,4]. This is a changed assessment, not a correction of an incorrect old key.

## Decisions

| Finding | Decision and repair |
|---|---|
| 1. Acetal/ketal terminology | Distinguish traditional hemiacetal, hemiketal, acetal and ketal by oxygen substituents and H/R versus R/R at the center. Explain inclusive IUPAC usage. The ketal is labeled a separate example, not the immediate next product of the displayed ethanal hemiacetal. The audit overstated omission: the old cue did already mention hemiketals/ketals. |
| 2. Alcohol alias | Added exact isopropyl alcohol alias; kept strict punctuation and regioisomer rejection. Did not indiscriminately add every suggested nonpreferred name. |
| 3. Coverage | Added aldehyde/ketone suffixes, ring carbaldehyde, oxo prefix, common name pairs, conditional boiling-point trend, named oxidants with medium/workup, anhydrous PCC selectivity without exclusivity, ammonia condensation, qualified imine–enamine tautomerism, and protection compatibility. Secondary amines form enamines through iminium alpha deprotonation; the displayed imine and enamine have different substituents/formulas and are explicitly not a tautomeric pair. Tollens is ammoniacal Ag(I), not a generic primary-alcohol oxidant; basic oxidation gives carboxylate before acid workup. H2O2 requires suitable conditions. |
| 4. Carbonyl arrow | Reusable quadratic flow geometry approaches visible atom labels from an outer side with 24px endpoint clearance instead of running across oxygen. Both atom-origin and bond-origin arrows retain their authored electron source/target references. Unit sampling checks carbonyl curve clearance; all Chapter 6/7/9 authored flows have finite geometry and are visually inspected in refreshed captures. These remain partial mechanism schematics where the nucleophile is not drawn. |
| 5. Question/canvas mismatch | Replaced the unrelated enamine stage with selection of the actual new cyanohydrin C–C bond. New workshop ID cyanohydrin-bond prevents old solved progress from certifying this new task. Carbon 4 and nitrogen 5 now receive distinct focus colors. Hydride final stage and completion show isopropanol (C3H8O). The generic addition canvas explicitly retains starting ethanal because the incoming nucleophile/product is unspecified; completion labels its displayed structure/formula. |
| 6. Symmetry | Corrected ketal and hydrate oxygen coordinates while preserving connectivity, formulas, names and atom indices. |

## Verification and limits

Four targeted Node groups exercise the retained tasks and aliases, displayed product/concealment, renamed workshop progress invalidation, new bond endpoints, symmetric graph layouts and arrow clearance. Live browser regression submits the new atom pair and alcohol alias and checks product formula; full multi-chapter suites remain the authoritative runtime evidence. Curriculum alignment uses local chapter06b.xhtml, not assumed *_p2.html filenames. No external expert chemistry sign-off or universal AAMC terminology claim is made.

## Inspected references

- Supplied local Kaplan chapter body and section scope; no passages distributed.
- [IUPAC Gold Book, acetals (search-index definition inspected; direct page fetch unavailable)](https://goldbook.iupac.org/terms/view/A00062)
- [OpenStax 19.3, aldehyde oxidation](https://openstax.org/books/organic-chemistry/pages/19-3-oxidation-of-aldehydes-and-ketones)
- [OpenStax 19.8, imines and enamines](https://openstax.org/books/organic-chemistry/pages/19-8-nucleophilic-addition-of-amines-imine-and-enamine-formation)
