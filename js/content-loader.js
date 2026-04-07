// Content Loader - Handles loading markdown files and rendering content

// Load and render about section
async function loadAbout() {
    try {
        const response = await fetch('content/about.md');
        const markdown = await response.text();
        const html = marked.parse(markdown);
        document.getElementById('about-content').innerHTML = html;
    } catch (error) {
        console.error('Error loading about content:', error);
    }
}

// Load and render research themes
async function loadResearch() {
    const themes = [
        {
            title: "Biophysical Controls on Marine Productivity and Carbon Export",
            content: `Ocean physics fundamentally controls where and when marine ecosystems transfer carbon to depth. This research uses autonomous platforms to observe how mixed layer dynamics, stratification, deep convection and mesoscale eddies regulate phytoplankton growth and the formation of sinking particles. By capturing processes across timescales from hours to seasons, this work reveals the mechanisms linking physical forcing to carbon export efficiency in different ocean regimes.`,
            projects: {
                current: ["ReBELS", "PARTITRICS", "IDAPro"],
                past: ["GOCART", "COMICS", "CUSTARD", "BIARRITZ"]
            }
        },
        {
            title: "Polar and Subpolar Ocean Ecosystems",
            content: `High-latitude oceans exhibit extreme seasonal cycles in mixing, light and temperature that generate intense but ephemeral productivity with disproportionate influence on global carbon storage. Research in these environments examines how winter convection, spring restratification, glacier–ocean interactions and ongoing climate change shape ecosystem structure and particle export pathways. These regions serve as natural laboratories where physical controls on biological processes become particularly visible and where climate-driven changes may fundamentally alter carbon cycling.`,
            projects: {
                current: ["ReBELS", "POLOMINTS"],
                past: ["PAL-LTER", "SEAFAReRS", "CONVERGE"]
            }
        },
        {
            title: "Autonomous Ocean Observing Systems",
            content: `Sustained ocean observation requires platforms that operate continuously through seasons and weather conditions inaccessible to research vessels. This research develops glider-based observing strategies that capture episodic events, resolve sub-seasonal variability and extend measurements into under-sampled regions. Work includes integrating biogeochemical sensors for real-time ecosystem monitoring, refining data processing pipelines for quality and interoperability, and demonstrating how marine robotics can address questions requiring persistent ocean presence.`,
            projects: {
                current: ["GLIDERS I", "GLIDERS II", "APART"],
                past: ["TechOceanS", "FIRe-Glider"]
            }
        }
    ];
    
    const container = document.getElementById('research-content');
    
    const html = themes.map(theme => `
        <div class="research-card">
            <h3>${theme.title}</h3>
            <p>${theme.content}</p>
            <div class="research-projects">
                <p><strong>Current projects:</strong> ${theme.projects.current.join(', ')}</p>
                <p><strong>Past projects:</strong> ${theme.projects.past.join(', ')}</p>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Load and render projects
async function loadProjects() {
    const currentProjects = [
        {
            title: "ReBELS",
            fullName: "Resolving Biological carbon Export in the Labrador Sea",
            dates: "Current",
            funding: "NERC",
            role: "Lead PI",
            description: "Investigates biological carbon export in the Labrador Sea, where deep winter convection and North Atlantic Deep Water formation create conditions for long-term carbon storage. Autonomous platforms, moorings and ship-based measurements track how convection, restratification and mesoscale eddies influence phytoplankton dynamics and particle export throughout the seasonal cycle.",
            url: "https://noc.ac.uk/projects/rebels",
            status: "current"
        },
        {
            title: "PARTITRICS",
            fullName: "PARTIcle Transformation and Respiration Influence on ocean Carbon Storage",
            dates: "Current",
            funding: "NERC",
            role: "WP1 Lead",
            description: "Examines the fate of sinking particles as they transit the mesopelagic twilight zone. By quantifying how microbial respiration, particle fragmentation and ecosystem interactions transform organic matter, this work determines what controls remineralization depth—the critical factor governing whether exported carbon remains sequestered for decades or returns to the atmosphere within years.",
            url: "https://bio-carbon.ac.uk/node/33",
            status: "current"
        },
        {
            title: "IDAPro",
            fullName: "Integrating Drivers of Atlantic Productivity",
            dates: "Current",
            funding: "NERC",
            role: "NOC PI",
            description: "Synthesizes observations across the Atlantic to understand productivity drivers from tropical to polar latitudes. Combining autonomous platforms, ship sampling and satellite data, the project maps how ocean dynamics regulate nutrient supply and ecosystem structure across contrasting physical regimes.",
            url: "https://bio-carbon.ac.uk/node/31",
            status: "current"
        },
        {
            title: "POLOMINTS",
            fullName: "Polar Ocean Mixing by Internal Tsunamis",
            dates: "Current",
            funding: "NERC",
            role: "WP2 Lead",
            description: "Investigates glacier calving as a mixing mechanism in Antarctic coastal waters. Glider observations, ship-based measurements and modeling quantify how calving-generated internal waves enhance ocean mixing near glaciers, revealing a previously underappreciated pathway through which ice-ocean interactions influence circulation and ecosystem dynamics.",
            url: "https://polomints.ac.uk",
            status: "current"
        },
        {
            title: "GLIDERS I & II",
            fullName: "GLider-type Infrastructure and Digital Environment for Research Science",
            dates: "Current",
            funding: "NOC / FMRI",
            role: "Lead PI",
            description: "Develops frameworks for processing, integrating and exploiting ocean glider data within modern observing systems. Creates standardised workflows and robust data pipelines that enable high-resolution autonomous observations to be efficiently quality-controlled and integrated with satellite, float and ship measurements.",
            status: "current"
        },
        {
            title: "APART",
            fullName: "Autonomous Platforms as A Research Tool",
            dates: "Current",
            funding: "NERC",
            role: "Co-PI",
            description: "Equips researchers with skills to design, plan and analyze research using marine autonomous systems including ocean gliders, Argo floats and autonomous underwater vehicles. The training programme covers mission design, sensor selection and calibration, data processing and quality control.",
            url: "https://noc.ac.uk/education/training-course-apart",
            status: "current"
        }
    ];
    
    const pastProjects = [
        {
            title: "GOCART",
            fullName: "Gauging ocean Organic Carbon fluxes using Autonomous Robotic Technologies",
            dates: "2018-2020",
            funding: "NERC",
            description: "Deployed autonomous underwater vehicles to capture high-resolution variability in organic carbon flux and remineralization that ship-based snapshots cannot resolve, revealing how episodic physical and biological events control export efficiency and particle degradation.",
            url: "https://projects.noc.ac.uk/gocart",
            status: "past"
        },
        {
            title: "COMICS",
            fullName: "Controls over Ocean Mesopelagic Interior Carbon Storage",
            dates: "2017-2020",
            funding: "NERC",
            description: "Examined mesopelagic carbon flow and ecosystem controls on carbon storage through field campaigns in the Benguela Upwelling and Southern Ocean near South Georgia, contrasting highly productive upwelling conditions with seasonal Southern Ocean dynamics.",
            url: "https://comics.ac.uk/",
            status: "past"
        },
        {
            title: "PAL-LTER",
            fullName: "Palmer Long-Term Ecological Research",
            dates: "2011-2017",
            description: "Examined phytoplankton dynamics along the rapidly warming West Antarctic Peninsula through sustained ecological observations, documenting ecosystem responses to environmental change in one of the Southern Ocean's most climate-sensitive regions.",
            url: "https://pallter.marine.rutgers.edu",
            status: "past"
        }
    ];
    
    const container = document.getElementById('projects-content');
    let currentFilter = 'current';
    
    function renderProjects(filter) {
        const projects = filter === 'current' ? currentProjects : pastProjects;
        
        const html = projects.map(proj => `
            <div class="project-card">
                <h3>${proj.title}</h3>
                ${proj.fullName ? `<p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">${proj.fullName}</p>` : ''}
                <div class="project-meta">
                    ${proj.dates ? `<span class="project-tag">${proj.dates}</span>` : ''}
                    ${proj.funding ? `<span class="project-tag">${proj.funding}</span>` : ''}
                    ${proj.role ? `<span class="project-tag">${proj.role}</span>` : ''}
                </div>
                <p>${proj.description}</p>
                ${proj.url ? `<p><a href="${proj.url}" target="_blank">Learn more →</a></p>` : ''}
            </div>
        `).join('');
        
        container.innerHTML = html;
    }
    
    // Initial render
    renderProjects(currentFilter);
    
    // Setup filter buttons
    document.querySelectorAll('.projects-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            currentFilter = filter;
            renderProjects(filter);
            
            // Update active state
            document.querySelectorAll('.projects-filter .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Load and render team/committees
async function loadTeam() {
    const content = `
        <h3>At NOC:</h3>
        <ul>
            <li>Member of Steering Team for Arctic Mission</li>
            <li>Autonomy Working Group Lead</li>
        </ul>
        
        <h3>National:</h3>
        <ul>
            <li><strong>Chief Scientist for Marine Autonomy and Robotic Systems (MARS)</strong></li>
            <li>Co-lead for Marine Autonomy and Robotics System (MARS) Working Group for Marine Facilities Advisory Board (MFAB)</li>
            <li>Member of Science Advisory Group (SAG) for Future Marine Research Infrastructure (FMRI)</li>
        </ul>
        
        <h3>International:</h3>
        <ul>
            <li><strong>Co-Chair for OceanGliders</strong> (GOOS network)</li>
            <li>Scientific Advisory Committee member for Voice of the Ocean (VOTO)</li>
        </ul>
    `;
    
    document.getElementById('team-content').innerHTML = content;
}

// Load and render news
async function loadNews() {
    const newsItems = [
        {
            date: "2022-10",
            title: "New Publication: Primary Production on Agulhas Bank",
            content: "Our latest research on primary production dynamics on the Agulhas Bank in autumn has been published in Deep Sea Research Part II."
        },
        {
            date: "2022-09",
            title: "Optical Particle Measurements Published",
            content: "New publication on optical particle measurements revealing cross-shelf turbidity gradients on the Agulhas Bank in Deep Sea Research Part II."
        },
        {
            date: "2020-11",
            title: "Autonomous Surface Vehicle Study Published",
            content: "Our evaluation of the C-Worker 4 autonomous surface vehicle for coastal ocean acidification monitoring has been published in the Journal of Marine Science and Engineering."
        },
        {
            date: "2020-08",
            title: "FIRe Glider Technology Published",
            content: "Excited to share our work on mapping chlorophyll variable fluorescence with autonomous underwater gliders, now published in Limnology and Oceanography: Methods."
        },
        {
            date: "2019",
            title: "NOC DST Early Career Award",
            content: "Honored to receive the NOC DST Early Career Award for Science 2019."
        }
    ];
    
    const container = document.getElementById('news-content');
    
    const html = newsItems.map(item => `
        <div class="news-item">
            <p class="news-date">${formatNewsDate(item.date)}</p>
            <h3>${item.title}</h3>
            <p>${item.content}</p>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Format news date
function formatNewsDate(dateStr) {
    const [year, month] = dateStr.split('-');
    if (!month) return year;
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
}

// Initialize all content when DOM is ready
function initContent() {
    loadAbout();
    loadResearch();
    loadProjects();
    loadTeam();
    loadNews();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContent);
} else {
    initContent();
}
