# Chemistry review — 2026-10-19

## Review standard

Software checks validate schema, graph references, valence/formula consistency, and encoded answer behavior. They do not independently verify scientific correctness. Source-backed author review and external expert review are recorded separately. No external expert has signed off this application.

All twelve chapters have undergone source-backed author review. No known unresolved chemistry defect remained after the final author audit. External verification tasks remain open below. Tests cannot establish that an encoded graph matches its name, that a mechanism is correct, or that an explanation is scientifically complete.

## Sources inspected

- Supplied `organic_chemistry_kaplan/OEBPS/toc.xhtml`: actual chapter sequence and section headings, Chapters 1–12.
- Supplied chapter body files, selectively read for curricular scope and disputed points. No quotations, textbook questions, or figures are included in distributed builds.
- IUPAC Blue Book P-1, P-4 and P-6: https://iupac.qmul.ac.uk/BlueBook/contents.html (nomenclature rules, accessed 2026-10-19).
- OpenStax Organic Chemistry, carbonyl overview and enolate acidity: https://openstax.org/books/organic-chemistry/pages/18-preview-of-carbonyl-chemistry and https://openstax.org/books/organic-chemistry/pages/22-5-acidity-of-alpha-hydrogen-atoms-enolate-ion-formation (cross-checks, accessed 2026-10-19).

## Chapter 1 corrections implemented

- The alternative name for the graph described as “2,3-diethylpentane” is 3-ethyl-4-methylhexane, not 2,4-dimethylhexane. The separately drawn fake_pent graph remains 2,4-dimethylhexane.
- Principal suffix locants outrank ring double-bond locants. C1=C2 is the simple cycloalkene rule when no senior suffix controls numbering.
- Functional-group naming seniority is a convention, not an algorithm based on oxidation state.
- Retinal is the aldehyde form of vitamin A; steroid numbering uses established parent conventions, not the simple monocycle rule alone.
- Remove unsupported Kaplan figure/question/mnemonic attributions and unsupported numerical hydration constants.
- Avoid calling but-3-en-2-ol an enol: OH is not attached to an alkene carbon. The internal legacy molecule identifier is retained only for migration.

## Open review questions

1. Independent expert review of names/graphs, stereochemical assignments, mechanism arrows, and every answer explanation remains pending.
2. Experimental spectra could supplement the schematic spectroscopy material later; none is claimed here.
3. Additional browser and assistive-technology testing could assess how effectively the visual chemistry reaches more learners. Keyboard controls and textual connectivity are implemented and tested, but this is not a full accessibility certification.

Chapter 1: corrections implemented and graph/formula checks passed. Per-step atom challenges now follow the displayed molecule. Names and formulas are concealed in practice until completion/reveal; SVG accessibility descriptions expose connectivity without leaking names.

Chapter 2: author-reviewed CIP ranking, E/Z graphs, Fischer (S) assignment, meso count, and butane conformations. Flat connectivity diagrams explicitly do not claim stereochemistry or chair geometry. Independent expert review pending.

Chapter 3 (Bonding): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 4 (Analyzing Organic Reactions): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 5 (Alcohols): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 6 (Aldehydes and Ketones I): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 7 (Aldehydes and Ketones II: Enolates): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 8 (Carboxylic Acids): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 9 (Carboxylic Acid Derivatives): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 10 (Nitrogen- and Phosphorus-Containing Compounds): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 11 (Spectroscopy): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

Chapter 12 (Separations and Purifications): original content aligned to supplied section headings and summary. Connectivity, formulas, encoded keys, and atom selections checked. Author review complete; external expert review pending.

## Additional external cross-checks

Accessed 2026-10-19:

- [OpenStax SN1](https://openstax.org/books/organic-chemistry/pages/11-4-the-sn1-reaction): racemization and ion-pair qualifications.
- [OpenStax IR regions](https://openstax.org/books/organic-chemistry/pages/12-8-infrared-spectra-of-some-common-functional-groups): approximate functional-group absorptions.
- [OpenStax proton splitting](https://openstax.org/books/organic-chemistry/pages/13-6-spin-spin-splitting-in-1h-nmr-spectra): the first-order n+1 model.
- [OpenStax conjugation and UV](https://openstax.org/books/organic-chemistry/pages/14-8-interpreting-ultraviolet-spectra-the-effect-of-conjugation): relative wavelength and energy trends.
- [Waters size-exclusion primer](https://www.waters.com/nextgen/us/en/education/primers/beginners-guide-to-size-exclusion-chromatography/gpc-basic-chemistry.html): pore access and elution order.

## Additional corrections and distinctions

No separate historical bug list was supplied; fixes were based on inspection of the two reference files and curriculum.

- Preserve chemical punctuation in answer validation rather than using the additional reference's punctuation-stripping normalization. Accepted aliases are explicit.
- Bind each Learn challenge to its displayed molecule. Switching from vicinal to geminal diol, or among acid derivatives, changes target atoms and explanation.
- Qualify oxo/formyl and ring-carbaldehyde naming: simple acyclic examples do not establish universal rules.
- Avoid claims that naming priority determines reaction selectivity, that SN1 must give exactly 50:50 products, or that inversion always changes the R/S letter.
- Distinguish hydroquinone from hydroxyquinone; aldol addition from dehydration; fatty-acid neutralization from ester saponification.
- Require activation/appropriate conditions for efficient amide formation from acids and amines. Do not imply spontaneous peptide formation in water.
- Distinguish overall ATP hydrolysis free energy from the energy required to break a bond.
- The formula check caught and prompted repair of the dimethyl phosphate monoanion formula to C2H6O4P; the neutral acid would contain one additional H. This is an internal-consistency repair, not independent chemistry verification.

## Modeling assumptions

Chapter 2 external-review follow-up: adjudicated six findings from the user's pasted model report. Added optical-rotation coverage, strain/resolution detail and original exercises; improved explicit aliases and highlights; preserved correct Fischer stereochemistry under a 180-degree redraw. Active challenge highlighting was already concealed and is now regression-tested. See docs/CHAPTER_02_REVIEW_ADJUDICATION.md for the finding-by-finding decisions, source checks, and limitations. The report is not treated as expert sign-off or verification of every molecular graph.

- Skeletal structures omit ordinary implicit H atoms; ions omit counterions. Formulas count atoms without a charge suffix; formal charges appear on atoms.
- Flat connectivity drawings do not assign tetrahedral stereochemistry or represent equilibrium chair geometry. Fischer and E/Z diagrams specify spatial conventions separately.
- Curved arrows illustrate particular electron-pair movements. Partial mechanisms are described as partial; the renderer is not a mechanistic simulator.
- Spectra are illustrative positions, not experimental measurements. The NMR plot labels multiplicities in its caption rather than simulating full multiplet line shapes.
- IR regions, proton shifts, and pKa values are approximate. Speciation assumes a simple monoprotic model. TLC sliders illustrate a trend and do not predict a real Rf.
- Reagent selectivity, equilibria, and chromatography depend on substrate and conditions. Conditions and limitations accompany the rules.
