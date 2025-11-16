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
        
        // Repositories will be injected by Application.js
        this.furnitureRepository = null;
        this.locationRepository = null;
    }

    /**
     * Initialize the page
     */
    async init() {
        // Always setup event listeners first, even if data loading fails
        this.setupEventListeners();
        
        try {
            await this.loadData();
        } catch (error) {
            console.error('Error loading inventory data:', error);
            // Continue with initialization even if API fails
        }
        
        // Always populate filters (even with empty data)
        this.populateFilters();
        
        // Auto-load RDC (ground floor) by default
        this.autoLoadRDC();
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
        // Hamburger menu toggle
        const filterToggleBtn = document.getElementById('filter-toggle-btn');
        const filterPanel = document.getElementById('map-filter-panel');
        
        if (filterToggleBtn && filterPanel) {
            filterToggleBtn.addEventListener('click', () => {
                filterToggleBtn.classList.toggle('active');
                filterPanel.classList.toggle('collapsed');
            });
        }

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
            items = items.filter(item => item.location && item.location.room === this.currentFilters.room);
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
                    <p>Sélectionnez un meuble et son emplacement pour l'étage ${this.escapeHtml(this.currentFloor)}</p>
                    
                    <div class="form-group">
                        <label for="furniture-select">Meuble</label>
                        <select id="furniture-select" class="form-control">
                            <option value="">Sélectionner un meuble</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="location-room-select">Emplacement (Salle)</label>
                        <select id="location-room-select" class="form-control">
                            <option value="">Sélectionner une salle</option>
                        </select>
                    </div>
                    
                    <div class="modal-info">
                        <p><strong>Instructions:</strong></p>
                        <ol>
                            <li>Sélectionnez un meuble dans la liste</li>
                            <li>Choisissez l'emplacement (salle) où placer le meuble</li>
                            <li>Cliquez sur la carte pour placer le meuble</li>
                            <li>Les coordonnées seront enregistrées automatiquement</li>
                        </ol>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-secondary" id="cancel-furniture-select">Annuler</button>
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
        
        // Populate location/room list for current floor
        this.populateLocationList();
        
        // Setup cancel button
        document.getElementById('cancel-furniture-select').addEventListener('click', () => {
            this.closeAddFurnitureDialog();
        });
        
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
            !item.coordinates || item.coordinates.x === null || item.location?.floor === this.currentFloor
        );
        
        availableItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id || item.barcode;
            option.textContent = `${item.designation} (${item.location?.room || 'Sans salle'})`;
            select.appendChild(option);
        });
    }

    /**
     * Populate location/room list in the modal
     */
    populateLocationList() {
        const select = document.getElementById('location-room-select');
        const allItems = this.inventoryService.getAllItems();
        
        // Get unique rooms for the current floor
        const roomsSet = new Set();
        allItems.forEach(item => {
            if (item.location && item.location.floor === this.currentFloor && item.location.room) {
                roomsSet.add(item.location.room);
            }
        });
        
        // Convert to sorted array
        const rooms = Array.from(roomsSet).sort();
        
        // Populate select options
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room;
            option.textContent = room;
            select.appendChild(option);
        });
    }

    /**
     * Enable furniture placement mode
     */
    enableFurniturePlacement() {
        const selectedId = document.getElementById('furniture-select').value;
        const selectedRoom = document.getElementById('location-room-select').value;
        
        if (!selectedId) {
            alert('Veuillez sélectionner un meuble');
            return;
        }
        
        if (!selectedRoom) {
            alert('Veuillez sélectionner un emplacement (salle)');
            return;
        }
        
        // Find the selected item
        const allItems = this.inventoryService.getAllItems();
        const selectedItem = allItems.find(item => 
            (item.id && item.id.toString() === selectedId) || 
            (item.barcode && item.barcode.toString() === selectedId)
        );
        
        if (!selectedItem) {
            alert('Meuble non trouvé');
            return;
        }
        
        this.closeAddFurnitureDialog();
        
        // Enable placement mode with selected location
        this.startPlacementMode(selectedItem, selectedRoom);
    }

    /**
     * Start furniture placement mode
     */
    startPlacementMode(item, selectedRoom) {
        // Store the item to place and selected room
        this.itemToPlace = item;
        this.selectedRoom = selectedRoom;
        
        // Add visual feedback
        const mapContainer = document.getElementById('map-container');
        mapContainer.style.cursor = 'crosshair';
        
        // Add overlay message
        const overlayMessage = document.createElement('div');
        overlayMessage.id = 'placement-overlay';
        overlayMessage.className = 'placement-overlay';
        overlayMessage.innerHTML = `
            <div class="placement-message">
                <p><strong>Mode placement actif</strong></p>
                <p>Cliquez sur la carte pour placer: <em>${this.escapeHtml(item.designation)}</em></p>
                <p>Emplacement: <em>${this.escapeHtml(selectedRoom)}</em></p>
                <button class="btn btn-secondary btn-sm" id="cancel-placement">Annuler</button>
            </div>
        `;
        mapContainer.appendChild(overlayMessage);
        
        // Add click handler to map for placement
        this.placementClickHandler = (e) => this.handleMapClick(e);
        mapContainer.addEventListener('click', this.placementClickHandler);
        
        // Add cancel button handler
        document.getElementById('cancel-placement').addEventListener('click', (e) => {
            e.stopPropagation();
            this.cancelPlacementMode();
        });
    }

    /**
     * Handle map click for furniture placement
     */
    async handleMapClick(event) {
        const mapContainer = document.getElementById('map-container');
        const interactiveMapContainer = document.getElementById('interactive-map-container');
        const image = document.getElementById('floor-plan-image');
        
        if (!image || !interactiveMapContainer) {
            console.error('Map elements not found');
            return;
        }
        
        // Get the click position relative to the image
        const rect = image.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        // Convert to relative coordinates (0-1)
        const relativeX = clickX / rect.width;
        const relativeY = clickY / rect.height;
        
        // Validate coordinates are within bounds
        if (relativeX < 0 || relativeX > 1 || relativeY < 0 || relativeY > 1) {
            console.log('Click outside map bounds');
            return;
        }
        
        // Update item coordinates
        this.itemToPlace.coordinates = {
            x: relativeX,
            y: relativeY
        };
        
        // Cancel placement mode
        this.cancelPlacementMode();
        
        // Show loading message
        this.showInfoMessage(`Placement de "${this.itemToPlace.designation}" en cours...`);
        
        try {
            // Call API to assign location
            await this.assignFurnitureLocation(this.itemToPlace, relativeX, relativeY);
            
            // Refresh the map to show the new placement
            await this.inventoryService.loadItems();
            this.applyFiltersInstantly();
            
            // Show success message
            this.showSuccessMessage(`Meuble "${this.itemToPlace.designation}" placé avec succès!`);
        } catch (error) {
            console.error('Error placing furniture:', error);
            this.showErrorMessage(`Erreur lors du placement: ${error.message}`);
            // Revert coordinates
            this.itemToPlace.coordinates = { x: null, y: null };
        }
    }

    /**
     * Cancel placement mode
     */
    cancelPlacementMode() {
        const mapContainer = document.getElementById('map-container');
        mapContainer.style.cursor = 'default';
        
        // Remove overlay message
        const overlayMessage = document.getElementById('placement-overlay');
        if (overlayMessage) {
            overlayMessage.remove();
        }
        
        // Remove click handler
        if (this.placementClickHandler) {
            mapContainer.removeEventListener('click', this.placementClickHandler);
            this.placementClickHandler = null;
        }
        
        // Clear item to place and selected room
        this.itemToPlace = null;
        this.selectedRoom = null;
    }

    /**
     * Show success message
     */
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            successDiv.classList.remove('show');
            setTimeout(() => {
                successDiv.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            errorDiv.classList.remove('show');
            setTimeout(() => {
                errorDiv.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Show info message
     */
    showInfoMessage(message) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info-message';
        infoDiv.textContent = message;
        document.body.appendChild(infoDiv);
        
        setTimeout(() => {
            infoDiv.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            infoDiv.classList.remove('show');
            setTimeout(() => {
                infoDiv.remove();
            }, 300);
        }, 1500);
    }

    /**
     * Assign furniture to location via API
     */
    async assignFurnitureLocation(item, x, y) {
        if (!this.furnitureRepository || !this.locationRepository) {
            throw new Error('Repositories not available');
        }

        try {
            // Use the selected room from the modal instead of the item's location
            const targetRoom = this.selectedRoom || item.location?.room || 'Unknown';
            
            // Get all locations
            const locations = await this.locationRepository.getAll();
            
            // Try to find an existing location for this floor and room
            let targetLocation = locations.find(loc => 
                loc.floor === this.currentFloor && 
                loc.room === targetRoom
            );
            
            if (!targetLocation) {
                // Create a new location
                const locationData = {
                    floor: this.currentFloor,
                    room: targetRoom,
                    building: item.location?.building || 'VIOTTE'
                };
                
                targetLocation = await this.locationRepository.create(locationData);
                console.log(`Created new location with ID: ${targetLocation.id}`);
            } else {
                console.log(`Using existing location with ID: ${targetLocation.id}`);
            }
            
            // Assign the location to the furniture
            await this.furnitureRepository.assignLocation(item.id, targetLocation.id);
            
            console.log(`Successfully assigned furniture ${item.id} to location ${targetLocation.id}`);
        } catch (error) {
            console.error('Error in assignFurnitureLocation:', error);
            throw error;
        }
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
