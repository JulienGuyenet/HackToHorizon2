/**
 * i18n Configuration and Initialization
 * Handles internationalization for the application
 */

// Supported languages
const SUPPORTED_LANGUAGES = ['fr', 'en'];
const DEFAULT_LANGUAGE = 'fr';
const LANGUAGE_STORAGE_KEY = 'userLanguagePreference';

/**
 * Get user's preferred language
 * Priority: 1. Stored preference, 2. Browser language, 3. Default
 */
function getUserLanguage() {
    // Check stored preference
    const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
        return storedLang;
    }
    
    // Check browser language (Accept-Language equivalent)
    const browserLang = navigator.language || navigator.userLanguage;
    const shortLang = browserLang.split('-')[0]; // Extract 'fr' from 'fr-FR'
    
    if (SUPPORTED_LANGUAGES.includes(shortLang)) {
        return shortLang;
    }
    
    return DEFAULT_LANGUAGE;
}

/**
 * Initialize i18next with enhanced configuration
 */
async function initI18n() {
    // Check if i18next is loaded
    if (typeof i18next === 'undefined') {
        console.error('i18next not loaded');
        return;
    }

    const userLang = getUserLanguage();

    // Use i18next with HttpBackend for lazy-loading
    await i18next
        .use(i18nextHttpBackend)
        .init({
            lng: userLang,
            fallbackLng: DEFAULT_LANGUAGE,
            debug: false,
            supportedLngs: SUPPORTED_LANGUAGES,
            load: 'languageOnly', // Load only 'fr' not 'fr-FR'
            backend: {
                loadPath: '/locales/{{lng}}/translation.json',
                // Cache translations in browser
                requestOptions: {
                    cache: 'default'
                }
            },
            // Lazy load translations as needed
            partialBundledLanguages: true
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
    
    if (!SUPPORTED_LANGUAGES.includes(lng)) {
        console.warn(`Language ${lng} not supported, falling back to ${DEFAULT_LANGUAGE}`);
        lng = DEFAULT_LANGUAGE;
    }
    
    // Store user preference
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    
    await i18next.changeLanguage(lng);
    updatePageTranslations();
    
    // Update HTML lang attribute
    document.documentElement.lang = lng;
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
    
    // Update elements with [placeholder] attribute notation (used in reservation.html)
    document.querySelectorAll('[data-i18n*="[placeholder]"]').forEach(element => {
        const attr = element.getAttribute('data-i18n');
        const key = attr.replace('[placeholder]', '');
        element.placeholder = t(key);
    });
}

/**
 * Get current language
 * @returns {string} Current language code
 */
function getCurrentLanguage() {
    return i18next.language || DEFAULT_LANGUAGE;
}

/**
 * Get Accept-Language header value for API calls
 * @returns {string} Accept-Language header value
 */
function getAcceptLanguageHeader() {
    const lang = getCurrentLanguage();
    // Format: fr-FR,fr;q=0.9,en;q=0.8
    return `${lang}-${lang.toUpperCase()},${lang};q=0.9,en;q=0.8`;
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        initI18n, 
        t, 
        changeLanguage, 
        updatePageTranslations,
        getCurrentLanguage,
        getAcceptLanguageHeader,
        SUPPORTED_LANGUAGES,
        DEFAULT_LANGUAGE
    };
}
