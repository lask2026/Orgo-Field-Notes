# Chapter 1 local blind pilot — 2026-10-19

Qwen3.5:9b is installed in Ollama. Four local responses completed: both models independently attempted `gp1a` and `gp1b`, three stages each. Qwen matched all six encoded answers; Llama matched four and gave an invalid complete name twice. Qwen's explanations still contain substantive errors. This is a completed small pilot, not a complete chapter review or expert sign-off.

## Results

| Model | Responses completed | Stages matching encoded keys | Complete names matching keys | Total request time | Output tokens |
|---|---:|---:|---:|---:|---:|
| Qwen3.5:9b, thinking disabled | 2/2 | 6/6 | 2/2 | 304.25 seconds | 2,500 |
| Llama3.1:8b | 2/2 | 4/6 | 0/2 | 104.75 seconds | 621 |

| Case | Qwen submitted name | Llama submitted name | Qwen seconds | Llama seconds |
|---|---|---|---:|---:|
| `gp1a` | `3-methylhexane` | `2-methylheptane` | 142.13 | 64.17 |
| `gp1b` | `2,4-dimethylhexane` | `2-methyl-4-ethylpentane` | 162.12 | 40.58 |

Both models selected the encoded chain/numbering choices. Scores above compare against the app's keys; the reasoning was separately inspected below. All four responses passed structural response checks. No model output changed curriculum or answer validation.

## Author inspection of the actual explanations

These are author deductions from the supplied graphs, not independent expert certification or externally sourced review.

- **Qwen, `gp1a:stage-2`:** selected the expected left-to-right direction, but repeatedly stated that reverse numbering puts the branch at C5. The six-atom parent path is `0–1–2–3–4–5`; in reverse, atom 2 is C4. The comparison is C3 versus C4. A correct choice concealed an incorrect explanation.
- **Qwen, `gp1a` limitations:** said stereochemistry was unspecified and then assumed the molecule achiral. Atom 2 has H, methyl, ethyl and propyl groups, so it is a stereogenic center. The flat graph leaves configuration unspecified; that does not make the molecule achiral.
- **Qwen, `gp1b` limitations:** claimed C2 and C4 are chiral. C2 has two identical methyl groups and is not a stereogenic center; C4 has four different substituents. The absence of an encoded R/S configuration is correctly identified, but the stereocenter count is wrong.
- **Qwen reporting:** all six findings are ordinary observations with `correction: "None"`, despite the instruction to reserve findings for actual or suspected defects. These are not six confirmed application bugs. Its first summary also uses the imprecise phrase “heptane derivative” while correctly deriving a hexane parent elsewhere.
- **Llama, `gp1a:stage-3`:** submitted `2-methylheptane`. That name contains eight carbons, whereas the graph contains seven. Its explanation contradicts both its earlier six-carbon selection and its own C3 branch statement. The graph supports a six-carbon parent with methyl at C3.
- **Llama, `gp1b:stage-3`:** submitted `2-methyl-4-ethylpentane` and asserted a five-carbon longest chain immediately after selecting the option explaining that six carbons are available. The graph supports a hexane parent with methyl groups at C2 and C4. Both terminal naming attempts therefore fail for chemical reasons, not merely punctuation or rejected aliases.
- **Llama evidence quality:** its coverage claims “correct IUPAC name provided” in the first case despite that incorrect name. The second case has empty coverage notes and explanations largely repeating the selected options. Self-declared coverage is not independent evidence of correctness.

No curriculum defect was established by this pilot. Model errors are preserved in the original responses, not silently corrected in those records. Earlier Chapter 1 candidate-audit adjudication remains outstanding.

## Setup and reproducibility

Inspected hardware: about 31 GB usable RAM, AMD Radeon graphics; Ollama reported Qwen using CPU memory and zero GPU memory. Ollama version: `0.40.6`. Settings: temperature 0, 16,384 context tokens, 2,048 maximum output tokens, 900-second overall timeout; Qwen reviewer specifies `think: false`. Llama has no optional thinking setting. Both received the same system prompt and original blind case text, graph connectivity, questions and choices. Keys, hints, reference notes and peer answers were absent. Each request used an isolated conversation.

Installed model identities:

- Qwen: `56671c2ab9385f9cfcb404638e32cd62d88e3501d44822208363c010179a3c90`
- Llama: `46e0c10c039e019119339687c3c1757cc81b9da49709a3b3924863ba87ca666e`

Completed run: `0357a25d656ce7fffc1d` under `review-results/panel/`. Its original case records retain provider metadata, stream frames, full submitted JSON and key comparisons. The compact tracked record is `artifacts/chapter01-local-pilot.json`, including original submitted reviews and SHA256 hashes of the raw record files. The run-level chapter report correctly remains partial: this tested 4 of the 92 reviewer/case combinations for Chapter 1, including only blind cases.

Local configurations:

- `review-config/chapter01-qwen-llama-pilot.local.json`: the matched two-model pilot.
- `review-config/panel.local.json`: a Qwen-only default was created because no default config existed. Running the wrapper without `-Execute` remains a preview.
- `review-config/panel.qwen-llama.example.json`: tracked reproducible pilot settings.

Repeat the four-request sample using the existing local config:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\run-chemistry-review.ps1 -Config review-config/chapter01-qwen-llama-pilot.local.json -Chapter 1 -Phase blind -Execute -MaxRequests 4
```

Without `-Resume`, this reruns the sample and archives existing records. With `-Resume`, matching completed work is reused and the budget applies to subsequent missing/failed cases. Do not run additional cases unless you intend to extend the sample.

## Transport failure and repair

The initial Qwen attempt used default extended thinking and an 8,192-token output budget. It failed after about 304 seconds before a complete non-streaming response arrived. This is consistent with Node fetch's approximately five-minute response-header limit despite the configured 900-second overall timeout; the saved generic transport error did not retain the lower-level cause. Ollama logs showed active generation followed by cancellation. That failed attempt is preserved separately under `review-results/panel/5e353b977d5b53d32bcb/`. It is not included in the answer or timing table and does not establish Qwen's extended-thinking accuracy.

The runner now requests streaming responses, checks bounded incoming bytes, retains frames/final metadata, reconstructs the answer, and preserves received partial text on stream failure. Strict JSON/coverage/completion checks remain in place. An optional boolean `think` is supported only for Ollama reviewers. New tests exercise terminal and incomplete frames, malformed streams, partial transport, explicit thinking settings and UTF-8 chemical glyphs split across network chunks.

After repair, all **82 Node groups**, **13 schema documents**, and packet checks for **279 cases / 827 screenshots / 24 PDFs** passed. No app renderer, curriculum, browser behavior, distributed build or review PDF changed; browser/regression suites were not rerun for this review-transport/configuration change.

## What this comparison supports

Qwen is a useful candidate for a broader local blind sample: it produced better naming answers here. It is not a reliable final chemistry authority. Its incorrect stereochemical statements show why explanation review must accompany key comparisons. AI Studio and a separate ChatGPT review can supply further candidate evidence; source checking and human expert sign-off remain pending.

Only two simple related naming exercises were sampled, with no repeated trials, stereochemical diagrams, mechanisms, spectra or other chapters. Choice prompts contain scaffolding, including chain lengths and locants. Qwen's thinking mode was disabled; its first successful request also benefited from cached prompt evaluation after the failed attempt. Timings include different loading/cache conditions and different answer lengths. Generation rates were roughly 8.6–8.8 tokens/sec for Qwen and 8.9–9.8 for Llama; most of Qwen's longer wall time came from its longer output. Do not generalize this into a controlled speed benchmark, a broad model ranking or independent chemistry verification.
