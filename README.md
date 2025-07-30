# Ashutosh Singh - Software Engineer Portfolio

A modern, secure and high-performance portfolio website showcasing professional experience, education, projects, and GitHub contributions.

## Features

### Content Features
- Responsive design that works on desktop, tablet, and mobile devices
- Professional education section with institution logos
- GitHub statistics with real-time data
- Dynamic news ticker for latest achievements
- Internship & experience showcase
- Education timeline with institutional branding
- Project portfolio with interactive previews
- Tech stack and skills visualization
- Coding profiles integration (GitHub, LeetCode, CodeForces)

### Technical Features
- **Security & Privacy**
  - Strong Content Security Policy (CSP)
  - Protection against XSS attacks and clickjacking
  - Subresource Integrity (SRI) for external resources
  - Advanced sanitization of dynamic content
  - Secure external links (rel="noopener noreferrer")
  - Permissions Policy limiting access to sensitive browser features

- **Performance Optimizations**
  - Smart caching strategy with automatic version management
  - Critical CSS inlining for faster initial rendering
  - Resource preloading for key assets
  - Progressive image loading with fallbacks
  - Service Worker for offline capability
  - Lazy loading of non-critical resources

- **User Experience**
  - Enhanced mobile menu animations
  - Improved scrolling behavior
  - Streamlined navigation
  - Smart error handling with graceful fallbacks
  - Animation performance optimizations
  
- **Developer Experience**
  - Modular JavaScript architecture
  - Centralized version management
  - Automated cache invalidation
  - Clean, semantic HTML structure

## Technologies Used

- **Core Technologies**
  - HTML5 with semantic markup
  - CSS3 with modern features (Grid, Flexbox, Variables)
- Vanilla JavaScript with ES6+ features
  
- **Performance & Security**
  - Service Workers for offline capabilities
  - Intersection Observer API for efficient animations
  - Content Security Policy (CSP)
  - LocalStorage/SessionStorage for state management
  - Cache API for resource management

- **External Integrations**
  - GitHub REST API for profile data
  - Font Awesome for iconography
  - Custom GitHub stats widgets

## Project Structure

```
portfolio-site/
│
├── index.html          # Main HTML file with structured content and security headers
├── styles.css          # CSS styles with optimized loading
├── script.js           # Modern JavaScript with modular architecture
├── sw.js               # Service Worker with advanced caching strategies
└── README.md           # Comprehensive project documentation
```

## Security Features

### Content Security Policy (CSP)
A strict CSP that allows content only from trusted sources:
- Scripts only from same origin and cdnjs.cloudflare.com
- Styles from same origin and cdnjs.cloudflare.com
- Images from specific trusted domains
- No inline scripts allowed (except those with nonces)
- No dangerous eval() or Function constructors

### Protection Headers
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Referrer-Policy**: Limits information leakage
- **Permissions-Policy**: Restricts access to sensitive browser features
- **Strict-Transport-Security**: Enforces HTTPS connections

### Link Protection
- All external links use rel="noopener noreferrer"
- Protection against tabnabbing attacks

### Content Sanitization
- HTML content is sanitized before rendering
- Allowlist-based approach for HTML tags and attributes
- Safe DOM manipulation helpers prevent XSS vulnerabilities

## Performance Optimizations

### Resource Loading
- CSS preloading for critical resources
- Efficient font loading strategy
- Optimized image loading with width/height attributes
- Preconnect hints for external domains

### Caching Strategy
- Multiple cache levels for different resource types:
  - Network-first for HTML/CSS/JS (always fresh)
  - Cache-first for static assets (images, icons)
  - Stale-while-revalidate for fonts and API data

### Version Management
- Centralized version control for resources
- Automatic cache invalidation on deployments
- Clean version transition without page reloads

## Getting Started

1. Clone the repository
   ```
   git clone https://github.com/ashutosh-engineer/Portfolio-Software-Engineer.git
   ```

2. Open `index.html` in your browser or use a local development server

## Deployment

This website can be deployed on any web hosting service or platforms like:

- GitHub Pages
- Netlify
- Vercel
- Any traditional web hosting

## Browser Support

This portfolio website is compatible with all modern browsers including:

- Chrome
- Firefox
- Safari
- Edge

## Contact

Ashutosh Singh - [LinkedIn](https://www.linkedin.com/in/ashutosh-singh-7945812b2/)
GitHub: [https://github.com/ashutosh-engineer](https://github.com/ashutosh-engineer)