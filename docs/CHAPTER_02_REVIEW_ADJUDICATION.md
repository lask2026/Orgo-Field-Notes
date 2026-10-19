# Chapter 2 review adjudication

The user supplied an external model's Chapter 2 audit. This record distinguishes accepted improvements from claims that required qualification. The review did not identify an incorrect key among the original 15 stages. It does not constitute independent expert sign-off of the app or the entire molecule repository.

## Findings and actions

| Finding | Decision | Action |
|---|---|---|
| 1: Specific rotation and optical vocabulary missing | Confirmed curriculum gap | Added an optical-activity lesson and a three-stage specific/observed-rotation workshop, including cm-to-dm conversion, mass-concentration convention, sign, temperature/wavelength/solvent caveats, and dimensionally explicit units. |
| 2: Strain and conformational coverage incomplete | Accepted expansion; original text was a simplification, not a wrong anti/gauche key | Added angle/torsional/steric definitions, 0/60/120/180-degree butane distinctions, 1,3-diaxial and boat flagpole crowding, nonplanar small-ring shapes, and chair-flip pathway context. Used “totally (fully) eclipsed” in the distractor. |
| 3: Resolution and relative/absolute distinctions missing | Confirmed coverage gap; suggested blanket retention rule needs qualification | Added resolution through diastereomeric salts/derivatives and chiral chromatography. Added a resolution workshop and explained that retained spatial arrangement does not guarantee a retained R/S label after priorities change. |
| 4: Challenge highlighting spoiler and partial ethyl highlight | UI-spoiler suspicion not reproduced in active challenge; highlight clarity improvement accepted | Existing Learn renderer substitutes clickable, unhighlighted atoms while Try It Yourself is active. Added a regression assertion for this behavior and the lettered controls. Expanded ethyl highlighting to include its terminal second-sphere carbon. Walkthrough teaching highlights remain intentional. |
| 5: ee question repeats the worked numbers and is attached to achiral butene | Accepted pedagogical improvement; original “Separately” wording did not claim butene has enantiomers | Replaced that stage with an achirality/racemate distinction tied to Z-but-2-ene. Moved mixture calculations into a chiral-structure workshop using different 85:15 data. |
| 6: Descriptor aliases narrow | Accepted optional UX improvement, without weakening validation | Added explicit correct locanted descriptors and full-name aliases. Wrong R/E descriptors, malformed names, and missing punctuation remain rejected. |

## Fischer projection

The previous ethyl-top, methyl-bottom Fischer drawing was a valid S projection. C1-at-top is a useful conventional presentation. The diagram was rotated 180 degrees: methyl top, ethyl bottom, H left, OH right. This preserves S. The mirrored diagram remains R. Prompts, explanations, hints, diagrams and accepted forms were updated consistently; automated coordinate/priority checks support consistency, not independent scientific verification.

## Specific-rotation conventions

The common solution convention used here is [alpha] = alpha_obs/(l*c), with l in dm and c in g/mL. Therefore specific rotation in this convention has units degrees*mL/(g*dm), rather than simply degrees. Concentration expressed per 100 mL must be converted or a correspondingly adjusted equation used. Practice values are explicitly hypothetical, not literature measurements for butan-2-ol. Observed sign must be measured; R/S and uppercase D/L do not predict it.

## Source checks and limits

- Inspected the supplied `organic_chemistry_kaplan/OEBPS/chapter02b.xhtml` discussion of conformation, optical activity, specific rotation, resolution and configuration.
- [IUPAC optical rotatory power](https://old.goldbook.iupac.org/html/O/O04313.html) defines normalization by path length and mass concentration.
- [IUPAC stereochemical terminology](https://iupac.qmul.ac.uk/stereo/FM.html) specifies Fischer depth conventions and discusses the conventional chain orientation in its configuration conventions.
- The pasted review refers to `chapter02b_p2.html`/`chapter02a_p2.html`, which are not the actual filenames in this workspace. Its particular page/question/boxed-equation assertions were not adopted as new app citations.
- Its molecule-coverage count (“9 ... remaining 36”) does not match the current 68-molecule repository. Do not treat that statement as verification of all current graphs.
- Original source prose, figures and assessment questions were not copied into the app or upload packets. New explanations and exercises are original.

## Recovery and follow-up

The revised E/Z workshop has ID `ez-chirality`, replacing `ez-ee`; a saved solve for the old unrelated ee question will not count as completion of the new question. Other existing workshop IDs remain stable. The new optical lesson is appended, preserving earlier concept indices.

Rebuilt app and Chapter 2 review packets must be used for the next review. Old Llama outputs retain their original source hash and are stale for the revised chapter. Independent expert review remains pending.
