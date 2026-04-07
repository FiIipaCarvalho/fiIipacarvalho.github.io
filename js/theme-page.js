// Theme Page JavaScript - loads publications for a specific theme
const ORCID_ID = '0000-0002-8355-4329';
const ORCID_API_URL = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;

let allPublications = [];
let publicationTags = {};

async function initThemePage() {
    if (typeof THEME_ID === 'undefined') {
        console.error('THEME_ID not defined');
        return;
    }

    try {
        // Load publication tags
        const tagsResponse = await fetch('../data/project-publications.json');
        const tagsData = await tagsResponse.json();
        
        // Create lookup map
        tagsData.publications.forEach(pub => {
            const key = pub.doi || pub.title.toLowerCase();
            publicationTags[key] = {
                projects: pub.projects || [],
                themes: pub.themes || []
            };
        });
        
        // Load ORCID publications
        await loadPublications();
        renderPublications();
        
    } catch (error) {
        console.error('Error loading theme page:', error);
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
        }
        
        // Tag publications
        allPublications.forEach(pub => {
            const doiKey = pub.doi;
            const titleKey = pub.title.toLowerCase();
            
            let tags = publicationTags[doiKey];
            if (!tags) {
                tags = Object.entries(publicationTags).find(([key, val]) => {
                    return titleKey.includes(key.toLowerCase());
                })?.[1];
            }
            
            pub.themes = tags?.themes || [];
        });
        
    } catch (error) {
        console.error('Error loading publications:', error);
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
            journal: workSummary['journal-title']?.value || '',
            doi: extractDOI(workSummary),
            themes: []
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

function renderPublications() {
    const container = document.getElementById('theme-publications-container');
    if (!container) return;

    // Filter by theme
    const themePubs = allPublications.filter(pub => 
        pub.themes && pub.themes.includes(THEME_ID)
    );

    if (themePubs.length === 0) {
        container.innerHTML = '<p class="text-muted">No publications tagged to this theme yet.</p>';
        return;
    }

    const html = themePubs.map(pub => `
        <div class="pub-item-compact">
            <h4>${pub.title}</h4>
            <p class="pub-meta-compact">
                ${pub.journal ? pub.journal + ' • ' : ''}${pub.year}
            </p>
            ${pub.doi ? `<a href="https://doi.org/${pub.doi}" target="_blank" class="pub-link-compact">DOI</a>` : ''}
        </div>
    `).join('');

    container.innerHTML = html;
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemePage);
} else {
    initThemePage();
}
