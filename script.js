// Global version for cache management
const APP_VERSION = '1.0.0';

// DOM manipulation helpers
const DOM = {
    // Create elements
    createElement(tag, attributes = {}, text = '') {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.keys(attributes).forEach(attr => {
            element.setAttribute(attr, attributes[attr]);
        });
        
        // Set text content
        if (text) {
            element.textContent = text;
        }
        
        return element;
    },
    
    // Append multiple child elements
    appendChildren(parent, children) {
        if (!parent || !children) return;
        
        children.forEach(child => {
            if (child) parent.appendChild(child);
        });
        
        return parent;
    }
};

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle with improved functionality
    initMobileMenu();
    
    // Add tooltip data attributes from alt text for certification logos
    addCertTooltips();
    
    // Project carousel functionality
    initProjectCarousel();
    
    // Smooth scrolling for navigation
    initSmoothScrolling();
    
    // Fixed header effects
    initFixedHeader();
    
    // Initialize animations for elements
    initAnimations();
    
    // Initialize news ticker
    initNewsTicker();
    
    // Fetch GitHub avatar
    fetchGitHubData();
});

// Function to reload CSS files
function reloadCSS() {
    const timestamp = new Date().getTime();
    const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
    
    styleSheets.forEach(linkElement => {
        // Only update local CSS files, not external CDN resources
        if (linkElement.href.includes(window.location.origin)) {
            const originalHref = linkElement.href.split('?')[0];
            linkElement.href = `${originalHref}?v=${timestamp}`;
        }
    });
}

// Function to initialize mobile menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Toggle body scroll when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Function to add tooltips to certification logos
function addCertTooltips() {
    document.querySelectorAll('.cert-item img').forEach(img => {
        const altText = img.getAttribute('alt');
        if (altText) {
        img.parentElement.setAttribute('data-tooltip', altText);
        }
    });
}

// Function to initialize project carousel
function initProjectCarousel() {
    const projectCards = document.querySelectorAll('.project-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    
    // Project expansion functionality
    document.querySelectorAll('.project-preview').forEach(preview => {
        preview.addEventListener('click', function() {
            const projectCard = this.closest('.project-card');
            const details = projectCard.querySelector('.project-details');
            
            if (details.style.display === 'block') {
                details.style.display = 'none';
                this.classList.remove('expanded');
            } else {
                details.style.display = 'block';
                this.classList.add('expanded');
            }
        });
    });
    
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectCard = this.closest('.project-card');
            const details = projectCard.querySelector('.project-details');
            const preview = projectCard.querySelector('.project-preview');
            
            details.style.display = 'block';
            preview.classList.add('expanded');
        });
    });
    
    document.querySelectorAll('.collapse-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const projectCard = this.closest('.project-card');
            const details = projectCard.querySelector('.project-details');
            const preview = projectCard.querySelector('.project-preview');
            
            details.style.display = 'none';
            preview.classList.remove('expanded');
        });
    });
    
    // Carousel navigation functionality
    function showProject(index) {
        projectCards.forEach((card, i) => {
            card.style.display = i === index ? 'block' : 'none';
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + projectCards.length) % projectCards.length;
            showProject(currentIndex);
        });
        
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % projectCards.length;
            showProject(currentIndex);
        });
    }
    
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showProject(i);
        });
    });
}

// Function to initialize smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = 65; // Height of the fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking a link
                const navLinks = document.querySelector('.nav-links');
                const menuToggle = document.querySelector('.menu-toggle');
                
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (menuToggle) menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// Function to initialize fixed header effects
function initFixedHeader() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.5)';
            header.style.backgroundColor = 'rgba(17, 17, 17, 0.98)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.4)';
            header.style.backgroundColor = 'rgba(17, 17, 17, 0.9)';
            }
        }
    });
}

// Function to initialize animations
function initAnimations() {
    const observedElements = document.querySelectorAll('.project-card, .profile-link, .tech-tag, .featured-project-card, .github-stat-card');
    
    if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = entry.target.classList.contains('tech-tag') ? 
                    'translateY(0)' : 'translateY(0)';
                    // Stop observing after animation
                    observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    observedElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = element.classList.contains('tech-tag') ? 
            'translateY(10px)' : 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
    } else {
        // Fallback for browsers without IntersectionObserver
        observedElements.forEach(element => {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        });
    }
}

// News ticker items with dates for priority sorting
const newsItems = [
    {
        icon: 'fas fa-code-branch',
        text: 'Contributed to <a href="https://github.com/OWASP/OpenCRE/pulls?q=is%3Apr+author%3Anashutosh" target="_blank" rel="noopener noreferrer">OWASP Foundation OpenCRE project (GSoC)</a> - Resolved issue #614',
        date: '2025-07-21',
        priority: 10 // Highest priority to show first
    }
];

// Function to initialize the news ticker with priority queue
function initNewsTicker() {
    const tickerContent = document.querySelector('.news-ticker-content');
    if (!tickerContent) return;
    
    // News items with priority (higher number = higher priority)
    // Also ordered by date - newest will be shown first when priorities are equal
    const newsItems = [
        {
            text: 'Contributed to OWASP Foundation OpenCRE project (<a href="https://github.com/OWASP/OpenCRE/pulls" target="_blank">GSoC</a>) resolving issue <strong>#614</strong>',
            date: '2025-07-21',
            priority: 10,
            icon: 'fas fa-code-branch'
        }
    ];
    
    // Sort by priority (high to low) and then by date (newest to oldest)
    const sortedItems = [...newsItems].sort((a, b) => {
        // First sort by priority
        if (a.priority !== b.priority) {
            return b.priority - a.priority;
        }
        
        // If priorities are equal, sort by date
        return new Date(b.date) - new Date(a.date);
    });
    
    // Add sorted items to the ticker
    sortedItems.forEach(item => {
        const tickerItem = document.createElement('span');
        tickerItem.className = 'ticker-item';
        
        // Add icon
        const iconElement = document.createElement('i');
        iconElement.className = item.icon;
        tickerItem.appendChild(iconElement);
        
        // Add a space after icon
        tickerItem.appendChild(document.createTextNode(' '));
        
        // Add the text content
        const textContainer = document.createElement('span');
        textContainer.innerHTML = item.text;
        tickerItem.appendChild(textContainer);
        
        // Add date
        const dateSpan = document.createElement('span');
        dateSpan.className = 'ticker-date';
        dateSpan.textContent = formatDate(item.date);
        
        tickerItem.appendChild(dateSpan);
        
        tickerContent.appendChild(tickerItem);
    });
    
    // Clone items for continuous scrolling
    const originalItems = Array.from(tickerContent.children);
    originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        tickerContent.appendChild(clone);
    });
    
    // Adjust animation speed based on content length
    const tickerWidth = tickerContent.offsetWidth;
    const animationDuration = Math.max(20, tickerWidth / 50);
    tickerContent.style.animationDuration = `${animationDuration}s`;
}

// Format a date string
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Handle user input
function sanitizeInput(input) {
    return input.trim();
}

// Simple HTML sanitizing function
function sanitizeHTML(html) {
    return html;
}

// Function to fetch GitHub data (avatar only)
async function fetchGitHubData() {
    const username = 'nashutosh';
    
    try {
        // Fetch user profile information
        const profileResponse = await fetch(`https://api.github.com/users/${username}`);
        
        if (!profileResponse.ok) {
            throw new Error(`HTTP error! Status: ${profileResponse.status}`);
        }
        
        const profileData = await profileResponse.json();
        
        // Update hero image with GitHub avatar
        const profileImgPlaceholder = document.querySelector('.profile-img-placeholder');
        if (profileImgPlaceholder && profileData.avatar_url) {
            // Create image element
            const img = document.createElement('img');
            img.src = profileData.avatar_url;
            img.alt = 'Ashutosh Singh Profile Image';
            img.className = 'profile-img';
            
            // Add error handler for image loading failures
            img.onerror = function() {
                this.onerror = null;
                this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="12" r="12" fill="%23333"/%3E%3Cpath d="M7 15v2h10v-2H7zm2-8h6v2H9V7z" fill="%23FFF"/%3E%3C/svg%3E';
            };
            
            // Clear placeholder and add image
            profileImgPlaceholder.innerHTML = '';
            profileImgPlaceholder.appendChild(img);
        }
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        
        // Provide fallback for profile image on error
        const profileImgPlaceholder = document.querySelector('.profile-img-placeholder');
        if (profileImgPlaceholder) {
            profileImgPlaceholder.innerHTML = '<i class="fas fa-user-circle"></i>';
        }
    }
} 