// ===== Validation Utilities =====
// Common validation functions

const ValidationUtils = {
    // Validate email format
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate password strength
    validatePassword: function(password) {
        const errors = [];
        
        if (!password || password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }
        
        if (password && password.length > 0 && password.length < 8) {
            return { valid: true, strength: 'weak', message: 'Password is weak' };
        }
        
        if (password && password.length >= 8) {
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            
            const criteriaCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
            
            if (criteriaCount >= 3) {
                return { valid: true, strength: 'strong', message: 'Strong password' };
            } else if (criteriaCount >= 2) {
                return { valid: true, strength: 'medium', message: 'Medium strength password' };
            }
        }
        
        return { valid: errors.length === 0, strength: 'weak', message: errors.join('. ') };
    },

    // Check if passwords match
    passwordsMatch: function(password, confirmPassword) {
        return password === confirmPassword;
    },

    // Sanitize HTML to prevent XSS
    sanitizeHtml: function(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
};

// Export for use in other modules
window.ValidationUtils = ValidationUtils;
