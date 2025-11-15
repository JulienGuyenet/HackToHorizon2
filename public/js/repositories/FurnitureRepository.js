/**
 * FurnitureRepository - Furniture API Repository
 * Handles all furniture-related API calls
 */

class FurnitureRepository {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }

    /**
     * Get all furniture items
     */
    async getAll() {
        return this.apiClient.get('/Furniture');
    }

    /**
     * Get furniture by ID
     */
    async getById(id) {
        return this.apiClient.get(`/Furniture/${id}`);
    }

    /**
     * Create new furniture
     */
    async create(furnitureData) {
        return this.apiClient.post('/Furniture', furnitureData);
    }

    /**
     * Update furniture
     */
    async update(id, furnitureData) {
        return this.apiClient.put(`/Furniture/${id}`, furnitureData);
    }

    /**
     * Delete furniture
     */
    async delete(id) {
        return this.apiClient.delete(`/Furniture/${id}`);
    }

    /**
     * Get furniture by barcode
     */
    async getByBarcode(barcode) {
        return this.apiClient.get(`/Furniture/barcode/${encodeURIComponent(barcode)}`);
    }

    /**
     * Search furniture
     */
    async search(searchParams) {
        const queryString = new URLSearchParams(searchParams).toString();
        return this.apiClient.get(`/Furniture/search?${queryString}`);
    }

    /**
     * Assign location to furniture
     */
    async assignLocation(furnitureId, locationId) {
        return this.apiClient.post(`/Furniture/${furnitureId}/location/${locationId}`, {});
    }

    /**
     * Assign RFID tag to furniture
     */
    async assignRfidTag(furnitureId, rfidTagId) {
        return this.apiClient.post(`/Furniture/${furnitureId}/rfid/${rfidTagId}`, {});
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.FurnitureRepository = FurnitureRepository;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FurnitureRepository };
}
