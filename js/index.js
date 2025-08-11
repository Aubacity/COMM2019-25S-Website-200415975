// Load navbar and footer components
async function loadComponents() {
    try {
        // Create promises for both components
        const navbarPromise = fetch('navbar.html').then(response => response.text());
        const footerPromise = fetch('footer.html').then(response => response.text());
        
        // Wait for both to complete
        const [navbarHTML, footerHTML] = await Promise.all([navbarPromise, footerPromise]);
        
        // Load navbar
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.innerHTML = navbarHTML;
        }

        // Load footer
        const footer = document.getElementById('footer');
        if (footer) {
            footer.innerHTML = footerHTML;
        }

        // Set active navigation after components are loaded
        setActiveNavigation();
        
        // Initialize mobile menu after navbar is loaded
        initializeMobileMenu();
        
        return true; // Indicate successful loading
        
    } catch (error) {
        console.error('Error loading components:', error);
        // Fallback: if components can't be loaded, the existing HTML will remain
        return false;
    }
}

// Hide loading screen and show page content
function showPage() {
    const loadingScreen = document.getElementById('loadingScreen');
    const body = document.body;
    
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        // Remove loading screen from DOM after transition completes
        setTimeout(() => {
            loadingScreen.remove();
        }, 300);
    }
    
    // Show the main content
    body.classList.add('loaded');
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Mobile Navigation Toggle and Component Loading
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load components and wait for completion
        const componentsLoaded = await loadComponents();
        
        // Add a small delay to ensure all rendering is complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Show the page
        showPage();
        
        // If components failed to load, initialize fallback navigation
        if (!componentsLoaded) {
            setTimeout(() => {
                initializeMobileMenu();
                setActiveNavigation();
            }, 100);
        }
    } catch (error) {
        console.error('Error during page initialization:', error);
        // Still show the page even if there were errors
        showPage();
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const company = formData.get('company');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission (replace with actual form handling)
            showMessage('Thank you for your message! I will get back to you soon.', 'success');
            contactForm.reset();
        });
    }

    // Add loading animation to buttons on click
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't add loading to form buttons or links
            if (this.type === 'submit' || this.href) return;
            
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 1500);
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .project-card, .interest-card, .course-project').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add hover effects to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Dynamic typing effect for hero section (if on home page)
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle && heroTitle.textContent.includes('Welcome')) {
        typeWriter(heroTitle, 'Welcome to my Portfolio', 50);
    }

    // Add active state to navigation based on current page
    setActiveNavigation();
});

// Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(text, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const message = document.createElement('div');
    message.className = `form-message ${type}`;
    message.textContent = text;
    message.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 5px;
        text-align: center;
        font-weight: 600;
        ${type === 'success' ? 
            'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
            'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
        }
    `;

    // Insert message after form
    const form = document.getElementById('contactForm');
    if (form) {
        form.parentNode.insertBefore(message, form.nextSibling);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

function typeWriter(element, text, speed) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href') || link.getAttribute('data-page');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Skills animation for about page
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        const percentage = bar.dataset.skill;
        bar.style.width = percentage + '%';
    });
}

// Project filtering (if needed for expanded projects page)
function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(project => {
        if (category === 'all' || project.dataset.category === category) {
            project.style.display = 'block';
            project.style.opacity = '1';
        } else {
            project.style.display = 'none';
            project.style.opacity = '0';
        }
    });
}

// Add scroll-to-top functionality
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-top');
    if (scrollButton) {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    }
});

// Form validation enhancements
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

// Add error styling to CSS
const errorStyle = document.createElement('style');
errorStyle.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #e74c3c;
        background-color: #fdf2f2;
    }
    
    .scroll-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2980b9;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
    }
    
    .scroll-top:hover {
        background: #1f6391;
        transform: translateY(-2px);
    }
`;
document.head.appendChild(errorStyle);

// Add scroll-to-top button
const scrollTopButton = document.createElement('button');
scrollTopButton.className = 'scroll-top';
scrollTopButton.innerHTML = '↑';
scrollTopButton.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
document.body.appendChild(scrollTopButton);
