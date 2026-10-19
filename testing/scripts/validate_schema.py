"""Full Draft 2020-12 schema validation; pip install jsonschema if unavailable."""
import json
from pathlib import Path
from jsonschema import Draft202012Validator
root = Path(__file__).resolve().parents[2]
count = 0
for name, files in [('chapter', sorted((root/'dev/chapters').glob('chapter-*.json'))), ('molecules', [root/'dev/chapters/molecules.json'])]:
    schema = json.loads((root/f'dev/schema/{name}.schema.json').read_text(encoding='utf-8'))
    Draft202012Validator.check_schema(schema)
    validator = Draft202012Validator(schema)
    for file in files:
        errors = sorted(validator.iter_errors(json.loads(file.read_text(encoding='utf-8'))), key=lambda e: str(e.path))
        if errors:
            for error in errors:
                print(file.name, list(error.path), error.message)
            raise SystemExit(1)
        count += 1
print(f'PASS: {count} JSON documents validated against Draft 2020-12 schemas.')
