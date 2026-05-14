/**
 * Interactive Glider Track Map - Simplified button filters
 * Loads tracks from separate project files
 */

// Regional boundaries (GeoJSON polygons)
const REGIONS = {
    "Labrador Sea": {
        "project": "ReBELS",
        "link": "projects/rebels.html",
        "anchor": "project-rebels",
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
        "anchor": "project-partitrics-idapro",
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
        "anchor": "project-gocart",
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
        "anchor": "project-gocart",
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
        "anchor": "project-custard",
        "bounds": [[
            [-95, -50],
            [-95, -60],
            [-85, -60],
            [-85, -50],
            [-95, -50]
        ]]
    },
    "Porcupine Abyssal Plain": {
        "project": "PAP Observatory",
        "link": "",
        "anchor": "project-pap",
        "bounds": [[
            [-17.5, 49.8333],
            [-15.5, 49.8333],
            [-15.5, 47.8333],
            [-17.5, 47.8333],
            [-17.5, 49.8333]
        ]]
    },
    "North Atlantic": {
        "project": "NA-VICE",
        "link": "",
        "anchor": "project-na-vice",
        "bounds": [[
            [-33.4027257,      39.6446975],
            [-19.9348597,      39.6446975],
            [-19.9348597,      62.3832102],
            [-33.4027257,      62.3832102],
            [-33.4027257,      39.6446975]
        ]]
    },
    "Ross Sea": {
        "project": "SeAFAReRS",
        "link": "",
        "anchor": "project-seafarers",
        "bounds": [[
            [-195.9589735, -77.4733155],
            [-189.2741114, -72.1461064],
            [-159.1922323, -73.3878571],
            [-164.7832078, -78.2648324],
            [-193.3458001, -77.0444625],
            [-195.9589735, -77.4733155]
        ]]
    },
    "West Antarctic Peninsula": {
        "project": "PAL-LTER",
        "link": "projects/pal-lter.html",
        "anchor": "project-pal-lter",
        "bounds": [[
            [-63.5419433, -64.8952099],
            [-67.240068,  -63.8645338],
            [-75.9541052, -68.2090107],
            [-69.9885478, -69.0683451],
            [-63.5419433, -64.8952099]
        ]]
    },
    "Ryder Bay": {
        "project": "POLOMINTS",
        "link": "",
        "anchor": "project-polomints",
        "front": true,
        "bounds": [[
            [-68.0794098, -67.5789401],
            [-68.2291619, -67.5442834],
            [-68.2390015, -67.5105822],
            [-68.4537202, -67.5597703],
            [-68.3624954, -67.6392991],
            [-68.0794098, -67.5789401]
        ]]
    }
};

// Single-point cruise/station locations (no polygon area to draw)
const POINT_LOCATIONS = {
    "Norwegian Sea": {
        "project": "MESOHUX",
        "link": "",
        "anchor": "project-mesohux",
        "lat": 60.2625,
        "lon": 5.2341
    },
    "Palmer Station": {
        "project": "PAL-LTER",
        "link": "projects/pal-lter.html",
        "anchor": "project-pal-lter",
        "lat": -64.7743,
        "lon": -64.0538
    },
    "Rothera Station": {
        "project": "POLOMINTS",
        "link": "",
        "anchor": "project-polomints",
        "lat": -67.5682,
        "lon": -68.1242
    }
};

// Region colors by project
const REGION_COLORS = {
    "ReBELS":          "#2563eb",
    "BIO-CARBON":      "#10b981",
    "GOCART":          "#9333ea",
    "CUSTARD":         "#f97316",
    "PAP Observatory": "#0891b2",
    "SeAFAReRS":       "#dc2626",
    "MESOHUX":         "#6b7280",
    "NA-VICE":         "#db2777",
    "PAL-LTER":        "#0e7490",
    "POLOMINTS":       "#65a30d"
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
let activeProjectFilter = 'all';
let activeYearFilter = 'all';

// Initialize map
function initMap() {
    map = L.map('glider-map', { zoomSnap: 0.25 }).setView([0, -30], 1.75);
    
    // CartoDB Positron tiles - guaranteed English, clean style
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);
    
    regionLayers.addTo(map);
    trackLayers.addTo(map);
    markerLayers.addTo(map);
    
    drawRegions();
    drawPointMarkers();
    loadAllGliderData();
}

// Draw single-point location markers
function drawPointMarkers() {
    Object.entries(POINT_LOCATIONS).forEach(([regionName, data]) => {
        const color = REGION_COLORS[data.project] || '#0066cc';
        const marker = L.circleMarker([data.lat, data.lon], {
            radius: 8,
            color: color,
            weight: 2,
            fillColor: color,
            fillOpacity: 0.3
        });

        const pointTitle = data.anchor
            ? `<a href="#${data.anchor}">${regionName}</a>`
            : regionName;
        const linkHtml = data.link
            ? `<p><a href="${data.link}" target="_blank">View Project →</a></p>`
            : '';

        marker.bindPopup(`
            <div class="glider-popup">
                <h3>${pointTitle}</h3>
                <p><strong>Project:</strong> ${data.project}</p>
                ${linkHtml}
            </div>
        `);

        marker.addTo(regionLayers);
    });
}

// Draw regional boundary boxes
function drawRegions() {
    const frontLayers = [];

    Object.entries(REGIONS).forEach(([regionName, regionData]) => {
        const color = REGION_COLORS[regionData.project] || '#0066cc';
        const polyOptions = {
            color: color,
            weight: 2,
            fillColor: color,
            fillOpacity: 0.1,
            dashArray: '5, 5'
        };
        const regionTitle = regionData.anchor
            ? `<a href="#${regionData.anchor}">${regionName}</a>`
            : regionName;
        const linkHtml = regionData.link
            ? `<p><a href="${regionData.link}" target="_blank">View Project →</a></p>`
            : '';
        const popupContent = `
            <div class="glider-popup">
                <h3>${regionTitle}</h3>
                <p><strong>Project:</strong> ${regionData.project}</p>
                ${linkHtml}
            </div>
        `;
        regionData.bounds.forEach(ring => {
            const latlngs = ring.map(coord => [coord[1], coord[0]]);
            const poly = L.polygon([latlngs], polyOptions)
                .bindPopup(popupContent)
                .addTo(regionLayers);
            if (regionData.front) frontLayers.push(poly);
        });
    });

    frontLayers.forEach(l => l.bringToFront());
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

document.addEventListener('DOMContentLoaded', initMap);
