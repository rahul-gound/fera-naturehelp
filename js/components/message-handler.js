// ===== Message Handler Component =====
// Handles display of success and error messages

const MessageHandler = {
    // Show error message
    showError: function(message, duration = 5000) {
        const errorEl = document.getElementById('error-message');
        if (!errorEl) {
            console.error('Error element not found');
            return;
        }
        
        errorEl.textContent = message;
        errorEl.classList.add('show');
        
        if (duration > 0) {
            setTimeout(() => {
                errorEl.classList.remove('show');
            }, duration);
        }
    },

    // Show success message
    showSuccess: function(message, duration = 5000) {
        const successEl = document.getElementById('success-message');
        if (!successEl) {
            console.error('Success element not found');
            return;
        }
        
        successEl.textContent = message;
        successEl.classList.add('show');
        
        if (duration > 0) {
            setTimeout(() => {
                successEl.classList.remove('show');
            }, duration);
        }
    },

    // Hide all messages
    hideMessages: function() {
        const errorEl = document.getElementById('error-message');
        const successEl = document.getElementById('success-message');
        
        if (errorEl) errorEl.classList.remove('show');
        if (successEl) successEl.classList.remove('show');
    },

    // Show loading state on button
    setButtonLoading: function(button, isLoading, loadingText = 'Loading...', originalText = null) {
        if (!button) return;
        
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
        } else {
            button.disabled = false;
            button.innerHTML = originalText || button.dataset.originalText || 'Submit';
        }
    }
};

// Export for use in other modules
window.MessageHandler = MessageHandler;
