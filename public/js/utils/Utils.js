/**
 * HtmlUtils - Utility functions for HTML operations
 */

class HtmlUtils {
    /**
     * Escape HTML to prevent XSS
     */
    static escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Create element with attributes
     */
    static createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    }

    /**
     * Show/hide element
     */
    static toggleDisplay(element, show) {
        if (show) {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    }

    /**
     * Add CSS class
     */
    static addClass(element, className) {
        if (element) {
            element.classList.add(className);
        }
    }

    /**
     * Remove CSS class
     */
    static removeClass(element, className) {
        if (element) {
            element.classList.remove(className);
        }
    }

    /**
     * Toggle CSS class
     */
    static toggleClass(element, className) {
        if (element) {
            element.classList.toggle(className);
        }
    }
}

/**
 * StorageUtils - Utility functions for localStorage
 */
class StorageUtils {
    /**
     * Get item from localStorage
     */
    static get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    /**
     * Set item in localStorage
     */
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    }

    /**
     * Remove item from localStorage
     */
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    /**
     * Clear all localStorage
     */
    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
}

/**
 * DateUtils - Utility functions for date operations
 */
class DateUtils {
    /**
     * Format date to locale string
     */
    static formatDate(date, locale = 'fr-FR') {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString(locale);
    }

    /**
     * Format datetime to locale string
     */
    static formatDateTime(date, locale = 'fr-FR') {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleString(locale);
    }

    /**
     * Get ISO date string
     */
    static toISODate(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    /**
     * Check if date is valid
     */
    static isValidDate(date) {
        const d = new Date(date);
        return d instanceof Date && !isNaN(d);
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.HtmlUtils = HtmlUtils;
    window.StorageUtils = StorageUtils;
    window.DateUtils = DateUtils;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HtmlUtils, StorageUtils, DateUtils };
}
