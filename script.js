// Elegant cursor animation
function initCursor() {
    const ring = document.createElement('div');
    const dot = document.createElement('div');
    ring.className = 'cursor-ring';
    dot.className = 'cursor-dot';
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    let ringX = 0, ringY = 0;
    let dotX = 0, dotY = 0;
    let mouseX = 0, mouseY = 0;

    // Smooth cursor movement
    function animate() {
        // Smooth movement for ring
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        // Faster movement for dot
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
        dot.style.left = dotX + 'px';
        dot.style.top = dotY + 'px';

        requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Click animation
    document.addEventListener('mousedown', () => {
        ring.classList.add('clicking');
        setTimeout(() => ring.classList.remove('clicking'), 500);
    });

    // Hover effects
    const hoverTargets = document.querySelectorAll('a, button, input, .hover-effect');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            ring.classList.add('hover');
            dot.classList.add('hover');
        });
        target.addEventListener('mouseleave', () => {
            ring.classList.remove('hover');
            dot.classList.remove('hover');
        });
    });

    // Hide/show cursor
    document.addEventListener('mouseleave', () => {
        ring.style.opacity = '0';
        dot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        ring.style.opacity = '1';
        dot.style.opacity = '1';
    });

    // Start animation
    animate();

    // Hide default cursor
    document.body.style.cursor = 'none';
}

// Back to Top Button functionality
const backToTop = document.getElementById('back-to-top');

function handleScroll() {
    if (window.scrollY > 200) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

function scrollToTop(e) {
    e.preventDefault();
    
    // Add click animation class
    backToTop.classList.add('clicked');
    setTimeout(() => backToTop.classList.remove('clicked'), 800);

    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    const rect = backToTop.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    backToTop.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => ripple.remove(), 800);

    // Smooth scroll with easing
    const startPosition = window.scrollY;
    const startTime = performance.now();
    const duration = 800;

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function scrollAnimation(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const eased = easeOutCubic(progress);
        window.scrollTo(0, startPosition * (1 - eased));

        if (progress < 1) {
            requestAnimationFrame(scrollAnimation);
        }
    }

    requestAnimationFrame(scrollAnimation);
}

window.addEventListener('scroll', handleScroll);
backToTop.addEventListener('click', scrollToTop);

// Disable hover effects on touch devices
if ('ontouchstart' in window) {
    backToTop.style.transform = 'none';
    backToTop.style.transition = 'opacity 0.3s';
}

// Title mouse follow effect
function initTitleEffect() {
    const title = document.querySelector('.testimonial-section h2');
    if (!title) return;

    // Add data-text attribute for the glow effect
    title.setAttribute('data-text', title.textContent);

    let bounds = title.getBoundingClientRect();
    const maxRotate = 15; // Maximum rotation in degrees
    const maxMove = 10; // Maximum movement in pixels

    function updateBounds() {
        bounds = title.getBoundingClientRect();
    }

    function handleMouseMove(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate distances from mouse to center of title
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;
        
        // Calculate distance ratios (-1 to 1)
        const ratioX = (mouseX - centerX) / (window.innerWidth / 2);
        const ratioY = (mouseY - centerY) / (window.innerHeight / 2);

        // Calculate movement and rotation
        const moveX = ratioX * maxMove;
        const moveY = ratioY * maxMove;
        const rotateX = -ratioY * maxRotate;
        const rotateY = ratioX * maxRotate;

        // Apply transforms
        title.style.transform = `
            translateX(calc(-50% + ${moveX}px))
            translateY(${moveY}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
        `;

        // Update glow effect
        title.style.setProperty('--glow-x', `${ratioX * 50 + 50}%`);
        title.style.setProperty('--glow-y', `${ratioY * 50 + 50}%`);
    }

    function handleMouseLeave() {
        // Reset position smoothly
        title.style.transform = 'translateX(-50%)';
    }

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('scroll', updateBounds);
    window.addEventListener('resize', updateBounds);
    title.addEventListener('mouseleave', handleMouseLeave);

    // Update bounds on load
    updateBounds();
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;

    // Add click event listener to each navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate scroll position accounting for fixed header
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Smooth scroll to target section
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active link
                navLinks.forEach(link => link.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Update active section on scroll
    const sections = document.querySelectorAll('section');
    
    function updateActiveSection() {
        const scrollPosition = window.scrollY + headerHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = '#' + section.id;
            const correspondingLink = document.querySelector(`.nav-links a[href="${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom && correspondingLink) {
                navLinks.forEach(link => link.classList.remove('active'));
                correspondingLink.classList.add('active');
            }
        });
    }

    // Add scroll event listener
    window.addEventListener('scroll', () => {
        updateActiveSection();
    });

    // Initial update of active section
    updateActiveSection();
});

// Add intersection observer for section animations
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
        }
    });
}, {
    threshold: 0.1
});

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    section.classList.add('section-hidden');
    sectionObserver.observe(section);
});

// Form submission handling
function initFormSubmission() {
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;

        if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
            alert('Please fill in all fields');
            return;
        }

        // In a real-world scenario, you would send this data to a backend
        alert('Thank you for your inquiry! We will get back to you soon.');
        
        // Reset form
        this.reset();
    });
}

// Simple scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in animation to sections
    document.querySelectorAll('.services, .about, .portfolio, .contact').forEach(section => {
        fadeInObserver.observe(section);
    });
}

// Mobile menu and navigation scroll functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = mobileMenuBtn.querySelector('i');
    const links = document.querySelectorAll('.nav-links a');

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuIcon.classList.toggle('fa-bars');
        menuIcon.classList.toggle('fa-times');
    });

    // Handle link clicks
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            // Remove active class from all links
            links.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');

            // Smooth scroll to section
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }

            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });
}

// Navigation scroll effect
function initNavScrollEffect() {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        // Add/remove scrolled class to nav
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Update active link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        updateParticlesTheme('light');
    }

    // Theme toggle function
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        // Update icon
        themeIcon.classList.replace(
            isLight ? 'fa-moon' : 'fa-sun',
            isLight ? 'fa-sun' : 'fa-moon'
        );
        
        // Save preference
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // Update particles
        updateParticlesTheme(isLight ? 'light' : 'dark');
    });

    // Function to update particles based on theme
    function updateParticlesTheme(theme) {
        const particlesConfig = {
            light: {
                particles: {
                    color: {
                        value: ['#3b82f6', '#8b5cf6', '#60a5fa', '#818cf8']
                    },
                    line_linked: {
                        color: '#3b82f6',
                        opacity: 0.4
                    }
                }
            },
            dark: {
                particles: {
                    color: {
                        value: ['#3b82f6', '#8b5cf6', '#60a5fa', '#818cf8']
                    },
                    line_linked: {
                        color: '#3b82f6',
                        opacity: 0.2
                    }
                }
            }
        };

        // Update particles configuration
        if (window.pJSDom && window.pJSDom[0]) {
            const particlesJS = window.pJSDom[0].pJS;
            const config = particlesConfig[theme];
            
            particlesJS.particles.color.value = config.particles.color.value;
            particlesJS.particles.line_linked.color = config.particles.line_linked.color;
            particlesJS.particles.line_linked.opacity = config.particles.line_linked.opacity;
            
            // Refresh particles
            particlesJS.fn.particlesRefresh();
        }
    }
}

// Testimonial Carousel
const testimonialTrack = document.querySelector('.testimonial-track');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const prevButton = document.querySelector('.carousel-arrow.prev');
const nextButton = document.querySelector('.carousel-arrow.next');

let currentSlide = 0;
const slideCount = testimonialSlides.length;

function updateSlideClasses() {
    testimonialSlides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev');
        if (index === currentSlide) {
            slide.classList.add('active');
        } else if (index === (currentSlide - 1 + slideCount) % slideCount) {
            slide.classList.add('prev');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    updateSlideClasses();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    updateSlideClasses();
}

// Initialize first slide
updateSlideClasses();

// Event listeners
if (prevButton && nextButton) {
    prevButton.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        prevSlide();
        autoSlideInterval = setInterval(nextSlide, 5000);
    });
    
    nextButton.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        nextSlide();
        autoSlideInterval = setInterval(nextSlide, 5000);
    });
}

// Auto advance slides
let autoSlideInterval = setInterval(nextSlide, 5000);

// Pause auto-advance on hover
if (testimonialTrack) {
    testimonialTrack.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    testimonialTrack.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    });
}

// Initialize Particles
particlesJS('particles-js', {
    particles: {
        number: {
            value: 100,  
            density: {
                enable: true,
                value_area: 1000
            }
        },
        color: {
            value: ['#3b82f6', '#8b5cf6', '#60a5fa', '#818cf8']  
        },
        shape: {
            type: ['circle', 'triangle', 'polygon'],  
            polygon: {
                nb_sides: 6
            }
        },
        opacity: {
            value: 0.3,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 4,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.3,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#3b82f6',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 3,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'bounce',
            bounce: true,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: ['grab', 'bubble']
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 200,
                line_linked: {
                    opacity: 0.4
                }
            },
            bubble: {
                distance: 200,
                size: 6,
                duration: 2,
                opacity: 0.8,
                speed: 3
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// Initialize all
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initBackToTop();
    initTitleEffect();
    initFormSubmission();
    initScrollAnimations();
    initMobileMenu();
    initNavScrollEffect();
    initThemeToggle();
});
