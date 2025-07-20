// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = document.querySelector('.theme-label');
    
    // Set dark theme as default
    if (localStorage.getItem('theme') === 'light') {
        document.body.setAttribute('data-theme', 'light');
        themeToggle.checked = false;
        themeLabel.textContent = 'Dark Mode';
    } else {
        document.body.removeAttribute('data-theme'); // Default is dark
        themeToggle.checked = true;
        themeLabel.textContent = 'Light Mode';
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.removeAttribute('data-theme'); // Default is dark
            localStorage.removeItem('theme');
            themeLabel.textContent = 'Light Mode';
        } else {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeLabel.textContent = 'Dark Mode';
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60, // Offset for the fixed header
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
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
            header.style.backgroundColor = 'rgba(20, 20, 20, 0.98)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            header.style.backgroundColor = 'rgba(20, 20, 20, 0.95)';
        }
    });

    // Fetch GitHub data
    fetchGitHubData();

    // Fetch LeetCode Profile
    fetchLeetCodeProfile();

    // Fetch Codeforces Profile
    fetchCodeforcesProfile();

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
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

    // Add animation to elements when they come into view
    const observedElements = document.querySelectorAll('.project-card, .profile-card, .tech-tag, .github-stat-card, .featured-project-card');
    
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

// Function to fetch GitHub projects and profile data
async function fetchGitHubData() {
    const username = 'nashutosh';
    const statsContainer = document.getElementById('github-stats-container');
    
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
        
        // Display GitHub statistics cards
        statsContainer.innerHTML = '';
        
        // Repositories card
        const reposCard = createStatCard('Repositories', profileData.public_repos, 'fa-code-branch');
        statsContainer.appendChild(reposCard);
        
        // Followers card
        const followersCard = createStatCard('Followers', profileData.followers, 'fa-users');
        statsContainer.appendChild(followersCard);
        
        // Following card
        const followingCard = createStatCard('Following', profileData.following, 'fa-user-plus');
        statsContainer.appendChild(followingCard);
        
        // Join date card
        const joinDate = new Date(profileData.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const joinDateCard = createStatCard('Joined GitHub', joinDate, 'fa-calendar-alt');
        statsContainer.appendChild(joinDateCard);
        
        // Contribution graph placeholder (in a real scenario, you'd use a library like Chart.js)
        const contributionGraph = document.createElement('div');
        contributionGraph.className = 'github-contribution-graph';
        contributionGraph.innerHTML = `
            <div class="github-stat-title">
                <i class="fas fa-chart-line"></i>
                Contribution Activity
            </div>
            <p>Visit my <a href="https://github.com/${username}" target="_blank">GitHub profile</a> to see my contribution activity.</p>
        `;
        statsContainer.appendChild(contributionGraph);
        
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        statsContainer.innerHTML = `<p class="error">Error loading GitHub profile. ${error.message}</p>`;
    }
}

// Helper function to create GitHub stat cards
function createStatCard(title, value, iconName) {
    const card = document.createElement('div');
    card.className = 'github-stat-card';
    
    card.innerHTML = `
        <div class="github-stat-title">
            <i class="fas ${iconName}"></i>
            ${title}
        </div>
        <div class="github-stat-value">${value}</div>
    `;
    
    return card;
}

// Function to fetch LeetCode profile data
async function fetchLeetCodeProfile() {
    const leetcodeSolved = document.getElementById('leetcode-solved');
    const leetcodeRating = document.getElementById('leetcode-rating');
    const easyProgress = document.getElementById('leetcode-easy-progress');
    const mediumProgress = document.getElementById('leetcode-medium-progress');
    const hardProgress = document.getElementById('leetcode-hard-progress');
    const easyText = document.getElementById('leetcode-easy-text');
    const mediumText = document.getElementById('leetcode-medium-text');
    const hardText = document.getElementById('leetcode-hard-text');
    
    try {
        const response = await fetch('https://leetcode-stats-api.herokuapp.com/Ashu054');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update basic stats
        leetcodeSolved.textContent = data.totalSolved || 'N/A';
        leetcodeRating.textContent = data.ranking || 'N/A';
        
        // Update progress bars
        if (easyProgress && easyText) {
            const easyPercent = (data.easySolved / data.totalEasy) * 100;
            easyProgress.style.width = `${easyPercent}%`;
            easyText.textContent = `${data.easySolved}/${data.totalEasy}`;
        }
        
        if (mediumProgress && mediumText) {
            const mediumPercent = (data.mediumSolved / data.totalMedium) * 100;
            mediumProgress.style.width = `${mediumPercent}%`;
            mediumText.textContent = `${data.mediumSolved}/${data.totalMedium}`;
        }
        
        if (hardProgress && hardText) {
            const hardPercent = (data.hardSolved / data.totalHard) * 100;
            hardProgress.style.width = `${hardPercent}%`;
            hardText.textContent = `${data.hardSolved}/${data.totalHard}`;
        }
        
    } catch (error) {
        console.error('Error fetching LeetCode profile:', error);
        leetcodeSolved.textContent = 'N/A';
        leetcodeRating.textContent = 'N/A';
        
        // Set default values for progress bars
        if (easyText) easyText.textContent = 'N/A';
        if (mediumText) mediumText.textContent = 'N/A';
        if (hardText) hardText.textContent = 'N/A';
    }
}

// Function to fetch Codeforces profile data
async function fetchCodeforcesProfile() {
    const username = 'ashutoshsingh6376';
    const codeforcesRating = document.getElementById('codeforces-rating');
    const codeforcesRank = document.getElementById('codeforces-rank');
    const codeforcesSolved = document.getElementById('codeforces-solved');
    const ratingChartContainer = document.getElementById('codeforces-rating-chart');
    const problemChartContainer = document.getElementById('codeforces-problem-chart');
    
    try {
        // Fetch user info
        const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
        
        if (!userResponse.ok) {
            throw new Error(`HTTP error! Status: ${userResponse.status}`);
        }
        
        const userData = await userResponse.json();
        
        if (userData.status === 'OK' && userData.result.length > 0) {
            const userInfo = userData.result[0];
            codeforcesRating.textContent = userInfo.rating || 'Unrated';
            codeforcesRank.textContent = userInfo.rank || 'Unranked';
            
            // Fetch user's submissions for problem count
            try {
                const submissionsResponse = await fetch(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=1000`);
                
                if (submissionsResponse.ok) {
                    const submissionsData = await submissionsResponse.json();
                    
                    if (submissionsData.status === 'OK') {
                        // Count unique solved problems
                        const solvedProblems = new Set();
                        submissionsData.result.forEach(submission => {
                            if (submission.verdict === 'OK') {
                                const problemId = `${submission.problem.contestId}${submission.problem.index}`;
                                solvedProblems.add(problemId);
                            }
                        });
                        
                        codeforcesSolved.textContent = solvedProblems.size;
                        
                        // Create placeholder for charts - in a real scenario, you'd use a charting library
                        ratingChartContainer.innerHTML = `
                            <p style="text-align: center; padding-top: 80px;">
                                Rating history visualization<br>
                                <a href="https://codeforces.com/profile/${username}" target="_blank">View on Codeforces</a>
                            </p>
                        `;
                        
                        problemChartContainer.innerHTML = `
                            <p style="text-align: center; padding-top: 80px;">
                                Problem solving distribution<br>
                                <a href="https://codeforces.com/profile/${username}" target="_blank">View on Codeforces</a>
                            </p>
                        `;
                    }
                }
            } catch (submissionsError) {
                console.error('Error fetching Codeforces submissions:', submissionsError);
                codeforcesSolved.textContent = 'N/A';
            }
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error fetching Codeforces profile:', error);
        codeforcesRating.textContent = 'N/A';
        codeforcesRank.textContent = 'N/A';
        codeforcesSolved.textContent = 'N/A';
        
        if (ratingChartContainer) {
            ratingChartContainer.innerHTML = `<p class="error">Error loading chart data</p>`;
        }
        
        if (problemChartContainer) {
            problemChartContainer.innerHTML = `<p class="error">Error loading chart data</p>`;
        }
    }
} 