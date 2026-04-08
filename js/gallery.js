// Photo Gallery System
// Handles album browsing, photo grid, and lightbox
// Albums are defined in data/gallery.json

let ALBUMS = { fieldwork: [], nature: [] };

// State
let currentTab = 'fieldwork';
let currentAlbum = null;
let currentPhotoIndex = 0;
let currentPhotos = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadGalleryData();
    initializeTabs();

    // Support deep-linking: ?album=rebels1-jc268-2024
    const params = new URLSearchParams(window.location.search);
    const deepAlbum = params.get('album');

    if (deepAlbum) {
        // Find which tab the album belongs to
        const fieldworkMatch = ALBUMS.fieldwork.find(a => a.id === deepAlbum);
        const natureMatch = ALBUMS.nature.find(a => a.id === deepAlbum);
        const match = fieldworkMatch || natureMatch;

        if (match) {
            currentTab = fieldworkMatch ? 'fieldwork' : 'nature';
            // Activate the right tab button
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-tab') === currentTab);
            });
            loadAlbums(currentTab);
            loadGallery(match);
        } else {
            loadAlbums(currentTab);
        }
    } else {
        loadAlbums(currentTab);
    }

    initializeLightbox();

    document.getElementById('back-to-albums').addEventListener('click', () => {
        showAlbumBrowser();
        // Remove ?album= from URL without reload
        const url = new URL(window.location);
        url.searchParams.delete('album');
        history.replaceState({}, '', url);
    });
});

// Load albums from data/gallery.json
async function loadGalleryData() {
    try {
        const response = await fetch('data/gallery.json');
        ALBUMS = await response.json();
    } catch (e) {
        console.error('Failed to load gallery.json', e);
    }
}

// Tab Switching
function initializeTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
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

    browser.innerHTML = albums.map(album => createAlbumCard(album)).join('');

    document.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', () => {
            const albumId = card.getAttribute('data-album');
            const album = albums.find(a => a.id === albumId);
            if (album) loadGallery(album);
        });
    });

    // Update photo counts
    albums.forEach(album => {
        loadPhotosForAlbum(album).then(photos => {
            const countEl = document.getElementById(`count-${album.id}`);
            if (countEl) countEl.textContent = photos.length || '0';
        });
    });
}

// Create Album Card HTML
function createAlbumCard(album) {
    const displayTitle = album.years
        ? `${album.title} <span style="color: var(--text-muted); font-weight: 400;">(${album.years})</span>`
        : album.title;

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

    document.getElementById('album-browser').style.display = 'none';
    document.getElementById('gallery-view').style.display = 'block';

    const titleText = album.years ? `${album.title} (${album.years})` : album.title;
    document.getElementById('gallery-title').textContent = titleText;
    document.getElementById('gallery-description').textContent = album.description;

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

// Load Photos for Album (tries info.json then photos.txt)
async function loadPhotosForAlbum(album) {
    try {
        const response = await fetch(`${album.folder}/info.json`);
        if (response.ok) {
            const data = await response.json();
            return data.photos || [];
        }
    } catch (e) {}

    try {
        const response = await fetch(`${album.folder}/photos.txt`);
        if (response.ok) {
            const text = await response.text();
            return text.split('\n').filter(f => f.trim()).map(file => ({
                file: file.trim(),
                path: `${album.folder}/${file.trim()}`
            }));
        }
    } catch (e) {}

    return [];
}

// Render Photo Grid
function renderPhotoGrid(photos) {
    const grid = document.getElementById('photo-grid');

    if (photos.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>No photos yet</p></div>';
        return;
    }

    grid.innerHTML = photos.map((photo, index) => {
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

    document.querySelectorAll('.photo-item').forEach(item => {
        item.addEventListener('click', () => {
            openLightbox(parseInt(item.getAttribute('data-index')));
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
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
    document.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

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
    currentPhotoIndex = (currentPhotoIndex + direction + currentPhotos.length) % currentPhotos.length;
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

function formatDate(dateStr) {
    if (!dateStr) return '';
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }
    return dateStr;
}
