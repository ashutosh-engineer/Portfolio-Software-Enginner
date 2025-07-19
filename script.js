// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Offset for the fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            // Simple validation
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                isValid = false;
                highlightError(nameInput);
            } else {
                removeHighlight(nameInput);
            }
            
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                isValid = false;
                highlightError(emailInput);
            } else {
                removeHighlight(emailInput);
            }
            
            if (!messageInput.value.trim()) {
                isValid = false;
                highlightError(messageInput);
            } else {
                removeHighlight(messageInput);
            }
            
            if (isValid) {
                // In a real application, you'd send the form data to a server here
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Please fill in all required fields correctly.');
            }
        });
    }
    
    // Helper functions for form validation
    function highlightError(element) {
        element.style.borderColor = 'red';
    }
    
    function removeHighlight(element) {
        element.style.borderColor = '';
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Add animation to skill sections when they come into view
    const skillCategories = document.querySelectorAll('.skill-category');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    skillCategories.forEach(category => {
        category.style.opacity = 0;
        category.style.transform = 'translateY(20px)';
        category.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(category);
    });
}); 