/**
 * Project-Specific Glider Map
 * Automatically filters tracks based on project page
 */

// Regional boundaries (GeoJSON polygons)
const REGIONS = {
    "Labrador Sea": {
        "project": "ReBELS",
        "link": "projects/rebels.html",
        "bounds": [[
            [-52.79302082650534, 65.45927508504622],
            [-59.13240908270683, 60.33577565288866],
            [-53.27614475996552, 55.08644382886743],
            [-50.45570690700987, 51.14622424612725],
            [-46.086375599557186, 59.370751482462055],
            [-48.79251880961314, 60.35554233639394],
            [-52.46871490200036, 63.17768201934487],
            [-52.79302082650534, 65.45927508504622]
        ]]
    },
    "Iceland Basin": {
        "project": "BIO-CARBON",
        "link": "projects/partitrics.html",
        "bounds": [[
            [-16.390728645190194, 63.19800180818393],
            [-23.625669669607618, 62.59787239784313],
            [-32.5836247344952, 56.610729498217665],
            [-17.343210623309176, 55.053607384505796],
            [-10.452152196538577, 60.51001486992419],
            [-16.390728645190194, 63.19800180818393]
        ]]
    },
    "Benguela": {
        "project": "GOCART",
        "link": "projects/gocart.html",
        "bounds": [[
            [11, -17.5],
            [8, -17.5],
            [9, -26],
            [14, -23],
            [11, -17]
        ]]
    },
    "South Georgia": {
        "project": "GOCART",
        "link": "projects/gocart.html",
        "bounds": [[
            [-43, -51],
            [-43, -54],
            [-38, -54],
            [-38, -51],
            [-43, -51]
        ]]
    },    
    "Southern Ocean": {
        "project": "CUSTARD",
        "link": "projects.html#custard",
        "bounds": [[
            [-95, -50],
            [-95, -60],
            [-85, -60],
            [-85, -50],
            [-95, -50]
        ]]
    }
};

// Project color schemes
const PROJECT_COLORS = {
    "ReBELS": ["#1e3a8a", "#2563eb", "#3b82f6", "#60a5fa"],
    "BIO": ["#064e3b", "#047857", "#10b981", "#34d399"],
    "CUSTARD": ["#7c2d12", "#c2410c", "#f97316", "#fb923c"]
};

// Global variables
let projectMap;
let projectTracks = [];

// Initialize project-specific map
function initProjectMap(projectId) {
    const mapContainer = document.getElementById('project-glider-map');
    if (!mapContainer) {
        console.error('Map container #project-glider-map not found!');
        return;
    }
    
    // Determine center and zoom based on project
    let center, zoom;
    switch(projectId.toUpperCase()) {
        case 'REBELS':
            center = [58, -52];
            zoom = 5;
            break;
        case 'BIO':
            center = [59, -22];
            zoom = 5;
            break;
        case 'CUSTARD':
            center = [-58, -90];
            zoom = 4;
            break;
        default:
            center = [0, -30];
            zoom = 2;
    }
    
    projectMap = L.map('project-glider-map').setView(center, zoom);
    
    // CartoDB Positron tiles - guaranteed English, clean style
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(projectMap);
    
    loadProjectGliderData(projectId);
}

// Draw regional boundary box for this project
function drawProjectRegion(projectId) {
    // Find the region for this project
    let regionName, regionData;
    for (const [name, data] of Object.entries(REGIONS)) {
        if (data.project.toUpperCase() === projectId.toUpperCase()) {
            regionName = name;
            regionData = data;
            break;
        }
    }
    
    if (!regionData) return;
    
    const latlngs = regionData.bounds.map(polygon => 
        polygon.map(coord => [coord[1], coord[0]])
    );
    
    const polygon = L.polygon(latlngs, {
        color: '#0066cc',
        weight: 2,
        fillColor: '#0066cc',
        fillOpacity: 0.05,
        dashArray: '5, 5'
    });
    
    polygon.bindPopup(`<strong>${regionName}</strong>`);
    polygon.addTo(projectMap);
}

// Load glider data for specific project
async function loadProjectGliderData(projectId) {
    const projectFile = projectId.toLowerCase();
    
    try {
        const response = await fetch(`../data/glider_tracks_${projectFile}.json`);
        if (!response.ok) {
            // No data available - hide the map section
            const mapSection = document.querySelector('.project-deployments');
            if (mapSection) {
                mapSection.style.display = 'none';
            }
            console.log(`No glider data available for ${projectId}`);
            return;
        }
        
        projectTracks = await response.json();
        
        if (projectTracks.length === 0) {
            // Empty data - hide the map section
            const mapSection = document.querySelector('.project-deployments');
            if (mapSection) {
                mapSection.style.display = 'none';
            }
            console.log(`No glider tracks for ${projectId}`);
            return;
        }
        
        console.log(`Loaded ${projectTracks.length} tracks for ${projectId}`);
        
        drawProjectRegion(projectId);
        drawProjectTracks(projectTracks);
    } catch (error) {
        // Error loading data - hide the map section
        const mapSection = document.querySelector('.project-deployments');
        if (mapSection) {
            mapSection.style.display = 'none';
        }
        console.log(`Glider data not available for ${projectId}`);
    }
}

// Draw glider tracks on project map
function drawProjectTracks(tracks) {
    const colors = PROJECT_COLORS[tracks[0]?.project] || ['#666666'];
    
    tracks.forEach((track, index) => {
        const color = colors[index % colors.length];
        const latlngs = track.coordinates.map(coord => [coord[0], coord[1]]);
        
        const polyline = L.polyline(latlngs, {
            color: color,
            weight: 3,
            opacity: 0.8
        });
        
        polyline.bindPopup(`
            <div class="glider-popup">
                <h3>${track.name}</h3>
                <p><strong>Deployment:</strong> ${track.date}</p>
                <p><strong>Data Points:</strong> ${track.num_points}</p>
            </div>
        `);
        
        polyline.addTo(projectMap);
        
        // Start marker
        if (latlngs.length > 0) {
            L.circleMarker(latlngs[0], {
                radius: 6,
                fillColor: '#10b981',
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 1
            }).bindPopup(`<strong>Start:</strong> ${track.name}`).addTo(projectMap);
        }
        
        // End marker
        if (latlngs.length > 1) {
            L.circleMarker(latlngs[latlngs.length - 1], {
                radius: 6,
                fillColor: '#ef4444',
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 1
            }).bindPopup(`<strong>End:</strong> ${track.name}`).addTo(projectMap);
        }
    });
    
    // Fit map to show all tracks
    if (tracks.length > 0) {
        const allCoords = tracks.flatMap(t => t.coordinates);
        const bounds = L.latLngBounds(allCoords);
        projectMap.fitBounds(bounds, { padding: [50, 50] });
    }
}
