// Main JavaScript - Navigation, Dark Mode, Forms, and UI Interactions

// Dark Mode Toggle
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDark.matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', 
                e.matches ? 'dark' : 'light');
        }
    });
}

// Mobile Navigation
function initMobileNav() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!mobileToggle || !navMenu) return; // Exit if elements don't exist
    
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-wrapper')) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Smooth Scrolling and Active Navigation
function initNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    // Highlight active section in nav
    function highlightNav() {
        if (sections.length === 0) return; // Skip if no sections
        
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Navbar scroll effect
    function handleScroll() {
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else if (navbar) {
            navbar.classList.remove('scrolled');
        }
        highlightNav();
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
}

// Contact Form Handler
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return; // Exit if form doesn't exist
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Create mailto link
        const mailtoLink = `mailto:filcar@noc.ac.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
        
        // Open default email client
        window.location.href = mailtoLink;
        
        // Optional: Show confirmation message
        showNotification('Opening your email client...');
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--radius-md);
        box-shadow: 0 5px 20px var(--shadow);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for fade-in animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and items
    const animatedElements = document.querySelectorAll(
        '.research-card, .project-card, .news-item, .publication-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// External link handling
function initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.getAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

// Keyboard navigation
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // Close mobile menu with Escape
        if (e.key === 'Escape') {
            document.querySelector('.mobile-menu-toggle')?.classList.remove('active');
            document.querySelector('.nav-menu')?.classList.remove('active');
        }
        
        // Ctrl/Cmd + K for search (if you add search later)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('pub-search')?.focus();
        }
    });
}

// Back to top button
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 5px 20px var(--shadow);
        transition: var(--transition);
        z-index: 999;
    `;
    backToTop.setAttribute('aria-label', 'Back to top');
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });
    
    document.body.appendChild(backToTop);
}

// Copy email to clipboard
function initEmailCopy() {
    const emailElements = document.querySelectorAll('[href^="mailto:"]');
    
    emailElements.forEach(el => {
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const email = el.getAttribute('href').replace('mailto:', '');
            
            navigator.clipboard.writeText(email).then(() => {
                showNotification('Email copied to clipboard!');
            });
        });
    });
}

// Performance: Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Print functionality
function initPrint() {
    const printButtons = document.querySelectorAll('[data-print]');
    
    printButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            window.print();
        });
    });
}

// Initialize all features
function init() {
    initTheme();
    initMobileNav();
    initNavigation();
    initContactForm();
    initExternalLinks();
    initKeyboardNav();
    initBackToTop();
    initEmailCopy();
    initLazyLoading();
    initPrint();
    
    // Delayed animations after content loads
    setTimeout(initAnimations, 500);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable offline mode
        // navigator.serviceWorker.register('/sw.js');
    });
}
