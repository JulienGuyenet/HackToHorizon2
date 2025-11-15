/**
 * LocationRepository - Location API Repository
 * Handles all location-related API calls
 */

class LocationRepository {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }

    /**
     * Get all locations
     */
    async getAll() {
        return this.apiClient.get('/Location');
    }

    /**
     * Get location by ID
     */
    async getById(id) {
        return this.apiClient.get(`/Location/${id}`);
    }

    /**
     * Create new location
     */
    async create(locationData) {
        return this.apiClient.post('/Location', locationData);
    }

    /**
     * Update location
     */
    async update(id, locationData) {
        return this.apiClient.put(`/Location/${id}`, locationData);
    }

    /**
     * Delete location
     */
    async delete(id) {
        return this.apiClient.delete(`/Location/${id}`);
    }

    /**
     * Get furniture at location
     */
    async getFurniture(locationId) {
        return this.apiClient.get(`/Location/${locationId}/furniture`);
    }

    /**
     * Get locations by building
     */
    async getByBuilding(buildingName) {
        return this.apiClient.get(`/Location/building/${encodeURIComponent(buildingName)}`);
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.LocationRepository = LocationRepository;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LocationRepository };
}
