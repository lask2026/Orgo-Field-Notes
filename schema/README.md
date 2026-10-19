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

Stage `molecule` optionally selects a different graph for transfer questions. Its highlights and atom answers refer to that graph; previous-graph highlights and the exercise-wide diagram are suppressed when switching. Audit blind cases include the replacement graph without author names, formulas or keys.
Newman names and energy commentary are withheld in active Guided Practice; Learn & Explore retains them.

The `orbitals` schematic uses `subshells`: one to three labeled rows, each with one to seven `electrons` occupancy values (0, 1 or 2) per orbital box. Arrows represent spin states; row spacing is not a quantitative energy axis. Authoring checks must confirm Pauli/Hund consistency for the intended atom. Do not attach a filled teaching diagram to an active quiz that it answers.
Composition `formula` remains charge-free Hill notation. `formulaLabel` adds net charge summed from atoms wherever a formula is revealed; never write an ionic charge into the composition string. For two-carbon all-carbon graphs, the renderer writes terminal hydrogen groups without introducing H atom indices. Multi-character atom-group highlights use wider ellipses; letter controls stay offset from element labels.

Dimensionless number stages retain `unit: "dimensionless"` in schema metadata; inputs state that convention, and completed answers omit it as a unit suffix. Stage feedback may explain the current decision but must not disclose a later calculation. Speciation diagrams must identify both HA and A− in text, including slider bounds.

Exercise `concealStructure: true` withholds the candidate graph throughout active practice and blind review inputs, revealing it on completion. Use a fresh exercise ID when removing a prior answer-bearing canvas. Audit tooling must omit both exercise and stage graphs from those blind inputs. Do not use this for atom-selection tasks that require a graph.

Molecule `displayFormula` optionally changes conventional element ordering for revealed labels (for example H3PO4) while canonical `formula` remains charge-free Hill composition H3O4P; tests require identical atom counts. Atom `showHydrogens` requests an explicit element/H group on a skeletal carbon, useful for an aldehydic CH, without adding H graph indices.

Spectrum peaks may declare `shape: "broad"` with positive `width` (illustrative full width at half maximum in axis units), or `lines` (1–7) and positive `spacing` for a first-order binomial line cluster. Multiplets with more than one line require spacing; broad bands require width. Spectra are illustrative, never experimental data. Signal identifiers must be distinct from atom letters. Width/spacing/peak height are not integration or inferred experimental coupling constants. Match each lesson step's diagram to its displayed structure.

Concept tabs use explicit Lesson numbers, not textbook section numbers. The wrapped chapter introduction includes the full chapter title even when a native narrow select control abbreviates its option text. Heteroatom selection badges are positioned clear of element labels and bonds; direct element hit regions and alternative 44px atom buttons retain the same stable indices.
