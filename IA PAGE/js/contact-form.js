/**
 * IA INTERNATIONAL PERU - Contact Form
 * Manejo del formulario de contacto con validación y envío
 */

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitButton = null;
        this.originalButtonText = '';
        this.init();
    }

    init() {
        if (!this.form) return;

        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.originalButtonText = this.submitButton.innerHTML;

        this.setupEventListeners();
        this.setupValidation();
        this.setupPhoneInput();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    setupValidation() {
        // Custom validation rules
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 100,
                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            phone: {
                required: true,
                pattern: /^[\d\s\-\+\(\)]+$/
            },
            service: {
                required: true
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000
            }
        };
    }

    setupPhoneInput() {
        const phoneInput = this.form.querySelector('#phone');
        if (!phoneInput) return;

        // Format phone number as user types
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length >= 3) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            }
            if (value.length >= 7) {
                value = value.slice(0, 7) + '-' + value.slice(7, 11);
            }

            e.target.value = value;
        });
    }

    validateField(field) {
        const fieldName = field.name || field.id;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];

        if (!rules) return true;

        // Clear previous errors
        this.clearFieldError(field);

        // Check required
        if (rules.required && !value) {
            this.showFieldError(field, 'Este campo es obligatorio');
            return false;
        }

        // Check min length
        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(field, `Mínimo ${rules.minLength} caracteres`);
            return false;
        }

        // Check max length
        if (rules.maxLength && value.length > rules.maxLength) {
            this.showFieldError(field, `Máximo ${rules.maxLength} caracteres`);
            return false;
        }

        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            const messages = {
                name: 'Por favor ingrese un nombre válido',
                email: 'Por favor ingrese un email válido',
                phone: 'Por favor ingrese un número de teléfono válido'
            };

            this.showFieldError(field, messages[fieldName] || 'Formato inválido');
            return false;
        }

        return true;
    }

    showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);

        // Add error class to field
        field.classList.add('is-invalid');

        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'invalid-feedback';
        errorElement.textContent = message;

        // Insert after field
        field.parentNode.appendChild(errorElement);

        // Add shake animation
        field.classList.add('shake');
        setTimeout(() => field.classList.remove('shake'), 500);
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.remove();
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit() {
        // Validate form
        if (!this.validateForm()) {
            this.showNotification('Por favor complete todos los campos correctamente', 'error');
            return;
        }

        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate API call
            await this.simulateFormSubmission(data);

            // Show success message
            this.showNotification('¡Mensaje enviado exitosamente!', 'success');

            // Reset form
            this.form.reset();

            // Track conversion (if analytics is set up)
            this.trackConversion();

        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Error al enviar el mensaje. Por favor intente nuevamente.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    async simulateFormSubmission(data) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Log form data (in real implementation, this would be an actual API call)
        console.log('Form submission data:', data);

        // Simulate random success/error
        if (Math.random() > 0.1) { // 90% success rate
            return Promise.resolve();
        } else {
            return Promise.reject(new Error('Network error'));
        }
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            this.submitButton.disabled = true;
            this.submitButton.classList.add('loading');
        } else {
            this.submitButton.innerHTML = this.originalButtonText;
            this.submitButton.disabled = false;
            this.submitButton.classList.remove('loading');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} show`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

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
            min-width: 300px;
            animation: slideInRight 0.3s ease;
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

        // Set color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };

        notification.style.borderLeft = `4px solid ${colors[type]}`;
        notification.style.color = colors[type];

        // Add to DOM
        document.body.appendChild(notification);

        // Event listeners
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
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

    trackConversion() {
        // Track form submission conversion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'Contact',
                'event_label': 'Contact Form Submission',
                'value': 1
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact');
        }

        console.log('Conversion tracked: Contact form submission');
    }
}

// ===================================
// MULTI-STEP FORM (if needed)
// ===================================
class MultiStepForm {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.steps = this.form.querySelectorAll('.form-step');
        this.currentStep = 0;
        this.init();
    }

    init() {
        this.showStep(this.currentStep);
        this.setupNavigation();
    }

    showStep(step) {
        this.steps.forEach((stepElement, index) => {
            stepElement.style.display = index === step ? 'block' : 'none';
        });

        this.updateProgressBar();
    }

    updateProgressBar() {
        const progressBar = this.form.querySelector('.form-progress-bar');
        if (progressBar) {
            const progress = ((this.currentStep + 1) / this.steps.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    setupNavigation() {
        const nextButtons = this.form.querySelectorAll('.btn-next');
        const prevButtons = this.form.querySelectorAll('.btn-prev');

        nextButtons.forEach(btn => {
            btn.addEventListener('click', () => this.nextStep());
        });

        prevButtons.forEach(btn => {
            btn.addEventListener('click', () => this.prevStep());
        });
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            if (this.currentStep >= this.steps.length) {
                this.submitForm();
            } else {
                this.showStep(this.currentStep);
            }
        }
    }

    prevStep() {
        this.currentStep--;
        this.showStep(this.currentStep);
    }

    validateCurrentStep() {
        const currentStepElement = this.steps[this.currentStep];
        const inputs = currentStepElement.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
            }
        });

        return isValid;
    }

    async submitForm() {
        // Handle final form submission
        console.log('Multi-step form submitted');
    }
}

// ===================================
// WHATSAPP INTEGRATION
// ===================================
class WhatsAppIntegration {
    constructor() {
        this.button = document.querySelector('.whatsapp-button');
        this.init();
    }

    init() {
        if (!this.button) return;

        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            this.openWhatsApp();
        });
    }

    openWhatsApp() {
        const phoneNumber = this.button.dataset.phone || '+51123456789';
        const message = this.button.dataset.message || 'Hola, estoy interesado en sus servicios de seguridad.';

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
}

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    // Initialize contact form
    new ContactForm();

    // Initialize WhatsApp integration
    new WhatsAppIntegration();

    // Initialize multi-step form if exists
    const multiStepForm = document.querySelector('.multi-step-form');
    if (multiStepForm) {
        new MultiStepForm('.multi-step-form');
    }

    console.log('📧 Contact form system initialized successfully!');
});

// ===================================
// CSS STYLES FOR NOTIFICATIONS
// ===================================
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        font-family: var(--font-primary);
        font-size: 0.875rem;
    }
    
    .notification-close:hover {
        opacity: 1 !important;
    }
    
    .notification.show {
        animation: slideInRight 0.3s ease;
    }
    
    .notification.hide {
        animation: slideOutRight 0.3s ease;
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .btn.loading {
        position: relative;
        color: transparent !important;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        top: 50%;
        left: 50%;
        margin-left: -10px;
        margin-top: -10px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spinner 0.8s linear infinite;
    }
    
    @keyframes spinner {
        to { transform: rotate(360deg); }
    }
`;

document.head.appendChild(notificationStyles);