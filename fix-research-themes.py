#!/usr/bin/env python3
"""
Fix research theme pages - clean formatting and shared navigation
"""

from pathlib import Path
import re

RESEARCH_DIR = Path('research_themes')

THEME_PAGES = {
    'biophysical-controls.html': {
        'title': 'Biophysical Controls on the Biological Carbon Pump',
        'breadcrumb': 'Biophysical Controls',
        'keywords': ['biophysical-interactions', 'carbon-export']
    },
    'polar-ecosystems.html': {
        'title': 'Polar and Subpolar Ocean Ecosystems',
        'breadcrumb': 'Polar Ecosystems',
        'keywords': ['polar-ecosystems', 'seasonal-cycles']
    },
    'autonomous-systems.html': {
        'title': 'Autonomous Ocean Observing Systems',
        'breadcrumb': 'Autonomous Systems',
        'keywords': ['autonomous-systems', 'best-practices']
    }
}

def fix_theme_page(html_file, page_info):
    """Clean up and fix a research theme page"""
    
    print(f"\n📄 Processing {html_file.name}")
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already using shared navigation
    if 'navigation-placeholder' in content:
        print("   ✅ Already using shared navigation")
        has_nav = True
    else:
        # Replace hardcoded nav
        content = re.sub(
            r'<nav class="navbar">.*?</nav>',
            '<div id="navigation-placeholder"></div>',
            content,
            flags=re.DOTALL
        )
        print("   🔄 Replaced navigation")
        has_nav = False
    
    # Add navigation.js if not present
    if not has_nav and 'navigation.js' not in content:
        content = content.replace(
            '</body>',
            '    <script src="../js/navigation.js"></script>\n</body>'
        )
        print("   ➕ Added navigation.js")
    
    # Add centering wrapper if not present
    if 'max-width: 900px' not in content:
        content = content.replace(
            '<div class="theme-page-content">',
            '<div class="theme-page-content" style="max-width: 900px; margin: 0 auto;">'
        )
        print("   📐 Added centering")
    
    # Add image section if not present
    if 'images/research/' not in content:
        image_section = f'''
    <!-- Theme Image -->
    <section class="section">
        <div class="container" style="text-align: center;">
            <img src="../images/research/{html_file.stem}.jpg" 
                 alt="{page_info['title']}" 
                 style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
                 onerror="this.style.display='none'">
        </div>
    </section>

'''
        # Insert after page header
        content = content.replace(
            '</section>\n\n<section class="section"><div class="container"><div class="theme-page-content"',
            f'</section>\n{image_section}<section class="section"><div class="container"><div class="theme-page-content"'
        )
        print("   🖼️  Added image section")
    
    # Write back
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("   ✅ Updated")

def main():
    print("🔧 Fixing Research Theme Pages")
    print("=" * 60)
    
    if not RESEARCH_DIR.exists():
        print("❌ Research directory not found")
        return
    
    for filename, page_info in THEME_PAGES.items():
        filepath = RESEARCH_DIR / filename
        if filepath.exists():
            fix_theme_page(filepath, page_info)
        else:
            print(f"\n⚠️  {filename} not found")
    
    print("\n" + "=" * 60)
    print("✨ Complete! Theme pages updated")
    print("\nDon't forget to add images:")
    print("  • images/research/biophysical-controls.jpg")
    print("  • images/research/polar-ecosystems.jpg")
    print("  • images/research/autonomous-systems.jpg")

if __name__ == "__main__":
    main()
