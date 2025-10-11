// ========================
//  SCRIPT.JS - Clinic Site (with Auto Reply Integration)
// ========================

document.addEventListener('DOMContentLoaded', function() {

    // ======================
    // Mobile Menu Toggle
    // ======================
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('show');
            }
        });
    });
    
    // ======================
    // Sticky Header
    // ======================
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    });
    
    // ======================
    // Testimonial Slider
    // ======================
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    if (testimonials.length > 0) {
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }
    
    // ======================
    // FAQ Accordion
    // ======================
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            answer.classList.toggle('active');
        });
    });
    
    // ======================
    // Smooth Scrolling
    // ======================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
    
    // ======================
    // Appointment Form Submission (Google Apps Script + Auto Reply)
    // ======================
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        const scriptURL = "https://script.google.com/macros/s/AKfycbzf9ScD7md3RCVQ-K_RELfxOGtlp4UVu9PC6H9NxaAXr7PTYGHUznYVxIfJeuyvkGVdYQ/exec";

        appointmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = appointmentForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            // Collect data
            const data = {
                name: appointmentForm.querySelector('input[placeholder="Your Name"]').value,
                phone: appointmentForm.querySelector('input[placeholder="Phone Number"]').value,
                email: appointmentForm.querySelector('input[placeholder="Email Address"]').value,
                treatment: appointmentForm.querySelector('select') ? appointmentForm.querySelector('select').value : '',
                message: appointmentForm.querySelector('textarea').value
            };

            try {
                const response = await fetch(scriptURL, {
                    method: "POST",
                    mode: "no-cors", // avoids CORS blocking in local dev
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                // The response is opaque (no-cors), so assume success if no error thrown
                alert("✅ Thank you! Your appointment request has been submitted successfully.\nYou'll receive a confirmation email shortly.");
                appointmentForm.reset();

            } catch (error) {
                console.error("Submission error:", error);
                alert("⚠️ Network error. Please check your connection and try again.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
    
    // ======================
    // Treatment / Gallery Navigation
    // ======================
    const treatmentNavLinks = document.querySelectorAll('.treatment-nav li a');
    const galleryNavLinks = document.querySelectorAll('.gallery-nav li a');
    
    function setActiveNav(links) {
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                links.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                const targetSection = document.querySelector(this.getAttribute('href'));
                if (targetSection) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const nav = document.querySelector('.treatment-nav, .gallery-nav');
                    const navHeight = nav ? nav.offsetHeight : 0;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - navHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });
        });
    }
    
    if (treatmentNavLinks.length > 0) setActiveNav(treatmentNavLinks);
    if (galleryNavLinks.length > 0) setActiveNav(galleryNavLinks);
    
    // Highlight current section
    if (treatmentNavLinks.length > 0 || galleryNavLinks.length > 0) {
        const sections = document.querySelectorAll('.treatment-section, .gallery-section');
        const nav = document.querySelector('.treatment-nav, .gallery-nav');
        const navHeight = nav ? nav.offsetHeight : 0;
        const headerHeight = document.querySelector('header').offsetHeight;
        
        window.addEventListener('scroll', function() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
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
