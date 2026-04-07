// Load recent publications for each theme on research page
const ORCID_ID = '0000-0002-8355-4329';
const ORCID_API_URL = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;

async function loadThemePublications() {
    try {
        // Load publication tags
        const tagsResponse = await fetch('data/project-publications.json');
        const tagsData = await tagsResponse.json();
        
        // Load ORCID publications
        const orcidResponse = await fetch(ORCID_API_URL, {
            headers: { 'Accept': 'application/json' }
        });
        
        let publications = [];
        if (orcidResponse.ok) {
            const data = await orcidResponse.json();
            publications = parseORCIDData(data);
        }
        
        // Tag publications
        publications.forEach(pub => {
            const doiKey = pub.doi;
            const titleKey = pub.title.toLowerCase();
            
            let tags = tagsData.publications.find(p => p.doi === doiKey);
            if (!tags) {
                tags = tagsData.publications.find(p => 
                    titleKey.includes(p.title.toLowerCase())
                );
            }
            
            pub.themes = tags?.themes || [];
        });
        
        // Display for each theme
        displayRecentPubs('biophysical', publications);
        displayRecentPubs('polar', publications);
        displayRecentPubs('autonomous', publications);
        
    } catch (error) {
        console.error('Error loading theme publications:', error);
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

function displayRecentPubs(theme, allPubs) {
    const container = document.querySelector(`.recent-pubs-list[data-theme="${theme}"]`);
    if (!container) return;
    
    // Filter by theme and take top 3 recent
    const themePubs = allPubs
        .filter(p => p.themes && p.themes.includes(theme))
        .slice(0, 3);
    
    if (themePubs.length === 0) {
        container.innerHTML = '<p class="text-muted" style="font-size: 0.9rem; margin: 0;">No publications tagged yet</p>';
        return;
    }
    
    const html = '<ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.95rem;">' +
        themePubs.map(pub => `<li style="margin-bottom: 0.25rem;">${pub.title} (${pub.year})</li>`).join('') +
        '</ul>';
    
    container.innerHTML = html;
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadThemePublications);
} else {
    loadThemePublications();
}
