/**
 * Bootstrap Script - Unified initialization for all pages
 * Initializes the application and makes services globally available
 */

(async function() {
    try {
        // Initialize application
        const app = await new Application().init();
        
        // Make services globally available
        window.app = app;
        
        // Determine page type and initialize appropriate controller
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1);
        
        let controller;
        
        if (page === 'inventory.html' || page === '') {
            controller = app.createInventoryController();
        } else if (page === 'map.html') {
            controller = app.createMapController();
        } else if (page === 'statistics.html') {
            controller = app.createStatisticsController();
        } else if (page === 'reservation.html') {
            // Reservation page will use a separate initialization
            return;
        }
        
        if (controller) {
            await controller.init();
            window.controller = controller;
        }
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
})();
