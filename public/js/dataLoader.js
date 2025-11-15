/**
 * Data Loader Module
 * Handles loading data from the API
 */

/**
 * Load inventory data from API
 * @returns {Promise<Array>} Array of inventory items
 */
async function loadInventoryData() {
    try {
        // Use the API service to fetch furniture data
        const furnitureData = await getAllFurniture();
        
        // Transform API data to match the expected format for the UI
        const transformedData = furnitureData.map(item => ({
            id: item.id,
            reference: item.reference || 'N/A',
            designation: item.designation || 'N/A',
            type: item.type || 'N/A',
            family: item.family || 'N/A',
            user: item.user || '',
            barcode: item.barcode || 'N/A',
            serialNumber: item.serialNumber || '',
            supplier: item.supplier || 'N/A',
            deliveryDate: item.deliveryDate || '',
            location: {
                floor: item.location?.floor || item.floor || '',
                room: item.location?.room || item.room || '',
                building: item.location?.building || item.building || ''
            },
            coordinates: item.coordinates || { x: null, y: null },
            // Include any additional fields from API
            ...item
        }));
        
        return transformedData;
    } catch (error) {
        console.error('Error loading inventory data from API:', error);
        
        // If it's an APIError, get the localized message
        if (error instanceof APIError) {
            const localizedMessage = error.getLocalizedMessage();
            throw new Error(localizedMessage);
        }
        
        throw error;
    }
}

/**
 * Load location data from API
 * @returns {Promise<Array>} Array of location objects
 */
async function loadLocationData() {
    try {
        const locationData = await getAllLocations();
        return locationData;
    } catch (error) {
        console.error('Error loading location data from API:', error);
        
        if (error instanceof APIError) {
            const localizedMessage = error.getLocalizedMessage();
            throw new Error(localizedMessage);
        }
        
        throw error;
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadInventoryData, loadLocationData };
}
