/**
 * IA INTERNATIONAL PERU - Scroll Animations
 * Animaciones y efectos al hacer scroll
 */

// ===================================
// AOS (Animate On Scroll) INITIALIZATION
// ===================================
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
    offset: 100,
    delay: 0,
    disable: 'mobile'
});

// ===================================
// CUSTOM SCROLL ANIMATIONS
// ===================================
class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        this.setupParallaxEffects();
        this.setupFadeInElements();
        this.setupSlideInElements();
        this.setupCounters();
        this.setupProgressBars();
        this.setupTypingEffect();
        this.setupRevealOnScroll();
    }

    // Parallax Effect
    setupParallaxElements() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;

            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const yPos = -(scrolled * speed);

                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Fade In Elements
    setupFadeInElements() {
        const fadeElements = document.querySelectorAll('[data-fade]');

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.fadeDelay || 0;
                    const duration = entry.target.dataset.fadeDuration || 600;

                    setTimeout(() => {
                        entry.target.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);

                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            fadeObserver.observe(element);
        });
    }

    // Slide In Elements
    setupSlideInElements() {
        const slideElements = document.querySelectorAll('[data-slide]');

        const slideObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const direction = entry.target.dataset.slide || 'left';
                    const delay = entry.target.dataset.slideDelay || 0;
                    const duration = entry.target.dataset.slideDuration || 800;

                    setTimeout(() => {
                        entry.target.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, delay);

                    slideObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        slideElements.forEach(element => {
            const direction = element.dataset.slide || 'left';
            element.style.opacity = '0';

            if (direction === 'left') {
                element.style.transform = 'translateX(-50px)';
            } else if (direction === 'right') {
                element.style.transform = 'translateX(50px)';
            }

            slideObserver.observe(element);
        });
    }

    // Animated Counters
    setupCounters() {
        const counters = document.querySelectorAll('[data-counter]');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.textContent);
                    const duration = parseInt(entry.target.dataset.counterDuration) || 2000;
                    const suffix = entry.target.dataset.counterSuffix || '';
                    const prefix = entry.target.dataset.counterPrefix || '';

                    this.animateCounter(entry.target, 0, target, duration, prefix, suffix);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element, start, end, duration, prefix = '', suffix = '') {
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = prefix + current + suffix;

            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    // Progress Bars Animation
    setupProgressBars() {
        const progressBars = document.querySelectorAll('[data-progress]');

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.dataset.progress;
                    const bar = entry.target.querySelector('.progress-bar-custom') || entry.target;

                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 200);

                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => {
            const progressBar = bar.querySelector('.progress-bar-custom') || bar;
            progressBar.style.width = '0%';
            progressBar.style.transition = 'width 1.5s ease';
            progressObserver.observe(bar);
        });
    }

    // Typing Effect
    setupTypingEffect() {
        const typingElements = document.querySelectorAll('[data-typing]');

        typingElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.typingSpeed) || 100;
            element.textContent = '';
            element.style.display = 'inline-block';

            const typeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.typeWriter(entry.target, text, speed);
                        typeObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            typeObserver.observe(element);
        });
    }

    typeWriter(element, text, speed) {
        let i = 0;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        type();
    }

    // Reveal on Scroll
    setupRevealOnScroll() {
        const revealElements = document.querySelectorAll('[data-reveal]');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.revealDelay || 0;
                    const duration = entry.target.dataset.revealDuration || 600;

                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);

                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(element => {
            element.classList.add('reveal-element');
            revealObserver.observe(element);
        });
    }

    // Parallax Background
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax-bg]');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(element => {
                const speed = element.dataset.parallaxBg || 0.5;
                const yPos = -(scrolled * speed);

                element.style.backgroundPosition = `center ${yPos}px`;
            });
        });
    }

    // Stagger Animation for Lists
    setupStaggerAnimation() {
        const staggerLists = document.querySelectorAll('[data-stagger]');

        staggerLists.forEach(list => {
            const items = list.children;
            const delay = parseInt(list.dataset.staggerDelay) || 100;

            const listObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        Array.from(items).forEach((item, index) => {
                            setTimeout(() => {
                                item.style.animation = `fadeInUp 0.6s ease forwards`;
                                item.style.opacity = '0';
                                item.style.animationDelay = `${index * delay}ms`;
                            }, index * delay);
                        });

                        listObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            listObserver.observe(list);
        });
    }

    // Zoom In Animation
    setupZoomInElements() {
        const zoomElements = document.querySelectorAll('[data-zoom]');

        const zoomObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.zoomDelay || 0;
                    const duration = entry.target.dataset.zoomDuration || 800;

                    setTimeout(() => {
                        entry.target.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1)';
                    }, delay);

                    zoomObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        zoomElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'scale(0.8)';
            zoomObserver.observe(element);
        });
    }

    // Rotate on Scroll
    setupRotateOnScroll() {
        const rotateElements = document.querySelectorAll('[data-rotate]');

        window.addEventListener('scroll', () => {
            rotateElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const speed = element.dataset.rotate || 1;

                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const rotation = (window.pageYOffset - rect.top) * speed;
                    element.style.transform = `rotate(${rotation}deg)`;
                }
            });
        });
    }

    // Blur to Focus Effect
    setupBlurToFocus() {
        const blurElements = document.querySelectorAll('[data-blur]');

        const blurObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const duration = entry.target.dataset.blurDuration || 1000;

                    entry.target.style.transition = `filter ${duration}ms ease`;
                    entry.target.style.filter = 'blur(0px)';

                    blurObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        blurElements.forEach(element => {
            element.style.filter = 'blur(5px)';
            blurObserver.observe(element);
        });
    }
}

// ===================================
// INITIALIZE SCROLL ANIMATIONS
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    new ScrollAnimations();
});

// ===================================
// ADDITIONAL SCROLL EFFECTS
// ===================================

// Magnetic Cursor Effect
class MagneticCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'magnetic-cursor';
        this.init();
    }

    init() {
        document.body.appendChild(this.cursor);

        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--primary-electric-blue);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s, transform 0.1s;
            mix-blend-mode: difference;
        `;

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            this.cursor.style.opacity = '1';
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;

            this.cursor.style.left = cursorX + 'px';
            this.cursor.style.top = cursorY + 'px';

            requestAnimationFrame(animateCursor.bind(this));
        }

        animateCursor.call(this);

        // Hide cursor when mouse leaves window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });
    }
}

// Initialize magnetic cursor on desktop
if (window.innerWidth > 768) {
    new MagneticCursor();
}

// Scroll Velocity Tracker
class ScrollVelocityTracker {
    constructor() {
        this.velocity = 0;
        this.lastScrollY = 0;
        this.ticking = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', this.update.bind(this), { passive: true });
    }

    update() {
        this.velocity = window.pageYOffset - this.lastScrollY;
        this.lastScrollY = window.pageYOffset;

        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.applyEffects();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    applyEffects() {
        // Add velocity-based effects here
        const intensity = Math.abs(this.velocity) / 10;
        document.documentElement.style.setProperty('--scroll-intensity', intensity);
    }
}

new ScrollVelocityTracker();

// Smooth Scroll with Velocity
class SmoothScroll {
    constructor() {
        this.target = 0;
        this.current = 0;
        this.ease = 0.1;
        this.init();
    }

    init() {
        this.current = window.pageYOffset;
        this.target = this.current;

        window.addEventListener('scroll', () => {
            this.target = window.pageYOffset;
        }, { passive: true });

        this.animate();
    }

    animate() {
        this.current += (this.target - this.current) * this.ease;

        if (Math.abs(this.target - this.current) > 0.1) {
            document.documentElement.style.transform = `translateY(${this.current - this.target}px)`;
            requestAnimationFrame(() => this.animate());
        } else {
            document.documentElement.style.transform = '';
        }
    }
}

// Initialize smooth scroll on desktop
if (window.innerWidth > 768 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new SmoothScroll();
}

console.log('🎨 Scroll animations initialized successfully!');