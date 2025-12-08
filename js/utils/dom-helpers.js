// ===== DOM Helper Utilities =====
// Common DOM manipulation functions

const DOMHelpers = {
    // Show element
    show: function(element) {
        if (element) {
            element.style.display = 'block';
        }
    },

    // Hide element
    hide: function(element) {
        if (element) {
            element.style.display = 'none';
        }
    },

    // Toggle element visibility
    toggle: function(element) {
        if (element) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    },

    // Add class to element
    addClass: function(element, className) {
        if (element) {
            element.classList.add(className);
        }
    },

    // Remove class from element
    removeClass: function(element, className) {
        if (element) {
            element.classList.remove(className);
        }
    },

    // Toggle class on element
    toggleClass: function(element, className) {
        if (element) {
            element.classList.toggle(className);
        }
    },

    // Set text content safely
    setText: function(element, text) {
        if (element) {
            element.textContent = text;
        }
    },

    // Get element by id with null check
    getById: function(id) {
        return document.getElementById(id);
    },

    // Get element by selector with null check
    getBySelector: function(selector) {
        return document.querySelector(selector);
    },

    // Get all elements by selector
    getAllBySelector: function(selector) {
        return document.querySelectorAll(selector);
    },

    // Create element with attributes
    createElement: function(tag, attributes = {}, text = null) {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        if (text) {
            element.textContent = text;
        }
        
        return element;
    }
};

// Export for use in other modules
window.DOMHelpers = DOMHelpers;
