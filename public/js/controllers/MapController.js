/**
 * MapController - Controls the interactive map page
 * Handles map display and interactions with non-fullscreen layout
 */

class MapController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
        this.interactiveMap = null;
        this.currentFloor = null;
        this.currentFilters = {
            floor: '',
            room: '',
            type: ''
        };
        
        this.floorImageMap = {
            'rdc': 'rdc.png',
            '1er etage': '1.png',
            '2eme etage': '2.png',
            '3eme etage': '3.png',
            '4eme etage': '4.png'
        };
    }

    /**
     * Initialize the page
     */
    async init() {
        try {
            await this.loadData();
            this.setupEventListeners();
            this.populateFilters();
            // Auto-load RDC (ground floor) by default
            this.autoLoadRDC();
        } catch (error) {
            console.error('Error initializing map page:', error);
            // Still load RDC even if API fails
            this.autoLoadRDC();
        }
    }

    /**
     * Load data
     */
    async loadData() {
        await this.inventoryService.loadItems();
        this.addSampleCoordinates();
        console.log(`Loaded ${this.inventoryService.getAllItems().length} items`);
    }

    /**
     * Add sample coordinates for demo
     */
    addSampleCoordinates() {
        const items = this.inventoryService.getAllItems();
        items.forEach((item, index) => {
            if (!item.coordinates) {
                item.coordinates = { x: null, y: null };
            }
            // Add sample coordinates to some items
            if (index < 10 && item.coordinates.x === null) {
                item.coordinates = {
                    x: 0.15 + (index % 5) * 0.15,
                    y: 0.25 + Math.floor(index / 5) * 0.3
                };
            }
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Floor filter change - instant map update
        document.getElementById('map-floor-filter').addEventListener('change', (e) => {
            this.currentFilters.floor = e.target.value;
            this.applyFiltersInstantly();
        });

        // Room filter change - instant update
        document.getElementById('map-room-filter').addEventListener('change', (e) => {
            this.currentFilters.room = e.target.value;
            this.applyFiltersInstantly();
        });

        // Type filter change - instant update
        document.getElementById('map-type-filter').addEventListener('change', (e) => {
            this.currentFilters.type = e.target.value;
            this.applyFiltersInstantly();
        });

        // Apply filters button - manual trigger
        document.getElementById('apply-map-filters').addEventListener('click', () => {
            this.applyFiltersInstantly();
        });

        // Reset filters button
        document.getElementById('reset-map-filters').addEventListener('click', () => {
            this.resetFilters();
        });

        // Add furniture button
        document.getElementById('add-furniture-btn').addEventListener('click', () => {
            this.showAddFurnitureDialog();
        });
    }

    /**
     * Populate filter dropdowns
     */
    populateFilters() {
        // Populate floor filter - RDC is already in HTML, add others
        const floors = this.inventoryService.getUniqueValues('location.floor');
        const floorSelect = document.getElementById('map-floor-filter');
        
        // Add floors from API (skip RDC if it's already there)
        floors.forEach(floor => {
            if (floor.toLowerCase() !== 'rdc') {
                const option = document.createElement('option');
                option.value = floor;
                option.textContent = floor;
                floorSelect.appendChild(option);
            }
        });

        // Populate room filter
        const rooms = this.inventoryService.getUniqueValues('location.room');
        const roomSelect = document.getElementById('map-room-filter');
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room;
            option.textContent = room;
            roomSelect.appendChild(option);
        });

        // Populate type filter
        const types = this.inventoryService.getUniqueValues('type');
        const typeSelect = document.getElementById('map-type-filter');
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeSelect.appendChild(option);
        });
    }

    /**
     * Auto-load RDC (ground floor) by default
     */
    autoLoadRDC() {
        const floorSelect = document.getElementById('map-floor-filter');
        
        // Try to find RDC in the options
        let rdcIndex = -1;
        for (let i = 0; i < floorSelect.options.length; i++) {
            if (floorSelect.options[i].value.toLowerCase() === 'rdc') {
                rdcIndex = i;
                break;
            }
        }
        
        // If RDC exists in options, select it
        if (rdcIndex > 0) {
            floorSelect.selectedIndex = rdcIndex;
            this.currentFilters.floor = floorSelect.value;
        } else {
            // Otherwise, default to 'rdc' even if not in API data
            this.currentFilters.floor = 'rdc';
        }
        
        // Load the map
        this.applyFiltersInstantly();
    }

    /**
     * Apply filters instantly (on change, not on button click)
     */
    applyFiltersInstantly() {
        const floor = this.currentFilters.floor || 'rdc'; // Default to RDC
        this.currentFloor = floor;
        this.loadMap(floor);
    }

    /**
     * Reset all filters to RDC
     */
    resetFilters() {
        document.getElementById('map-room-filter').selectedIndex = 0;
        document.getElementById('map-type-filter').selectedIndex = 0;
        
        // Reset floor to RDC
        const floorSelect = document.getElementById('map-floor-filter');
        let rdcIndex = -1;
        for (let i = 0; i < floorSelect.options.length; i++) {
            if (floorSelect.options[i].value.toLowerCase() === 'rdc') {
                rdcIndex = i;
                break;
            }
        }
        
        if (rdcIndex > 0) {
            floorSelect.selectedIndex = rdcIndex;
            this.currentFilters.floor = floorSelect.value;
        } else {
            floorSelect.selectedIndex = 0;
            this.currentFilters.floor = 'rdc';
        }
        
        this.currentFilters.room = '';
        this.currentFilters.type = '';

        // Reload RDC
        this.applyFiltersInstantly();
    }

    /**
     * Load and display map for a floor
     */
    loadMap(floor) {
        const mapContainer = document.getElementById('map-container');
        
        const imageName = this.floorImageMap[floor] || 'rdc.png';
        const imagePath = `/images/floors/${imageName}`;
        
        // Get filtered items
        let items = this.inventoryService.getItemsByFloor(floor);
        
        // Apply additional filters
        if (this.currentFilters.room) {
            items = items.filter(item => item.location.room === this.currentFilters.room);
        }
        if (this.currentFilters.type) {
            items = items.filter(item => item.type === this.currentFilters.type);
        }
        
        // Clear previous map
        if (this.interactiveMap && this.interactiveMap.tooltipElement) {
            this.interactiveMap.tooltipElement.remove();
        }
        
        mapContainer.innerHTML = '';
        
        setTimeout(() => {
            try {
                this.interactiveMap = new InteractiveMap('map-container', imagePath, items);
                
                document.getElementById('map-container').addEventListener('itemsSelected', (event) => {
                    console.log('Selected items:', event.detail.items);
                    this.showItemDetails(event.detail.items);
                });
            } catch (error) {
                console.error('Error initializing interactive map:', error);
                this.handleImageError();
            }
        }, 100);
    }

    /**
     * Show item details (placeholder for future implementation)
     */
    showItemDetails(items) {
        console.log('Show details for:', items);
        // TODO: Implement item details modal or panel
    }

    /**
     * Handle image loading errors
     */
    handleImageError() {
        const mapContainer = document.getElementById('map-container');
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <h3 style="color: #666;">Image non disponible</h3>
                <p>Le plan pour cet étage n'est pas disponible</p>
            </div>
        `;
    }

    /**
     * Show dialog to add furniture to map
     */
    showAddFurnitureDialog() {
        if (!this.currentFloor) {
            alert('Veuillez d\'abord sélectionner un étage');
            return;
        }

        // Create a simple modal dialog
        const modalHtml = `
            <div class="modal-overlay" id="add-furniture-modal">
                <div class="modal-content">
                    <h3>Ajouter un meuble sur la carte</h3>
                    <p>Sélectionnez un meuble à placer sur l'étage ${this.escapeHtml(this.currentFloor)}</p>
                    
                    <div class="form-group">
                        <label for="furniture-select">Meuble</label>
                        <select id="furniture-select" class="form-control">
                            <option value="">Sélectionner un meuble</option>
                        </select>
                    </div>
                    
                    <div class="modal-info">
                        <p><strong>Instructions:</strong></p>
                        <ol>
                            <li>Sélectionnez un meuble dans la liste</li>
                            <li>Cliquez sur la carte pour placer le meuble</li>
                            <li>Les coordonnées seront enregistrées automatiquement</li>
                        </ol>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="mapController.closeAddFurnitureDialog()">Annuler</button>
                        <button class="btn btn-primary" id="confirm-furniture-select">Sélectionner</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHtml;
        document.body.appendChild(modalDiv.firstElementChild);
        
        // Populate furniture list
        this.populateFurnitureList();
        
        // Setup confirm button
        document.getElementById('confirm-furniture-select').addEventListener('click', () => {
            this.enableFurniturePlacement();
        });
    }

    /**
     * Populate furniture list in the modal
     */
    populateFurnitureList() {
        const select = document.getElementById('furniture-select');
        const allItems = this.inventoryService.getAllItems();
        
        // Get items without coordinates or for current floor
        const availableItems = allItems.filter(item => 
            !item.coordinates || item.coordinates.x === null || item.location.floor === this.currentFloor
        );
        
        availableItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id || item.barcode;
            option.textContent = `${item.designation} (${item.location.room || 'Sans salle'})`;
            select.appendChild(option);
        });
    }

    /**
     * Enable furniture placement mode
     */
    enableFurniturePlacement() {
        const selectedId = document.getElementById('furniture-select').value;
        if (!selectedId) {
            alert('Veuillez sélectionner un meuble');
            return;
        }
        
        this.closeAddFurnitureDialog();
        
        // Enable click-to-place mode
        alert('Mode placement activé. Cliquez sur la carte pour placer le meuble.\n\n(Cette fonctionnalité sera complètement implémentée avec la sauvegarde dans l\'API)');
        
        // TODO: Implement actual placement logic with map click handler
        // This would require:
        // 1. Add click handler to map
        // 2. Convert click coordinates to relative positions
        // 3. Update item coordinates
        // 4. Save to API
        // 5. Refresh map
    }

    /**
     * Close add furniture dialog
     */
    closeAddFurnitureDialog() {
        const modal = document.getElementById('add-furniture-modal');
        if (modal) {
            modal.remove();
        }
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.MapController = MapController;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MapController };
}
