/**
 * API Service Module
 * Handles all communication with the .NET Furniture Inventory API
 */

// API Configuration
const API_CONFIG = {
    baseURL: 'http://localhost:5000/api', // Default to HTTP for development
    httpsBaseURL: 'https://localhost:5001/api',
    timeout: 10000,
    useHttps: false // Toggle for HTTPS
};

/**
 * Get the base URL based on configuration
 */
function getBaseURL() {
    return API_CONFIG.useHttps ? API_CONFIG.httpsBaseURL : API_CONFIG.baseURL;
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${getBaseURL()}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        ...options
    };

    try {
        const response = await fetch(url, defaultOptions);
        
        // Handle different status codes
        if (response.status === 204) {
            return { success: true };
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`API call failed for ${endpoint}:`, error);
        throw error;
    }
}

// ============================================================================
// FURNITURE API METHODS
// ============================================================================

/**
 * Get all furniture items
 * @returns {Promise<Array>} Array of furniture objects
 */
async function getAllFurniture() {
    return apiFetch('/Furniture');
}

/**
 * Get furniture by ID
 * @param {number} id - Furniture ID
 * @returns {Promise<Object>} Furniture object
 */
async function getFurnitureById(id) {
    return apiFetch(`/Furniture/${id}`);
}

/**
 * Create new furniture
 * @param {Object} furnitureData - Furniture data
 * @returns {Promise<Object>} Created furniture object
 */
async function createFurniture(furnitureData) {
    return apiFetch('/Furniture', {
        method: 'POST',
        body: JSON.stringify(furnitureData)
    });
}

/**
 * Update furniture
 * @param {number} id - Furniture ID
 * @param {Object} furnitureData - Updated furniture data
 * @returns {Promise<Object>} Updated furniture object
 */
async function updateFurniture(id, furnitureData) {
    return apiFetch(`/Furniture/${id}`, {
        method: 'PUT',
        body: JSON.stringify(furnitureData)
    });
}

/**
 * Delete furniture
 * @param {number} id - Furniture ID
 * @returns {Promise<Object>} Success response
 */
async function deleteFurniture(id) {
    return apiFetch(`/Furniture/${id}`, {
        method: 'DELETE'
    });
}

/**
 * Get furniture by barcode
 * @param {string} barcode - Barcode string
 * @returns {Promise<Object>} Furniture object
 */
async function getFurnitureByBarcode(barcode) {
    return apiFetch(`/Furniture/barcode/${encodeURIComponent(barcode)}`);
}

/**
 * Search furniture with criteria
 * @param {Object} searchParams - Search parameters (reference, famille, site)
 * @returns {Promise<Array>} Array of furniture objects
 */
async function searchFurniture(searchParams) {
    const queryString = new URLSearchParams(searchParams).toString();
    return apiFetch(`/Furniture/search?${queryString}`);
}

/**
 * Assign location to furniture
 * @param {number} furnitureId - Furniture ID
 * @param {number} locationId - Location ID
 * @returns {Promise<Object>} Success response
 */
async function assignLocationToFurniture(furnitureId, locationId) {
    return apiFetch(`/Furniture/${furnitureId}/location/${locationId}`, {
        method: 'POST'
    });
}

/**
 * Assign RFID tag to furniture
 * @param {number} furnitureId - Furniture ID
 * @param {number} rfidTagId - RFID Tag ID
 * @returns {Promise<Object>} Success response
 */
async function assignRfidTagToFurniture(furnitureId, rfidTagId) {
    return apiFetch(`/Furniture/${furnitureId}/rfid/${rfidTagId}`, {
        method: 'POST'
    });
}

// ============================================================================
// LOCATION API METHODS
// ============================================================================

/**
 * Get all locations
 * @returns {Promise<Array>} Array of location objects
 */
async function getAllLocations() {
    return apiFetch('/Location');
}

/**
 * Get location by ID
 * @param {number} id - Location ID
 * @returns {Promise<Object>} Location object
 */
async function getLocationById(id) {
    return apiFetch(`/Location/${id}`);
}

/**
 * Create new location
 * @param {Object} locationData - Location data
 * @returns {Promise<Object>} Created location object
 */
async function createLocation(locationData) {
    return apiFetch('/Location', {
        method: 'POST',
        body: JSON.stringify(locationData)
    });
}

/**
 * Update location
 * @param {number} id - Location ID
 * @param {Object} locationData - Updated location data
 * @returns {Promise<Object>} Updated location object
 */
async function updateLocation(id, locationData) {
    return apiFetch(`/Location/${id}`, {
        method: 'PUT',
        body: JSON.stringify(locationData)
    });
}

/**
 * Delete location
 * @param {number} id - Location ID
 * @returns {Promise<Object>} Success response
 */
async function deleteLocation(id) {
    return apiFetch(`/Location/${id}`, {
        method: 'DELETE'
    });
}

/**
 * Get all furniture at a location
 * @param {number} locationId - Location ID
 * @returns {Promise<Array>} Array of furniture objects
 */
async function getFurnitureAtLocation(locationId) {
    return apiFetch(`/Location/${locationId}/furniture`);
}

/**
 * Get locations by building name
 * @param {string} buildingName - Building name
 * @returns {Promise<Array>} Array of location objects
 */
async function getLocationsByBuilding(buildingName) {
    return apiFetch(`/Location/building/${encodeURIComponent(buildingName)}`);
}

// ============================================================================
// RFID API METHODS
// ============================================================================

/**
 * Get all active RFID tags
 * @returns {Promise<Array>} Array of RFID tag objects
 */
async function getActiveTags() {
    return apiFetch('/Rfid/tags');
}

/**
 * Get RFID tag by ID
 * @param {string} tagId - Tag ID
 * @returns {Promise<Object>} RFID tag object
 */
async function getTagById(tagId) {
    return apiFetch(`/Rfid/tags/${encodeURIComponent(tagId)}`);
}

/**
 * Register new RFID tag
 * @param {Object} tagData - Tag data (tagId, tagType)
 * @returns {Promise<Object>} Created RFID tag object
 */
async function registerTag(tagData) {
    return apiFetch('/Rfid/tags', {
        method: 'POST',
        body: JSON.stringify(tagData)
    });
}

/**
 * Assign RFID tag to furniture
 * @param {string} tagId - Tag ID
 * @param {number} furnitureId - Furniture ID
 * @returns {Promise<Object>} Success response
 */
async function assignTagToFurniture(tagId, furnitureId) {
    return apiFetch(`/Rfid/tags/${encodeURIComponent(tagId)}/assign/${furnitureId}`, {
        method: 'POST'
    });
}

/**
 * Deactivate RFID tag
 * @param {string} tagId - Tag ID
 * @returns {Promise<Object>} Success response
 */
async function deactivateTag(tagId) {
    return apiFetch(`/Rfid/tags/${encodeURIComponent(tagId)}/deactivate`, {
        method: 'POST'
    });
}

/**
 * Process RFID tag read
 * @param {Object} readData - Read data (tagId, readerId)
 * @returns {Promise<Object>} Success response
 */
async function processTagRead(readData) {
    return apiFetch('/Rfid/read', {
        method: 'POST',
        body: JSON.stringify(readData)
    });
}

/**
 * Get all active RFID readers
 * @returns {Promise<Array>} Array of RFID reader objects
 */
async function getActiveReaders() {
    return apiFetch('/Rfid/readers');
}

/**
 * Register new RFID reader
 * @param {Object} readerData - Reader data (readerId, name, locationId)
 * @returns {Promise<Object>} Created RFID reader object
 */
async function registerReader(readerData) {
    return apiFetch('/Rfid/readers', {
        method: 'POST',
        body: JSON.stringify(readerData)
    });
}

/**
 * Update RFID reader status
 * @param {string} readerId - Reader ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Success response
 */
async function updateReaderStatus(readerId, status) {
    return apiFetch(`/Rfid/readers/${encodeURIComponent(readerId)}/status`, {
        method: 'POST',
        body: JSON.stringify({ status })
    });
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Set API to use HTTPS
 * @param {boolean} useHttps - Whether to use HTTPS
 */
function setUseHttps(useHttps) {
    API_CONFIG.useHttps = useHttps;
}

/**
 * Set custom base URL
 * @param {string} url - Base URL for API
 */
function setBaseURL(url) {
    API_CONFIG.baseURL = url;
}

// Export all methods
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Furniture methods
        getAllFurniture,
        getFurnitureById,
        createFurniture,
        updateFurniture,
        deleteFurniture,
        getFurnitureByBarcode,
        searchFurniture,
        assignLocationToFurniture,
        assignRfidTagToFurniture,
        // Location methods
        getAllLocations,
        getLocationById,
        createLocation,
        updateLocation,
        deleteLocation,
        getFurnitureAtLocation,
        getLocationsByBuilding,
        // RFID methods
        getActiveTags,
        getTagById,
        registerTag,
        assignTagToFurniture,
        deactivateTag,
        processTagRead,
        getActiveReaders,
        registerReader,
        updateReaderStatus,
        // Configuration
        setUseHttps,
        setBaseURL
    };
}
