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


// ======================
// Google Reviews Carousel - Enhanced
// ======================
// Google Reviews Carousel - Infinite with 3 cards
// Google Reviews Carousel - Fixed Responsive Version
class GoogleReviewsCarousel {
    constructor() {
        this.container = document.getElementById('reviews-container');
        this.dotsContainer = document.getElementById('carousel-dots');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        
        this.currentSlide = 0;
        this.isAnimating = false;
        this.autoRotateInterval = null;
        this.cardsPerSlide = 3;
        this.totalSlides = 0;
        
        this.init();
    }
    
    async init() {
        await this.loadReviews();
        this.setupEventListeners();
        this.startAutoRotate();
        this.updateCardsPerSlide(); // Initial calculation
    }
    
    async loadReviews() {
        try {
            const response = await fetch('data/reviews.json');
            const data = await response.json();
            this.setupCarousel(data.reviews);
        } catch (error) {
            console.error('Error loading reviews:', error);
            const fallbackReviews = this.getFallbackReviews();
            this.setupCarousel(fallbackReviews);
        }
    }
    
    getFallbackReviews() {
        return [
            {
                name: "Priya M.",
                rating: 5,
                date: "2024-12-15",
                review: "Dr. Pradeepa is extremely knowledgeable and caring. She accurately diagnosed my skin condition and the treatment worked wonders.",
                treatment: "Acne Treatment"
            },
            {
                name: "Ramesh K.",
                rating: 5,
                date: "2024-12-10",
                review: "The PRP therapy for my hair loss has shown remarkable results in just 3 sessions. The clinic is hygienic and staff is very supportive.",
                treatment: "Hair Treatment"
            },
            {
                name: "Anjali S.",
                rating: 5,
                date: "2024-12-05",
                review: "I had laser hair removal done and it was completely painless. Doctor explained everything clearly and made me feel comfortable throughout.",
                treatment: "Laser Treatment"
            },
            {
                name: "Suresh R.",
                rating: 5,
                date: "2024-11-28",
                review: "Excellent service and professional approach. My skin issues were resolved quickly with proper guidance and medication.",
                treatment: "Skin Treatment"
            },
            {
                name: "Deepa K.",
                rating: 5,
                date: "2024-11-20",
                review: "Very satisfied with the treatment. Dr. Pradeepa takes time to understand the problem and provides effective solutions.",
                treatment: "Cosmetic Treatment"
            },
            {
                name: "Karthik M.",
                rating: 5,
                date: "2024-11-15",
                review: "Professional and caring staff. The clinic maintains high standards of hygiene and the results have been excellent.",
                treatment: "Skin Treatment"
            }
        ];
    }
    
    setupCarousel(reviews) {
        this.container.innerHTML = '';
        this.dotsContainer.innerHTML = '';
        
        this.reviews = reviews;
        this.updateCardsPerSlide();
        
        // Create review cards
        this.reviews.forEach((review, index) => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.innerHTML = this.createReviewCardHTML(review);
            this.container.appendChild(reviewCard);
        });
        
        this.totalSlides = Math.ceil(this.reviews.length / this.cardsPerSlide);
        this.createDots();
        this.showSlide(0);
    }
    
    createReviewCardHTML(review) {
    return `
        <div class="review-card-inner">
            <div class="google-icon-container">
                <div class="google-icon"></div>
                <div class="star-rating">
                    ${this.generateStars(review.rating)}
                </div>
            </div>
            <div class="review-header">
                <div class="reviewer-info">
                    <h4>${review.name}</h4>
                    <div class="review-date">${review.date}</div> <!-- show raw text -->
                </div>
            </div>
            <p class="review-text">"${review.review}"</p>
        </div>
    `;
}

    
    createDots() {
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('span');
            dot.className = 'carousel-dot';
            dot.dataset.slide = i;
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateCardsPerSlide() {
        const width = window.innerWidth;
        if (width <= 768) {
            this.cardsPerSlide = 1;
        } else if (width <= 1024) {
            this.cardsPerSlide = 2;
        } else {
            this.cardsPerSlide = 3;
        }
    }
    
    showSlide(slideIndex) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Ensure slide index is within bounds
        if (slideIndex < 0) {
            slideIndex = this.totalSlides - 1;
        } else if (slideIndex >= this.totalSlides) {
            slideIndex = 0;
        }
        
        const translateX = -slideIndex * (100 / this.cardsPerSlide);
        this.container.style.transform = `translateX(${translateX}%)`;
        
        // Update active dot
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[slideIndex]) {
            dots[slideIndex].classList.add('active');
        }
        
        this.currentSlide = slideIndex;
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }
    
    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }
    
    prevSlide() {
        this.showSlide(this.currentSlide - 1);
    }
    
    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('carousel-dot')) {
                const slideIndex = parseInt(e.target.dataset.slide);
                this.showSlide(slideIndex);
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateCardsPerSlide();
            this.totalSlides = Math.ceil(this.reviews.length / this.cardsPerSlide);
            this.showSlide(0);
        });
        
        // Pause auto-rotate on hover
        this.container.addEventListener('mouseenter', () => {
            this.stopAutoRotate();
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.startAutoRotate();
        });
    }
    
    startAutoRotate() {
        this.stopAutoRotate();
        this.autoRotateInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    stopAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }
    
    generateStars(rating) {
        return '★★★★★'.slice(0, rating);
    }
    
    // formatDate(dateString) {
    //     const options = { year: 'numeric', month: 'short', day: 'numeric' };
    //     return new Date(dateString).toLocaleDateString('en-US', options);
    // }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new GoogleReviewsCarousel();
});