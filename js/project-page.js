// Project Page JavaScript
// Loads team members and publications for individual project pages

let projectData = null;
let projectTeams = null;
let projectPubs = null;
let allPublications = [];
let galleryData = null;

// Initialize project page
async function initProjectPage() {
    if (typeof PROJECT_ID === 'undefined') {
        console.error('PROJECT_ID not defined');
        return;
    }

    try {
        // Load all data files
        await Promise.all([
            loadProjectData(),
            loadProjectTeams(),
            loadProjectPublications(),
            loadORCIDPublications(),
            loadGalleryData()
        ]);

        // Populate page
        renderMeta();
        renderSummary();
        renderTeam();
        renderPublications();
        renderFieldwork();
    } catch (error) {
        console.error('Error loading project data:', error);
    }
}

// Load gallery data (for fieldwork albums)
async function loadGalleryData() {
    try {
        const response = await fetch('../data/gallery.json');
        galleryData = await response.json();
    } catch (e) {
        console.error('Failed to load gallery.json', e);
    }
}

// Load project metadata
async function loadProjectData() {
    const response = await fetch('../data/projects.json');
    const data = await response.json();
    projectData = data.projects.find(p => p.id === PROJECT_ID);
}

// Load team assignments
async function loadProjectTeams() {
    const response = await fetch('../data/project-teams.json');
    const data = await response.json();
    projectTeams = data.project_teams[PROJECT_ID];
}

// Load publication assignments
async function loadProjectPublications() {
    const response = await fetch('../data/project-publications.json');
    projectPubs = await response.json();
}

// Load publications from ORCID
async function loadORCIDPublications() {
    const ORCID_ID = '0000-0002-8355-4329';
    const ORCID_API_URL = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;
    
    try {
        const response = await fetch(ORCID_API_URL, {
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            const data = await response.json();
            allPublications = parseORCIDData(data);
        }
    } catch (error) {
        console.error('Failed to load from ORCID, using fallback');
        allPublications = getFallbackPublications();
    }
}

// Parse ORCID data (same as publications.js)
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
            url: workSummary.url?.value || ''
        };
        
        publications.push(pub);
    });
    
    return publications;
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
            title: "Implications for oceanographic and seafloor geodetic applications due to settling of self-calibrating bottom pressure recorders",
            year: 2026,
            journal: "Geophysical Research Letters",
            doi: "10.1029/2025GL117927"
        },
        {
            title: "FIRe glider: Mapping in situ chlorophyll variable fluorescence with autonomous underwater gliders",
            year: 2020,
            journal: "Limnology and Oceanography: Methods",
            doi: "10.1002/lom3.10380"
        }
    ];
}

// Render project meta bar from JSON data
function renderMeta() {
    const metaBar = document.querySelector('.project-meta-bar');
    if (!metaBar || !projectData) return;

    let html = '';
    if (projectData.dates) {
        html += `<div class="meta-item"><strong>Duration:</strong> ${projectData.dates}</div>`;
    }
    if (projectData.funding) {
        html += `<div class="meta-item"><strong>Funding:</strong> ${projectData.funding}</div>`;
    }
    if (projectData.pi && projectData.noc_pi) {
        html += `<div class="meta-item"><strong>Project PI:</strong> ${projectData.pi}</div>`;
        html += `<div class="meta-item"><strong>NOC PI:</strong> ${projectData.noc_pi}</div>`;
    } else if (projectData.pi) {
        html += `<div class="meta-item"><strong>PI:</strong> ${projectData.pi}</div>`;
    } else if (projectData.noc_pi) {
        html += `<div class="meta-item"><strong>NOC PI:</strong> ${projectData.noc_pi}</div>`;
    }
    if (projectData.role) {
        html += `<div class="meta-item"><strong>Role:</strong> ${projectData.role}</div>`;
    }
    if (projectData.website) {
        html += `<div class="meta-item"><a href="${projectData.website}" target="_blank" rel="noopener" class="project-website-link">Project Website →</a></div>`;
    }

    metaBar.innerHTML = html;
}

// Render summary from JSON, replacing any hardcoded description content
function renderSummary() {
    const descSection = document.querySelector('.project-description');
    if (!descSection || !projectData?.summary) return;

    descSection.innerHTML = `
        <h2>Project Overview</h2>
        <p class="project-summary">${projectData.summary}</p>`;
}

// Render fieldwork album cards from gallery.json into .project-photos
function renderFieldwork() {
    const section = document.querySelector('.project-photos');
    if (!section) return;

    const albumIds = projectData?.fieldwork;
    if (!albumIds || albumIds.length === 0 || !galleryData) {
        section.innerHTML = `
            <h2>Fieldwork</h2>
            <p class="text-muted">No fieldwork expeditions recorded for this project yet.</p>`;
        return;
    }

    const albums = galleryData.fieldwork.filter(a => albumIds.includes(a.id));

    if (albums.length === 0) {
        section.innerHTML = `
            <h2>Fieldwork</h2>
            <p class="text-muted">No fieldwork expeditions recorded for this project yet.</p>`;
        return;
    }

    const cards = albums.map(album => `
        <a class="fieldwork-card" href="../photos.html?album=${album.id}">
            <div class="fieldwork-card-cover">
                <img src="../${album.folder}/${album.cover}"
                     alt="${album.title}"
                     onerror="this.src='../images/gallery-placeholder.svg'">
            </div>
            <div class="fieldwork-card-info">
                <strong>${album.title}</strong>
                ${album.years ? `<span>${album.years}</span>` : ''}
                <p>${album.description}</p>
            </div>
        </a>`).join('');

    section.innerHTML = `<h2>Fieldwork</h2><div class="fieldwork-grid">${cards}</div>`;
}

// Render team members
function renderTeam() {
    const container = document.getElementById('project-team-container');
    if (!container || !projectTeams) return;

    let html = '';
    
    // PI
    if (projectTeams.pi && projectTeams.pi.length > 0) {
        html += '<div class="team-role-section"><h4>Principal Investigator</h4><div class="team-members">';
        projectTeams.pi.forEach(name => {
            html += createTeamMemberCard(name);
        });
        html += '</div></div>';
    }
    
    // Staff
    if (projectTeams.staff && projectTeams.staff.length > 0) {
        html += '<div class="team-role-section"><h4>Research Staff</h4><div class="team-members">';
        projectTeams.staff.forEach(name => {
            html += createTeamMemberCard(name);
        });
        html += '</div></div>';
    }
    
    // Students
    if (projectTeams.students && projectTeams.students.length > 0) {
        html += '<div class="team-role-section"><h4>PhD Students</h4><div class="team-members">';
        projectTeams.students.forEach(name => {
            html += createTeamMemberCard(name);
        });
        html += '</div></div>';
    }
    
    // Alumni
    if (projectTeams.alumni && projectTeams.alumni.length > 0) {
        html += '<div class="team-role-section"><h4>Alumni</h4><div class="team-members">';
        projectTeams.alumni.forEach(name => {
            html += createTeamMemberCard(name);
        });
        html += '</div></div>';
    }
    
    container.innerHTML = html;
}

function createTeamMemberCard(name) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const photoPath = `../images/team/${slug}.jpg`;
    
    return `
        <div class="team-member-mini">
            <img src="${photoPath}" alt="${name}" onerror="this.src='../images/team/placeholder.svg'">
            <p>${name}</p>
        </div>
    `;
}

// Render publications tagged to this project
function renderPublications() {
    const container = document.getElementById('project-publications-container');
    if (!container) return;

    // Find publications tagged to this project
    const taggedPubs = projectPubs.publications
        .filter(p => p.projects.includes(PROJECT_ID))
        .map(p => p.doi || p.title);

    // Match against ORCID publications
    const matchedPubs = allPublications.filter(pub => {
        return taggedPubs.some(tagged => {
            return (pub.doi && tagged === pub.doi) || 
                   (pub.title && pub.title.toLowerCase().includes(tagged.toLowerCase()));
        });
    });

    if (matchedPubs.length === 0) {
        container.innerHTML = '<p class="text-muted">No publications tagged to this project yet.</p>';
        return;
    }

    // Render publication list
    const html = matchedPubs.map(pub => `
        <div class="pub-item-compact">
            <h4>${pub.title}</h4>
            <p class="pub-meta-compact">
                ${pub.year} ${pub.journal ? '• ' + pub.journal : ''}
            </p>
            ${pub.doi ? `<a href="https://doi.org/${pub.doi}" target="_blank" class="pub-link-compact">DOI</a>` : ''}
        </div>
    `).join('');

    container.innerHTML = html;
}

// Initialize when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectPage);
} else {
    initProjectPage();
}
