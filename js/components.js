/**
 * IA INTERNATIONAL PERU - Component Loader
 * Sistema de carga dinámica de componentes
 */

class ComponentLoader {
    constructor() {
        this.componentsLoaded = false;
        this.init();
    }

    async init() {
        await this.loadComponents();
        this.initLoadedComponents();
    }

    async loadComponents() {
        console.log('🚀 Iniciando carga de componentes...');

        const components = [
            {
                id: 'header-container',
                file: 'components/header.html',
                position: 'afterbegin'
            },
            {
                id: 'footer-container',
                file: 'components/footer.html',
                position: 'beforeend'
            }
        ];

        try {
            for (const component of components) {
                await this.loadComponent(component);
            }
            
            this.componentsLoaded = true;
            console.log('✅ Todos los componentes cargados correctamente');
            
            // Disparar evento personalizado cuando los componentes se cargan
            document.dispatchEvent(new CustomEvent('componentsLoaded'));
            
        } catch (error) {
            console.error('❌ Error cargando componentes:', error);
            this.showErrorFallback();
        }
    }

    async loadComponent(component) {
        try {
            console.log(`📂 Cargando ${component.file}...`);
            
            const response = await fetch(component.file);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const html = await response.text();
            
            // Crear contenedor si no existe
            let container = document.getElementById(component.id);
            if (!container) {
                container = document.createElement('div');
                container.id = component.id;
                if (component.position === 'afterbegin') {
                    document.body.insertAdjacentElement('afterbegin', container);
                } else {
                    document.body.insertAdjacentElement('beforeend', container);
                }
            }
            
            container.innerHTML = html;
            console.log(`✅ ${component.id} cargado correctamente`);
            
        } catch (error) {
            console.error(`❌ Error cargando ${component.file}:`, error);
            throw error; // Re-lanzar para manejo en nivel superior
        }
    }

    initLoadedComponents() {
        // Inicializar funcionalidades específicas del footer
        this.initFooterFeatures();
        
        // Inicializar funcionalidades específicas del header
        this.initHeaderFeatures();
    }

    initFooterFeatures() {
        // Actualizar año actual
        const yearSpan = document.getElementById('añoActual');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
        
        // Manejar newsletter form
        const newsletterForm = document.querySelector('#newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = newsletterForm.querySelector('input[type="email"]');
                if (emailInput.value) {
                    this.showNotification('¡Gracias por suscribirte!', 'success');
                    newsletterForm.reset();
                }
            });
        }
        
        // Manejar imágenes de certificaciones (evitar 404)
        const certImages = document.querySelectorAll('.cert-img');
        certImages.forEach(img => {
            img.addEventListener('error', () => {
                console.warn(`⚠️ Imagen no encontrada: ${img.src}`);
                img.style.display = 'none';
            });
        });
    }

    initHeaderFeatures() {
        // Aquí puedes agregar inicializaciones específicas del header si las necesitas
        console.log('🎯 Header features initialized');
    }

    showErrorFallback() {
        // Mostrar mensajes de error en los contenedores
        const containers = ['header-container', 'footer-container'];
        
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container && container.innerHTML === '') {
                container.innerHTML = `
                    <div class="alert alert-warning m-3">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Error cargando componente. Recarga la página.
                    </div>
                `;
            }
        });
    }

    showNotification(message, type = 'info') {
        // Usar la función de notificación del main.js si existe
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            // Fallback simple
            const notification = document.createElement('div');
            notification.className = `alert alert-${type} fixed-top m-3`;
            notification.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="fas fa-${this.getNotificationIcon(type)} me-2"></i>
                    ${message}
                </div>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el cargador de componentes
    window.componentLoader = new ComponentLoader();
});
