/**
 * Reservation Bootstrap - Compatibility layer for reservation page
 * Wraps new architecture to work with existing reservation.js
 */

(async function() {
    let furnitureRepository;
    
    try {
        // Initialize application
        window.app = await new Application().init();
        
        // Create repository instance
        furnitureRepository = new FurnitureRepository(window.app.getApiClient());
        
        // Expose API functions for compatibility with reservation.js
        window.getAllFurniture = () => furnitureRepository.getAll();
        window.getFurnitureById = (id) => furnitureRepository.getById(id);
        window.searchFurniture = (params) => furnitureRepository.search(params);
    } catch (error) {
        console.error('Failed to initialize reservation page:', error);
    }
})();
