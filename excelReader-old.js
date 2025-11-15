/**
 * Excel Data Extraction Module
 * Extracts and parses inventory data from Excel files
 */

const XLSX = require('xlsx');

/**
 * Parse location string to extract floor and room information
 * Example: "25\\BESANCON\\Siege\\VIOTTE\\1er etage\\105"
 * @param {string} location - Location string from Excel
 * @returns {Object} Parsed location with floor and room
 */
function parseLocation(location) {
    if (!location) {
        return { floor: null, room: null, fullPath: null };
    }

    const parts = location.split('\\');
    const floor = parts.length >= 5 ? parts[4] : null;
    const room = parts.length >= 6 ? parts[5] : null;

    return {
        floor: floor,
        room: room,
        fullPath: location,
        building: parts.length >= 4 ? parts[3] : null,
        site: parts.length >= 3 ? parts[2] : null,
        city: parts.length >= 2 ? parts[1] : null
    };
}

/**
 * Read and parse Excel file
 * @param {string} filePath - Path to Excel file
 * @returns {Array} Array of inventory items
 */
function readExcelData(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with header row
    const rawData = XLSX.utils.sheet_to_json(worksheet);
    
    // Parse and structure the data
    const items = rawData.map((row, index) => {
        const location = parseLocation(row['Site']);
        
        return {
            id: index + 1,
            reference: row['Référence'] || '',
            designation: row['Désignation'] || '',
            family: row['Famille'] || '',
            type: row['Type'] || '',
            supplier: row['Fournisseur'] || '',
            user: row['Utilisateur'] || '',
            barcode: row['Code barre'] || '',
            serialNumber: row['N° série'] || '',
            information: row['Informations'] || '',
            deliveryDate: row['Date de livraison'] || '',
            location: location,
            // Coordinates will be set later for interactive map
            coordinates: { x: null, y: null }
        };
    });

    return items;
}

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

/**
 * Export data as JSON
 * @param {Array} items - Array of inventory items
 * @param {string} outputPath - Path to save JSON file
 */
function exportToJSON(items, outputPath) {
    const fs = require('fs');
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
}

// Export functions for use in other modules
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
