# Automated chemistry review

This workflow gathers candidate model evidence. It cannot produce credentialed expert sign-off. Every result records `scientificVerification: false` and `humanExpertSignoff: pending`. A completed response means its required IDs and JSON passed software checks, not that its chemistry is correct.

## Use the accounts you already have

- **AI Studio / Gemini web app:** use the existing per-chapter PDF workflow in `review-packets/START-HERE.md`. Submit `01-BLIND-EXERCISES.pdf` first in a fresh chat. Save the independent attempt before submitting the full chapter packet in a separate chat. Use an available reasoning-capable model; do not claim that a model is a human expert.
- **ChatGPT Plus:** use a different fresh chat as another reviewer with the same blind-first procedure. Save the model name/date and original output. Subscription use and API billing are separate.
- **Unattended local review:** use Ollama through the PowerShell wrapper below. No API key is needed. Local model output remains candidate evidence.
- **Unattended cloud review:** configure Gemini API credentials locally. A Gemini consumer subscription does not establish the API quota or billing status of an AI Studio project. Check that project's model availability, quota and billing before executing. Free-tier access can be sufficient for a bounded pilot where the selected model is eligible; this runner does not establish eligibility or promise a free run.

The web PDF workflow includes screenshots. The automated runner sends text and graph JSON; it cannot judge actual rendering, clicks, animations or clipping. Existing browser tests and visual review remain necessary. No subscription browser sessions are controlled by the runner, and manual PDF reviews are not automatically imported into its ledger.

## Local setup

From `C:\AI\projects\MCAT\Orgo`:

```powershell
Copy-Item .\review-config\panel.ollama.example.json .\review-config\panel.local.json
```

Edit the local config's explicit model tag to one shown by `ollama list`. Start Ollama if needed. The runner never downloads a model. `llama3.1:8b` is the compatibility example, not a chemistry recommendation. For the inspected 31 GB RAM / AMD Radeon system, pilot `qwen3.5:9b` before considering a larger model. This is a practical starting point, not an independently measured chemistry ranking. Download size is not total runtime memory; context and GPU support affect speed and capacity. Do not download anything merely to run the dry preview.

Preview one chapter without model requests, credentials, result writes or billing:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\run-chemistry-review.ps1 -Chapter 1
```

Run at most one inference request:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\run-chemistry-review.ps1 -Chapter 1 -Execute -MaxRequests 1 -Resume
```

After inspecting the response, resume in bounded increments:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\run-chemistry-review.ps1 -Chapter 1 -Execute -MaxRequests 10 -Resume
```

To cover all chapters with one stable run identity, use `-Chapter all` consistently. There are currently 279 primary cases **per reviewer**; challenge requests are additional. Changing the chapter selector, config, source content, runner, case engine or notes starts a different run. Changes to an installed local model digest invalidate matching record reuse. Use the same config and selector when resuming.

`-Phase blind`, `-Phase audit`, and `-Phase challenge` restrict **new** requests. With `-Resume`, matching completed records from earlier phases are loaded for context/coverage without requesting those phases again. Audit without an earlier successful blind attempt records `hasIndependentAttempt: false`. Each call uses an isolated conversation; all blind cases precede keyed requests for a chapter.

For a matched Qwen/Llama local pilot, use `review-config/panel.qwen-llama.example.json` (Qwen3.5:9b and Llama3.1:8b, 16K context, 2K output budget, Qwen `think: false`). Four requests in blind phase select the first two exercises for both models. Both models must already be installed. Qwen's optional extended-thinking channel is disabled for this bounded pilot; answer explanations are still requested. This setting is not a benchmark of Qwen with extended reasoning enabled.

```powershell
Copy-Item .\review-config\panel.qwen-llama.example.json .\review-config\chapter01-qwen-llama-pilot.local.json
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\run-chemistry-review.ps1 -Config review-config/chapter01-qwen-llama-pilot.local.json -Chapter 1 -Phase blind -Execute -MaxRequests 4
```

Ollama responses now stream to avoid the HTTP client's five-minute wait for non-streaming response headers. The runner retains the parsed stream frames and final aggregate, applies the same completion/schema checks, and saves received partial text if a response stream breaks. An explicit reviewer `think` boolean is Ollama-only; omit it for models without a thinking capability. The configured overall timeout still applies. Streaming and thinking settings are recorded through the runner/config signatures; older results remain in their own run directories.

Exit codes: 0 means the selected primary coverage is complete with no requested challenge pass left partial; 2 means partial work, including bounded runs; 1 means a configuration/preflight/execution exception. Transport/provider failures are saved as partial results and stop further inference in that invocation. There are no automatic retries. A resume explicitly retries failed or invalid work. Exit 0 never means scientific approval.

## Optional Gemini API panel

Copy `review-config/panel.hybrid.example.json` to `review-config/panel.local.json`. Replace the `CHOOSE_...` placeholder with an explicit model ID available to your AI Studio project. Keep the local reviewer or remove it for a cloud-only pilot. Configure `challengeReviewer` to an existing reviewer ID. Put credentials only in the named environment variable using your preferred local secret mechanism; never in the config, repository or chat.

The runner supports Ollama and Gemini API, not OpenAI API. Configuring ChatGPT Plus as an API key will not work. Preview is the default. Only `-Execute` issues model calls. `-MaxRequests` caps new inference calls, **not dollars**; model token prices, thinking tokens, quotas and billing settings determine cost. Local inventory checks are additional non-inference requests. The API model's reported version and usage metadata are retained when returned.

Every primary reviewer independently receives blind cases, keyed exercise audits, lesson audits, molecule audits and curriculum-scope cases. If configured, a challenge pass rechecks candidate findings, model-declared uncertainty, blind/key differences and textual disagreements once primary reviews for the affected case are complete. A challenge is an additional model call, not a third independent expert. Training-data independence is not established, even across providers. Textual disagreement can be a formatting difference. No vote changes curriculum or closes findings.

## Source evidence and adjudication

Without curated source notes, non-blind cases remain flagged `no-curated-source-evidence` even if models agree. To provide notes, copy `review-config/references.example.json` to `review-config/references.local.json` and add `"referenceFile": "review-config/references.local.json"` to the panel config. Each reference entry requires:

```json
{
  "id": "unique-source-id",
  "title": "Actual inspected source title",
  "url": "https://authoritative-source.example/relevant-page",
  "checkedOn": "2026-10-19",
  "caseIds": ["ch01:exercise:gp1a"],
  "notes": "Your original bounded summary of the source material actually inspected."
}
```

This illustrative entry is not a verified reference; replace every field with inspected material. Notes are never included in blind calls. The runner checks metadata shape and case IDs, but neither fetches the URL nor confirms that the supplied notes accurately represent it. Do not supply textbook excerpts or files. Only original review inputs and explicitly configured notes are uploaded to Gemini. Textbook directories, PDFs and screenshots are not uploaded by this tool. A reference ID mentioned by a model remains an unverified citation until a reviewer checks it.

Results live under ignored `review-results/panel/<run-hash>/`: manifest, raw provider responses, validated case records, histories, chapter summaries, a combined summary and `REPORT.md`. Preserve these privately; they may contain your supplied notes. Configuration and reference files ending `.local.json` are ignored. Reports retain gaps, uncertainty, candidate findings and blind/key disagreements. Challenge answers remain in `summary.json`; they never automatically remove queue entries. Inspect their derivations and authoritative evidence, then document a separate adjudication and any resulting change. No model-generated commands execute and no curriculum is modified automatically.

Conservative byte-based context estimates reject oversized requests without truncating inputs. Truncated, incomplete, malformed, duplicate-ID and unknown-ID responses do not count as completed. Resume checks source/config/prompt/model signatures and revalidates raw output. These checks establish provenance and structural validity, not honest reasoning or scientific correctness. Do not run two writers against the same run directory concurrently.

## Legacy result validity

The pre-existing untracked `scripts/audit/run-expert-review.mjs` copied canonical keys into alleged blind results without calling a model, then wrote `scientificVerification: true`. Its existing `review-results/expert/` records and summary do **not** establish independent attempts, scientific review or sign-off. Original files are preserved with a local `VALIDITY-NOTICE.md`; the original script backup is `legacy-runner-source.mjs` (SHA256 `564aa0e133d3fb15d180aa99df850e6a7e0c6e9c138a7815cbd96936eb9f299d`). The old entry point now forwards to the real runner and defaults to preview. New results are stored separately.

## Verification and limits

Run `npm test`, `python scripts/validate_schema.py`, and `node scripts/audit/check-packets.mjs`. The new panel tests inject mock provider responses: they test blind isolation, strict response checking, cloud credential handling, request caps, phase/resume behavior, stale packets, partial results, challenge provenance and refusal to certify. They are not chemistry tests or evidence that a live Gemini API call succeeded. No real paid request is needed for these tests. Application rendering is unaffected by this tooling change.

Documentation inspected for account/API and local model guidance: [OpenAI subscription/API distinction](https://learn.chatgpt.com/docs/pricing), [Gemini billing and tiers](https://ai.google.dev/gemini-api/docs/billing), [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output), [Ollama chat API](https://docs.ollama.com/api/chat), [Qwen3.5 model tags and sizes](https://ollama.com/library/qwen3.5). These are tooling references, not independent chemistry evidence.
