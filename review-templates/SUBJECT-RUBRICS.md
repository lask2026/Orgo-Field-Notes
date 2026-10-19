# Subject-specific scientific review rubrics

Attach only the relevant rubric alongside the universal prompt and review inputs, or include it within the keyed bundle. These are review questions, not a verified curriculum. Use the actual supplied outline and target level. Check each principle in its stated context instead of applying blanket rules. Preserve uncertainty and cite only inspected sources.

## Biology

- **Scope and context:** Is the statement about a molecule, organelle, cell, tissue, organism or population? Are organism/species, cellular compartment, physiological state, experimental conditions and relevant exceptions specified? Avoid transferring a rule between contexts without justification.
- **Structures and labels:** Do diagrams correctly identify parts, locations, orientations, compartments and transport directions? Are graphical arrows causal, material-flow or regulatory relations, and is that meaning explicit? Distinguish a schematic scale from anatomical scale.
- **Sequences and genetics:** Check sequence direction, strand identity, complementarity, transcription/translation roles, genotype/phenotype distinctions, alleles, segregation assumptions and probability denominators. Preserve biologically meaningful names/case. Verify that pedigrees and inheritance conclusions follow from the data and stated assumptions rather than an unstated universal pattern.
- **Pathways and regulation:** Track inputs, products, locations, energy carriers and regulatory direction. Distinguish enzyme activity from enzyme expression and direct effects from downstream consequences. Check feedback, saturation and condition dependence; inspect every arrow label and stage-specific highlight.
- **Physiology and homeostasis:** Identify the variable, sensor, controller and response where applicable. Check direction and time scale of changes, transport gradients, hormonal context and interactions among systems. Avoid converting a simplified educational relation into a universal claim or patient-specific advice.
- **Evolution and populations:** Check the level of selection, inheritance assumptions, variation, fitness context, population versus individual changes and appropriate conditions for quantitative models. Do not describe adaptation as an individual's goal-directed biological redesign.
- **Experiments and plots:** Identify controls, interventions, dependent variables, axes, sample context and what the experiment can support. Distinguish correlation from causation, association from mechanism and biological significance from statistical evidence. Do not infer measured quantities from illustrative drawings.
- **Assessment quality:** Can the original question have more than one defensible answer? Are distractors false under the stated conditions? Are synonyms accepted only when scientifically equivalent? Does feedback explain the actual biology rather than repeat a keyword?

## Physics

- **System and assumptions:** Identify the system boundary, reference frame, coordinate axes, sign convention, initial/boundary conditions and approximation regime. Check whether friction, resistance, losses, field uniformity or other idealizations are stated where necessary. Avoid applying a special-case equation as a universal law.
- **Dimensions and units:** Check dimensional homogeneity, constants, SI conversions, prefixes, squared/cubed units, angle conventions and dimensionless quantities. An encoded numerical key without appropriate units/meaning is not sufficient evidence.
- **Vectors and diagrams:** Check magnitudes, directions, components, projections and which object an arrow acts on. Free-body diagrams, circuits, fields and ray diagrams must correspond to the question's actual system. A drawing's apparent size or angle is not a measured given unless stated.
- **Derivations and calculations:** State the governing relation, conditions and substitutions; check algebra, signs, orders of magnitude, precision and tolerances. Use a separately justified calculation or conservation/limiting check where possible. Do not test an equation by reproducing the same mistaken implementation as its expected value.
- **Conservation and limits:** Check appropriate conservation balances and account for transfer/dissipation consistently. Test limiting or boundary cases only where the model applies. Distinguish a model's failure outside its regime from an arithmetic error inside it.
- **Graphs and simulations:** Verify axes, scales, units, slopes, areas, phase and causal interpretation. Check slider endpoints and ranges against the governing model. Numerical stability, timestep and discretization may need actual execution; do not claim that source reading demonstrates dynamic behavior.
- **Conceptual distinctions:** Inspect common confusions such as scalar/vector, position/displacement, speed/velocity, force/energy, potential/potential energy, field/force, frequency/amplitude and equilibrium/steady state in the relevant chapter. Require conditions, not memorized keyword associations.
- **Assessment quality:** Confirm that all required givens are present, conventions are unambiguous, accepted alternatives are equivalent and distractors have the intended physical meaning. Preserve meaningful minus signs, vector direction and units. Do not disguise a valid alternative as a wrong answer merely because it differs from the author's form.

## Organic chemistry

- Derive connectivity, atom count, formula, charge, ordinary valence and naming from the actual graph, honoring explicit H/charge/stereo data.
- Distinguish stereogenic centers, whole-molecule symmetry and specified configuration; do not assign R/S or E/Z from an ordinary flat drawing without sufficient spatial information.
- Check reaction conditions, electron source/target, mechanistic scope, competing pathways, equilibrium/kinetics distinctions and stage-specific products/intermediates.
- Audit spectra and separation data with appropriate assumptions; distinguish experimental evidence, hypothetical givens and explanatory schematics.
- Compare keys, aliases, graph selections and explanations without weakening chemical punctuation or inventing textbook references. The current Orgo application has additional detailed conventions in AGENTS.md.

## General chemistry and biochemistry extension checklist

- Check species/state, charges, atom/charge balance, stoichiometry, concentration/activity assumptions and the conditions attached to quantitative relations.
- Distinguish equilibrium, reaction rate and thermodynamic favorability. Inspect sign/standard-state conventions, approximation regimes and unit/dimensionless metadata.
- For biochemical systems, check molecular form, protonation/context, compartments, pathway direction, regulation, energy coupling and experimental interpretation.
- Add chapter-specific asset and assessment rules before treating this checklist as sufficient support for an entire new subject.

## Adding another subject

Define its target level and actual outline; scientific asset types and conventions; likely misconceptions; quantitative/statistical checks; accepted-answer semantics; authoritative evidence needs; and what requires visual/runtime inspection. Pilot narrative, numerical and diagram cases as applicable. Demonstrate that both intentional faulty fixtures and valid items are handled sensibly before scaling. Do not infer support merely because the generic prompt can name the subject.
