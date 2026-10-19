# Orgo Field Notes

Preserve the v5 visual language and the two modes: Learn & Explore and Guided Practice. Do not add Exam Mode or Mistake Review.

Chapter JSON is the canonical curriculum. Keep reusable behavior in src/. Use zero-based stable atom indices. Every displayed molecule must have a molecular graph, formula, and review note. Distinguish schematic diagrams from molecular structures and experimental data.

Never copy textbook prose, figures, questions, or answer keys into the distributed app. Use the locally supplied curriculum outline; write original teaching material. Do not distribute the EPUB directory. Cite only references actually inspected. Automated graph and answer tests do not constitute independent chemistry verification.

Validate with `python scripts/validate_schema.py`, `node --test tests/unit.test.mjs`, and `node tests/browser.mjs`. Set NODE_PATH to a directory containing playwright if it is not installed locally. `node scripts/build.mjs` creates dist/ and the standalone HTML. Run browser tests after each chapter. Preserve corrections and remaining issues in CHEMISTRY_REVIEW.md and PROGRESS.md. Commit each chapter after its checks.

Do not weaken answer validation: preserve commas, hyphens, parentheses, signs, stereochemical descriptors, and units. Revealed or hint-assisted answers must not be counted as independently solved. Never put concealed solution names in accessible labels. Respect reduced motion and keyboard operation. Local storage failures must leave the app usable.
