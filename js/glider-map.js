/**
 * Interactive Glider Track Map - Multi-file version
 * Loads tracks from separate project files
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
let map;
let gliderTracks = [];
let regionLayers = L.layerGroup();
let trackLayers = L.layerGroup();
let markerLayers = L.layerGroup();

// Initialize map
function initMap() {
    map = L.map('glider-map').setView([0, -30], 2);
    
    // // Use CartoDB tiles which are always in English
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    //     attribution: '© OpenStreetMap contributors, © CARTO',
    //     maxZoom: 19,
    //     subdomains: 'abcd'
    // }).addTo(map);

    L.tileLayer(
    'https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=YOUR_KEY',
    {
        attribution: '&copy; OpenStreetMap contributors &copy; MapTiler',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);
    
    regionLayers.addTo(map);
    trackLayers.addTo(map);
    markerLayers.addTo(map);
    
    drawRegions();
    loadAllGliderData();
}

// Draw regional boundary boxes
function drawRegions() {
    Object.entries(REGIONS).forEach(([regionName, regionData]) => {
        const latlngs = regionData.bounds.map(polygon => 
            polygon.map(coord => [coord[1], coord[0]])
        );
        
        const polygon = L.polygon(latlngs, {
            color: '#0066cc',
            weight: 2,
            fillColor: '#0066cc',
            fillOpacity: 0.1,
            dashArray: '5, 5'
        });
        
        polygon.bindPopup(`
            <div class="glider-popup">
                <h3>${regionName}</h3>
                <p><strong>Project:</strong> ${regionData.project}</p>
                <p><a href="${regionData.link}" target="_blank">View Project →</a></p>
            </div>
        `);
        
        polygon.addTo(regionLayers);
    });
}

// Load glider data from multiple project files
async function loadAllGliderData() {
    const projects = ['rebels', 'bio', 'custard'];
    
    try {
        const promises = projects.map(project => 
            fetch(`data/glider_tracks_${project}.json`)
                .then(response => {
                    if (!response.ok) throw new Error(`${project} not found`);
                    return response.json();
                })
                .catch(err => {
                    console.warn(`Could not load ${project}:`, err);
                    return [];
                })
        );
        
        const results = await Promise.all(promises);
        gliderTracks = results.flat();
        
        console.log(`Loaded ${gliderTracks.length} tracks from ${projects.length} projects`);
        
        drawTracks(gliderTracks);
        updateLegend();
    } catch (error) {
        console.error('Error loading glider data:', error);
        document.getElementById('glider-map').innerHTML += 
            '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 2rem; border-radius: 8px;">' +
            '<p><strong>Error loading glider tracks.</strong></p>' +
            '<p>Check browser console for details.</p>' +
            '</div>';
    }
}

// Draw glider tracks on map
function drawTracks(tracks) {
    trackLayers.clearLayers();
    markerLayers.clearLayers();
    
    const projectGroups = {};
    tracks.forEach(track => {
        if (!projectGroups[track.project]) {
            projectGroups[track.project] = [];
        }
        projectGroups[track.project].push(track);
    });
    
    Object.entries(projectGroups).forEach(([project, projectTracks]) => {
        const colors = PROJECT_COLORS[project] || ['#666666'];
        
        projectTracks.forEach((track, index) => {
            const color = colors[index % colors.length];
            const latlngs = track.coordinates.map(coord => [coord[0], coord[1]]);
            
            const polyline = L.polyline(latlngs, {
                color: color,
                weight: 3,
                opacity: 0.7
            });
            
            polyline.bindPopup(`
                <div class="glider-popup">
                    <h3>${track.name}</h3>
                    <p><strong>Project:</strong> ${track.project}</p>
                    <p><strong>Region:</strong> ${track.region}</p>
                    <p><strong>Deployment:</strong> ${track.date}</p>
                    <p><strong>Points:</strong> ${track.num_points}</p>
                    <p><a href="${track.link}" target="_blank">View Project →</a></p>
                </div>
            `);
            
            polyline.addTo(trackLayers);
            
            if (latlngs.length > 0) {
                L.circleMarker(latlngs[0], {
                    radius: 6,
                    fillColor: '#10b981',
                    color: '#ffffff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 1
                }).bindPopup(`<strong>Start:</strong> ${track.name}`).addTo(markerLayers);
            }
            
            if (latlngs.length > 1) {
                L.circleMarker(latlngs[latlngs.length - 1], {
                    radius: 6,
                    fillColor: '#ef4444',
                    color: '#ffffff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 1
                }).bindPopup(`<strong>End:</strong> ${track.name}`).addTo(markerLayers);
            }
        });
    });
}

// Apply filters
function applyFilters() {
    const regionFilter = document.getElementById('region-filter').value;
    const projectFilter = document.getElementById('project-filter').value;
    const dateMin = document.getElementById('date-min').value;
    const dateMax = document.getElementById('date-max').value;
    
    const filteredTracks = gliderTracks.filter(track => {
        if (regionFilter !== 'all' && track.region !== regionFilter) return false;
        if (projectFilter !== 'all' && track.project !== projectFilter) return false;
        if (dateMin && track.date < dateMin) return false;
        if (dateMax && track.date > dateMax) return false;
        return true;
    });
    
    drawTracks(filteredTracks);
    console.log(`Showing ${filteredTracks.length} of ${gliderTracks.length} tracks`);
}

// Reset filters
function resetFilters() {
    document.getElementById('region-filter').value = 'all';
    document.getElementById('project-filter').value = 'all';
    document.getElementById('date-min').value = '';
    document.getElementById('date-max').value = '';
    drawTracks(gliderTracks);
}

// Update legend
function updateLegend() {
    const legendContent = document.getElementById('legend-content');
    let html = '';
    
    Object.entries(PROJECT_COLORS).forEach(([project, colors]) => {
        html += `
            <div class="legend-item">
                <div class="legend-color" style="background: ${colors[0]};"></div>
                <span>${project}</span>
            </div>
        `;
    });
    
    html += `
        <div class="legend-item" style="margin-top: 0.5rem;">
            <div style="width: 12px; height: 12px; background: #10b981; border-radius: 50%; margin-right: 0.5rem; border: 2px solid white;"></div>
            <span>Start Point</span>
        </div>
        <div class="legend-item">
            <div style="width: 12px; height: 12px; background: #ef4444; border-radius: 50%; margin-right: 0.5rem; border: 2px solid white;"></div>
            <span>End Point</span>
        </div>
    `;
    
    legendContent.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', initMap);
