#!/usr/bin/env python3
"""
Add glider map section to project pages with smart project mapping
"""

import re
from pathlib import Path

PROJECTS_DIR = Path('projects')

# Map HTML filenames to glider data files
PROJECT_MAPPING = {
    'rebels': 'rebels',
    'partitrics': 'bio',      # PARTITRICS uses BIO data
    'idapro': 'bio',          # IDAPro uses BIO data
    'custard': 'custard',
    'gocart': None,           # No glider data yet
    'polomints': None,        # No glider data yet
    'techoceans': None,       # No glider data yet
    'comics': None,
    'pal-lter': None,
    'biarritz': None,
    'fire-glider': None,
    'gliders-i': None,
    'gliders-ii': None,
    'apart': None
}

MAP_SECTION = '''
            <!-- ============================================ -->
            <!-- GLIDER DEPLOYMENT MAP -->
            <!-- ============================================ -->
            <div class="project-deployments">
                <h2>Glider Deployments</h2>
                <div id="project-glider-map" style="width: 100%; height: 500px; border-radius: 8px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></div>
            </div>
'''

LEAFLET_CSS = '    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />'

def get_map_scripts(data_project_id):
    """Generate map scripts with correct project ID"""
    return f'''    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    
    <!-- Project Map JS -->
    <script src="../js/project-glider-map.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {{
            initProjectMap('{data_project_id}');
        }});
    </script>
'''

def add_map_to_project(html_file):
    """Add map section to a project page"""
    
    print(f"\n📄 Processing {html_file.name}")
    
    # Get project ID from filename
    page_id = html_file.stem
    
    # Check if this project has glider data
    data_project_id = PROJECT_MAPPING.get(page_id)
    
    if data_project_id is None:
        print(f"   ⏭️  Skipped - no glider data for {page_id}")
        return False
    
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
    
    # Find publications section
    pub_pattern = r'(<div class="project-publications">)'
    
    if re.search(pub_pattern, content):
        # Insert map section before publications
        content = re.sub(pub_pattern, MAP_SECTION + r'\1', content)
        print("   ➕ Added map section before publications")
    else:
        print("   ⚠️  Could not find publications section")
        return False
    
    # Add scripts before </body>
    if 'project-glider-map.js' not in content:
        content = content.replace('</body>', get_map_scripts(data_project_id) + '</body>')
        print(f"   ➕ Added map scripts (loads '{data_project_id}' data)")
    
    # Write back
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"   ✅ Map added for {page_id} → uses {data_project_id} data")
    return True

def main():
    print("🗺️  Adding Glider Maps to Project Pages")
    print("=" * 60)
    
    if not PROJECTS_DIR.exists():
        print(f"❌ Projects directory not found")
        return
    
    html_files = list(PROJECTS_DIR.glob("*.html"))
    print(f"Found {len(html_files)} HTML files")
    print(f"\nProjects with glider data:")
    for page_id, data_id in PROJECT_MAPPING.items():
        if data_id:
            print(f"  • {page_id} → {data_id}")
    print()
    
    updated_count = sum(1 for f in html_files if add_map_to_project(f))
    
    print("\n" + "=" * 60)
    print(f"✨ Complete! Added maps to {updated_count} files")
    print("\nMaps added to:")
    print("  • ReBELS (rebels data)")
    print("  • PARTITRICS (bio data)")
    print("  • IDAPro (bio data)")
    print("  • CUSTARD (custard data)")

if __name__ == "__main__":
    main()
