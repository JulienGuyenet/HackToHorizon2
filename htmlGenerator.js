/**
 * Backwards Compatibility Wrapper for htmlGenerator.js
 * Delegates to the new modular structure
 * 
 * @deprecated Use src/modules/htmlGenerator.js for new code
 */

// Import from new structure
const htmlGeneratorNew = require('./src/modules/htmlGenerator');
const { escapeHtml } = require('./src/utils/htmlSanitizer');

/**
 * Generate HTML for a single item card
 * @param {Object} item - Inventory item
 * @returns {string} HTML string for item card
 */
function generateItemCard(item) {
    return htmlGeneratorNew.generateItemCard(item);
}

/**
 * Generate quick info tooltip HTML for an item
 * @param {Object} item - Inventory item
 * @returns {string} HTML string for tooltip
 */
function generateQuickInfo(item) {
    return htmlGeneratorNew.generateQuickInfo(item);
}

/**
 * Generate HTML for a list of items
 * @param {Array} items - Array of inventory items
 * @param {string} title - Title for the list
 * @returns {string} HTML string for item list
 */
function generateItemList(items, title = 'Liste des items') {
    return htmlGeneratorNew.generateItemList(items, title);
}

/**
 * Generate HTML for floor selector
 * @param {Array} floors - Array of floor names
 * @returns {string} HTML string for floor selector
 */
function generateFloorSelector(floors) {
    return htmlGeneratorNew.generateFloorSelector(floors);
}

/**
 * Generate HTML for room selector
 * @param {Array} rooms - Array of room numbers
 * @returns {string} HTML string for room selector
 */
function generateRoomSelector(rooms) {
    return htmlGeneratorNew.generateRoomSelector(rooms);
}

/**
 * Generate HTML for search bar
 * @returns {string} HTML string for search bar
 */
function generateSearchBar() {
    return htmlGeneratorNew.generateSearchBar();
}

/**
 * Generate complete filter panel
 * @param {Array} floors - Array of floor names
 * @param {Array} rooms - Array of room numbers
 * @returns {string} HTML string for filter panel
 */
function generateFilterPanel(floors, rooms) {
    return htmlGeneratorNew.generateFilterPanel(floors, rooms);
}

/**
 * Generate statistics panel
 * @param {Array} items - Array of inventory items
 * @returns {string} HTML string for statistics
 */
function generateStatistics(items) {
    return htmlGeneratorNew.generateStatistics(items);
}

// Export functions for backwards compatibility
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
