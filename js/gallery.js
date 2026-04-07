// Photo Gallery System
// Handles album browsing, photo grid, and lightbox

// Album Definitions
const ALBUMS = {
    fieldwork: [
        {
            id: 'glider-deployments',
            title: 'Glider Deployments',
            years: '2008 - Present',
            description: 'Ocean glider operations across multiple research cruises and locations',
            folder: 'images/fieldwork/glider-deployments',
            cover: 'cover.jpg'
        },
        {
            id: 'seafarers-2011',
            title: 'SeAFARERS',
            years: '2011',
            description: 'Ross Sea, Antarctica',
            folder: 'images/fieldwork/seafarers-2011',
            cover: 'cover.jpg'
        },
        {
            id: 'na-vice-2012',
            title: 'NA-VICE',
            years: '2012',
            description: 'North Atlantic',
            folder: 'images/fieldwork/na-vice-2012',
            cover: 'cover.jpg'
        },
        {
            id: 'pal-lter-palmer-2012-2013',
            title: 'PAL-LTER - Palmer Station',
            years: '2012-2013',
            description: 'Palmer Station, Antarctica',
            folder: 'images/fieldwork/pal-lter-palmer-2012-2013',
            cover: 'cover.jpg'
        },
        {
            id: 'pal-lter-wap-2014',
            title: 'PAL-LTER - West Antarctica Peninsula',
            years: '2014',
            description: 'West Antarctica Peninsula research expedition',
            folder: 'images/fieldwork/pal-lter-wap-2014',
            cover: 'cover.jpg'
        },
        {
            id: 'pal-lter-wap-2015',
            title: 'PAL-LTER - West Antarctica Peninsula',
            years: '2015',
            description: 'West Antarctica Peninsula research expedition',
            folder: 'images/fieldwork/pal-lter-wap-2015',
            cover: 'cover.jpg'
        },
        {
            id: 'mesohux-2017',
            title: 'MESOHUX',
            years: '2017',
            description: 'Norway research cruise',
            folder: 'images/fieldwork/mesohux-2017',
            cover: 'cover.jpg'
        },
        {
            id: 'comics1-dy086-2017',
            title: 'COMICS 1',
            years: '2017',
            description: 'South Georgia (DY086)',
            folder: 'images/fieldwork/comics1-dy086-2017',
            cover: 'cover.jpg'
        },
        {
            id: 'gocart2-2018',
            title: 'GOCART 2',
            years: '2018',
            description: 'Benguela Upwelling System',
            folder: 'images/fieldwork/gocart2-2018',
            cover: 'cover.jpg'
        },
        {
            id: 'comics2-dy090-2018',
            title: 'COMICS 2',
            years: '2018',
            description: 'South Atlantic (DY090)',
            folder: 'images/fieldwork/comics2-dy090-2018',
            cover: 'cover.jpg'
        },
        {
            id: 'custard1-dy096-2018',
            title: 'CUSTARD 1',
            years: '2018',
            description: 'Southern Ocean (DY096)',
            folder: 'images/fieldwork/custard1-dy096-2018',
            cover: 'cover.jpg'
        },
        {
            id: 'pap-dy130-2022',
            title: 'PAP',
            years: '2022',
            description: 'North Atlantic (DY130)',
            folder: 'images/fieldwork/pap-dy130-2022',
            cover: 'cover.jpg'
        },
        {
            id: 'biocarbon-dy180-2024',
            title: 'BIO-Carbon',
            years: '2024',
            description: 'Iceland Basin (DY180)',
            folder: 'images/fieldwork/biocarbon-dy180-2024',
            cover: 'cover.jpg'
        },
        {
            id: 'rebels1-jc268-2024',
            title: 'ReBELS 1',
            years: '2024',
            description: 'Labrador Sea (JC268)',
            folder: 'images/fieldwork/rebels1-jc268-2024',
            cover: 'cover.jpg'
        },
        {
            id: 'rebels2-jc268-2025',
            title: 'ReBELS 2',
            years: '2025',
            description: 'Labrador Sea (JC268)',
            folder: 'images/fieldwork/rebels2-jc268-2025',
            cover: 'cover.jpg'
        }
    ],
    nature: [
        {
            id: 'antarctica-wildlife',
            title: 'Antarctica Wildlife',
            description: 'Penguins, seals, and Antarctic fauna',
            folder: 'images/nature/antarctica-wildlife',
            cover: 'cover.jpg'
        },
        {
            id: 'antarctic-landscapes',
            title: 'Antarctic Landscapes',
            description: 'Ice, mountains, and polar scenery',
            folder: 'images/nature/antarctic-landscapes',
            cover: 'cover.jpg'
        },
        {
            id: 'underwater-wildlife',
            title: 'Underwater Wildlife',
            description: 'Marine life beneath the surface',
            folder: 'images/nature/underwater-wildlife',
            cover: 'cover.jpg'
        },
        {
            id: 'whales-dolphins',
            title: 'Whales and Dolphins',
            description: 'Cetacean encounters at sea',
            folder: 'images/nature/whales-dolphins',
            cover: 'cover.jpg'
        },
        {
            id: 'birds',
            title: 'Birds',
            description: 'Seabirds and coastal avifauna',
            folder: 'images/nature/birds',
            cover: 'cover.jpg'
        },
        {
            id: 'landscapes',
            title: 'Landscapes',
            description: 'Coastal and oceanic vistas',
            folder: 'images/nature/landscapes',
            cover: 'cover.jpg'
        }
    ]
};

// State
let currentTab = 'fieldwork';
let currentAlbum = null;
let currentPhotoIndex = 0;
let currentPhotos = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    loadAlbums(currentTab);
    initializeLightbox();
    
    // Back to albums button
    document.getElementById('back-to-albums').addEventListener('click', () => {
        showAlbumBrowser();
    });
});

// Tab Switching
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            
            // Update active state
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Load albums for this tab
            currentTab = tab;
            loadAlbums(tab);
            showAlbumBrowser();
        });
    });
}

// Load Album Cards
function loadAlbums(tab) {
    const browser = document.getElementById('album-browser');
    const albums = ALBUMS[tab];
    
    if (!albums || albums.length === 0) {
        browser.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p>No albums yet. Check back soon!</p>
            </div>
        `;
        return;
    }
    
    const html = albums.map(album => createAlbumCard(album)).join('');
    browser.innerHTML = html;
    
    // Add click handlers
    document.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', () => {
            const albumId = card.getAttribute('data-album');
            const album = albums.find(a => a.id === albumId);
            if (album) loadGallery(album);
        });
    });
}

// Create Album Card HTML
function createAlbumCard(album) {
    const displayTitle = album.years ? 
        `${album.title} <span style="color: var(--text-muted); font-weight: 400;">(${album.years})</span>` : 
        album.title;
    
    return `
        <div class="album-card" data-album="${album.id}">
            <div class="album-cover">
                <img src="${album.folder}/${album.cover}" 
                     alt="${album.title}"
                     onerror="this.src='images/gallery-placeholder.svg'">
                <div class="album-photo-count">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span id="count-${album.id}">...</span>
                </div>
            </div>
            <div class="album-info">
                <h3 class="album-title">${displayTitle}</h3>
                <p class="album-description">${album.description}</p>
            </div>
        </div>
    `;
}

// Load Gallery for Album
async function loadGallery(album) {
    currentAlbum = album;
    
    // Show gallery view
    document.getElementById('album-browser').style.display = 'none';
    document.getElementById('gallery-view').style.display = 'block';
    
    // Set title and description
    const titleText = album.years ? `${album.title} (${album.years})` : album.title;
    document.getElementById('gallery-title').textContent = titleText;
    document.getElementById('gallery-description').textContent = album.description;
    
    // Load photos
    try {
        const photos = await loadPhotosForAlbum(album);
        currentPhotos = photos;
        renderPhotoGrid(photos);
    } catch (error) {
        console.error('Error loading photos:', error);
        document.getElementById('photo-grid').innerHTML = `
            <div class="empty-state">
                <p>No photos in this album yet. Upload photos to <code>${album.folder}</code></p>
            </div>
        `;
    }
}

// Load Photos for Album
async function loadPhotosForAlbum(album) {
    // Try to load info.json if it exists
    try {
        const response = await fetch(`${album.folder}/info.json`);
        if (response.ok) {
            const data = await response.json();
            return data.photos || [];
        }
    } catch (e) {
        // info.json doesn't exist, try photos.txt
    }
    
    // Try photos.txt
    try {
        const response = await fetch(`${album.folder}/photos.txt`);
        if (response.ok) {
            const text = await response.text();
            const filenames = text.split('\n').filter(f => f.trim());
            return filenames.map(file => ({
                file: file.trim(),
                path: `${album.folder}/${file.trim()}`
            }));
        }
    } catch (e) {
        // No photos.txt either
    }
    
    // No index file found
    return [];
}

// Render Photo Grid
function renderPhotoGrid(photos) {
    const grid = document.getElementById('photo-grid');
    
    if (photos.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>No photos yet</p></div>';
        return;
    }
    
    const html = photos.map((photo, index) => {
        const photoPath = photo.path || `${currentAlbum.folder}/${photo.file}`;
        const caption = photo.caption || '';
        const location = photo.location || '';
        const date = photo.date || '';
        
        return `
            <div class="photo-item" data-index="${index}">
                <img src="${photoPath}" 
                     alt="${caption || 'Photo'}"
                     loading="lazy">
                ${caption || location || date ? `
                    <div class="photo-caption-overlay">
                        ${caption ? `<div class="photo-caption-text">${caption}</div>` : ''}
                        <div class="photo-caption-meta">
                            ${location ? location : ''}
                            ${location && date ? ' • ' : ''}
                            ${date ? formatDate(date) : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    grid.innerHTML = html;
    
    // Add click handlers for lightbox
    document.querySelectorAll('.photo-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index'));
            openLightbox(index);
        });
    });
}

// Show Album Browser
function showAlbumBrowser() {
    document.getElementById('album-browser').style.display = 'grid';
    document.getElementById('gallery-view').style.display = 'none';
    currentAlbum = null;
}

// Lightbox
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const close = document.querySelector('.lightbox-close');
    const prev = document.querySelector('.lightbox-prev');
    const next = document.querySelector('.lightbox-next');
    
    close.addEventListener('click', closeLightbox);
    prev.addEventListener('click', () => navigateLightbox(-1));
    next.addEventListener('click', () => navigateLightbox(1));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
    
    // Click outside to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

function openLightbox(index) {
    currentPhotoIndex = index;
    updateLightbox();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentPhotoIndex += direction;
    
    // Wrap around
    if (currentPhotoIndex < 0) currentPhotoIndex = currentPhotos.length - 1;
    if (currentPhotoIndex >= currentPhotos.length) currentPhotoIndex = 0;
    
    updateLightbox();
}

function updateLightbox() {
    const photo = currentPhotos[currentPhotoIndex];
    const photoPath = photo.path || `${currentAlbum.folder}/${photo.file}`;
    
    document.getElementById('lightbox-image').src = photoPath;
    document.querySelector('.lightbox-caption').textContent = photo.caption || '';
    document.querySelector('.lightbox-location').textContent = photo.location || '';
    document.querySelector('.lightbox-date').textContent = photo.date ? formatDate(photo.date) : '';
    document.querySelector('.lightbox-counter').textContent = 
        `${currentPhotoIndex + 1} / ${currentPhotos.length}`;
}

// Utilities
function formatDate(dateStr) {
    if (!dateStr) return '';
    
    // Handle YYYY-MM-DD format
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    return dateStr;
}

// Update photo counts (runs after page load)
setTimeout(() => {
    ALBUMS.fieldwork.forEach(album => {
        loadPhotosForAlbum(album).then(photos => {
            const countEl = document.getElementById(`count-${album.id}`);
            if (countEl) countEl.textContent = photos.length || '0';
        });
    });
    
    ALBUMS.nature.forEach(album => {
        loadPhotosForAlbum(album).then(photos => {
            const countEl = document.getElementById(`count-${album.id}`);
            if (countEl) countEl.textContent = photos.length || '0';
        });
    });
}, 1000);
