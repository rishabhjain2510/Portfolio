document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const exploreBtn = document.querySelector('.explore-btn');

    // Responsive Custom Cursor - Only on desktop/laptop devices
    const cursor = document.querySelector('.custom-cursor');
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Check if device has fine pointer control (desktop/laptop)
    const hasFinePtrControl = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    
    if (cursor && hasFinePtrControl) {
        // Update mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // More accurate cursor movement with less smoothing
        function updateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            // Increased responsiveness - less smoothing for more accurate following
            const smoothness = 0.25; // Increased from 0.1-0.15 for better accuracy
            
            cursorX += dx * smoothness;
            cursorY += dy * smoothness;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(updateCursor);
        }

        updateCursor();

        // Hover effects with responsive class names
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        // Click effect with responsive scaling
        document.addEventListener('mousedown', () => {
            cursor.classList.add('click');
        });

        document.addEventListener('mouseup', () => {
            cursor.classList.remove('click');
        });

        // Hover effects only for interactive elements (excluding text)
        const interactiveElements = document.querySelectorAll('a, button, .nav-link, .explore-btn, .company-badge, .stat-item, input, textarea');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });

        // Handle window resize for responsive updates
        window.addEventListener('resize', () => {
            // Re-check if device still has fine pointer control after resize
            const currentHasFinePtrControl = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
            if (!currentHasFinePtrControl) {
                cursor.style.display = 'none';
            } else {
                cursor.style.display = 'block';
            }
        });
    }

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Explore More button functionality
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            window.location.href = '/about';
        });
    }

    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

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

    // Simple scroll effects for overlay opacity
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const opacity = Math.max(0.3, 0.8 - scrolled * 0.001);
        
        // Update overlay opacity based on scroll
        const overlay = document.querySelector('.content-overlay');
        if (overlay) {
            overlay.style.opacity = opacity;
        }
        
        // Hide scroll indicator when scrolled
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = Math.max(0, 1 - scrolled / 100);
        }
    }
    
    // Throttled scroll event
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    // Add scroll effect to navbar and background
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.pageYOffset;
        
        // Navbar background effect
        if (scrolled > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
        }
        
        // Request background update
        requestTick();
    });

    // Add mouse move parallax effect for aurora
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const moveX = (mouseX - 0.5) * 20;
        const moveY = (mouseY - 0.5) * 20;
        
        // Apply subtle parallax to aurora background
        const auroraElement = document.body;
        auroraElement.style.setProperty('--aurora-x', `${moveX}px`);
        auroraElement.style.setProperty('--aurora-y', `${moveY}px`);
    });

    // Particles Animation
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
        function createParticle() {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random position and properties
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            particlesContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 5000);
        }

        // Create particles periodically
        setInterval(createParticle, 200);
    }
});
