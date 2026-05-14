// Shared Navigation System
(function() {
    // Detect if we're in a subfolder
    const inSubfolder = window.location.pathname.includes('/projects/') || window.location.pathname.includes('/research_themes/');
    const prefix = inSubfolder ? '../' : '';
    
    const nav = `
        <nav class="navbar" id="navbar">
            <div class="container">
                <div class="nav-wrapper">
                    <a href="${prefix}index.html" class="logo">Filipa Carvalho</a>
                    <button class="mobile-menu-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <ul class="nav-menu">
                        <li><a href="${prefix}index.html" class="nav-link">Home</a></li>
                        <li><a href="${prefix}biography.html" class="nav-link">Biography</a></li>
                        <li><a href="${prefix}research.html" class="nav-link">Research</a></li>
                        <li><a href="${prefix}publications.html" class="nav-link">Publications</a></li>
                        <li><a href="${prefix}projects.html" class="nav-link">Projects</a></li>
                        <li><a href="${prefix}people.html" class="nav-link">People</a></li>
                        <li><a href="${prefix}photos.html" class="nav-link">Photos</a></li>
                        <li><a href="${prefix}fieldwork.html" class="nav-link">Fieldwork</a></li>
                        <li><a href="${prefix}resources.html" class="nav-link">Resources</a></li>
                        <li><a href="${prefix}news.html" class="nav-link">News</a></li>
                        <li><a href="${prefix}contact.html" class="nav-link">Contact</a></li>
                        <li><button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode">🌙</button></li>
                    </ul>
                </div>
            </div>
        </nav>
    `;
    
    // Insert navigation
    const placeholder = document.getElementById('navigation-placeholder');
    if (placeholder) {
        placeholder.innerHTML = nav;
        
        // Set active page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href.endsWith(currentPage)) {
                link.classList.add('active');
            }
        });
    }
})();
