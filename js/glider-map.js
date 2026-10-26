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
        "link": "projects/custard.html",
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
    "European Atlantic Arc": {
        "project": "iFADO",
        "link": "",
        "anchor": "project-ifado",
        "bounds": [[
            [-12.5, 52.0],
            [-9.0, 51.5],
            [-8.5, 43.5],
            [-8.5, 37.0],
            [-13.5, 28.0],
            [-16.5, 27.5],
            [-14.0, 37.0],
            [-16.5, 43.0],
            [-17.5, 48.5],
            [-12.5, 52.0]
        ]]
    },
    "EXPORTS 2021": {
        "project": "EXPORTS",
        "link": "",
        "anchor": "project-pap",
        "bounds": [[
            [-20.6, 49.9],
            [-13.4, 49.9],
            [-13.4, 47.1],
            [-20.6, 47.1],
            [-20.6, 49.9]
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
        "link": "projects/polomints.html",
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
    "Norwegian Fjord (Espegrend Station)": {
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
        "link": "projects/polomints.html",
        "anchor": "project-polomints",
        "lat": -67.5682,
        "lon": -68.1242
    },
    "OOI Southern Ocean": {
        "project": "CUSTARD",
        "link": "projects/custard.html",
        "anchor": "project-custard",
        "lat": -54.0814,
        "lon": -89.6652
    },
    "PAP-SO": {
        "project": "PAP Observatory",
        "link": "",
        "anchor": "project-pap",
        "lat": 49.0,
        "lon": -16.5
    },
    "P3 Mooring": {
        "project": "COMICS",
        "link": "projects/comics.html",
        "anchor": "project-comics-so",
        "lat": -52.40,
        "lon": -40.06
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
    "PAL-LTER":        "#ca8a04",
    "POLOMINTS":       "#65a30d",
    "COMICS":          "#b45309",
    "iFADO":           "#4f46e5",
    "EXPORTS":         "#0e7490"
};

// Project color schemes
const PROJECT_COLORS = {
    "ReBELS": ["#1e3a8a", "#2563eb", "#3b82f6", "#60a5fa"],
    "BIO": ["#064e3b", "#047857", "#10b981", "#34d399"],
    "CUSTARD": ["#7c2d12", "#c2410c", "#f97316", "#fb923c"],
    "iFADO": ["#312e81", "#818cf8"],
    "EXPORTS": ["#0e7490", "#06b6d4", "#155e75"]
};

// Global variables
let map;
let gliderTracks = [];
let regionLayers = L.layerGroup();
let trackLayers = L.layerGroup();
let markerLayers = L.layerGroup();
let trackIndex = {};   // track name -> polyline (for focusing from fieldwork cards)
let regionIndex = {};  // region or point name -> [layers]
let projectLayers = {}; // legend label -> [layers], for the legend and its click-to-fly

// Track files use short project names; the legend uses the region names
const TRACK_PROJECT_LABEL = { "BIO": "BIO-CARBON" };

function registerProjectLayer(project, layer) {
    const label = TRACK_PROJECT_LABEL[project] || project;
    (projectLayers[label] = projectLayers[label] || []).push(layer);
}
let activeProjectFilter = 'all';
let activeYearFilter = 'all';

// Initialize map
function initMap() {
    map = L.map('glider-map', { zoomSnap: 0.25 }).setView([0, -30], 1.75);
    map.createPane('frontPane');
    map.getPane('frontPane').style.zIndex = 450;
    
    // Esri Light Gray Canvas tiles - English labels, clean style, no API key
    // (CARTO basemaps started requiring an API key in 2026)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; <a href="https://www.esri.com">Esri</a>, Esri, DeLorme, NAVTEQ',
        maxZoom: 16
    }).addTo(map);
    
    regionLayers.addTo(map);
    trackLayers.addTo(map);
    markerLayers.addTo(map);
    
    drawRegions();
    drawPointMarkers();
    renderLegend();
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
        regionIndex[regionName] = [marker];
        registerProjectLayer(data.project, marker);
    });
}

// Draw regional boundary boxes
function drawRegions() {
    Object.entries(REGIONS).forEach(([regionName, regionData]) => {
        const color = REGION_COLORS[regionData.project] || '#0066cc';
        const polyOptions = {
            color: color,
            weight: 2,
            fillColor: color,
            fillOpacity: 0.1,
            dashArray: '5, 5',
            ...(regionData.front ? { pane: 'frontPane' } : {})
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
        regionIndex[regionName] = regionData.bounds.map(ring => {
            const latlngs = ring.map(coord => [coord[1], coord[0]]);
            const polygon = L.polygon([latlngs], polyOptions)
                .bindPopup(popupContent)
                .addTo(regionLayers);
            registerProjectLayer(regionData.project, polygon);
            return polygon;
        });
    });
}

// Load glider data from multiple project files
async function loadAllGliderData() {
    const projects = ['rebels', 'bio', 'custard', 'ifado', 'exports'];
    
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
        renderLegend();
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
    trackIndex = {};
    Object.keys(projectLayers).forEach(k => {
        projectLayers[k] = projectLayers[k].filter(l => !(l instanceof L.Polyline) || l instanceof L.Polygon);
    });
    
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
            trackIndex[track.name] = polyline;
            registerProjectLayer(track.project, polyline);
            
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

// Legend below the map: one swatch per project drawn, click to fly there
function renderLegend() {
    let el = document.getElementById('map-legend');
    if (!el) {
        const mapEl = document.getElementById('glider-map');
        if (!mapEl) return;
        el = document.createElement('div');
        el.id = 'map-legend';
        el.className = 'map-legend';
        mapEl.insertAdjacentElement('afterend', el);
    }
    const colour = label => REGION_COLORS[label]
        || (PROJECT_COLORS[label] || PROJECT_COLORS[Object.keys(TRACK_PROJECT_LABEL).find(k => TRACK_PROJECT_LABEL[k] === label)] || ['#666666'])[0];
    const items = Object.keys(projectLayers).sort((a, b) => a.localeCompare(b)).map(label => `
        <button type="button" class="legend-item legend-project" data-project="${label}" title="Show ${label} on the map">
            <span class="legend-swatch" style="background:${colour(label)}"></span>${label}
        </button>`).join('');
    el.innerHTML = `
        <h3>Projects</h3>
        <div class="legend-content">${items}</div>
        <div class="legend-content legend-keys">
            <span class="legend-item"><span class="legend-dot" style="background:#10b981"></span>Glider start</span>
            <span class="legend-item"><span class="legend-dot" style="background:#ef4444"></span>Glider end</span>
            <span class="legend-item"><span class="legend-box"></span>Study region</span>
        </div>`;
    el.onclick = e => {
        const btn = e.target.closest('.legend-project');
        if (!btn) return;
        const bounds = L.latLngBounds([]);
        (projectLayers[btn.dataset.project] || []).forEach(l => l.getBounds ? bounds.extend(l.getBounds()) : bounds.extend(l.getLatLng()));
        if (bounds.isValid()) map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 7, duration: 1.2 });
    };
}

// "49.00°N, 16.50°W" -> [49.0, -16.5]
function parseCoords(text) {
    const m = (text || '').match(/([\d.]+)\s*°?\s*([NS])\s*,\s*([\d.]+)\s*°?\s*([EW])/i);
    if (!m) return null;
    return [parseFloat(m[1]) * (/s/i.test(m[2]) ? -1 : 1), parseFloat(m[3]) * (/w/i.test(m[4]) ? -1 : 1)];
}

// Fly the map to a fieldwork activity. Tries, in order: an explicit map_region,
// the activity's glider tracks, its station coordinates, the map region named
// earliest in its location text, then every region linked to its project.
// Returns false if nothing on the map matches.
function focusMapOn(activity, projectId) {
    if (!map) return false;
    const bounds = L.latLngBounds([]);
    const add = layer => layer.getBounds ? bounds.extend(layer.getBounds()) : bounds.extend(layer.getLatLng());
    const highlight = [];

    [].concat(activity.map_region || []).forEach(n => (regionIndex[n] || []).forEach(add));
    if (!bounds.isValid()) {
        (activity.gliders || []).forEach(g => {
            if (trackIndex[g]) { add(trackIndex[g]); highlight.push(trackIndex[g]); }
        });
    }
    if (!bounds.isValid()) {
        (activity.stations || []).forEach(s => { const ll = parseCoords(s.coords); if (ll) bounds.extend(ll); });
    }
    if (!bounds.isValid() && activity.location) {
        const hits = Object.keys(regionIndex)
            .map(n => [activity.location.indexOf(n), n])
            .filter(([i]) => i >= 0)
            .sort((a, b) => a[0] - b[0]);
        if (hits.length) regionIndex[hits[0][1]].forEach(add);
    }
    if (!bounds.isValid() && projectId) {
        const anchor = `project-${projectId}`;
        [...Object.entries(REGIONS), ...Object.entries(POINT_LOCATIONS)]
            .filter(([, d]) => d.anchor === anchor)
            .forEach(([n]) => (regionIndex[n] || []).forEach(add));
    }
    if (!bounds.isValid()) return false;

    map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 7, duration: 1.2 });
    highlight.forEach(line => {
        const weight = line.options.weight;
        line.setStyle({ weight: 7, opacity: 1 });
        line.bringToFront();
        setTimeout(() => line.setStyle({ weight, opacity: 0.7 }), 3000);
    });
    return true;
}

document.addEventListener('DOMContentLoaded', initMap);
