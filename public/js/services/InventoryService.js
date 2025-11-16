/**
 * InventoryService - Business logic for inventory management
 * Handles data transformation and filtering
 */

class InventoryService {
    constructor(furnitureRepository, locationRepository) {
        this.furnitureRepository = furnitureRepository;
        this.locationRepository = locationRepository;
        this.items = [];
        this.filters = {
            search: '',
            floor: '',
            room: '',
            type: '',
            family: '',
            supplier: '',
            user: ''
        };
    }

    /**
     * Load all inventory items
     */
    async loadItems() {
        try {
            const furnitureData = await this.furnitureRepository.getAll();
            this.items = this.transformItems(furnitureData);
            return this.items;
        } catch (error) {
            console.error('Error loading inventory items:', error);
            throw error;
        }
    }

    /**
     * Transform API data to internal format
     */
    transformItems(apiData) {
        return apiData.map(item => ({
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
            ...item
        }));
    }

    /**
     * Get all items
     */
    getAllItems() {
        return this.items;
    }

    /**
     * Set filters
     */
    setFilters(filters) {
        this.filters = { ...this.filters, ...filters };
    }

    /**
     * Clear filters
     */
    clearFilters() {
        this.filters = {
            search: '',
            floor: '',
            room: '',
            type: '',
            family: '',
            supplier: '',
            user: ''
        };
    }

    /**
     * Get filtered items
     */
    getFilteredItems() {
        return this.items.filter(item => {
            // Search filter
            if (this.filters.search) {
                const searchString = `${item.designation} ${item.reference} ${item.barcode} ${item.user}`.toLowerCase();
                if (!searchString.includes(this.filters.search.toLowerCase())) {
                    return false;
                }
            }

            // Floor filter
            if (this.filters.floor && (!item.location || item.location.floor !== this.filters.floor)) {
                return false;
            }

            // Room filter
            if (this.filters.room && (!item.location || item.location.room !== this.filters.room)) {
                return false;
            }

            // Type filter
            if (this.filters.type && item.type !== this.filters.type) {
                return false;
            }

            // Family filter
            if (this.filters.family && item.family !== this.filters.family) {
                return false;
            }

            // Supplier filter
            if (this.filters.supplier && item.supplier !== this.filters.supplier) {
                return false;
            }

            // User filter
            if (this.filters.user && item.user !== this.filters.user) {
                return false;
            }

            return true;
        });
    }

    /**
     * Get unique values for a field
     */
    getUniqueValues(field) {
        const values = this.items.map(item => {
            if (field.includes('.')) {
                const parts = field.split('.');
                return item[parts[0]]?.[parts[1]];
            }
            return item[field];
        });
        return [...new Set(values)].filter(Boolean).sort();
    }

    /**
     * Get items by floor
     */
    getItemsByFloor(floor) {
        return this.items.filter(item => item.location && item.location.floor === floor);
    }

    /**
     * Get statistics
     */
    getStatistics() {
        const stats = {
            total: this.items.length,
            floors: this.getUniqueValues('location.floor').length,
            rooms: this.getUniqueValues('location.room').length,
            families: this.getUniqueValues('family').length,
            byFloor: {},
            byFamily: {},
            byType: {}
        };

        this.items.forEach(item => {
            const floor = item.location?.floor || 'Unknown';
            const family = item.family || 'Unknown';
            const type = item.type || 'Unknown';

            stats.byFloor[floor] = (stats.byFloor[floor] || 0) + 1;
            stats.byFamily[family] = (stats.byFamily[family] || 0) + 1;
            stats.byType[type] = (stats.byType[type] || 0) + 1;
        });

        return stats;
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.InventoryService = InventoryService;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InventoryService };
}
