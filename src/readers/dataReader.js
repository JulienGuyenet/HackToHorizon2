/**
 * Data Reader Module
 * Interface for reading inventory data from various sources
 * Follows Dependency Inversion Principle - depends on abstractions not implementations
 */

const path = require('path');
const fs = require('fs');

/**
 * Read inventory data from file (auto-detects format)
 * @param {string} filePath - Path to data file
 * @param {Object} options - Reading options
 * @returns {Array} Array of inventory items
 */
function readInventoryData(filePath, options = {}) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    
    const ext = path.extname(filePath).toLowerCase();
    
    switch (ext) {
        case '.csv':
            return readFromCSV(filePath, options);
        case '.xlsx':
        case '.xls':
            return readFromExcel(filePath, options);
        default:
            throw new Error(`Unsupported file format: ${ext}`);
    }
}

/**
 * Read from CSV file
 * @param {string} filePath - Path to CSV file
 * @param {Object} options - Reading options
 * @returns {Array} Array of inventory items
 */
function readFromCSV(filePath, options = {}) {
    const csvReader = require('./csvReader');
    return csvReader.readCSVData(filePath, options);
}

/**
 * Read from Excel file
 * @param {string} filePath - Path to Excel file
 * @param {Object} options - Reading options
 * @returns {Array} Array of inventory items
 */
function readFromExcel(filePath, options = {}) {
    const excelReader = require('./excelReader');
    return excelReader.readExcelData(filePath, options);
}

/**
 * Export data to JSON file
 * @param {Array} items - Array of inventory items
 * @param {string} outputPath - Path to save JSON file
 */
function exportToJSON(items, outputPath) {
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
}

module.exports = {
    readInventoryData,
    readFromCSV,
    readFromExcel,
    exportToJSON
};
