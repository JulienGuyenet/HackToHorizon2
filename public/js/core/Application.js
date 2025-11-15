/**
 * Application - Main application bootstrap class
 * Initializes all services and controllers
 */

class Application {
    constructor() {
        this.apiClient = null;
        this.i18nService = null;
        this.furnitureRepository = null;
        this.locationRepository = null;
        this.inventoryService = null;
    }

    /**
     * Initialize the application
     */
    async init() {
        // Initialize API Client
        this.apiClient = new ApiClient({
            baseURL: 'http://localhost:5281/api',
            httpsBaseURL: 'https://localhost:7201/api',
            useHttps: false
        });

        // Initialize I18n Service
        this.i18nService = new I18nService({
            supportedLanguages: ['fr', 'en'],
            defaultLanguage: 'fr'
        });
        
        // Make i18nService globally available for API client
        window.I18nService = this.i18nService;

        // Initialize Repositories
        this.furnitureRepository = new FurnitureRepository(this.apiClient);
        this.locationRepository = new LocationRepository(this.apiClient);

        // Initialize Services
        this.inventoryService = new InventoryService(
            this.furnitureRepository,
            this.locationRepository
        );

        return this;
    }

    /**
     * Get the I18n Service instance
     */
    getI18nService() {
        return this.i18nService;
    }

    /**
     * Get the Inventory Service instance
     */
    getInventoryService() {
        return this.inventoryService;
    }

    /**
     * Get the API Client instance
     */
    getApiClient() {
        return this.apiClient;
    }

    /**
     * Create controller for inventory page
     */
    createInventoryController() {
        return new InventoryController(this.inventoryService, this.i18nService);
    }

    /**
     * Create controller for map page
     */
    createMapController() {
        return new MapController(this.inventoryService, this.i18nService);
    }

    /**
     * Create controller for statistics page
     */
    createStatisticsController() {
        return new StatisticsController(this.inventoryService, this.i18nService);
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.Application = Application;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Application };
}
