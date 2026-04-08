// Projects List Page
// Renders project cards dynamically from data/projects.json

async function initProjectsList() {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();

        const currentContainer = document.getElementById('current-projects-list');
        const pastContainer = document.getElementById('past-projects-list');

        const currentProjects = data.projects.filter(p => p.status === 'current');
        const pastProjects = data.projects.filter(p => p.status === 'past');

        if (currentContainer) {
            currentContainer.innerHTML = currentProjects.map(p => renderProjectCard(p, true)).join('');
        }
        if (pastContainer) {
            pastContainer.innerHTML = pastProjects.map(p => renderProjectCard(p, false)).join('');
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function renderProjectCard(project, showDescription) {
    const metaParts = [project.dates, project.funding, project.role].filter(Boolean);
    const meta = metaParts.length ? `<p class="project-meta">${metaParts.join(' • ')}</p>` : '';
    const description = showDescription && project.description
        ? `<p class="project-description-short">${project.description}</p>`
        : '';

    return `
        <div class="project-card-list">
            <div class="project-card-content">
                <h3><a href="projects/${project.id}.html">${project.title}</a></h3>
                <p class="project-subtitle">${project.fullTitle}</p>
                ${meta}
                ${description}
            </div>
        </div>`;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectsList);
} else {
    initProjectsList();
}
