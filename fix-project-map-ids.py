#!/usr/bin/env python3
import re
from pathlib import Path

PROJECTS_DIR = Path('projects')

FIXES = {
    'partitrics.html': 'bio',
    'idapro.html': 'bio',
}

for filename, data_id in FIXES.items():
    filepath = PROJECTS_DIR / filename
    if not filepath.exists():
        print(f"❌ {filename} not found")
        continue
    
    print(f"\n📄 Processing {filename}")
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace the entire script block
    old_pattern = r'<script>\s*//[^\n]*\s*document\.addEventListener\(\'DOMContentLoaded\',\s*function\(\)\s*\{\s*if\s*\(typeof\s+PROJECT_ID\s*!==\s*\'undefined\'\)\s*\{\s*initProjectMap\(PROJECT_ID\);\s*\}\s*\}\);\s*</script>'
    
    new_script = f'''<script>
        document.addEventListener('DOMContentLoaded', function() {{
            initProjectMap('{data_id}');
        }});
    </script>'''
    
    new_content = re.sub(old_pattern, new_script, content, flags=re.DOTALL)
    
    if new_content == content:
        # Try simpler replacement
        if f"initProjectMap('{data_id}')" in content:
            print(f"   ✅ Already correct")
        else:
            # Manual replacement
            new_content = content.replace(
                "initProjectMap(PROJECT_ID)",
                f"initProjectMap('{data_id}')"
            )
            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"   ✅ Fixed → loads '{data_id}' data")
            else:
                print(f"   ⚠️  Could not fix automatically")
    else:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"   ✅ Fixed → loads '{data_id}' data")

print("\n✨ Done!")
