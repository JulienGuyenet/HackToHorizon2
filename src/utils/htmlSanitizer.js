/**
 * HTML Security Utility
 * Single Responsibility: Sanitize HTML content
 */

/**
 * Escape HTML special characters to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

/**
 * Sanitize text for use in HTML attributes
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
function sanitizeAttribute(text) {
    if (!text) return '';
    return escapeHtml(text).replace(/[\r\n]/g, ' ');
}

module.exports = { escapeHtml, sanitizeAttribute };
