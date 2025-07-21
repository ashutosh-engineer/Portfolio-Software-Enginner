// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

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

    // Fetch GitHub avatar
    fetchGitHubAvatar();

    // Add animation to elements when they come into view
    const observedElements = document.querySelectorAll('.project-card, .profile-link, .tech-tag, .featured-project-card');
    
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

// Function to fetch GitHub avatar for profile image
async function fetchGitHubAvatar() {
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
            profileImgPlaceholder.innerHTML = `<img src="${profileData.avatar_url}" alt="Profile Image" class="profile-img">`;
        }
    } catch (error) {
        console.error('Error fetching GitHub avatar:', error);
    }
} 