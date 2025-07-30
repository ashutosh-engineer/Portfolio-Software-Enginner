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
    
    // Duplicate news ticker items
    initNewsTicker();
    
    // Initialize events modal
    initEventsModal();
    
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

// Function to initialize news ticker
function initNewsTicker() {
    const tickerContent = document.querySelector('.news-ticker-content');
    if (!tickerContent) return;
    
    // Clone items for continuous scrolling
    const originalItems = Array.from(tickerContent.children);
    originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        tickerContent.appendChild(clone);
    });
    
    // Set animation speed based on screen width and content length
    const totalWidth = tickerContent.scrollWidth;
    const isMobile = window.innerWidth <= 768;
    
    // Slower animation for mobile to ensure all items are visible
    const animationDuration = isMobile 
        ? Math.max(25, totalWidth / 60) // Slower on mobile
        : Math.max(15, totalWidth / 120); // Faster on desktop
    
    tickerContent.style.animationDuration = `${animationDuration}s`;
    
    // Ensure ticker content has proper width and spacing
    if (isMobile) {
        // Add extra spacing on mobile between items
        const tickerItems = tickerContent.querySelectorAll('.ticker-item');
        tickerItems.forEach(item => {
            item.style.marginRight = '200px'; // More spacing on mobile
            item.style.paddingLeft = '15px';
            item.style.paddingRight = '15px';
        });
    }
    
    // Handle window resize events to adjust animation speed
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth <= 768;
        const newDuration = newIsMobile 
            ? Math.max(25, tickerContent.scrollWidth / 60)
            : Math.max(15, tickerContent.scrollWidth / 120);
        
        tickerContent.style.animationDuration = `${newDuration}s`;
        
        // Update spacing on resize
        const tickerItems = tickerContent.querySelectorAll('.ticker-item');
        tickerItems.forEach(item => {
            item.style.marginRight = newIsMobile ? '200px' : '120px';
            item.style.paddingLeft = newIsMobile ? '15px' : '';
            item.style.paddingRight = newIsMobile ? '15px' : '';
        });
    });

    // --- ENHANCED INTERACTIVITY ---
    // Pause/resume on hover or focus
    function pauseTicker() {
        tickerContent.style.animationPlayState = 'paused';
    }
    function resumeTicker() {
        tickerContent.style.animationPlayState = 'running';
    }
    tickerContent.addEventListener('mouseenter', pauseTicker);
    tickerContent.addEventListener('mouseleave', resumeTicker);
    tickerContent.addEventListener('focusin', pauseTicker);
    tickerContent.addEventListener('focusout', resumeTicker);

    // Add tooltips to ticker items for clarity
    document.querySelectorAll('.ticker-item').forEach(item => {
        if (!item.title) {
            item.title = item.textContent.trim();
        }
    });
}

// Function to initialize events modal
function initEventsModal() {
    const modal = document.getElementById('events-modal');
    const whatsNewLabel = document.getElementById('whats-new-label');
    const closeModal = document.querySelector('.close-modal');
    
    if (!modal || !whatsNewLabel || !closeModal) return;
    
    // Add data-label attributes to table cells for mobile view
    const tableCells = document.querySelectorAll('.events-table tbody td');
    const headerTexts = Array.from(document.querySelectorAll('.events-table th')).map(th => th.textContent);
    
    tableCells.forEach((cell, index) => {
        const headerIndex = index % headerTexts.length;
        cell.setAttribute('data-label', headerTexts[headerIndex]);
    });
    
    // Helper function to open modal
    const openModalFunction = (e) => {
        e.preventDefault();
        e.stopPropagation();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        console.log('Modal opened');
    };
    
    // Improved mobile touch handling
    let touchStarted = false;
    
    // Handle touch events for mobile
    whatsNewLabel.addEventListener('touchstart', (e) => {
        touchStarted = true;
        e.preventDefault();
        e.stopPropagation();
    }, {passive: false});
    
    whatsNewLabel.addEventListener('touchend', (e) => {
        if (touchStarted) {
            e.preventDefault();
            e.stopPropagation();
            openModalFunction(e);
            touchStarted = false;
        }
    }, {passive: false});
    
    // Handle click events for desktop (only if not a touch device or touch didn't occur)
    whatsNewLabel.addEventListener('click', (e) => {
        if (!touchStarted) {
            openModalFunction(e);
        }
    });
    
    // Make sure the entire label area is clickable - apply same logic to span
    const labelSpan = whatsNewLabel.querySelector('span');
    if (labelSpan) {
        labelSpan.addEventListener('touchstart', (e) => {
            touchStarted = true;
            e.preventDefault();
            e.stopPropagation();
        }, {passive: false});
        
        labelSpan.addEventListener('touchend', (e) => {
            if (touchStarted) {
                e.preventDefault();
                e.stopPropagation();
                openModalFunction(e);
                touchStarted = false;
            }
        }, {passive: false});
        
        labelSpan.addEventListener('click', (e) => {
            if (!touchStarted) {
                openModalFunction(e);
            }
        });
    }
    
    // Close modal when clicking on X button
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
        console.log('Modal closed via X button');
    });
    // Keyboard accessibility for close button
    closeModal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            e.preventDefault();
        }
    });
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
            console.log('Modal closed via outside click');
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
            console.log('Modal closed via Escape key');
        }
    });
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