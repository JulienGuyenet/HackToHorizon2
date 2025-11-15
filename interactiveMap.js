/**
 * Interactive Map Module
 * Handles the interactive floor plan with clickable points
 * For browser use only
 */

class InteractiveMap {
    /**
     * Initialize the interactive map
     * @param {string} containerId - ID of the container element
     * @param {string} imageUrl - URL of the floor plan image
     * @param {Array} items - Array of inventory items
     */
    constructor(containerId, imageUrl, items) {
        this.container = document.getElementById(containerId);
        this.imageUrl = imageUrl;
        this.items = items;
        this.currentFloor = null;
        this.selectedPoint = null;
        this.tooltipElement = null;
        
        this.init();
    }
    
    /**
     * Initialize the map
     */
    init() {
        this.createMapStructure();
        this.loadImage();
        this.createTooltip();
    }
    
    /**
     * Create the map HTML structure
     */
    createMapStructure() {
        this.container.innerHTML = `
            <div class="map-wrapper">
                <div class="map-container" id="map-container">
                    <img id="floor-plan-image" src="${this.imageUrl}" alt="Floor Plan" />
                    <svg id="map-overlay" class="map-overlay"></svg>
                </div>
            </div>
        `;
        
        this.mapContainer = document.getElementById('map-container');
        this.image = document.getElementById('floor-plan-image');
        this.svg = document.getElementById('map-overlay');
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
     * Update SVG overlay size to match image
     */
    updateSVGSize() {
        const rect = this.image.getBoundingClientRect();
        this.svg.setAttribute('width', this.image.offsetWidth);
        this.svg.setAttribute('height', this.image.offsetHeight);
        this.svg.setAttribute('viewBox', `0 0 ${this.image.offsetWidth} ${this.image.offsetHeight}`);
    }
    
    /**
     * Create tooltip element
     */
    createTooltip() {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.id = 'map-tooltip';
        this.tooltipElement.className = 'map-tooltip hidden';
        document.body.appendChild(this.tooltipElement);
    }
    
    /**
     * Render points on the map
     */
    renderPoints() {
        // Clear existing points
        this.svg.innerHTML = '';
        
        // Filter items based on current floor
        const visibleItems = this.currentFloor 
            ? this.items.filter(item => item.location.floor === this.currentFloor)
            : this.items;
        
        // Group items by room to avoid overlapping points
        const itemsByRoom = this.groupItemsByRoom(visibleItems);
        
        // Render points for each room
        Object.entries(itemsByRoom).forEach(([room, roomItems]) => {
            if (roomItems[0].coordinates.x !== null && roomItems[0].coordinates.y !== null) {
                this.renderPoint(roomItems);
            }
        });
    }
    
    /**
     * Group items by room
     * @param {Array} items - Items to group
     * @returns {Object} Items grouped by room
     */
    groupItemsByRoom(items) {
        const grouped = {};
        items.forEach(item => {
            const room = item.location.room || 'unknown';
            if (!grouped[room]) {
                grouped[room] = [];
            }
            grouped[room].push(item);
        });
        return grouped;
    }
    
    /**
     * Render a single point on the map
     * @param {Array} items - Items at this location
     */
    renderPoint(items) {
        const item = items[0]; // Use first item for coordinates
        const x = item.coordinates.x * this.image.offsetWidth;
        const y = item.coordinates.y * this.image.offsetHeight;
        
        // Create group for point
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('map-point');
        group.setAttribute('data-room', item.location.room || '');
        
        // Create outer circle (pulse effect)
        const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        outerCircle.setAttribute('cx', x);
        outerCircle.setAttribute('cy', y);
        outerCircle.setAttribute('r', '12');
        outerCircle.classList.add('point-outer');
        
        // Create inner circle
        const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        innerCircle.setAttribute('cx', x);
        innerCircle.setAttribute('cy', y);
        innerCircle.setAttribute('r', '8');
        innerCircle.classList.add('point-inner');
        
        // Create badge for item count if multiple items
        if (items.length > 1) {
            const badge = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            badge.setAttribute('cx', x + 8);
            badge.setAttribute('cy', y - 8);
            badge.setAttribute('r', '10');
            badge.classList.add('point-badge');
            
            const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            badgeText.setAttribute('x', x + 8);
            badgeText.setAttribute('y', y - 8);
            badgeText.setAttribute('text-anchor', 'middle');
            badgeText.setAttribute('dominant-baseline', 'central');
            badgeText.classList.add('point-badge-text');
            badgeText.textContent = items.length;
            
            group.appendChild(badge);
            group.appendChild(badgeText);
        }
        
        group.appendChild(outerCircle);
        group.appendChild(innerCircle);
        
        // Add event listeners
        group.addEventListener('mouseenter', (e) => this.showTooltip(e, items));
        group.addEventListener('mouseleave', () => this.hideTooltip());
        group.addEventListener('click', (e) => this.handlePointClick(e, items));
        
        this.svg.appendChild(group);
    }
    
    /**
     * Show tooltip for items
     * @param {Event} event - Mouse event
     * @param {Array} items - Items to show in tooltip
     */
    showTooltip(event, items) {
        const tooltipContent = this.generateTooltipContent(items);
        this.tooltipElement.innerHTML = tooltipContent;
        this.tooltipElement.classList.remove('hidden');
        
        // Position tooltip
        const rect = this.container.getBoundingClientRect();
        this.tooltipElement.style.left = event.pageX + 10 + 'px';
        this.tooltipElement.style.top = event.pageY + 10 + 'px';
    }
    
    /**
     * Hide tooltip
     */
    hideTooltip() {
        this.tooltipElement.classList.add('hidden');
    }
    
    /**
     * Generate tooltip content HTML
     * @param {Array} items - Items to display
     * @returns {string} HTML string
     */
    generateTooltipContent(items) {
        if (items.length === 1) {
            const item = items[0];
            return `
                <div class="tooltip-header">
                    <strong>${this.escapeHtml(item.designation)}</strong>
                </div>
                <div class="tooltip-body">
                    <div><strong>Type:</strong> ${this.escapeHtml(item.type)}</div>
                    <div><strong>Utilisateur:</strong> ${this.escapeHtml(item.user)}</div>
                    <div><strong>Salle:</strong> ${this.escapeHtml(item.location.room || 'N/A')}</div>
                    <div><strong>Code barre:</strong> ${item.barcode || 'N/A'}</div>
                </div>
            `;
        } else {
            const itemList = items.map(item => 
                `<li>${this.escapeHtml(item.designation)} (${this.escapeHtml(item.user)})</li>`
            ).join('');
            
            return `
                <div class="tooltip-header">
                    <strong>Salle ${this.escapeHtml(items[0].location.room || 'N/A')}</strong>
                </div>
                <div class="tooltip-body">
                    <div><strong>${items.length} items:</strong></div>
                    <ul class="tooltip-item-list">
                        ${itemList}
                    </ul>
                </div>
            `;
        }
    }
    
    /**
     * Handle point click
     * @param {Event} event - Click event
     * @param {Array} items - Items at this point
     */
    handlePointClick(event, items) {
        event.stopPropagation();
        
        // Dispatch custom event for other components to handle
        const customEvent = new CustomEvent('itemsSelected', {
            detail: { items: items }
        });
        this.container.dispatchEvent(customEvent);
        
        // Highlight selected point
        this.highlightPoint(event.target.closest('.map-point'));
    }
    
    /**
     * Highlight selected point
     * @param {Element} pointElement - Point element to highlight
     */
    highlightPoint(pointElement) {
        // Remove previous highlight
        if (this.selectedPoint) {
            this.selectedPoint.classList.remove('selected');
        }
        
        // Add highlight to new point
        if (pointElement) {
            pointElement.classList.add('selected');
            this.selectedPoint = pointElement;
        }
    }
    
    /**
     * Set current floor filter
     * @param {string} floor - Floor to display
     */
    setFloor(floor) {
        this.currentFloor = floor;
        this.renderPoints();
    }
    
    /**
     * Update item coordinates
     * @param {Array} items - Items with updated coordinates
     */
    updateItemCoordinates(items) {
        this.items = items;
        this.renderPoints();
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
    window.InteractiveMap = InteractiveMap;
}
