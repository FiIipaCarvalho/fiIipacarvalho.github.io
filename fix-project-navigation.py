#!/usr/bin/env python3
"""
Fix navigation in all project HTML files
Replaces hardcoded <nav> with shared navigation placeholder
"""

import re
from pathlib import Path

# Pattern to match the hardcoded nav section
NAV_PATTERN = r'<nav class="navbar">.*?</nav>'

# Replacement - shared navigation placeholder
NAV_REPLACEMENT = '<div id="navigation-placeholder"></div>'

# Pattern to check if navigation.js is already included
NAVIGATION_JS_PATTERN = r'<script src="\.\./js/navigation\.js"></script>'

# Projects directory
PROJECTS_DIR = Path('projects')

def fix_navigation(html_file):
    """Fix navigation in a single HTML file"""
    
    print(f"\n📄 Processing {html_file.name}")
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already using shared navigation
    if 'navigation-placeholder' in content:
        print("   ✅ Already using shared navigation")
        return False
    
    # Replace hardcoded nav with placeholder
    new_content, count = re.sub(NAV_PATTERN, NAV_REPLACEMENT, content, flags=re.DOTALL)
    
    if count == 0:
        print("   ⚠️  No navigation found to replace")
        return False
    
    print(f"   🔄 Replaced hardcoded navigation")
    
    # Check if navigation.js is already included
    if not re.search(NAVIGATION_JS_PATTERN, new_content):
        # Add navigation.js before </body>
        new_content = new_content.replace(
            '</body>',
            '    <script src="../js/navigation.js"></script>\n</body>'
        )
        print("   ➕ Added navigation.js script")
    else:
        print("   ✅ navigation.js already included")
    
    # Write back
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("   ✅ File updated")
    return True

def main():
    """Process all HTML files in projects directory"""
    
    print("🔧 Fixing Project Page Navigation")
    print("=" * 60)
    
    if not PROJECTS_DIR.exists():
        print(f"❌ Projects directory not found: {PROJECTS_DIR}")
        return
    
    html_files = list(PROJECTS_DIR.glob("*.html"))
    
    if not html_files:
        print(f"⚠️  No HTML files found in {PROJECTS_DIR}")
        return
    
    print(f"Found {len(html_files)} HTML files\n")
    
    updated_count = 0
    for html_file in html_files:
        if fix_navigation(html_file):
            updated_count += 1
    
    print("\n" + "=" * 60)
    print(f"✨ Complete! Updated {updated_count} of {len(html_files)} files")
    print("\nNext steps:")
    print("1. Review the changes")
    print("2. Commit to git")
    print("3. Push to GitHub")

if __name__ == "__main__":
    main()
