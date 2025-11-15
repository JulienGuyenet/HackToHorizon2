/**
 * InventoryController - Controls the inventory page
 * Handles UI interactions and data display
 */

class InventoryController {
    constructor(inventoryService, i18nService) {
        this.inventoryService = inventoryService;
        this.i18nService = i18nService;
        this.container = document.getElementById('items-container');
    }

    /**
     * Initialize the page
     */
    async init() {
        try {
            // i18n is already initialized by Application
            this.i18nService.updatePageTranslations();
            
            await this.loadData();
            this.setupEventListeners();
            this.populateFilters();
            this.render();
        } catch (error) {
            console.error('Error initializing inventory page:', error);
            this.showError(this.i18nService.translate('errors.loadingData'));
        }
    }

    /**
     * Load data
     */
    async loadData() {
        await this.inventoryService.loadItems();
        console.log(`Loaded ${this.inventoryService.getAllItems().length} items`);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        document.getElementById('apply-filters').addEventListener('click', () => this.applyFilters());
        document.getElementById('reset-filters').addEventListener('click', () => this.resetFilters());
        document.getElementById('search-input').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.applyFilters();
        });
    }

    /**
     * Populate filter dropdowns
     */
    populateFilters() {
        this.populateSelect('floor-filter', this.inventoryService.getUniqueValues('location.floor'));
        this.populateSelect('room-filter', this.inventoryService.getUniqueValues('location.room'));
        this.populateSelect('type-filter', this.inventoryService.getUniqueValues('type'));
        this.populateSelect('family-filter', this.inventoryService.getUniqueValues('family'));
        this.populateSelect('supplier-filter', this.inventoryService.getUniqueValues('supplier'));
        this.populateSelect('user-filter', this.inventoryService.getUniqueValues('user'));
    }

    /**
     * Populate a select element
     */
    populateSelect(selectId, values) {
        const select = document.getElementById(selectId);
        values.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    }

    /**
     * Apply filters
     */
    applyFilters() {
        const filters = {
            search: document.getElementById('search-input').value,
            floor: document.getElementById('floor-filter').value,
            room: document.getElementById('room-filter').value,
            type: document.getElementById('type-filter').value,
            family: document.getElementById('family-filter').value,
            supplier: document.getElementById('supplier-filter').value,
            user: document.getElementById('user-filter').value
        };

        this.inventoryService.setFilters(filters);
        this.render();
    }

    /**
     * Reset filters
     */
    resetFilters() {
        document.getElementById('search-input').value = '';
        document.getElementById('floor-filter').value = '';
        document.getElementById('room-filter').value = '';
        document.getElementById('type-filter').value = '';
        document.getElementById('family-filter').value = '';
        document.getElementById('supplier-filter').value = '';
        document.getElementById('user-filter').value = '';
        
        this.inventoryService.clearFilters();
        this.render();
    }

    /**
     * Render items
     */
    render() {
        const items = this.inventoryService.getFilteredItems();
        
        if (items.length === 0) {
            this.renderEmptyState();
            return;
        }

        const html = `
            <div style="margin-bottom: 15px; color: #495057;">
                <strong>${items.length}</strong> ${this.i18nService.translate('inventory.itemsFound')}
            </div>
            <div class="items-grid">
                ${items.map(item => this.generateItemCard(item)).join('')}
            </div>
        `;
        
        this.container.innerHTML = html;
    }

    /**
     * Render empty state
     */
    renderEmptyState() {
        this.container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3 data-i18n="inventory.noResults">${this.i18nService.translate('inventory.noResults')}</h3>
                <p data-i18n="inventory.noResultsHint">${this.i18nService.translate('inventory.noResultsHint')}</p>
            </div>
        `;
    }

    /**
     * Generate item card HTML
     */
    generateItemCard(item) {
        const userRow = item.user ? `
            <div class="item-detail">
                <span class="label">${this.i18nService.translate('inventory.user')}:</span>
                <span class="value">${this.escapeHtml(item.user)}</span>
            </div>
        ` : '';
        
        return `
            <div class="item-card">
                <div class="item-header">
                    <h3 class="item-designation">${this.escapeHtml(item.designation)}</h3>
                    <span class="item-barcode">#${this.escapeHtml(item.barcode)}</span>
                </div>
                <div class="item-body">
                    <div class="item-detail">
                        <span class="label">${this.i18nService.translate('inventory.reference')}:</span>
                        <span class="value">${this.escapeHtml(item.reference)}</span>
                    </div>
                    <div class="item-detail">
                        <span class="label">${this.i18nService.translate('inventory.type')}:</span>
                        <span class="value">${this.escapeHtml(item.type)}</span>
                    </div>
                    <div class="item-detail">
                        <span class="label">${this.i18nService.translate('inventory.family')}:</span>
                        <span class="value">${this.escapeHtml(item.family)}</span>
                    </div>
                    ${userRow}
                    <div class="item-detail">
                        <span class="label">${this.i18nService.translate('inventory.location')}:</span>
                        <span class="value">${this.escapeHtml(item.location.floor || 'N/A')} - ${this.i18nService.translate('inventory.room')} ${this.escapeHtml(item.location.room || 'N/A')}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Show error message
     */
    showError(message) {
        this.container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>${this.i18nService.translate('errors.generic')}</h3>
                <p>${this.escapeHtml(message)}</p>
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
    window.InventoryController = InventoryController;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InventoryController };
}
