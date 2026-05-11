#!/usr/bin/env python3
import re
from pathlib import Path

NAV_PATTERN = r'<nav class="navbar">.*?</nav>'
NAV_REPLACEMENT = '<div id="navigation-placeholder"></div>'
PROJECTS_DIR = Path('projects')

def fix_navigation(html_file):
    print(f"\n📄 Processing {html_file.name}")
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'navigation-placeholder' in content:
        print("   ✅ Already using shared navigation")
        return False
    new_content = re.sub(NAV_PATTERN, NAV_REPLACEMENT, content, flags=re.DOTALL)
    if new_content == content:
        print("   ⚠️  No navigation found")
        return False
    print("   🔄 Replaced navigation")
    if '../js/navigation.js' not in new_content:
        new_content = new_content.replace('</body>', '    <script src="../js/navigation.js"></script>\n</body>')
        print("   ➕ Added navigation.js")
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("   ✅ Updated")
    return True

html_files = list(PROJECTS_DIR.glob("*.html"))
print(f"Found {len(html_files)} files")
for f in html_files:
    fix_navigation(f)
