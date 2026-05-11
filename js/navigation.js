// Shared Navigation System
(function() {
    const nav = `
        <nav class="navbar" id="navbar">
            <div class="container">
                <div class="nav-wrapper">
                    <a href="index.html" class="logo">Filipa Carvalho</a>
                    <button class="mobile-menu-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <ul class="nav-menu">
                        <li><a href="index.html" class="nav-link">Home</a></li>
                        <li><a href="biography.html" class="nav-link">Biography</a></li>
                        <li><a href="research.html" class="nav-link">Research</a></li>
                        <li><a href="publications.html" class="nav-link">Publications</a></li>
                        <li><a href="projects.html" class="nav-link">Projects</a></li>
                        <li><a href="people.html" class="nav-link">People</a></li>
                        <li><a href="photos.html" class="nav-link">Photos</a></li>
                        <li><a href="news.html" class="nav-link">News</a></li>
                        <li><a href="contact.html" class="nav-link">Contact</a></li>
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
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
})();
