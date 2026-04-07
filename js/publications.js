// Publications management with ORCID API integration
const ORCID_ID = '0000-0002-8355-4329';
const ORCID_API_URL = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;

let allPublications = [];
let filteredPublications = [];

// Initialize publications
async function initPublications() {
    try {
        await fetchPublications();
        renderPublications();
        setupFilters();
    } catch (error) {
        console.error('Error initializing publications:', error);
        displayError();
    }
}

// Fetch publications from ORCID
async function fetchPublications() {
    const loadingEl = document.getElementById('publications-list');
    
    try {
        const response = await fetch(ORCID_API_URL, {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch publications');
        }
        
        const data = await response.json();
        allPublications = parseORCIDData(data);
        filteredPublications = [...allPublications];
        
        // Sort by year (most recent first)
        allPublications.sort((a, b) => b.year - a.year);
        filteredPublications.sort((a, b) => b.year - a.year);
        
    } catch (error) {
        console.error('Error fetching from ORCID:', error);
        // Fallback to sample data if ORCID fails
        await loadFallbackPublications();
    }
}

// Parse ORCID API response
function parseORCIDData(data) {
    const publications = [];
    
    if (!data.group) return publications;
    
    data.group.forEach(group => {
        const workSummary = group['work-summary']?.[0];
        if (!workSummary) return;
        
        const pub = {
            title: workSummary.title?.title?.value || 'Untitled',
            year: workSummary['publication-date']?.year?.value || 'n.d.',
            journal: workSummary['journal-title']?.value || '',
            authors: '', // ORCID API doesn't provide authors in summary
            doi: extractDOI(workSummary),
            url: workSummary.url?.value || '',
            type: workSummary.type || 'journal-article'
        };
        
        publications.push(pub);
    });
    
    return publications;
}

// Extract DOI from external identifiers
function extractDOI(workSummary) {
    const externalIds = workSummary['external-ids']?.['external-id'];
    if (!externalIds) return '';
    
    const doiId = externalIds.find(id => id['external-id-type'] === 'doi');
    return doiId?.['external-id-value'] || '';
}

// Fallback publications (subset of your key papers)
async function loadFallbackPublications() {
    allPublications = [
        {
            title: "FIRe glider: Mapping in situ chlorophyll variable fluorescence with autonomous underwater gliders",
            authors: "Carvalho, F., et al.",
            year: 2020,
            journal: "Limnology and Oceanography: Methods",
            doi: "10.1002/lom3.10380",
            url: "https://aslopubs.onlinelibrary.wiley.com/doi/full/10.1002/lom3.10380"
        },
        {
            title: "Evaluating the sensor-equipped autonomous surface vehicle C-Worker 4 as a tool for identifying coastal ocean acidification",
            authors: "Carvalho, F., et al.",
            year: 2020,
            journal: "Journal of Marine Science and Engineering",
            doi: "10.3390/jmse8110939",
            url: "https://www.mdpi.com/2077-1312/8/11/939"
        },
        {
            title: "Optical particle measurements reveal cross-shelf turbidity gradients on the Agulhas Bank",
            authors: "Carvalho, F., et al.",
            year: 2022,
            journal: "Deep Sea Research Part II",
            doi: "10.1016/j.dsr2.2022.105094",
            url: "https://doi.org/10.1016/j.dsr2.2022.105094"
        },
        {
            title: "Primary production dynamics on the Agulhas Bank in autumn",
            authors: "Carvalho, F., et al.",
            year: 2022,
            journal: "Deep Sea Research Part II",
            doi: "10.1016/j.dsr2.2022.105153",
            url: "https://doi.org/10.1016/j.dsr2.2022.105153"
        }
    ];
    
    filteredPublications = [...allPublications];
}

// Render publications list
function renderPublications() {
    const container = document.getElementById('publications-list');
    
    if (filteredPublications.length === 0) {
        container.innerHTML = '<p class="text-center">No publications found matching your criteria.</p>';
        return;
    }
    
    const html = filteredPublications.map(pub => createPublicationHTML(pub)).join('');
    container.innerHTML = html;
}

// Create HTML for single publication
function createPublicationHTML(pub) {
    const links = [];
    
    if (pub.doi) {
        links.push(`<a href="https://doi.org/${pub.doi}" target="_blank" class="publication-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            DOI
        </a>`);
    }
    
    if (pub.url && !pub.doi) {
        links.push(`<a href="${pub.url}" target="_blank" class="publication-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Link
        </a>`);
    }
    
    return `
        <div class="publication-item" data-year="${pub.year}">
            <span class="publication-year">${pub.year}</span>
            <h3 class="publication-title">${pub.title}</h3>
            ${pub.authors ? `<p class="publication-authors">${pub.authors}</p>` : ''}
            ${pub.journal ? `<p class="publication-journal">${pub.journal}</p>` : ''}
            ${links.length > 0 ? `<div class="publication-links">${links.join('')}</div>` : ''}
        </div>
    `;
}

// Setup filters and search
function setupFilters() {
    // Get unique years
    const years = [...new Set(allPublications.map(pub => pub.year))].sort((a, b) => b - a);
    
    // Create year filter buttons
    const yearFiltersEl = document.getElementById('year-filters');
    years.forEach(year => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.setAttribute('data-year', year);
        btn.textContent = year;
        btn.addEventListener('click', () => filterByYear(year, btn));
        yearFiltersEl.appendChild(btn);
    });
    
    // Setup search
    const searchInput = document.getElementById('pub-search');
    searchInput.addEventListener('input', (e) => searchPublications(e.target.value));
    
    // Setup "All Years" button
    const allBtn = document.querySelector('[data-year="all"]');
    allBtn.addEventListener('click', () => {
        filteredPublications = [...allPublications];
        renderPublications();
        
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        allBtn.classList.add('active');
    });
}

// Filter publications by year
function filterByYear(year, clickedBtn) {
    filteredPublications = allPublications.filter(pub => pub.year == year);
    renderPublications();
    
    // Update active state
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
}

// Search publications
function searchPublications(query) {
    const lowerQuery = query.toLowerCase();
    
    filteredPublications = allPublications.filter(pub => {
        return pub.title.toLowerCase().includes(lowerQuery) ||
               (pub.authors && pub.authors.toLowerCase().includes(lowerQuery)) ||
               (pub.journal && pub.journal.toLowerCase().includes(lowerQuery));
    });
    
    renderPublications();
}

// Display error message
function displayError() {
    const container = document.getElementById('publications-list');
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                Unable to load publications from ORCID at this time.
            </p>
            <p style="color: var(--text-muted); font-size: 0.9rem;">
                Please visit my 
                <a href="https://orcid.org/${ORCID_ID}" target="_blank" style="color: var(--primary-color);">
                    ORCID profile
                </a>
                to view my complete publication list.
            </p>
        </div>
    `;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPublications);
} else {
    initPublications();
}
