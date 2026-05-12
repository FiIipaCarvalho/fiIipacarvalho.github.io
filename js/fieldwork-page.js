// Fieldwork page — loads data/fieldwork.json and renders grouped, sorted cards

const TYPE_LABELS = {
    cruise:        'Research Cruise',
    glider_mission: 'Glider Mission',
    field_station:  'Field Station'
};

async function initFieldworkPage() {
    const container = document.getElementById('fieldwork-activities');
    if (!container) return;

    try {
        const response = await fetch('data/fieldwork.json');
        const data = await response.json();
        container.innerHTML = renderRegions(data.regions);
    } catch (err) {
        console.error('Error loading fieldwork data:', err);
        container.innerHTML = '<p class="text-muted">Unable to load fieldwork data.</p>';
    }
}

function latestDate(activities) {
    return Math.max(...activities.map(a => new Date(a.date)));
}

function renderRegions(regions) {
    return regions.map(region => {
        // sort projects by latest activity date, newest first
        const sorted = [...region.projects].sort(
            (a, b) => latestDate(b.activities) - latestDate(a.activities)
        );

        const projectsHtml = sorted.map(project => {
            // sort activities newest first
            const acts = [...project.activities].sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );
            const heading = project.link
                ? `<a href="${project.link}">${project.name}</a>`
                : project.name;
            const cards = acts.map(renderCard).join('');
            return `<h3 class="fieldwork-project-title">${heading}</h3>${cards}`;
        }).join('');

        return `<h2 class="fieldwork-region-title">${region.name}</h2>${projectsHtml}`;
    }).join('');
}

function renderCard(activity) {
    const typeLabel = TYPE_LABELS[activity.type] || activity.type;

    let title = activity.label;
    if (activity.cruise_id) title += ` — ${activity.cruise_id}`;

    let meta = `<strong>Location:</strong> ${activity.location}`;
    if (activity.role)    meta += `<br><strong>Role:</strong> ${activity.role}`;
    if (activity.gliders && activity.gliders.length) {
        meta += `<br><strong>Gliders:</strong> ${activity.gliders.map(g => g.replace(/_/g, ' ')).join(', ')}`;
    }
    if (activity.description) meta += `<br>${activity.description}`;

    const photosLink = activity.photos_album
        ? `<a href="photos.html?album=${activity.photos_album}" class="expedition-gallery-link">View Photos →</a>`
        : '';

    return `
<div class="expedition-card">
    <div class="expedition-header">
        <h3>${title}</h3>
        <span class="expedition-date">${activity.date_display}</span>
    </div>
    <span class="activity-type-tag ${activity.type}-tag">${typeLabel}</span>
    <p>${meta}</p>
    ${photosLink}
</div>`;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFieldworkPage);
} else {
    initFieldworkPage();
}
