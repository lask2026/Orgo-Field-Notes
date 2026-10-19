# Chemistry review

## Review standard

Software checks validate schema, graph references, valence/formula consistency, and encoded answer behavior. They do not independently verify scientific correctness. Source-backed author review and external expert review are recorded separately. No external expert has signed off this application.

## Sources inspected

- Supplied `organic_chemistry_kaplan/OEBPS/toc.xhtml`: actual chapter sequence and section headings, Chapters 1–12.
- Supplied chapter body files, selectively read for curricular scope and disputed points. No quotations, textbook questions, or figures are included in distributed builds.
- IUPAC Blue Book P-1, P-4 and P-6: https://iupac.qmul.ac.uk/BlueBook/contents.html (nomenclature rules, accessed 2026-10-19).
- OpenStax Organic Chemistry, carbonyl overview and enolate acidity: https://openstax.org/books/organic-chemistry/pages/18-preview-of-carbonyl-chemistry and https://openstax.org/books/organic-chemistry/pages/22-5-acidity-of-alpha-hydrogen-atoms-enolate-ion-formation (cross-checks, accessed 2026-10-19).

## Chapter 1 corrections under implementation

- The alternative name for the graph described as “2,3-diethylpentane” is 3-ethyl-4-methylhexane, not 2,4-dimethylhexane. The separately drawn fake_pent graph remains 2,4-dimethylhexane.
- Principal suffix locants outrank ring double-bond locants. C1=C2 is the simple cycloalkene rule when no senior suffix controls numbering.
- Functional-group naming seniority is a convention, not an algorithm based on oxidation state.
- Retinal is the aldehyde form of vitamin A; steroid numbering uses established parent conventions, not the simple monocycle rule alone.
- Remove unsupported Kaplan figure/question/mnemonic attributions and unsupported numerical hydration constants.
- Avoid calling but-3-en-2-ol an enol: OH is not attached to an alkene carbon. The internal legacy molecule identifier is retained only for migration.

## Open review questions

External expert review has not yet been performed. Any remaining scientific ambiguities will be recorded here before delivery.

Chapter 1: corrections implemented and graph/formula checks passed. Per-step atom challenges now follow the displayed molecule. Names and formulas are concealed in practice until completion/reveal; SVG accessibility descriptions expose connectivity without leaking names.

Chapter 2: author-reviewed CIP ranking, E/Z graphs, Fischer (S) assignment, meso count, and butane conformations. Flat connectivity diagrams explicitly do not claim stereochemistry or chair geometry. Independent expert review pending.
