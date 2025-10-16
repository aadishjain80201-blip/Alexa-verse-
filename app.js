// Global Variables
let registrationData = [];
let isMenuOpen = false;

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const registrationForm = document.getElementById('registrationForm');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModal');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeFormValidation();
    initializeAnimations();
    initializeModalHandlers();
});

// Navigation Functions
function initializeNavigation() {
    // Hamburger menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navbar.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Animate hamburger bars
    const spans = hamburger.querySelectorAll('span');
    if (isMenuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

function handleNavLinkClick(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 15, 35, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(15, 15, 35, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.highlight-card, .timeline-item, .hero-card, .speaker-card'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Form Validation
function initializeFormValidation() {
    if (!registrationForm) return;
    
    const formFields = {
        fullName: document.getElementById('fullName'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        institution: document.getElementById('institution'),
        yearOfStudy: document.getElementById('yearOfStudy')
    };
    
    // Add real-time validation
    Object.keys(formFields).forEach(fieldName => {
        const field = formFields[fieldName];
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName, field));
            field.addEventListener('input', () => clearFieldError(fieldName));
        }
    });
    
    // Handle form submission
    registrationForm.addEventListener('submit', handleFormSubmission);
}

function validateField(fieldName, field) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${fieldName}Error`);
    const formGroup = field.closest('.form-group');
    
    let errorMessage = '';
    
    // Validation rules
    switch (fieldName) {
        case 'fullName':
            if (!value) {
                errorMessage = 'Full name is required';
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = 'Email address is required';
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!value) {
                errorMessage = 'Phone number is required';
            } else if (!phoneRegex.test(value)) {
                errorMessage = 'Please enter a valid phone number';
            }
            break;
            
        case 'institution':
            if (!value) {
                errorMessage = 'Institution/University is required';
            }
            break;
            
        case 'yearOfStudy':
            if (!value) {
                errorMessage = 'Year of study is required';
            }
            break;
    }
    
    // Display error or clear it
    if (errorMessage) {
        errorElement.textContent = errorMessage;
        formGroup.classList.add('error');
        return false;
    } else {
        errorElement.textContent = '';
        formGroup.classList.remove('error');
        return true;
    }
}

function clearFieldError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    
    if (field.value.trim()) {
        errorElement.textContent = '';
        formGroup.classList.remove('error');
    }
}

function validateForm() {
    const fields = ['fullName', 'email', 'phone', 'institution', 'yearOfStudy'];
    let isValid = true;
    
    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field && !validateField(fieldName, field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        // Find first error and scroll to it
        const firstError = document.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
        return;
    }
    
    // Collect form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        institution: document.getElementById('institution').value,
        yearOfStudy: document.getElementById('yearOfStudy').value,
        registrationDate: new Date().toISOString()
    };
    
    // Store registration data (in real app, this would go to a server)
    registrationData.push(formData);
    
    // Show success modal
    showSuccessModal();
    
    // Reset form
    registrationForm.reset();
    
    // Clear any remaining errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));
}

// Modal Functions
function initializeModalHandlers() {
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideSuccessModal);
    }
    
    // Close modal when clicking outside
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                hideSuccessModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal.classList.contains('active')) {
            hideSuccessModal();
        }
    });
}

function showSuccessModal() {
    if (successModal) {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus the close button for accessibility
        setTimeout(() => {
            if (closeModalBtn) {
                closeModalBtn.focus();
            }
        }, 100);
    }
}

function hideSuccessModal() {
    if (successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Animation Functions
function initializeAnimations() {
    // Add entrance animations to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.highlight-card, .hero-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimized scroll handler
const optimizedScrollHandler = throttle(() => {
    handleNavbarScroll();
    updateActiveNavLink();
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Handle window resize
window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 768 && isMenuOpen) {
        toggleMobileMenu();
    }
}, 250));

// Export functions for potential external use
window.AlexaVerseApp = {
    registrationData,
    showSuccessModal,
    hideSuccessModal,
    validateForm
};