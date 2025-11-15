const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('VIOTTE_Inventaire_20251114.xlsx');

// Get sheet names
console.log('Sheet names:', workbook.SheetNames);

// Process each sheet
workbook.SheetNames.forEach(sheetName => {
    console.log(`\n=== Sheet: ${sheetName} ===`);
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Show first 5 rows
    console.log('First 5 rows:');
    data.slice(0, 5).forEach((row, index) => {
        console.log(`Row ${index}:`, row);
    });
    
    // Show headers
    if (data.length > 0) {
        console.log('\nHeaders:', data[0]);
    }
});
