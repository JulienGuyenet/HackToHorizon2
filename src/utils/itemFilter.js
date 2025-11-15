/**
 * Item Filter Utility
 * Single Responsibility: Filter inventory items
 */

/**
 * Get unique floors from items
 * @param {Array} items - Array of inventory items
 * @returns {Array} Array of unique floor names
 */
function getUniqueFloors(items) {
    const floors = items
        .map(item => item.location.floor)
        .filter(floor => floor !== null);
    
    return [...new Set(floors)].sort();
}

/**
 * Get unique rooms from items
 * @param {Array} items - Array of inventory items
 * @returns {Array} Array of unique room numbers
 */
function getUniqueRooms(items) {
    const rooms = items
        .map(item => item.location.room)
        .filter(room => room !== null);
    
    return [...new Set(rooms)].sort();
}

/**
 * Filter items by floor
 * @param {Array} items - Array of inventory items
 * @param {string} floor - Floor name to filter by
 * @returns {Array} Filtered items
 */
function filterByFloor(items, floor) {
    return items.filter(item => item.location.floor === floor);
}

/**
 * Filter items by room
 * @param {Array} items - Array of inventory items
 * @param {string} room - Room number to filter by
 * @returns {Array} Filtered items
 */
function filterByRoom(items, room) {
    return items.filter(item => item.location.room === room);
}

/**
 * Filter items by search term (searches in multiple fields)
 * @param {Array} items - Array of inventory items
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered items
 */
function filterBySearch(items, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return items;
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    return items.filter(item => {
        return (
            (item.designation && item.designation.toLowerCase().includes(term)) ||
            (item.reference && item.reference.toLowerCase().includes(term)) ||
            (item.type && item.type.toLowerCase().includes(term)) ||
            (item.barcode && item.barcode.toLowerCase().includes(term)) ||
            (item.user && item.user.toLowerCase().includes(term))
        );
    });
}

/**
 * Group items by floor
 * @param {Array} items - Array of inventory items
 * @returns {Object} Items grouped by floor
 */
function groupByFloor(items) {
    const grouped = {};
    
    items.forEach(item => {
        const floor = item.location.floor || 'Unknown';
        if (!grouped[floor]) {
            grouped[floor] = [];
        }
        grouped[floor].push(item);
    });
    
    return grouped;
}

/**
 * Group items by room
 * @param {Array} items - Array of inventory items
 * @returns {Object} Items grouped by room
 */
function groupByRoom(items) {
    const grouped = {};
    
    items.forEach(item => {
        const room = item.location.room || 'Unknown';
        if (!grouped[room]) {
            grouped[room] = [];
        }
        grouped[room].push(item);
    });
    
    return grouped;
}

module.exports = {
    getUniqueFloors,
    getUniqueRooms,
    filterByFloor,
    filterByRoom,
    filterBySearch,
    groupByFloor,
    groupByRoom
};
