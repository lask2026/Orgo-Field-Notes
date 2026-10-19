# Scientific and model review

- `scripts/`: packet generation, local capture/PDF tools and the bounded Ollama/Gemini review runners.
- `config/`: example settings and ignored local configuration. Credentials remain in environment variables.
- `packets/`: chapter blind/full PDFs, source bundles, prompts and snapshot evidence. Begin with `packets/START-HERE.md` or `packets/INDEX.md`.
- `results/`: original responses and reviewer output. Local model/API/legacy output stays ignored as before; preserved notes remain tracked. The old expert records remain invalid independent-review evidence.
- `docs/`: chapter adjudications, the automated-review guide and local-model pilot report.
- `templates/`: subject-neutral blind/keyed prompts and biology/physics/chemistry rubrics.

From the project root, preview work without inference or uploads:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\review\run-chemistry-review.ps1 -Chapter 1
powershell -NoProfile -ExecutionPolicy Bypass -File .\review\run-llama-review.ps1 -Chapter 2 -DryRun
```

To build chapter review packets, use `npm run audit:build`; to verify existing packets, use `npm run audit:check`. The packet builder captures the actual local app and builds PDFs; it performs no model review or upload. Text-only preparation uses `powershell -NoProfile -ExecutionPolicy Bypass -File .\review\build-review-packets.ps1 -TextOnly` and explicitly does not refresh screenshot/PDF evidence.

For AI Studio source review, upload `packets/APP-SOURCE-REVIEW.txt` with `packets/APP-SOURCE-REVIEW-PROMPT.txt`. The source includes every key and is not a blind input. After future application changes, rebuild the app and refresh this text copy with `Copy-Item .\Orgo-Field-Notes-offline.html .\review\packets\APP-SOURCE-REVIEW.txt`. Use separate fresh chats and blind packets for independent attempts. Do not assume an uploaded source snapshot is a running app.

The reorganization preserved canonical content, packet/PDF/screenshot bytes and original model evidence. `RELOCATION-MAP.json` maps former paths to current paths. Historical response signatures and embedded paths were deliberately not rewritten; they record their original run. Current runners use relocated configuration and new tool signatures, so old runs are not silently relabeled/reused as fresh execution.

Source fingerprints use stable logical source names plus actual content hashes. Moving identical source bytes does not invalidate a scientific packet; changing source/content still does. Model output and key agreement remain candidate evidence, never human expert sign-off.
