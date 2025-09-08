// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('show');
            }
        });
    });
    
    // Sticky Header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    // Auto slide testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            answer.classList.toggle('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would typically send the form data to a server
            // For demo purposes, we'll just show an alert
            alert('Thank you for your appointment request! We will contact you shortly to confirm.');
            this.reset();
        });
    }
    
    // Treatment and Gallery navigation
    const treatmentNavLinks = document.querySelectorAll('.treatment-nav li a');
    const galleryNavLinks = document.querySelectorAll('.gallery-nav li a');
    
    function setActiveNav(links, sectionId) {
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                links.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                const targetSection = document.querySelector(this.getAttribute('href'));
                if (targetSection) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const navHeight = document.querySelector('.treatment-nav, .gallery-nav').offsetHeight;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    if (treatmentNavLinks.length > 0) {
        setActiveNav(treatmentNavLinks);
    }
    
    if (galleryNavLinks.length > 0) {
        setActiveNav(galleryNavLinks);
    }
    
    // Highlight current section in treatment/gallery navigation
    if (treatmentNavLinks.length > 0 || galleryNavLinks.length > 0) {
        const sections = document.querySelectorAll('.treatment-section, .gallery-section');
        const nav = document.querySelector('.treatment-nav, .gallery-nav');
        const navHeight = nav ? nav.offsetHeight : 0;
        const headerHeight = document.querySelector('header').offsetHeight;
        
        window.addEventListener('scroll', function() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (window.pageYOffset >= (sectionTop - headerHeight - navHeight - 100)) {
                    current = section.getAttribute('id');
                }
            });
            
            const links = treatmentNavLinks.length > 0 ? treatmentNavLinks : galleryNavLinks;
            
            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
});