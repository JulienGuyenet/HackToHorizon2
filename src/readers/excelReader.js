/**
 * Excel Reader Module
 * Single Responsibility: Read data from Excel files using xlsx library
 */

const XLSX = require('xlsx');
const { parseLocation } = require('../utils/locationParser');

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
            coordinates: { x: null, y: null }
        };
    });

    return items;
}

module.exports = { readExcelData };
