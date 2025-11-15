/**
 * Backwards Compatibility Wrapper for excelReader.js
 * Delegates to the new modular structure
 * 
 * @deprecated Use src/readers/dataReader.js for new code
 */

const path = require('path');

// Import from new structure
const excelReaderNew = require('./src/readers/excelReader');
const { parseLocation } = require('./src/utils/locationParser');
const itemFilter = require('./src/utils/itemFilter');
const fs = require('fs');

/**
 * Read and parse Excel file
 * @param {string} filePath - Path to Excel file
 * @returns {Array} Array of inventory items
 */
function readExcelData(filePath) {
    return excelReaderNew.readExcelData(filePath);
}

/**
 * Get unique floors from items
 * @param {Array} items - Array of inventory items
 * @returns {Array} Array of unique floor names
 */
function getUniqueFloors(items) {
    return itemFilter.getUniqueFloors(items);
}

/**
 * Get unique rooms from items
 * @param {Array} items - Array of inventory items
 * @returns {Array} Array of unique room numbers
 */
function getUniqueRooms(items) {
    return itemFilter.getUniqueRooms(items);
}

/**
 * Filter items by floor
 * @param {Array} items - Array of inventory items
 * @param {string} floor - Floor name to filter by
 * @returns {Array} Filtered items
 */
function filterByFloor(items, floor) {
    return itemFilter.filterByFloor(items, floor);
}

/**
 * Filter items by room
 * @param {Array} items - Array of inventory items
 * @param {string} room - Room number to filter by
 * @returns {Array} Filtered items
 */
function filterByRoom(items, room) {
    return itemFilter.filterByRoom(items, room);
}

/**
 * Group items by floor
 * @param {Array} items - Array of inventory items
 * @returns {Object} Items grouped by floor
 */
function groupByFloor(items) {
    return itemFilter.groupByFloor(items);
}

/**
 * Group items by room
 * @param {Array} items - Array of inventory items
 * @returns {Object} Items grouped by room
 */
function groupByRoom(items) {
    return itemFilter.groupByRoom(items);
}

/**
 * Export data as JSON
 * @param {Array} items - Array of inventory items
 * @param {string} outputPath - Path to save JSON file
 */
function exportToJSON(items, outputPath) {
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
}

// Export functions for backwards compatibility
module.exports = {
    readExcelData,
    parseLocation,
    getUniqueFloors,
    getUniqueRooms,
    filterByFloor,
    filterByRoom,
    groupByFloor,
    groupByRoom,
    exportToJSON
};
