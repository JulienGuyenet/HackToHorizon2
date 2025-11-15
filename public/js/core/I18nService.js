/**
 * I18nService - Internationalization Service Class
 * Handles translation and language management
 */

class I18nService {
    constructor(config = {}) {
        this.supportedLanguages = config.supportedLanguages || ['fr', 'en'];
        this.defaultLanguage = config.defaultLanguage || 'fr';
        this.storageKey = config.storageKey || 'userLanguagePreference';
        this.i18nextInstance = null;
    }

    /**
     * Initialize i18next
     */
    async init() {
        if (typeof i18next === 'undefined') {
            console.error('i18next not loaded');
            throw new Error('i18next library not found');
        }

        const userLang = this.getUserLanguage();

        this.i18nextInstance = await i18next
            .use(i18nextHttpBackend)
            .init({
                lng: userLang,
                fallbackLng: this.defaultLanguage,
                debug: false,
                supportedLngs: this.supportedLanguages,
                load: 'languageOnly',
                backend: {
                    loadPath: '/locales/{{lng}}/translation.json',
                    requestOptions: {
                        cache: 'default'
                    }
                },
                partialBundledLanguages: true
            });

        return this;
    }

    /**
     * Get user's preferred language
     */
    getUserLanguage() {
        // Check stored preference
        const storedLang = localStorage.getItem(this.storageKey);
        if (storedLang && this.supportedLanguages.includes(storedLang)) {
            return storedLang;
        }
        
        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const shortLang = browserLang.split('-')[0];
        
        if (this.supportedLanguages.includes(shortLang)) {
            return shortLang;
        }
        
        return this.defaultLanguage;
    }

    /**
     * Translate a key
     */
    translate(key, options = {}) {
        if (!this.i18nextInstance) {
            console.error('i18next not initialized');
            return key;
        }
        return this.i18nextInstance.t(key, options);
    }

    /**
     * Translate error code to localized message
     */
    translateError(errorCode, fallbackMessage) {
        const key = `errors.${errorCode}`;
        const translated = this.translate(key);
        
        // If translation exists, use it
        if (translated !== key) {
            return translated;
        }
        
        return fallbackMessage || 'An error occurred';
    }

    /**
     * Change language
     */
    async changeLanguage(lng) {
        if (!this.i18nextInstance) {
            console.error('i18next not initialized');
            return;
        }
        
        if (!this.supportedLanguages.includes(lng)) {
            console.warn(`Language ${lng} not supported, falling back to ${this.defaultLanguage}`);
            lng = this.defaultLanguage;
        }
        
        localStorage.setItem(this.storageKey, lng);
        await this.i18nextInstance.changeLanguage(lng);
        this.updatePageTranslations();
        document.documentElement.lang = lng;
    }

    /**
     * Update all translations on the page
     */
    updatePageTranslations() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.translate(key);
        });
        
        // Update elements with [placeholder] attribute notation
        document.querySelectorAll('[data-i18n*="[placeholder]"]').forEach(element => {
            const attr = element.getAttribute('data-i18n');
            const key = attr.replace('[placeholder]', '');
            element.placeholder = this.translate(key);
        });
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.i18nextInstance?.language || this.defaultLanguage;
    }

    /**
     * Get Accept-Language header value
     */
    getAcceptLanguageHeader() {
        const lang = this.getCurrentLanguage();
        return `${lang}-${lang.toUpperCase()},${lang};q=0.9,en;q=0.8`;
    }
}

// Export for browser
// Note: window.I18nService will be set to an instance by Application.init()

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { I18nService };
}
