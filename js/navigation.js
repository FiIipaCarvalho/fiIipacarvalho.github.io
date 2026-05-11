/**
 * Shared Navigation System
 * Loads navigation and sets active page
 */

const navigationHTML = `<nav class="navbar" id="navbar">
        <div class="container">
            <div class="nav-wrapper">
                <a href="index.html" class="logo">Filipa Carvalho</a>
                <button class="mobile-menu-toggle" aria-label="Toggle menu">
                    <span></span><span></span><span></span>
                </button>
                <ul class="nav-menu">
                    <li><a href="index.html" class="nav-link">Home</a></li>
                    <li><a href="biography.html" class="nav-link">Biography</a></li>
                    <li><a href="research.html" class="nav-link">Research</a></li>
                    <li><a href="publications.html" class="nav-link">Publications</a></li>
                    <li><a href="projects.html" class="nav-link">Projects</a></li>
                    <li><a href="people.html" class="nav-link">People</a></li>
                    <li><a href="fieldwork.html" class="nav-link">Fieldwork</a></li>
                    <li><a href="photos.html" class="nav-link">Photos</a></li>
                    <li><a href="news.html" class="nav-link">News</a></li>
                    <li><a href="contact.html" class="nav-link">Contact</a></li>
                    <li><button class="theme-toggle" aria-label="Toggle dark mode">
                        <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                        <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                    </button></li>
                </ul>
            </div>
        </div>
    </nav>`;

document.addEventListener('DOMContentLoaded', function() {
    // Insert navigation
    const navPlaceholder = document.getElementById('navigation-placeholder');
    if (navPlaceholder) {
        navPlaceholder.innerHTML = navigationHTML;
    }
    
    // Set active page based on current URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
});
