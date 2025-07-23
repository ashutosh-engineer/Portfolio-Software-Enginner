// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle with improved functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
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

    // Initialize news ticker with priority system
    initNewsTicker();

    // Add tooltip data attributes from alt text for certification logos
    document.querySelectorAll('.cert-item img').forEach(img => {
        const altText = img.getAttribute('alt');
        img.parentElement.setAttribute('data-tooltip', altText);
    });

    // Featured Projects Carousel Functionality
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

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Fixed header adjustments
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.5)';
            header.style.backgroundColor = 'rgba(17, 17, 17, 0.98)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.4)';
            header.style.backgroundColor = 'rgba(17, 17, 17, 0.9)';
        }
    });

    // Fetch GitHub avatar and stats
    fetchGitHubData();

    // Add animation to elements when they come into view
    const observedElements = document.querySelectorAll('.project-card, .profile-link, .tech-tag, .featured-project-card, .github-stat-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = entry.target.classList.contains('tech-tag') ? 
                    'translateY(0)' : 'translateY(0)';
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
});

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
        const tickerItem = document.createElement('span');
        tickerItem.className = 'ticker-item';
        
        // Safely add icon
        const iconElement = document.createElement('i');
        iconElement.className = sanitizeInput(item.icon);
        tickerItem.appendChild(iconElement);
        
        // Add a space after icon
        tickerItem.appendChild(document.createTextNode(' '));
        
        // Add the text content - using a container for HTML content
        const textContainer = document.createElement('span');
        textContainer.innerHTML = sanitizeHTML(item.text);
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
            profileImgPlaceholder.innerHTML = `<img src="${profileData.avatar_url}" alt="Ashutosh Singh Profile Image" class="profile-img">`;
        }
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
    }
} 