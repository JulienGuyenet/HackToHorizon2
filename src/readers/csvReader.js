/**
 * CSV Data Extraction Module
 * Extracts and parses inventory data from CSV files
 * No external dependencies - uses Node.js built-in modules only
 */

const fs = require('fs');

/**
 * Parse location string to extract floor and room information
 * Example: "25\\BESANCON\\Siege\\VIOTTE\\1er etage\\105"
 * @param {string} location - Location string from CSV
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
 * Parse CSV line handling quoted fields
 * @param {string} line - CSV line to parse
 * @param {string} delimiter - Field delimiter (default: ';')
 * @returns {Array} Array of field values
 */
function parseCSVLine(line, delimiter = ';') {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i++;
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === delimiter && !inQuotes) {
            // Field delimiter
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    // Add last field
    result.push(current.trim());
    
    return result;
}

/**
 * Read and parse CSV file
 * @param {string} filePath - Path to CSV file
 * @param {Object} options - Parsing options
 * @returns {Array} Array of inventory items
 */
function readCSVData(filePath, options = {}) {
    const delimiter = options.delimiter || ';';
    const encoding = options.encoding || 'utf8';
    
    // Read file
    const fileContent = fs.readFileSync(filePath, encoding);
    
    // Split into lines and remove BOM if present
    const lines = fileContent.replace(/^\uFEFF/, '').split(/\r?\n/);
    
    if (lines.length < 2) {
        return [];
    }
    
    // Parse header
    const headers = parseCSVLine(lines[0], delimiter);
    
    // Parse data rows
    const items = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines
        
        const values = parseCSVLine(line, delimiter);
        if (values.length < headers.length) continue; // Skip incomplete rows
        
        // Create object from headers and values
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        
        // Parse location and create structured item
        const location = parseLocation(row['Site']);
        
        items.push({
            id: items.length + 1,
            reference: row['Référence'] || row['Reference'] || '',
            designation: row['Désignation'] || row['Designation'] || '',
            family: row['Famille'] || row['Family'] || '',
            type: row['Type'] || '',
            supplier: row['Fournisseur'] || row['Supplier'] || '',
            user: row['Utilisateur'] || row['User'] || '',
            barcode: row['Code barre'] || row['Barcode'] || '',
            serialNumber: row['N° série'] || row['Serial Number'] || '',
            information: row['Informations'] || row['Information'] || '',
            deliveryDate: row['Date de livraison'] || row['Delivery Date'] || '',
            location: location,
            // Coordinates will be set later for interactive map
            coordinates: { x: null, y: null }
        });
    }
    
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
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
}

// Export functions for use in other modules
module.exports = {
    readCSVData,
    parseLocation,
    parseCSVLine,
    getUniqueFloors,
    getUniqueRooms,
    filterByFloor,
    filterByRoom,
    groupByFloor,
    groupByRoom,
    exportToJSON
};
