        // Wait for DOM to be fully loaded before accessing elements
        document.addEventListener('DOMContentLoaded', function() {

            // ===== MOBILE NAVIGATION =====
            const menuBtn = document.getElementById('menu-btn');
            const navLinks = document.getElementById('nav-links');

            if (menuBtn && navLinks) {
                menuBtn.addEventListener('click', () => {
                    navLinks.classList.toggle('active');
                });

                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.addEventListener('click', () => {
                        navLinks.classList.remove('active');
                    });
                });
            }

            // ===== SMOOTH SCROLLING =====
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });

            // ===== FORM SUBMIT HANDLER =====
            const form = document.querySelector('form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    alert('Thank you! Your message has been sent successfully.');
                    form.reset();
                });
            }

            // ===== NAVBAR SCROLL EFFECT =====
            const nav = document.querySelector('nav');
            if (nav) {
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 80) {
                        nav.classList.add('scrolled');
                    } else {
                        nav.classList.remove('scrolled');
                    }
                }, { passive: true });
            }

            // ===== SERVICES CAROUSEL =====
            (function() {
                const viewport = document.querySelector('.services-viewport');
                const track = document.querySelector('.services-track');
                const cards = document.querySelectorAll('.service-card');
                const prevBtn = document.querySelector('.service-prev');
                const nextBtn = document.querySelector('.service-next');
                const dotsContainer = document.querySelector('.service-dots');
                const carouselEl = document.querySelector('.services-carousel');

                if (!viewport || !track || cards.length === 0) return;

                let currentIndex = 0;
                const totalSlides = cards.length;
                let autoPlayTimer = null;
                let isTransitioning = false;
                let touchStartX = 0;
                let touchEndX = 0;

                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                // Create dot indicators
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('button');
                    dot.className = 'service-dot' + (i === 0 ? ' active' : '');
                    dot.setAttribute('aria-label', 'Go to service ' + (i + 1));
                    dot.addEventListener('click', () => goToSlide(i));
                    dotsContainer.appendChild(dot);
                }

                const dots = document.querySelectorAll('.service-dot');

                function updateDots() {
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === currentIndex);
                    });
                }

                function goToSlide(index, userInitiated = true) {
                    if (isTransitioning) return;
                    if (index < 0) index = totalSlides - 1;
                    if (index >= totalSlides) index = 0;
                    
                    isTransitioning = true;
                    currentIndex = index;
                    
                    const offset = -currentIndex * 100;
                    track.style.transform = 'translateX(' + offset + '%)';
                    updateDots();
                    
                    setTimeout(() => { isTransitioning = false; }, 550);
                    if (userInitiated) resetAutoPlay();
                }

                function nextSlide() { goToSlide(currentIndex + 1); }
                function prevSlide() { goToSlide(currentIndex - 1); }

                function startAutoPlay() {
                    stopAutoPlay();
                    if (prefersReducedMotion) return;
                    autoPlayTimer = setInterval(nextSlide, 4000);
                }

                function stopAutoPlay() {
                    if (autoPlayTimer) {
                        clearInterval(autoPlayTimer);
                        autoPlayTimer = null;
                    }
                }

                function resetAutoPlay() { startAutoPlay(); }

                if (prevBtn) prevBtn.addEventListener('click', prevSlide);
                if (nextBtn) nextBtn.addEventListener('click', nextSlide);

                if (carouselEl) {
                    carouselEl.addEventListener('mouseenter', stopAutoPlay);
                    carouselEl.addEventListener('mouseleave', startAutoPlay);
                    
                    carouselEl.addEventListener('touchstart', function(e) {
                        touchStartX = e.changedTouches[0].screenX;
                        stopAutoPlay();
                    }, { passive: true });
                    
                    carouselEl.addEventListener('touchend', function(e) {
                        touchEndX = e.changedTouches[0].screenX;
                        const diff = touchStartX - touchEndX;
                        if (Math.abs(diff) > 50) {
                            if (diff > 0) nextSlide();
                            else prevSlide();
                        }
                        setTimeout(startAutoPlay, 3000);
                    }, { passive: true });
                }

                startAutoPlay();
            })();

            // ===== PROJECT IMAGE SLIDESHOW =====
            (function() {
                const slideshows = document.querySelectorAll('.slideshow');
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                slideshows.forEach(function(slideshow) {
                    const slides = slideshow.querySelectorAll('.slide');
                    const counter = slideshow.parentElement.querySelector('.slide-counter .current');
                    if (slides.length < 2) return;

                    let current = 0;
                    let interval = null;

                    function showSlide(index) {
                        slides.forEach(s => s.classList.remove('active'));
                        slides[index].classList.add('active');
                        current = index;
                        if (counter) counter.textContent = index + 1;
                    }

                    function nextSlide() {
                        const next = (current + 1) % slides.length;
                        showSlide(next);
                    }

                    function startSlideshow() {
                        stopSlideshow();
                        if (prefersReducedMotion) return;
                        interval = setInterval(nextSlide, 3000);
                    }

                    function stopSlideshow() {
                        if (interval) {
                            clearInterval(interval);
                            interval = null;
                        }
                    }

                    // Pause on hover
                    const container = slideshow.closest('.project-icon');
                    if (container) {
                        container.addEventListener('mouseenter', stopSlideshow);
                        container.addEventListener('mouseleave', startSlideshow);
                    }

                    startSlideshow();
                });
            })();

            // ===== SCROLL REVEAL OBSERVER =====
            function createScrollReveal(selector, options = {}) {
                const elements = document.querySelectorAll(selector);
                if (elements.length === 0) return;

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('revealed');
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || '0px' });

                elements.forEach(el => observer.observe(el));
            }

            // Reveal section titles on scroll
            createScrollReveal('.section-title');
            createScrollReveal('.section-header');

            // Reveal about section panels
            createScrollReveal('.about-image-wrapper');
            createScrollReveal('.about-content');

            // Reveal contact section
            createScrollReveal('.contact-image');
            createScrollReveal('.contact-form-card');

            // Reveal footer
            createScrollReveal('.footer-content');

            // ===== STAGGERED REVEAL FOR TECH ICONS & SKILLS =====
            const revealItems = () => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('reveal-active');
                        }
                    });
                }, { threshold: 0.1 });

                document.querySelectorAll('.tech-icon-item, .skills-box, .timeline-item').forEach(item => {
                    item.classList.add('reveal-item');
                    observer.observe(item);
                });
            };
            revealItems();

            // ===== PROJECTS CAROUSEL =====
            (function() {
                const viewport = document.querySelector('.projects-viewport');
                const track = document.querySelector('.projects-track');
                const cards = document.querySelectorAll('.project-card');
                const prevBtn = document.querySelector('.project-prev');
                const nextBtn = document.querySelector('.project-next');
                const dotsContainer = document.querySelector('.project-dots');
                const carouselEl = document.querySelector('.projects-carousel');

                if (!viewport || !track || cards.length === 0) return;

                let currentIndex = 0;
                const totalSlides = cards.length;
                let autoPlayTimer = null;
                let isTransitioning = false;
                let touchStartX = 0;
                let touchEndX = 0;

                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                // Create dot indicators
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('button');
                    dot.className = 'project-dot' + (i === 0 ? ' active' : '');
                    dot.setAttribute('aria-label', 'Go to project ' + (i + 1));
                    dot.addEventListener('click', () => goToSlide(i));
                    dotsContainer.appendChild(dot);
                }

                const dots = document.querySelectorAll('.project-dot');

                function updateDots() {
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === currentIndex);
                    });
                }

                function updateActiveCard() {
                    cards.forEach((card, i) => {
                        card.classList.toggle('active', i === currentIndex);
                    });
                }

                function goToSlide(index, userInitiated = true) {
                    if (isTransitioning) return;
                    if (index < 0) index = totalSlides - 1;
                    if (index >= totalSlides) index = 0;
                    
                    isTransitioning = true;
                    currentIndex = index;
                    
                    const offset = -currentIndex * 100;
                    track.style.transform = 'translateX(' + offset + '%)';
                    updateDots();
                    updateActiveCard();
                    
                    setTimeout(() => { isTransitioning = false; }, 550);
                    if (userInitiated) resetAutoPlay();
                }

                function nextSlide() { goToSlide(currentIndex + 1); }
                function prevSlide() { goToSlide(currentIndex - 1); }

                function startAutoPlay() {
                    stopAutoPlay();
                    if (prefersReducedMotion) return;
                    autoPlayTimer = setInterval(nextSlide, 4000);
                }

                function stopAutoPlay() {
                    if (autoPlayTimer) {
                        clearInterval(autoPlayTimer);
                        autoPlayTimer = null;
                    }
                }

                function resetAutoPlay() { startAutoPlay(); }

                updateActiveCard();

                if (prevBtn) prevBtn.addEventListener('click', prevSlide);
                if (nextBtn) nextBtn.addEventListener('click', nextSlide);

                if (carouselEl) {
                    carouselEl.addEventListener('mouseenter', stopAutoPlay);
                    carouselEl.addEventListener('mouseleave', startAutoPlay);
                    
                    carouselEl.addEventListener('touchstart', function(e) {
                        touchStartX = e.changedTouches[0].screenX;
                        stopAutoPlay();
                    }, { passive: true });
                    
                    carouselEl.addEventListener('touchend', function(e) {
                        touchEndX = e.changedTouches[0].screenX;
                        handleSwipe();
                        setTimeout(startAutoPlay, 3000);
                    }, { passive: true });
                }

                function handleSwipe() {
                    const swipeThreshold = 50;
                    const diff = touchStartX - touchEndX;
                    if (Math.abs(diff) > swipeThreshold) {
                        if (diff > 0) nextSlide();
                        else prevSlide();
                    }
                }

                document.addEventListener('keydown', function(e) {
                    const activeEl = document.activeElement;
                    const insideCarousel = carouselEl && (carouselEl.contains(activeEl) || carouselEl.contains(e.target));
                    if (!insideCarousel) return;
                    if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
                    if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
                });

                startAutoPlay();
            })();

        });
    