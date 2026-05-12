// Research Theme Page JavaScript - loads publications filtered by theme keywords
const ORCID_ID = '0000-0002-8355-4329';
const ORCID_API_URL = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;

let allPublications = [];
let publicationTags = {};
let currentKeywordFilter = 'all';

async function initResearchThemePage() {
    if (typeof THEME_KEYWORDS === 'undefined') {
        console.error('THEME_KEYWORDS not defined');
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
                keywords: pub.keywords || []
            };
        });
        
        // Load ORCID publications
        await loadPublications();
        setupKeywordFilters();
        renderPublications();
        
    } catch (error) {
        console.error('Error loading research theme page:', error);
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
            
            pub.keywords = tags?.keywords || [];
            pub.projects = tags?.projects || [];
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
            keywords: [],
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

function setupKeywordFilters() {
    const buttons = document.querySelectorAll('.keyword-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentKeywordFilter = btn.dataset.keyword;
            renderPublications();
        });
    });
}

function renderPublications() {
    const container = document.getElementById('theme-publications-container');
    if (!container) return;

    // Filter by theme keywords
    let filtered = allPublications.filter(pub => {
        if (!pub.keywords || pub.keywords.length === 0) return false;
        
        // Check if publication has ANY of the theme keywords
        const hasThemeKeyword = pub.keywords.some(kw => THEME_KEYWORDS.includes(kw));
        if (!hasThemeKeyword) return false;
        
        // Apply current keyword filter
        if (currentKeywordFilter !== 'all') {
            return pub.keywords.includes(currentKeywordFilter);
        }
        
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-muted">No publications tagged to this research theme yet.</p>';
        return;
    }

    const KEYWORD_NAMES = {
        'biological-carbon-pump': 'Biological Carbon Pump',
        'phytoplankton-dynamics': 'Phytoplankton Dynamics',
        'biophysical-interactions': 'Biophysical Interactions',
        'autonomous-systems': 'Autonomous Systems',
        'best-practices': 'Best Practices',
        'polar-ecosystems': 'Polar Ecosystems',
        'dataset': 'Dataset',
        'methods': 'Methods'
    };

    const html = filtered.map(pub => {
        let tags = '';

        // Keyword tags only (page already filters by project/theme)
        if (pub.keywords && pub.keywords.length > 0) {
            tags += pub.keywords.map(kw =>
                `<span class="pub-tag keyword-tag">${KEYWORD_NAMES[kw] || kw}</span>`
            ).join('');
        }

        return `
        <div class="pub-item-compact">
            <h4>${pub.title}</h4>
            <p class="pub-meta-compact">
                ${pub.journal ? pub.journal + ' • ' : ''}${pub.year}${pub.doi ? `. <a href="https://doi.org/${pub.doi}" target="_blank" class="doi-link">doi: ${pub.doi}</a>` : ''}
            </p>
            ${tags ? `<div class="pub-tags">${tags}</div>` : ''}
        </div>
    `;
    }).join('');

    container.innerHTML = html;
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResearchThemePage);
} else {
    initResearchThemePage();
}
