#!/usr/bin/env python3
"""
Add glider map section to all project pages
Map will auto-hide if no data available for that project
"""

import re
from pathlib import Path

PROJECTS_DIR = Path('projects')

# Map section HTML to insert
MAP_SECTION = '''
            <!-- ============================================ -->
            <!-- GLIDER DEPLOYMENT MAP (auto-hides if no data) -->
            <!-- ============================================ -->
            <div class="project-deployments">
                <h2>Glider Deployments</h2>
                <div id="project-glider-map" style="width: 100%; height: 500px; border-radius: 8px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></div>
            </div>
'''

# Leaflet CSS for <head>
LEAFLET_CSS = '    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />'

# Scripts to add before </body>
MAP_SCRIPTS = '''    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    
    <!-- Project Map JS -->
    <script src="../js/project-glider-map.js"></script>
    <script>
        // Auto-detect project ID from PROJECT_ID variable or page
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof PROJECT_ID !== 'undefined') {
                initProjectMap(PROJECT_ID);
            }
        });
    </script>
'''

def get_project_id(html_file):
    """Extract PROJECT_ID from existing script or filename"""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Try to find existing PROJECT_ID
    match = re.search(r'const PROJECT_ID = [\'"](\w+)[\'"]', content)
    if match:
        return match.group(1)
    
    # Fall back to filename
    return html_file.stem

def add_map_to_project(html_file):
    """Add map section to a project page"""
    
    print(f"\n📄 Processing {html_file.name}")
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if map already added
    if 'project-glider-map' in content:
        print("   ✅ Map section already present")
        return False
    
    # Add Leaflet CSS to <head> if not present
    if 'leaflet' not in content.lower():
        content = content.replace('</head>', f'{LEAFLET_CSS}\n</head>')
        print("   ➕ Added Leaflet CSS")
    
    # Find where to insert map (between team and publications)
    # Look for publications section
    pub_pattern = r'(<div class="project-publications">)'
    
    if re.search(pub_pattern, content):
        # Insert map section before publications
        content = re.sub(pub_pattern, MAP_SECTION + r'\1', content)
        print("   ➕ Added map section before publications")
    else:
        print("   ⚠️  Could not find publications section to insert map")
        return False
    
    # Add scripts before </body> if not present
    if 'project-glider-map.js' not in content:
        content = content.replace('</body>', MAP_SCRIPTS + '</body>')
        print("   ➕ Added map scripts")
    
    # Write back
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    project_id = get_project_id(html_file)
    print(f"   ✅ Map added (will show if data exists for '{project_id}')")
    return True

def main():
    print("🗺️  Adding Glider Maps to Project Pages")
    print("=" * 60)
    
    if not PROJECTS_DIR.exists():
        print(f"❌ Projects directory not found")
        return
    
    html_files = list(PROJECTS_DIR.glob("*.html"))
    print(f"Found {len(html_files)} HTML files\n")
    
    updated_count = sum(1 for f in html_files if add_map_to_project(f))
    
    print("\n" + "=" * 60)
    print(f"✨ Complete! Added maps to {updated_count} of {len(html_files)} files")
    print("\nThe map will automatically:")
    print("  • Show if glider data exists for that project")
    print("  • Hide if no data available")
    print("\nNext: Upload js/project-glider-map.js to GitHub")

if __name__ == "__main__":
    main()
