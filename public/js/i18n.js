/**
 * i18n Configuration and Initialization
 * Handles internationalization for the application
 */

/**
 * Initialize i18next
 */
async function initI18n() {
    // Check if i18next is loaded
    if (typeof i18next === 'undefined') {
        console.error('i18next not loaded');
        return;
    }

    // Use i18next with HttpBackend
    await i18next
        .use(i18nextHttpBackend)
        .init({
            lng: 'fr', // default language
            fallbackLng: 'fr',
            debug: false,
            backend: {
                loadPath: '/locales/{{lng}}/translation.json'
            }
        });
}

/**
 * Translate a key
 * @param {string} key - Translation key
 * @param {object} options - Options for interpolation
 * @returns {string} Translated text
 */
function t(key, options = {}) {
    if (typeof i18next === 'undefined') {
        console.error('i18next not initialized');
        return key;
    }
    return i18next.t(key, options);
}

/**
 * Change language
 * @param {string} lng - Language code (fr, en)
 */
async function changeLanguage(lng) {
    if (typeof i18next === 'undefined') {
        console.error('i18next not initialized');
        return;
    }
    await i18next.changeLanguage(lng);
    updatePageTranslations();
}

/**
 * Update all translations on the page
 */
function updatePageTranslations() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initI18n, t, changeLanguage, updatePageTranslations };
}
