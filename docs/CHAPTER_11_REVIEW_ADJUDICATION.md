# Chapter 11 candidate-review adjudication

Reviewed 2026-10-19 against canonical JSON, molecular graphs, current renderer, supplied local chapter body and inspected references. The candidate report is preserved locally in review-results/ai-studio/chapter-11/submitted-review.txt, excluded from Git. Model confidence and key agreement are not independent scientific verification. The local source is chapter11b.xhtml; exact page/question claims tied to *_p2.html filenames were not adopted as app citations. No textbook passages, questions or figures are redistributed.

## Answer derivations

All twelve original keys retained. Acetone's C=O endpoints are [1,3]; IR activity requires a changing dipole moment and reduction can produce an alcohol OH band. Butadiene carbons [0,1,2,3] participate in conjugation; a smaller excitation gap means longer wavelength and A=10000×1×0.000020=0.20. Ethyl ethanoate's OCH2 carbon is 4; three equivalent neighboring methyl H give a quartet and the terminal methyl gives a three-H triplet. For C3H6O, DBE=1; a six-H singlet and ketone evidence identify two equivalent methyl groups surrounding C=O, acetone. Exact accepted aliases now include 2-propanone and dimethyl ketone.

## Findings and decisions

| Finding | Action and qualification |
|---|---|
| 1. Valid aliases rejected | Added exact 2-propanone/dimethyl ketone; wrong structures and lost punctuation remain rejected. |
| 2. Peak A/B/C conflicts with atom letters | Spectrum uses Signal 1/2/3 everywhere. Captions distinguish signal numbers from graph letters, preserving stable atom indices. |
| 3. Proton-free linkage has primary focus | Focus now marks H-bearing carbons [0,4,5], with carbonyl carbon [1] contrasted. Wording explains these are three distinct environments, not one set because of a shared focus color. |
| 4. Orbital/NMR vocabulary | Added qualified HOMO/LUMO pi excitation, TMS reference, upfield/downfield, J in Hz and nuclear-spin criteria. Avoided the false “odd mass required” simplification: odd-odd nuclei such as ²H/¹⁴N can be active too; activity is not a guarantee of a simple observable signal. |
| 5. Stick spectra and mismatched IR | Reusable spectrum renderer supports binomial line clusters and broad Gaussian teaching bands with schema-validated spacing/width. Quartet 1:3:3:1 and triplet 1:2:1 are shown; heights are not integrals and spacing is not a measured J. Each IR lesson step has its own ketone, alcohol or acid diagram. The previous renderer did not actually persist the ketone spectrum on diagram-free steps; the audit's persistence suspicion was not a confirmed runtime bug. Added matched diagrams as an educational improvement. |
| 6a. Ethyl path | Path now [4,5], omitting H-free ester O. |
| 6b. Weak alternative | Replaced ethanal comparison with propanal, same C3H6O/DBE and a carbonyl, with explicit terminal aldehydic CH. NMR now discriminates the candidates rather than carbon count alone. |
| 6c. Off-center two-carbon graphs | Shifted ethene and ethanal horizontally without changing chemistry or atom indices; shared references and flow remain graph-relative. |
| 6d. Structure gives away identification | Added reusable concealStructure behavior: no candidate SVG/accessible graph in active combined-evidence practice, and no graph in blind JSON/PDF inputs. Structure appears on completion. New workshop ID prevents old completion under the answer-bearing canvas from certifying the revised task. Source keyed/full-review data still deliberately contain the author solution. |

## Sources and checks

- Supplied chapter11b.xhtml body/scope inspected.
- [OpenStax 13.1, nuclear magnetic resonance](https://openstax.org/books/organic-chemistry/pages/13-1-nuclear-magnetic-resonance-spectroscopy), inspected.
- [OpenStax 13.6, spin splitting](https://openstax.org/books/organic-chemistry/pages/13-6-spin-spin-splitting-in-1h-nmr-spectra), inspected.
- [OpenStax 14.7, ultraviolet spectroscopy](https://openstax.org/books/organic-chemistry/pages/14-7-ultraviolet-spectroscopy), inspected.

Four targeted Node groups check original answers/aliases/arithmetic, eight multiplet lines and binomial heights, step-matched IR bands, propanal formula/H, active UI and blind-data graph concealment, completion reveal and prior-ID invalidation. These are schematic spectra, not experimental datasets or independent spectroscopy verification. Runtime and final packet checks are recorded in PROGRESS.md.
