// Global version for cache management
const APP_VERSION = '1.0.0';

// Safe DOM manipulation helpers
const DOM = {
    // Create elements safely
    createElement(tag, attributes = {}, text = '') {
        const element = document.createElement(tag);
        
        // Set attributes safely
        Object.keys(attributes).forEach(attr => {
            if (attr.startsWith('on')) return; // Skip event handlers for security
            element.setAttribute(attr, attributes[attr]);
        });
        
        // Set text content safely (not innerHTML)
        if (text) {
            element.textContent = text;
        }
        
        return element;
    },
    
    // Append multiple child elements safely
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
    // Check for version changes
    checkAppVersion();
    
    // Initialize news ticker with priority system
    initNewsTicker();

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
    
    // Fetch GitHub avatar
    fetchGitHubData();
});

// Function to check if app version has changed
function checkAppVersion() {
    const storedVersion = localStorage.getItem('app_version');
    const currentVersion = window.APP_VERSION || APP_VERSION;
    
    // If version is different or not set
    if (storedVersion !== currentVersion) {
        console.log(`App version changed from ${storedVersion} to ${currentVersion}`);
        
        // Update CSS and JS resources
        refreshResources();
        
        // Store the new version
        localStorage.setItem('app_version', currentVersion);
    }
}

// Function to refresh resources when version changes
function refreshResources() {
    // Force reload CSS
    reloadCSS();
    
    // Clear any cached data
    sessionStorage.clear();
}

// Function to reload CSS files
function reloadCSS() {
    const timestamp = new Date().getTime();
    const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
    
    styleSheets.forEach(linkElement => {
        // Only update local CSS files, not external CDN resources
        if (linkElement.href.includes(window.location.origin)) {
            const originalHref = linkElement.href.split('?')[0];
            const newHref = `${originalHref}?v=${APP_VERSION}&t=${timestamp}`;
            
            // Create a new link element
            const newLink = DOM.createElement('link', {
                rel: 'stylesheet',
                href: newHref,
                type: 'text/css'
            });
            
            // Add it to head
            linkElement.parentNode.insertBefore(newLink, linkElement.nextSibling);
            
            // Remove the old one after the new one loads
            newLink.onload = () => {
                linkElement.parentNode.removeChild(linkElement);
            };
            
            // If it fails to load, keep the old one
            newLink.onerror = () => {
                linkElement.parentNode.removeChild(newLink);
            };
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
    
    // Clear existing content
    tickerContent.innerHTML = '';
    
    // Sort news items by date (newest first) and priority
    const sortedItems = [...newsItems].sort((a, b) => {
        // First sort by priority (higher number means higher priority)
        if (a.priority !== b.priority) {
            return b.priority - a.priority;
        }
        // If same priority, sort by date (newer first)
        return new Date(b.date) - new Date(a.date);
    });
    
    // Add sorted items to the ticker with security measures
    sortedItems.forEach(item => {
        const tickerItem = DOM.createElement('span', {
            class: 'ticker-item'
        });
        
        // Safely add icon
        const iconElement = DOM.createElement('i', {
            class: sanitizeInput(item.icon)
        });
        tickerItem.appendChild(iconElement);
        
        // Add a space after icon
        tickerItem.appendChild(document.createTextNode(' '));
        
        // Add the text content - using a container for HTML content
        const textContainer = DOM.createElement('span');
        textContainer.innerHTML = sanitizeHTML(item.text);
        tickerItem.appendChild(textContainer);
        
        // Add date
        const dateSpan = DOM.createElement('span', {
            class: 'ticker-date'
        }, formatDate(item.date));
        
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

// Helper function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
}

// Security helper functions
function sanitizeInput(input) {
    // Basic sanitization for CSS classes
    return input.replace(/[^\w\s-]/g, '');
}

function sanitizeHTML(html) {
    // Only allow specific tags and attributes
    const allowedTags = ['a', 'b', 'i', 'strong', 'em'];
    const allowedAttributes = {
        'a': ['href', 'target', 'rel']
    };
    
    // Create temporary element
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Process all nodes
    Array.from(temp.querySelectorAll('*')).forEach(element => {
        // Remove disallowed tags
        if (!allowedTags.includes(element.tagName.toLowerCase())) {
            element.outerHTML = element.innerHTML;
            return;
        }
        
        // Remove disallowed attributes
        Array.from(element.attributes).forEach(attr => {
            const tagAllowedAttrs = allowedAttributes[element.tagName.toLowerCase()];
            if (!tagAllowedAttrs || !tagAllowedAttrs.includes(attr.name)) {
                element.removeAttribute(attr.name);
            }
        });
        
        // Ensure links have proper security attributes
        if (element.tagName.toLowerCase() === 'a' && element.getAttribute('target') === '_blank') {
            element.setAttribute('rel', 'noopener noreferrer');
        }
    });
    
    return temp.innerHTML;
}

// Function to fetch GitHub data (avatar only) with safety mechanisms
async function fetchGitHubData() {
    const username = 'nashutosh';
    
    try {
        // Create AbortController for fetch timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        // Fetch user profile information with timeout
        const profileResponse = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!profileResponse.ok) {
            throw new Error(`HTTP error! Status: ${profileResponse.status}`);
        }
        
        const profileData = await profileResponse.json();
        
        // Update hero image with GitHub avatar
        const profileImgPlaceholder = document.querySelector('.profile-img-placeholder');
        if (profileImgPlaceholder && profileData.avatar_url) {
            // Create image element safely
            const img = DOM.createElement('img', {
                src: profileData.avatar_url,
                alt: 'Ashutosh Singh Profile Image',
                class: 'profile-img',
                loading: 'eager',
                decoding: 'async'
            });
            
            // Add error handler for image loading failures
            img.onerror = function() {
                this.onerror = null;
                this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="12" r="12" fill="%23333"/%3E%3Cpath d="M7 15v2h10v-2H7zm2-8h6v2H9V7z" fill="%23FFF"/%3E%3C/svg%3E';
                this.alt = 'Profile Placeholder';
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