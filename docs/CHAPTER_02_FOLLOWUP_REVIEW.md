# Chapter 2 follow-up: candidate audit and local Llama attempts

Reviewed 2026-10-19. The user supplied a second external audit plus eight saved local `llama3.1:8b` blind attempts. These are candidate evidence, not independent expert certification. The original result files remain unchanged in the ignored `review-results/` directory.

## Local run assessment

All eight blind response records report completion and cover all 24 stage IDs. Their source SHA-256 is `afe988d3371a2c61a9c471ef9fb0934bf2b06d6670508568ed7a3ec49866dcc9`. They predate the changes below. The files include raw response text and model digest. Completion describes response execution and structure, not chemistry correctness. The two saved keyed exercise records do not establish completion of the full keyed review.

There are 13 answers matching the encoded keys and 11 differing. **13/24 is key agreement, not a scientific accuracy score**: several matching answers have false or insufficient reasoning. For example, `isomer-pair:stage-3` selects option 1 (ethanol only), but its reasoning incorrectly calls ethanol an ether and reverses the donor roles. The external candidate audit's all-matching answer table is a different attempt from these local Llama files.

| Local Llama disagreement | Submitted answer | Adjudication from the supplied graph/data |
|---|---|---|
| butane-rotation:stage-1 | [0,2] | [1,2]. The central bond in 0–1–2–3 joins the two internal carbons. |
| butane-rotation:stage-2 | Gauche | Anti. The specified methyl–methyl dihedral is 180 degrees. |
| stereocenters:stage-1 | [0,2] | [1,2]. Both internal carbons have four different substituents; terminal methyl carbons do not. |
| stereocenters:stage-3 | 2 | 3: one meso form plus an enantiomeric pair. |
| fischer-cip:stage-2 | Option 0 (away) | Option 1 (toward). H is on a horizontal Fischer bond. |
| ez-chirality:stage-1 | [0,2] | [1,2]. The explicit order-2 graph edge connects 1 and 2. |
| specific-rotation:stage-1 | 0.05 | 0.50 dm = 5.0 cm / 10. |
| specific-rotation:stage-2 | 48 | +60 = +2.4 / (0.080 × 0.50), in degrees·mL/(g·dm). |
| specific-rotation:stage-3 | 96 | +4.8 degrees = 60 × 0.040 × 2.0. |
| optical-mixture:stage-2 | 85 | 70% ee = 85% − 15%. |
| optical-mixture:stage-3 | −40 | +28 degrees = +40 × 0.70 under the stated matched conditions. |

Other reasoning limits: electronegativity is not the CIP ranking criterion; the Fischer S result needs the entire priority sequence and inversion for H toward the viewer; E/Z compares higher-priority substituents rather than the positions of the alkene carbons themselves. Symmetry alone does not establish achirality without an appropriate improper symmetry operation. The app keys remain unchanged after these derivations. Llama's empty findings lists do not justify sign-off.

## Attached audit decisions

| Finding | Decision and implemented action |
|---|---|
| 1: Identical Fischer diagrams described as a rotation | Confirmed. Replaced the erroneous sentence with “Use the same Fischer projection with C1 at the top.” The S assignment and mirrored R diagram remain consistent. |
| 2: Newman caption reveals Anti | Confirmed. Active Guided Practice hides conformation names and energy commentary at every slider angle; Learn & Explore and completed workshops retain teaching labels. |
| 3: Butane shown beside chair question; flat lesson hexagons | Partly addressed. Added a reusable optional stage molecule override. The transfer question now shows cyclohexane connectivity and suppresses the unrelated Newman widget. The blind packet includes the replacement graph. **Open:** the two chair walkthroughs still use explicitly labeled connectivity hexagons; no actual chair/axial/equatorial visualization has been implemented. |
| 4: Hidden atom letters and internal index in prose | Confirmed. Student-facing prose now identifies the terminal CH3 of ethyl and the highlighted ethyl carbons. |
| 5: Alias symmetry | Accepted the explicit parenthesized locanted older-name variants `(2S)-2-butanol` and `(2Z)-2-butene`. Did not add every proposed unparenthesized string or `cis`: the prompts request stereodescriptors and validation deliberately preserves nomenclature punctuation. Alias symmetry alone is not evidence that every spelling is a valid IUPAC name. Wrong configurations and malformed names remain rejected. |
| 6: Missing Unicode in PDF | Confirmed by inspecting font character maps: Windows Arial lacks the three reported code points. Switched to Segoe UI (DejaVu Sans fallback) and added a generation-time glyph preflight for both regular and bold fonts. Rebuilt all packets because the defect affects the common generator. Browser unit strings are checked separately. |
| 7: Later prompt reveals Z in blind packet | Confirmed. Reworded it to “this alkene isomer”; it no longer names the earlier answer. |

## Evidence and limits

The [IUPAC stereochemical terminology page](https://iupac.qmul.ac.uk/stereo/FM.html) was opened for the Fischer depth convention: horizontal groups project above the plane and vertical groups below it. The legacy Gold Book optical-rotation URL returned HTTP 502 on this follow-up; no new reference verification is claimed for that page. Polarimetry arithmetic was re-derived using the app's explicitly stated dm and g/mL convention.

The audit's claimed access to `chapter02*_p2.html` is not independently established by this record. It does not establish complete curriculum or textbook verification. No textbook passage or figure has been added to distributed content.

Validation includes schema, graph/reference and answer checks, targeted concealment/transfer/alias tests, full browser and regression suites, packet provenance checks and sampled rendered PDFs. Passing results are recorded in PROGRESS.md after execution. These checks cannot certify chemistry. A genuine chair visualization and external subject-matter review remain outstanding. The earlier Chapter 1 candidate review is a separate pending task.

## Reuse of saved results

Keep these historical attempts. The updated packet has a new source fingerprint; do not manually relabel the old records as current. A future runner invocation with `-Resume` will rerun stale cases and archive replaced records. Rerunning the same model on familiar questions is a repeat review, not a fresh blind human experiment. Do not spend time rerunning only to obtain agreement; use derivations and qualified review to adjudicate disagreements.
