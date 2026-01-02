/**
 * IA INTERNATIONAL PERU - Main JavaScript
 * Funcionalidades principales del sitio web
 */

// Función para inicializar todo después de que los componentes se carguen
function initializeAfterComponents() {
    // ===================================
    // PRELOADER
    // ===================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }

    // ===================================
    // HEADER SCROLL EFFECT
    // ===================================
    const header = document.getElementById('header');
    let lastScrollTop = 0;

    if (header) {
        window.addEventListener('scroll', function () {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header on scroll
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollTop = scrollTop;
        });
    }


    // ===================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    // ===================================
    // PARTICLE SYSTEM FOR HERO
    // ===================================
    function createParticles() {
        const particlesContainer = document.getElementById('particles-js');
        if (!particlesContainer) return;

        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random properties
            const size = Math.random() * 4 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const animationDelay = Math.random() * 6;
            const opacity = Math.random() * 0.5 + 0.1;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDelay = `${animationDelay}s`;
            particle.style.opacity = opacity;

            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // ===================================
    // COUNTER ANIMATION
    // ===================================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.ceil(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        updateCounter();
    }

    // Observe counters when they come into view
    const counters = document.querySelectorAll('.stats-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        counter.setAttribute('data-target', target);
        counter.textContent = '0';
        counterObserver.observe(counter);
    });

    // ===================================
    // FORM VALIDATION
    // ===================================
    const forms = document.querySelectorAll('.needs-validation');

    forms.forEach(form => {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // ===================================
    // NEWSLETTER FORM
    // ===================================
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = this.querySelector('input[type="email"]').value;

            // Simulate form submission
            const submitButton = this.querySelector('button');
            const originalText = submitButton.innerHTML;

            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitButton.disabled = true;

            setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-check"></i>';
                submitButton.style.background = '#28a745';

                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                    this.reset();

                    // Show success message
                    showNotification('¡Gracias por suscribirte!', 'success');
                }, 1000);
            }, 2000);
        });
    }

    // ===================================
    // NOTIFICATION SYSTEM
    // ===================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            min-width: 300px;
        `;

        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-grow: 1;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: inherit;
            opacity: 0.7;
            transition: opacity 0.2s;
        `;

        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Set color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };

        notification.style.borderLeft = `4px solid ${colors[type]}`;
        notification.style.color = colors[type];
    }

    function getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // ===================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observe elements with animations
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

    // ===================================
    // LAZY LOADING FOR IMAGES
    // ===================================
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // ===================================
    // TOOLTIP INITIALIZATION
    // ===================================
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // ===================================
    // POPOVER INITIALIZATION
    // ===================================
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

    // ===================================
    // CUSTOM DROPDOWN TOGGLER
    // ===================================
    document.querySelectorAll('.dropdown-toggle-custom').forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            dropdown.classList.toggle('show');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.matches('.dropdown-toggle-custom')) {
            document.querySelectorAll('.dropdown-menu-custom').forEach(menu => {
                if (menu.classList.contains('show')) {
                    menu.classList.remove('show');
                }
            });
        }
    });

    // ===================================
    // MOBILE MENU ENHANCEMENTS
    // ===================================
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        // Add overlay when mobile menu is open
        navbarToggler.addEventListener('click', function () {
            if (navbarCollapse.classList.contains('show')) {
                document.body.classList.remove('mobile-menu-open');
            } else {
                document.body.classList.add('mobile-menu-open');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                    document.body.classList.remove('mobile-menu-open');
                }
            }
        });
    }

    // ===================================
    // SCROLL PROGRESS INDICATOR
    // ===================================
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--gradient-primary);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function () {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // ===================================
    // SECURITY DASHBOARD SIMULATION
    // ===================================
    function updateSecurityDashboard() {
        const statusItems = document.querySelectorAll('.status-item span');

        statusItems.forEach(item => {
            const text = item.textContent;
            if (text.includes('Online')) {
                const number = parseInt(text.match(/\d+/)[0]);
                const variation = Math.floor(Math.random() * 3) - 1;
                const newNumber = Math.max(0, number + variation);
                item.textContent = text.replace(/\d+/, newNumber);
            }
        });
    }

    // Update dashboard every 5 seconds
    setInterval(updateSecurityDashboard, 5000);

    // ===================================
    // KEYBOARD NAVIGATION
    // ===================================
    document.addEventListener('keydown', function (e) {
        // ESC key to close mobile menu
        if (e.key === 'Escape') {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
                document.body.classList.remove('mobile-menu-open');
            }
        }
    });

    // ===================================
    // PERFORMANCE MONITORING
    // ===================================
    // Monitor page load performance
    window.addEventListener('load', function () {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Performance:', {
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                totalTime: perfData.loadEventEnd - perfData.fetchStart
            });
        }, 0);
    });

    // ===================================
    // ERROR HANDLING
    // ===================================
    // ===================================
    // ERROR HANDLING
    // ===================================
    window.addEventListener('error', function (e) {
        console.error('JavaScript Error:', e.error);
        // You can send this to your error tracking service
    });

    window.addEventListener('unhandledrejection', function (e) {
        console.error('Unhandled Promise Rejection:', e.reason);
        // You can send this to your error tracking service
    });

    console.log('🚀 IA INTERNATIONAL PERU - Website loaded successfully!');
}

// Esperar a que el DOM esté completamente cargado Y los componentes también
document.addEventListener('DOMContentLoaded', function () {
    
    // Inicializar inmediatamente si los componentes ya están cargados
    if (window.componentLoader && window.componentLoader.componentsLoaded) {
        initializeAfterComponents();
    } else {
        // Esperar a que los componentes se carguen
        document.addEventListener('componentsLoaded', initializeAfterComponents);
        
        // Timeout de seguridad (8 segundos máximo)
        setTimeout(initializeAfterComponents, 8000);
    }
});
// ===================================
// SERVICE WORKER REGISTRATION (PWA Ready)
// ===================================
///if ('serviceWorker' in navigator) {
    //window.addEventListener('load', function () {
       // navigator.serviceWorker.register('/sw.js')
           //.then(function (registration) {
            //    console.log('ServiceWorker registration successful');
          //  })
        //    .catch(function (err) {
      //          console.log('ServiceWorker registration failed: ', err);
    //        });
  //  });
//}
// Script para controlar el menú móvil
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    if (navbarToggler && navbarCollapse) {
        // Toggle del menú móvil
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
            body.classList.toggle('mobile-menu-open');
            
            // Cambiar icono del toggler
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Animar icono hamburguesa a X
            this.classList.toggle('collapsed');
        });
        
        // Cerrar menú al hacer clic en un link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 992) {
                    navbarCollapse.classList.remove('show');
                    body.classList.remove('mobile-menu-open');
                    navbarToggler.setAttribute('aria-expanded', 'false');
                    navbarToggler.classList.add('collapsed');
                }
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 992 && 
                navbarCollapse.classList.contains('show') &&
                !navbarCollapse.contains(e.target) && 
                !navbarToggler.contains(e.target)) {
                
                navbarCollapse.classList.remove('show');
                body.classList.remove('mobile-menu-open');
                navbarToggler.setAttribute('aria-expanded', 'false');
                navbarToggler.classList.add('collapsed');
            }
        });
        
        // Cerrar menú al hacer scroll en móvil
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (window.innerWidth <= 992 && navbarCollapse.classList.contains('show')) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    navbarCollapse.classList.remove('show');
                    body.classList.remove('mobile-menu-open');
                    navbarToggler.setAttribute('aria-expanded', 'false');
                    navbarToggler.classList.add('collapsed');
                }, 300);
            }
        });
        
        // Cerrar menú al cambiar tamaño de ventana
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                navbarCollapse.classList.remove('show');
                body.classList.remove('mobile-menu-open');
                navbarToggler.setAttribute('aria-expanded', 'false');
                navbarToggler.classList.add('collapsed');
            }
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Agregar/remover clase scrolled
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Ocultar/mostrar header al hacer scroll
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
});