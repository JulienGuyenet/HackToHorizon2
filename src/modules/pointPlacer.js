/**
 * Point Placer Tool
 * Interactive tool to place and configure points on the floor plan
 * For browser use only
 */

class PointPlacer {
    /**
     * Initialize the point placer
     * @param {string} containerId - ID of the container element
     * @param {string} imageUrl - URL of the floor plan image
     * @param {Array} items - Array of inventory items
     */
    constructor(containerId, imageUrl, items) {
        this.container = document.getElementById(containerId);
        this.imageUrl = imageUrl;
        this.items = items;
        this.currentItemIndex = 0;
        this.placedPoints = [];
        this.mode = 'place'; // 'place' or 'edit'
        
        this.init();
    }
    
    /**
     * Initialize the point placer
     */
    init() {
        this.createInterface();
        this.loadImage();
        this.updateCurrentItem();
        this.attachEventListeners();
    }
    
    /**
     * Create the UI interface
     */
    createInterface() {
        this.container.innerHTML = `
            <div class="placer-wrapper">
                <div class="placer-sidebar">
                    <h3>Placer les points</h3>
                    <div class="current-item-info" id="current-item-info"></div>
                    <div class="placer-controls">
                        <button id="prev-item-btn">◀ Précédent</button>
                        <button id="next-item-btn">Suivant ▶</button>
                        <button id="skip-item-btn">Passer</button>
                    </div>
                    <div class="placer-progress" id="placer-progress"></div>
                    <div class="placer-actions">
                        <button id="export-btn" class="btn-primary">Exporter la configuration</button>
                        <button id="import-btn" class="btn-secondary">Importer la configuration</button>
                        <input type="file" id="import-file" accept=".json" style="display:none" />
                    </div>
                    <div class="placed-items-list" id="placed-items-list">
                        <h4>Points placés</h4>
                        <div id="placed-items-container"></div>
                    </div>
                </div>
                <div class="placer-canvas-wrapper">
                    <div class="placer-instructions">
                        <p>Cliquez sur l'image pour placer le point de l'item actuel</p>
                        <p>Maintenez CTRL et cliquez pour déplacer un point existant</p>
                    </div>
                    <div class="placer-canvas" id="placer-canvas">
                        <img id="placer-image" src="${this.imageUrl}" alt="Floor Plan" />
                        <svg id="placer-overlay" class="placer-overlay"></svg>
                    </div>
                </div>
            </div>
        `;
        
        this.image = document.getElementById('placer-image');
        this.svg = document.getElementById('placer-overlay');
        this.currentItemInfo = document.getElementById('current-item-info');
        this.placerProgress = document.getElementById('placer-progress');
        this.placedItemsContainer = document.getElementById('placed-items-container');
    }
    
    /**
     * Load the floor plan image
     */
    loadImage() {
        this.image.addEventListener('load', () => {
            this.updateSVGSize();
            this.renderPoints();
        });
    }
    
    /**
     * Update SVG overlay size
     */
    updateSVGSize() {
        this.svg.setAttribute('width', this.image.offsetWidth);
        this.svg.setAttribute('height', this.image.offsetHeight);
        this.svg.setAttribute('viewBox', `0 0 ${this.image.offsetWidth} ${this.image.offsetHeight}`);
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Canvas click
        this.svg.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // Navigation buttons
        document.getElementById('prev-item-btn').addEventListener('click', () => this.previousItem());
        document.getElementById('next-item-btn').addEventListener('click', () => this.nextItem());
        document.getElementById('skip-item-btn').addEventListener('click', () => this.skipItem());
        
        // Export/Import buttons
        document.getElementById('export-btn').addEventListener('click', () => this.exportConfiguration());
        document.getElementById('import-btn').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        document.getElementById('import-file').addEventListener('change', (e) => this.importConfiguration(e));
        
        // Window resize
        window.addEventListener('resize', () => {
            this.updateSVGSize();
            this.renderPoints();
        });
    }
    
    /**
     * Handle canvas click
     * @param {Event} event - Click event
     */
    handleCanvasClick(event) {
        const rect = this.svg.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        
        if (event.ctrlKey || event.metaKey) {
            // Edit mode - select existing point
            this.selectPointAtPosition(x, y);
        } else {
            // Place mode - place current item
            this.placeCurrentItem(x, y);
        }
    }
    
    /**
     * Place the current item at coordinates
     * @param {number} x - X coordinate (0-1)
     * @param {number} y - Y coordinate (0-1)
     */
    placeCurrentItem(x, y) {
        if (this.currentItemIndex >= this.items.length) {
            return;
        }
        
        const currentItem = this.items[this.currentItemIndex];
        currentItem.coordinates = { x, y };
        
        this.placedPoints.push({
            itemId: currentItem.id,
            x: x,
            y: y
        });
        
        this.renderPoints();
        this.updatePlacedItemsList();
        this.nextItem();
    }
    
    /**
     * Select a point at position for editing
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    selectPointAtPosition(x, y) {
        const threshold = 0.02; // 2% of image size
        
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.coordinates.x !== null && item.coordinates.y !== null) {
                const dx = Math.abs(item.coordinates.x - x);
                const dy = Math.abs(item.coordinates.y - y);
                
                if (dx < threshold && dy < threshold) {
                    this.currentItemIndex = i;
                    this.updateCurrentItem();
                    this.renderPoints();
                    return;
                }
            }
        }
    }
    
    /**
     * Render all placed points
     */
    renderPoints() {
        this.svg.innerHTML = '';
        
        this.items.forEach((item, index) => {
            if (item.coordinates.x !== null && item.coordinates.y !== null) {
                this.renderPoint(item, index === this.currentItemIndex);
            }
        });
    }
    
    /**
     * Render a single point
     * @param {Object} item - Item to render
     * @param {boolean} isCurrent - Is this the current item
     */
    renderPoint(item, isCurrent) {
        const x = item.coordinates.x * this.image.offsetWidth;
        const y = item.coordinates.y * this.image.offsetHeight;
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', isCurrent ? '10' : '8');
        circle.setAttribute('fill', isCurrent ? '#ff6b6b' : '#4ecdc4');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        circle.classList.add('placed-point');
        if (isCurrent) circle.classList.add('current');
        
        // Add label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y - 15);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#333');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.textContent = item.location.room || item.id;
        
        this.svg.appendChild(circle);
        this.svg.appendChild(text);
    }
    
    /**
     * Update current item display
     */
    updateCurrentItem() {
        if (this.currentItemIndex >= this.items.length) {
            this.currentItemInfo.innerHTML = `
                <div class="completion-message">
                    <h4>✓ Tous les items sont placés!</h4>
                    <p>Vous pouvez exporter la configuration.</p>
                </div>
            `;
            return;
        }
        
        const item = this.items[this.currentItemIndex];
        const isPlaced = item.coordinates.x !== null;
        
        this.currentItemInfo.innerHTML = `
            <div class="item-card-mini ${isPlaced ? 'placed' : ''}">
                <div class="item-status">${isPlaced ? '✓ Placé' : 'À placer'}</div>
                <h4>${this.escapeHtml(item.designation)}</h4>
                <p><strong>Salle:</strong> ${this.escapeHtml(item.location.room || 'N/A')}</p>
                <p><strong>Étage:</strong> ${this.escapeHtml(item.location.floor || 'N/A')}</p>
                <p><strong>Utilisateur:</strong> ${this.escapeHtml(item.user)}</p>
            </div>
        `;
        
        this.updateProgress();
    }
    
    /**
     * Update progress display
     */
    updateProgress() {
        const placed = this.placedPoints.length;
        const total = this.items.length;
        const percentage = total > 0 ? Math.round((placed / total) * 100) : 0;
        
        this.placerProgress.innerHTML = `
            <div class="progress-info">
                <span>Progrès: ${placed} / ${total} (${percentage}%)</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
        `;
    }
    
    /**
     * Update placed items list
     */
    updatePlacedItemsList() {
        const placedItems = this.items.filter(item => item.coordinates.x !== null);
        
        const html = placedItems.map((item, index) => `
            <div class="placed-item-entry" data-index="${index}">
                <span class="placed-item-name">${this.escapeHtml(item.designation)}</span>
                <span class="placed-item-room">Salle ${this.escapeHtml(item.location.room || 'N/A')}</span>
            </div>
        `).join('');
        
        this.placedItemsContainer.innerHTML = html || '<p class="no-items">Aucun point placé</p>';
    }
    
    /**
     * Go to next item
     */
    nextItem() {
        if (this.currentItemIndex < this.items.length - 1) {
            this.currentItemIndex++;
            this.updateCurrentItem();
            this.renderPoints();
        } else if (this.currentItemIndex === this.items.length - 1) {
            this.currentItemIndex++;
            this.updateCurrentItem();
        }
    }
    
    /**
     * Go to previous item
     */
    previousItem() {
        if (this.currentItemIndex > 0) {
            this.currentItemIndex--;
            this.updateCurrentItem();
            this.renderPoints();
        }
    }
    
    /**
     * Skip current item without placing
     */
    skipItem() {
        this.nextItem();
    }
    
    /**
     * Export configuration as JSON
     */
    exportConfiguration() {
        const config = {
            version: '1.0',
            imageUrl: this.imageUrl,
            timestamp: new Date().toISOString(),
            coordinates: this.items.map(item => ({
                id: item.id,
                barcode: item.barcode,
                room: item.location.room,
                floor: item.location.floor,
                coordinates: item.coordinates
            }))
        };
        
        const json = JSON.stringify(config, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `floor-plan-coordinates-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    /**
     * Import configuration from JSON
     * @param {Event} event - File input change event
     */
    importConfiguration(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                this.applyConfiguration(config);
            } catch (error) {
                alert('Erreur lors de l\'import: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
    
    /**
     * Apply imported configuration
     * @param {Object} config - Configuration object
     */
    applyConfiguration(config) {
        if (!config.coordinates) {
            alert('Configuration invalide');
            return;
        }
        
        config.coordinates.forEach(coord => {
            const item = this.items.find(i => i.id === coord.id || i.barcode === coord.barcode);
            if (item) {
                item.coordinates = coord.coordinates;
            }
        });
        
        this.placedPoints = config.coordinates.filter(c => c.coordinates.x !== null);
        this.renderPoints();
        this.updatePlacedItemsList();
        this.updateProgress();
        
        alert(`${this.placedPoints.length} points importés avec succès!`);
    }
    
    /**
     * Escape HTML
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        if (text === null || text === undefined) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.PointPlacer = PointPlacer;
}
