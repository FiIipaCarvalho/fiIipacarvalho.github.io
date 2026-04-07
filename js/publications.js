// Enhanced Publications JavaScript with Theme Filtering
const ORCID_ID = '0000-0002-8355-4329';
const ORCID_API_URL = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;

let allPublications = [];
let publicationTags = {};
let currentThemeFilter = 'all';
let currentYearFilter = 'all';
let searchTerm = '';

// Load publications and tags
async function init() {
    try {
        // Load publication tags (projects + themes)
        const tagsResponse = await fetch('data/project-publications.json');
        const tagsData = await tagsResponse.json();
        
        // Create lookup map
        tagsData.publications.forEach(pub => {
            const key = pub.doi || pub.title.toLowerCase();
            publicationTags[key] = {
                projects: pub.projects || [],
                themes: pub.themes || []
            };
        });
        
        // Load publications from ORCID
        await loadPublications();
        
        // Setup filters
        setupThemeFilters();
        setupSearch();
        
    } catch (error) {
        console.error('Error initializing publications:', error);
        displayError();
    }
}

async function loadPublications() {
    try {
        const response = await fetch(ORCID_API_URL, {
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            const data = await response.json();
            allPublications = parseORCIDData(data);
        } else {
            allPublications = getFallbackPublications();
        }
        
        // Tag publications with themes
        allPublications.forEach(pub => {
            const doiKey = pub.doi;
            const titleKey = pub.title.toLowerCase();
            
            // Try DOI first, then title
            let tags = publicationTags[doiKey];
            if (!tags) {
                // Try partial title match
                tags = Object.entries(publicationTags).find(([key, val]) => {
                    return titleKey.includes(key.toLowerCase()) || key.toLowerCase().includes(titleKey);
                })?.[1];
            }
            
            pub.themes = tags?.themes || [];
            pub.projects = tags?.projects || [];
        });
        
        renderPublications();
        setupYearFilters();
        
    } catch (error) {
        console.error('Error loading publications:', error);
        allPublications = getFallbackPublications();
        renderPublications();
    }
}

function parseORCIDData(data) {
    const publications = [];
    
    if (!data.group) return publications;
    
    data.group.forEach(group => {
        const workSummary = group['work-summary']?.[0];
        if (!workSummary) return;
        
        const pub = {
            title: workSummary.title?.title?.value || 'Untitled',
            year: parseInt(workSummary['publication-date']?.year?.value) || null,
            month: workSummary['publication-date']?.month?.value || null,
            journal: workSummary['journal-title']?.value || '',
            type: workSummary.type || '',
            doi: extractDOI(workSummary),
            url: workSummary.url?.value || '',
            themes: [],
            projects: []
        };
        
        publications.push(pub);
    });
    
    return publications.sort((a, b) => (b.year || 0) - (a.year || 0));
}

function extractDOI(workSummary) {
    const externalIds = workSummary['external-ids']?.['external-id'];
    if (!externalIds) return '';
    const doiId = externalIds.find(id => id['external-id-type'] === 'doi');
    return doiId?.['external-id-value'] || '';
}

function getFallbackPublications() {
    return [
        {
            title: "FIRe glider: Mapping in situ chlorophyll variable fluorescence with autonomous underwater gliders",
            year: 2020,
            journal: "Limnology and Oceanography: Methods",
            doi: "10.1002/lom3.10380",
            themes: ['autonomous', 'polar'],
            projects: ['fire-glider', 'pal-lter']
        }
    ];
}

function setupThemeFilters() {
    const buttons = document.querySelectorAll('.theme-filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentThemeFilter = btn.dataset.theme;
            renderPublications();
        });
    });
}

function setupYearFilters() {
    const years = [...new Set(allPublications.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);
    const yearFiltersDiv = document.getElementById('year-filters');
    
    years.forEach(year => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.year = year;
        btn.textContent = year;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentYearFilter = year;
            renderPublications();
        });
        yearFiltersDiv.appendChild(btn);
    });
    
    // All years button
    document.querySelector('.filter-btn[data-year="all"]').addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-btn[data-year="all"]').classList.add('active');
        currentYearFilter = 'all';
        renderPublications();
    });
}

function setupSearch() {
    const searchInput = document.getElementById('pub-search');
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        renderPublications();
    });
}

function renderPublications() {
    const container = document.getElementById('publications-list');
    
    // Filter publications
    let filtered = allPublications.filter(pub => {
        // Theme filter
        if (currentThemeFilter !== 'all') {
            if (!pub.themes || !pub.themes.includes(currentThemeFilter)) {
                return false;
            }
        }
        
        // Year filter
        if (currentYearFilter !== 'all') {
            if (pub.year != currentYearFilter) {
                return false;
            }
        }
        
        // Search filter
        if (searchTerm) {
            const searchText = `${pub.title} ${pub.journal} ${pub.year}`.toLowerCase();
            if (!searchText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-muted">No publications found matching your filters.</p>';
        return;
    }
    
    // Group by year
    const byYear = {};
    filtered.forEach(pub => {
        const year = pub.year || 'Unknown';
        if (!byYear[year]) byYear[year] = [];
        byYear[year].push(pub);
    });
    
    // Render
    let html = '';
    Object.keys(byYear).sort((a, b) => b - a).forEach(year => {
        html += `<div class="year-group">
            <h2 class="year-header">${year}</h2>`;
        
        byYear[year].forEach(pub => {
            html += `<div class="publication-item">
                <h3 class="pub-title">${pub.title}</h3>
                <p class="pub-meta">
                    ${pub.journal ? `<em>${pub.journal}</em>` : ''}
                    ${pub.month && pub.year ? ` (${getMonthName(pub.month)} ${pub.year})` : pub.year ? ` (${pub.year})` : ''}
                </p>`;
            
            // Theme tags
            if (pub.themes && pub.themes.length > 0) {
                html += '<div class="pub-tags">';
                pub.themes.forEach(theme => {
                    const themeNames = {
                        'biophysical': 'Biophysical',
                        'polar': 'Polar',
                        'autonomous': 'Autonomous'
                    };
                    html += `<span class="pub-tag theme-tag">${themeNames[theme] || theme}</span>`;
                });
                html += '</div>';
            }
            
            // Links
            html += '<div class="pub-links">';
            if (pub.doi) {
                html += `<a href="https://doi.org/${pub.doi}" target="_blank">DOI</a>`;
            }
            if (pub.projects && pub.projects.length > 0) {
                pub.projects.forEach(proj => {
                    html += `<a href="projects/${proj}.html">Project: ${proj.toUpperCase()}</a>`;
                });
            }
            html += '</div>';
            
            html += '</div>';
        });
        
        html += '</div>';
    });
    
    container.innerHTML = html;
}

function getMonthName(month) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(month) - 1] || '';
}

function displayError() {
    document.getElementById('publications-list').innerHTML = 
        '<p class="error-message">Unable to load publications. Please try again later.</p>';
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
