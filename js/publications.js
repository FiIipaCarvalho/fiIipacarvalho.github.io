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
        allPublications.sort((a, b) => (b.year || 0) - (a.year || 0));
        filteredPublications.sort((a, b) => (b.year || 0) - (a.year || 0));
        
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
            year: parseInt(workSummary['publication-date']?.year?.value) || null,
            month: workSummary['publication-date']?.month?.value || '',
            journal: workSummary['journal-title']?.value || '',
            authors: '', // ORCID API doesn't provide authors in summary
            doi: extractDOI(workSummary),
            url: workSummary.url?.value || '',
            type: workSummary.type || 'journal-article',
            description: ''
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

// Fallback publications (with full example data)
async function loadFallbackPublications() {
    allPublications = [
        {
            title: "Implications for oceanographic and seafloor geodetic applications due to settling of self-calibrating bottom pressure recorders",
            authors: "N. Harmon, C. A. Rychert, B. Moat, D. Smeed, F. Carvalho, T. Petit, M. Walker, P. Provost, T. Thomas",
            year: 2026,
            month: "January",
            journal: "Geophysical Research Letters",
            description: "Measurements of the pressure at the bottom of the oceans are useful for understanding ocean currents and vertical motions of the seafloor.",
            pdf: "https://agupubs.onlinelibrary.wiley.com/doi/epdf/10.1029/2025GL117927",
            doi: "10.1029/2025GL117927",
            project: "https://eleanorfrajka.com/project/epoc/"
        },
        {
            title: "Primary production dynamics on the Agulhas Bank in autumn",
            authors: "Carvalho, F., et al.",
            year: 2022,
            journal: "Deep Sea Research Part II",
            description: "Investigation of primary production patterns and drivers on the Agulhas Bank during autumn conditions.",
            doi: "10.1016/j.dsr2.2022.105153"
        },
        {
            title: "Optical particle measurements reveal cross-shelf turbidity gradients on the Agulhas Bank",
            authors: "Carvalho, F., et al.",
            year: 2022,
            journal: "Deep Sea Research Part II",
            description: "Using optical particle measurements to understand cross-shelf variability in turbidity and particle dynamics.",
            doi: "10.1016/j.dsr2.2022.105094"
        },
        {
            title: "Evaluating the sensor-equipped autonomous surface vehicle C-Worker 4 as a tool for identifying coastal ocean acidification",
            authors: "Carvalho, F., et al.",
            year: 2020,
            journal: "Journal of Marine Science and Engineering",
            description: "Assessment of autonomous surface vehicles for monitoring ocean acidification in coastal environments.",
            doi: "10.3390/jmse8110939"
        },
        {
            title: "FIRe glider: Mapping in situ chlorophyll variable fluorescence with autonomous underwater gliders",
            authors: "Carvalho, F., et al.",
            year: 2020,
            journal: "Limnology and Oceanography: Methods",
            description: "Development and application of fluorescence measurements on autonomous underwater gliders for studying phytoplankton physiology.",
            doi: "10.1002/lom3.10380",
            pdf: "https://aslopubs.onlinelibrary.wiley.com/doi/epdf/10.1002/lom3.10380"
        }
    ];
    
    filteredPublications = [...allPublications];
}

// Render publications list with year grouping
function renderPublications() {
    const container = document.getElementById('publications-list');
    
    if (filteredPublications.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No publications found matching your criteria.</p>';
        return;
    }
    
    // Group publications by year
    const pubsByYear = {};
    filteredPublications.forEach(pub => {
        const year = pub.year || 'Unknown';
        if (!pubsByYear[year]) {
            pubsByYear[year] = [];
        }
        pubsByYear[year].push(pub);
    });
    
    // Sort years descending
    const years = Object.keys(pubsByYear).sort((a, b) => {
        if (a === 'Unknown') return 1;
        if (b === 'Unknown') return -1;
        return parseInt(b) - parseInt(a);
    });
    
    // Build HTML with year headers
    let html = '';
    years.forEach(year => {
        html += `
        <div class="year-group">
            <h2 class="year-header">${year}</h2>
            <div class="year-publications">
                ${pubsByYear[year].map(pub => createPublicationHTML(pub)).join('')}
            </div>
        </div>`;
    });
    
    container.innerHTML = html;
}

// Create HTML for single publication (Eleanor's style)
function createPublicationHTML(pub) {
    const links = [];
    
    // PDF link
    if (pub.pdf) {
        links.push(`<a href="${pub.pdf}" target="_blank" class="pub-link">PDF</a>`);
    }
    
    // Cite link (placeholder)
    links.push(`<a href="#" class="pub-link" onclick="event.preventDefault(); alert('Citation: ${pub.title}')">Cite</a>`);
    
    // Project link
    if (pub.project) {
        links.push(`<a href="${pub.project}" target="_blank" class="pub-link">Project</a>`);
    }
    
    // DOI link
    if (pub.doi) {
        links.push(`<a href="https://doi.org/${pub.doi}" target="_blank" class="pub-link">DOI</a>`);
    } else if (pub.url) {
        links.push(`<a href="${pub.url}" target="_blank" class="pub-link">Link</a>`);
    }
    
    // Create description preview
    const description = pub.description || '';
    const shortDesc = description.length > 150 ? description.substring(0, 150) + '…' : description;
    
    return `
        <div class="publication-item">
            <h3 class="pub-title">${pub.title}</h3>
            ${shortDesc ? `<p class="pub-description">${shortDesc}</p>` : ''}
            ${pub.authors ? `<p class="pub-authors">${pub.authors}</p>` : ''}
            <p class="pub-meta">
                ${pub.month ? `<span class="pub-date">${pub.month} ${pub.year}</span>` : `<span class="pub-date">${pub.year}</span>`}
                ${pub.journal ? `<span class="pub-venue">${pub.journal}</span>` : ''}
            </p>
            <div class="pub-links">${links.join(' ')}</div>
        </div>
    `;
}

// Setup filters and search
function setupFilters() {
    // Get unique years
    const years = [...new Set(allPublications.map(pub => pub.year).filter(y => y))].sort((a, b) => b - a);
    
    // Create year filter buttons
    const yearFiltersEl = document.getElementById('year-filters');
    if (yearFiltersEl) {
        years.forEach(year => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.setAttribute('data-year', year);
            btn.textContent = year;
            btn.addEventListener('click', () => filterByYear(year, btn));
            yearFiltersEl.appendChild(btn);
        });
    }
    
    // Setup search
    const searchInput = document.getElementById('pub-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => searchPublications(e.target.value));
    }
    
    // Setup "All Years" button
    const allBtn = document.querySelector('[data-year="all"]');
    if (allBtn) {
        allBtn.addEventListener('click', () => {
            filteredPublications = [...allPublications];
            renderPublications();
            
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            allBtn.classList.add('active');
        });
    }
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
