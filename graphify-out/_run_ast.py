import sys, json
from graphify.extract import collect_files, extract
from pathlib import Path

detect = json.loads(Path('graphify-out/.graphify_detect.json').read_text())
code_files = [Path(f) for f in detect.get('files', {}).get('code', [])]

if code_files:
    result = extract(code_files)
else:
    result = {'nodes': [], 'edges': [], 'input_tokens': 0, 'output_tokens': 0}

Path('graphify-out/.graphify_ast.json').write_text(json.dumps(result, indent=2))
print(f"AST: {len(result['nodes'])} nodes, {len(result['edges'])} edges")
