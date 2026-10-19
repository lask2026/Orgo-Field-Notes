# Chapter authoring contract

`chapter.schema.json` uses JSON Schema Draft 2020-12. Every chapter defines objectives, real provenance, review status, lessons, and exercises. `molecules.schema.json` defines the shared graph repository.

- IDs are stable. Exercise IDs are namespaced by chapter in saved progress.
- Atom indices are zero-based, rendered as A, B, C, etc. A bond is `[atomA, atomB, order]`; bond orders are 1, 2, or 3. Implicit hydrogens follow ordinary C4/N3/O2/halogen1 valences; charged N+ uses 4 and O− uses 1. Specify `h` explicitly when required. Formula is Hill-order ASCII, with charge stored on atoms, not in the formula. `cond` is a readable description, not used as a concealed-answer label.
- `highlights` can contain `path`, `prin`, `sub`, `num`, `alpha`. Numbering is the ordered list of atom indices. Paths must be contiguous. `num` is a numbering overlay, not a new graph.
- `highlights.flow` adds illustrative curved electron-pair arrows. Each arrow has exactly one origin (`fromAtom` or `fromBond`) and exactly one destination (`toAtom` or `toBond`). Bond indices are zero-based in the graph's bonds array. Describe partial mechanisms explicitly; an arrow overlay is not a reaction simulator.
- Step `focus` can be `rule`, `cue`, `trap`, or `app` to open and highlight the relevant teaching card as the walkthrough advances.
- Lessons contain at least two steps, four teaching cards, and a molecule. Steps can switch molecule, show a name, render name anatomy, or attach a molecule-specific atom challenge. Do not reuse a challenge after changing the displayed molecule.
- Each exercise belongs to a lesson and has at least two stages. Supported types: `atoms` (exact unordered set), `choice` (one zero-based option index), `text` (explicit accepted aliases), `number` (finite value, absolute tolerance, separately displayed unit). There is no fuzzy matching. Text normalization changes case, typographic dashes, and incidental spacing, but preserves punctuation and descriptors.
- Every stage needs two progressive hints and a correct-answer explanation. Hints count as assisted study. Keep the complete solution out of early hints. Future stage content is omitted from the DOM until reached.
- `diagram` is a reusable schematic: Fischer projection, rotatable butane Newman projection, illustrative stick spectrum, normal-phase TLC trend, or monoprotic acid fraction calculator. These are not experimental spectra or quantitative chromatography predictions.
- Only the lesson `text` and four card fields allow curated HTML: paragraphs, emphasis, code, lists, line breaks, subscript/superscript. No executable HTML, event attributes, embedded media, or textbook figures. All other fields are escaped.

Validation: `python scripts/validate_schema.py` checks schemas; `node --test tests/unit.test.mjs` checks graph/formula consistency, references, and stage behavior. Neither independently verifies chemistry. Review provenance and mechanistic assumptions separately.
