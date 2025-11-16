/**
 * Application - Main application bootstrap class
 * Initializes all services and controllers
 */

class Application {
    constructor() {
        this.apiClient = null;
        this.furnitureRepository = null;
        this.locationRepository = null;
        this.inventoryService = null;
    }

    /**
     * Initialize the application
     */
    async init() {
        // Initialize API Client
        this.apiClient = new ApiClient();

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
        return new InventoryController(this.inventoryService);
    }

    /**
     * Create controller for map page
     */
    createMapController() {
        const controller = new MapController(this.inventoryService);
        // Expose repositories to controller
        controller.furnitureRepository = this.furnitureRepository;
        controller.locationRepository = this.locationRepository;
        return controller;
    }

    /**
     * Create controller for statistics page
     */
    createStatisticsController() {
        return new StatisticsController(this.inventoryService);
    }

    /**
     * Create controller for reservation page
     */
    createReservationController() {
        return new ReservationController(this.furnitureRepository);
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
