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
            // Auto-load first floor if available
            this.autoLoadFirstFloor();
        } catch (error) {
            console.error('Error initializing map page:', error);
            // Don't show alert on API error, just log it
            const mapContainer = document.getElementById('map-container');
            mapContainer.innerHTML = `
                <div class="map-placeholder">
                    <p>Impossible de charger les données. Veuillez vérifier la connexion à l'API.</p>
                </div>
            `;
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
        // Floor filter change
        document.getElementById('map-floor-filter').addEventListener('change', (e) => {
            this.currentFilters.floor = e.target.value;
            this.applyFilters();
        });

        // Room filter change
        document.getElementById('map-room-filter').addEventListener('change', (e) => {
            this.currentFilters.room = e.target.value;
        });

        // Type filter change
        document.getElementById('map-type-filter').addEventListener('change', (e) => {
            this.currentFilters.type = e.target.value;
        });

        // Apply filters button
        document.getElementById('apply-map-filters').addEventListener('click', () => {
            this.applyFilters();
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
        // Populate floor filter
        const floors = this.inventoryService.getUniqueValues('location.floor');
        const floorSelect = document.getElementById('map-floor-filter');
        floors.forEach(floor => {
            const option = document.createElement('option');
            option.value = floor;
            option.textContent = floor;
            floorSelect.appendChild(option);
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
     * Auto-load the first available floor
     */
    autoLoadFirstFloor() {
        const floorSelect = document.getElementById('map-floor-filter');
        if (floorSelect.options.length > 1) {
            floorSelect.selectedIndex = 1;
            this.currentFilters.floor = floorSelect.value;
            this.applyFilters();
        }
    }

    /**
     * Apply filters and reload map
     */
    applyFilters() {
        const floor = this.currentFilters.floor;
        if (!floor) {
            const mapContainer = document.getElementById('map-container');
            mapContainer.innerHTML = `
                <div class="map-placeholder">
                    <p>Sélectionnez un étage pour afficher la carte</p>
                </div>
            `;
            return;
        }

        this.currentFloor = floor;
        this.loadMap(floor);
    }

    /**
     * Reset all filters
     */
    resetFilters() {
        document.getElementById('map-floor-filter').selectedIndex = 0;
        document.getElementById('map-room-filter').selectedIndex = 0;
        document.getElementById('map-type-filter').selectedIndex = 0;
        
        this.currentFilters = {
            floor: '',
            room: '',
            type: ''
        };

        const mapContainer = document.getElementById('map-container');
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <p>Sélectionnez un étage pour afficher la carte</p>
            </div>
        `;
    }

    /**
     * Load and display map for a floor
     */
    loadMap(floor) {
        const mapContainer = document.getElementById('map-container');
        
        const imageName = this.floorImageMap[floor] || 'rdc.png';
        const imagePath = `/assets/images/floors/${imageName}`;
        
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
