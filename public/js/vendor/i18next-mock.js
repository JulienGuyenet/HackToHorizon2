/**
 * Mock i18next for testing (minimal implementation)
 * This is a simplified version for testing only
 */

const i18next = {
    isInitialized: false,
    language: 'fr',
    translations: {},
    
    use(backend) {
        return this;
    },
    
    async init(options) {
        this.language = options.lng || 'fr';
        this.fallbackLng = options.fallbackLng || 'fr';
        
        // Load translation files
        if (options.backend && options.backend.loadPath) {
            try {
                const lng = this.language;
                const url = options.backend.loadPath.replace('{{lng}}', lng);
                const response = await fetch(url);
                if (response.ok) {
                    this.translations[lng] = await response.json();
                }
            } catch (error) {
                console.warn('Could not load translations:', error);
                this.translations[this.language] = {};
            }
        }
        
        this.isInitialized = true;
        return this;
    },
    
    t(key, options = {}) {
        const keys = key.split('.');
        let value = this.translations[this.language];
        
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key;
            }
        }
        
        return value || key;
    },
    
    async changeLanguage(lng) {
        this.language = lng;
        
        // Load new language if not already loaded
        if (!this.translations[lng]) {
            const url = `/locales/${lng}/translation.json`;
            try {
                const response = await fetch(url);
                if (response.ok) {
                    this.translations[lng] = await response.json();
                }
            } catch (error) {
                console.warn('Could not load translations for', lng, error);
                this.translations[lng] = {};
            }
        }
    }
};

const i18nextHttpBackend = {
    type: 'backend'
};

// Make globally available
if (typeof window !== 'undefined') {
    window.i18next = i18next;
    window.i18nextHttpBackend = i18nextHttpBackend;
}
