# Local Llama pipeline pilot

The installed `llama3.1:8b` model was contacted through local Ollama. One Chapter 2 blind case and its corresponding keyed audit produced structurally valid saved responses. These were limited pipeline checks, not a complete chapter review. One earlier comparison attempt timed out and was reported as an error; the longer-timeout retry completed. The latest record replaced that initial failed attempt during development. The final runner now archives previous case records before replacement.

The pilot contained **model chemistry errors**:

- For `isomer-pair:stage-2`, the model called the formula C2H4O. Ethanol and the supplied dimethyl ether graph have formula C2H6O.
- For `isomer-pair:stage-3`, it selected “This ether only” as the O-H hydrogen-bond donor while its own reasoning correctly stated that ethanol has O-H and the ether does not. The correct choice in the app is “Ethanol only.”
- The subsequent comparison response repeated these mistakes and placed some observations with correction “None” into its findings list.

No curriculum correction was made from those responses. The app's answer to this example is consistent with its structure. The final runner includes explicit encoded-key comparisons for parsable blind answers and instructions to keep correct observations out of findings. These features help triage; they do not make Llama's chemical reasoning reliable or independently establish that an app key is correct.

Raw local results are retained under `review-results/llama/chapter-02/llama3.1_8b/` and ignored by Git. Prompts were compacted and refined after the pilot. Resume signatures include the exact prompt, so mismatching earlier responses will not be silently reused for the same case after a prompt change.
