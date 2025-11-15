/**
 * HTML Generator Module
 * Functions to generate HTML elements for inventory items
 */

/**
 * Generate HTML for a single item card
 * @param {Object} item - Inventory item
 * @returns {string} HTML string for item card
 */
function generateItemCard(item) {
    return `
    <div class="item-card" data-item-id="${item.id}" data-floor="${item.location.floor || ''}" data-room="${item.location.room || ''}">
        <div class="item-header">
            <h3 class="item-designation">${escapeHtml(item.designation)}</h3>
            <span class="item-barcode">#${item.barcode || 'N/A'}</span>
        </div>
        <div class="item-body">
            <div class="item-detail">
                <span class="label">Référence:</span>
                <span class="value">${escapeHtml(item.reference)}</span>
            </div>
            <div class="item-detail">
                <span class="label">Type:</span>
                <span class="value">${escapeHtml(item.type)}</span>
            </div>
            <div class="item-detail">
                <span class="label">Famille:</span>
                <span class="value">${escapeHtml(item.family)}</span>
            </div>
            <div class="item-detail">
                <span class="label">Utilisateur:</span>
                <span class="value">${escapeHtml(item.user)}</span>
            </div>
            <div class="item-detail">
                <span class="label">Localisation:</span>
                <span class="value">${escapeHtml(item.location.floor || 'N/A')} - Salle ${escapeHtml(item.location.room || 'N/A')}</span>
            </div>
            ${item.information ? `
            <div class="item-detail item-info">
                <span class="label">Informations:</span>
                <span class="value">${escapeHtml(item.information)}</span>
            </div>
            ` : ''}
        </div>
    </div>`;
}

/**
 * Generate quick info tooltip HTML for an item
 * @param {Object} item - Inventory item
 * @returns {string} HTML string for tooltip
 */
function generateQuickInfo(item) {
    return `
    <div class="quick-info-tooltip">
        <div class="tooltip-header">
            <strong>${escapeHtml(item.designation)}</strong>
        </div>
        <div class="tooltip-body">
            <div class="tooltip-row">
                <span class="tooltip-label">Type:</span>
                <span class="tooltip-value">${escapeHtml(item.type)}</span>
            </div>
            <div class="tooltip-row">
                <span class="tooltip-label">Utilisateur:</span>
                <span class="tooltip-value">${escapeHtml(item.user)}</span>
            </div>
            <div class="tooltip-row">
                <span class="tooltip-label">Salle:</span>
                <span class="tooltip-value">${escapeHtml(item.location.room || 'N/A')}</span>
            </div>
            <div class="tooltip-row">
                <span class="tooltip-label">Code barre:</span>
                <span class="tooltip-value">${item.barcode || 'N/A'}</span>
            </div>
        </div>
    </div>`;
}

/**
 * Generate HTML for a list of items
 * @param {Array} items - Array of inventory items
 * @param {string} title - Title for the list
 * @returns {string} HTML string for item list
 */
function generateItemList(items, title = 'Liste des items') {
    const itemCards = items.map(item => generateItemCard(item)).join('\n');
    
    return `
    <div class="items-container">
        <h2 class="list-title">${escapeHtml(title)}</h2>
        <div class="items-count">Total: ${items.length} item(s)</div>
        <div class="items-grid">
            ${itemCards}
        </div>
    </div>`;
}

/**
 * Generate HTML for floor selector
 * @param {Array} floors - Array of floor names
 * @returns {string} HTML string for floor selector
 */
function generateFloorSelector(floors) {
    const options = floors.map(floor => 
        `<option value="${escapeHtml(floor)}">${escapeHtml(floor)}</option>`
    ).join('\n');
    
    return `
    <div class="floor-selector">
        <label for="floor-select">Sélectionner un étage:</label>
        <select id="floor-select">
            <option value="">Tous les étages</option>
            ${options}
        </select>
    </div>`;
}

/**
 * Generate HTML for room selector
 * @param {Array} rooms - Array of room numbers
 * @returns {string} HTML string for room selector
 */
function generateRoomSelector(rooms) {
    const options = rooms.map(room => 
        `<option value="${escapeHtml(room)}">${escapeHtml(room)}</option>`
    ).join('\n');
    
    return `
    <div class="room-selector">
        <label for="room-select">Sélectionner une salle:</label>
        <select id="room-select">
            <option value="">Toutes les salles</option>
            ${options}
        </select>
    </div>`;
}

/**
 * Generate HTML for search bar
 * @returns {string} HTML string for search bar
 */
function generateSearchBar() {
    return `
    <div class="search-bar">
        <input type="text" id="search-input" placeholder="Rechercher un item..." />
        <button id="search-button">Rechercher</button>
    </div>`;
}

/**
 * Generate complete filter panel
 * @param {Array} floors - Array of floor names
 * @param {Array} rooms - Array of room numbers
 * @returns {string} HTML string for filter panel
 */
function generateFilterPanel(floors, rooms) {
    return `
    <div class="filter-panel">
        <h3>Filtres</h3>
        ${generateSearchBar()}
        ${generateFloorSelector(floors)}
        ${generateRoomSelector(rooms)}
    </div>`;
}

/**
 * Generate statistics panel
 * @param {Array} items - Array of inventory items
 * @returns {string} HTML string for statistics
 */
function generateStatistics(items) {
    const byFloor = {};
    const byFamily = {};
    
    items.forEach(item => {
        const floor = item.location.floor || 'Unknown';
        const family = item.family || 'Unknown';
        
        byFloor[floor] = (byFloor[floor] || 0) + 1;
        byFamily[family] = (byFamily[family] || 0) + 1;
    });
    
    const floorStats = Object.entries(byFloor)
        .map(([floor, count]) => `
            <div class="stat-row">
                <span class="stat-label">${escapeHtml(floor)}:</span>
                <span class="stat-value">${count}</span>
            </div>
        `).join('');
    
    const familyStats = Object.entries(byFamily)
        .slice(0, 5) // Top 5 families
        .map(([family, count]) => `
            <div class="stat-row">
                <span class="stat-label">${escapeHtml(family)}:</span>
                <span class="stat-value">${count}</span>
            </div>
        `).join('');
    
    return `
    <div class="statistics-panel">
        <h3>Statistiques</h3>
        <div class="stat-section">
            <h4>Par étage</h4>
            ${floorStats}
        </div>
        <div class="stat-section">
            <h4>Top 5 familles</h4>
            ${familyStats}
        </div>
    </div>`;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Export functions for use in other modules
module.exports = {
    generateItemCard,
    generateQuickInfo,
    generateItemList,
    generateFloorSelector,
    generateRoomSelector,
    generateSearchBar,
    generateFilterPanel,
    generateStatistics,
    escapeHtml
};
