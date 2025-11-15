/**
 * Reservation Bootstrap - Compatibility layer for reservation page
 * Wraps new architecture to work with existing reservation.js
 */

(async function() {
    let furnitureRepository;
    
    try {
        // Initialize application for i18n
        window.app = await new Application().init();
        window.changeLanguage = (lng) => window.app.getI18nService().changeLanguage(lng);
        
        // Setup language switcher buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const lang = this.textContent.toLowerCase();
                window.changeLanguage(lang);
            });
        });
        
        // i18n is already initialized by Application
        
        // Make I18nService available globally for ApiClient
        window.I18nService = window.app.getI18nService();
        
        // Update translations
        window.I18nService.updatePageTranslations();
        
        // Create repository instance
        furnitureRepository = new FurnitureRepository(window.app.getApiClient());
        
        // Expose API functions for compatibility with reservation.js
        window.getAllFurniture = () => furnitureRepository.getAll();
        window.getFurnitureById = (id) => furnitureRepository.getById(id);
        window.searchFurniture = (params) => furnitureRepository.search(params);
        
        // Expose i18next for compatibility with reservation.js
        if (typeof i18next !== 'undefined' && i18next.isInitialized) {
            window.i18next = i18next;
        }
    } catch (error) {
        console.error('Failed to initialize reservation page:', error);
    }
})();
