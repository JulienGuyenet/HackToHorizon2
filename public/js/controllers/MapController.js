/**
 * MapController - Controls the interactive map page
 * Handles map display and interactions
 */

class MapController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
        this.interactiveMap = null;
        
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
            this.populateFloorFilter();
        } catch (error) {
            console.error('Error initializing map page:', error);
            alert('Erreur lors du chargement des données');
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
            if (index < 5 && item.coordinates.x === null) {
                item.coordinates = {
                    x: 0.2 + (index * 0.15),
                    y: 0.3 + (index * 0.1)
                };
            }
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        document.getElementById('load-map').addEventListener('click', () => this.loadMap());
    }

    /**
     * Populate floor filter
     */
    populateFloorFilter() {
        const floors = this.inventoryService.getUniqueValues('location.floor');
        const select = document.getElementById('map-floor-filter');
        
        floors.forEach(floor => {
            const option = document.createElement('option');
            option.value = floor;
            option.textContent = floor;
            select.appendChild(option);
        });
    }

    /**
     * Load and display map
     */
    loadMap() {
        const floor = document.getElementById('map-floor-filter').value;
        if (!floor) {
            alert('Veuillez sélectionner un étage');
            return;
        }

        const mapContainer = document.getElementById('map-container');
        const mapWrapper = document.querySelector('.map-container-wrapper');
        
        const imageName = this.floorImageMap[floor] || 'rdc.png';
        const imagePath = `/images/floors/${imageName}`;
        
        const floorItems = this.inventoryService.getItemsByFloor(floor);
        
        mapContainer.innerHTML = `
            <div class="floor-map-overlay">
                <div class="floor-info-bar">
                    <span class="floor-name">${this.escapeHtml(floor)}</span>
                    <button class="close-map" onclick="mapController.closeMap()">✕</button>
                </div>
                <div class="floor-map-content" id="interactive-map-wrapper">
                </div>
            </div>
        `;
        
        mapWrapper.classList.add('active');
        
        setTimeout(() => {
            try {
                this.interactiveMap = new InteractiveMap('interactive-map-wrapper', imagePath, floorItems);
                
                document.getElementById('interactive-map-wrapper').addEventListener('itemsSelected', (event) => {
                    console.log('Selected items:', event.detail.items);
                });
            } catch (error) {
                console.error('Error initializing interactive map:', error);
                this.handleImageError();
            }
        }, 100);
    }

    /**
     * Close map view
     */
    closeMap() {
        const mapContainer = document.getElementById('map-container');
        const mapWrapper = document.querySelector('.map-container-wrapper');
        
        if (this.interactiveMap && this.interactiveMap.tooltipElement) {
            this.interactiveMap.tooltipElement.remove();
        }
        this.interactiveMap = null;
        
        mapContainer.innerHTML = '';
        mapWrapper.classList.remove('active');
    }

    /**
     * Handle image loading errors
     */
    handleImageError() {
        const wrapper = document.getElementById('interactive-map-wrapper');
        if (!wrapper) return;
        
        wrapper.innerHTML = `
            <div class="empty-state" style="display: flex; color: #fff;">
                <h3>Image non disponible</h3>
                <p>Le plan pour cet étage n'est pas disponible</p>
            </div>
        `;
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
