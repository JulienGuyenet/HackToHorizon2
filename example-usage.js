/**
 * Example script demonstrating how to use the Excel Reader module
 * Run with: node example-usage.js
 */

const excelReader = require('./excelReader');
const htmlGenerator = require('./htmlGenerator');
const fs = require('fs');

console.log('=== Excel Data Extraction and HTML Generation Example ===\n');

// Read Excel data
console.log('1. Reading Excel file...');
const items = excelReader.readExcelData('VIOTTE_Inventaire_20251114.xlsx');
console.log(`   ✓ Found ${items.length} items\n`);

// Show sample item
console.log('2. Sample item:');
console.log(JSON.stringify(items[0], null, 2));
console.log();

// Get unique floors
console.log('3. Unique floors:');
const floors = excelReader.getUniqueFloors(items);
console.log('   ', floors.join(', '));
console.log();

// Get unique rooms
console.log('4. Unique rooms (first 10):');
const rooms = excelReader.getUniqueRooms(items);
console.log('   ', rooms.slice(0, 10).join(', '));
console.log();

// Group by floor
console.log('5. Items per floor:');
const byFloor = excelReader.groupByFloor(items);
Object.entries(byFloor).forEach(([floor, floorItems]) => {
    console.log(`   ${floor}: ${floorItems.length} items`);
});
console.log();

// Export data as JSON
console.log('6. Exporting data to JSON...');
excelReader.exportToJSON(items, 'inventory-data.json');
console.log('   ✓ Saved to inventory-data.json\n');

// Generate HTML examples
console.log('7. Generating HTML examples...');

// Generate item list HTML
const itemListHtml = htmlGenerator.generateItemList(items.slice(0, 5), 'Premiers 5 items');
fs.writeFileSync('example-item-list.html', `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example Item List</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        ${itemListHtml}
    </div>
</body>
</html>
`);
console.log('   ✓ Generated example-item-list.html');

// Generate filter panel HTML
const filterPanelHtml = htmlGenerator.generateFilterPanel(floors, rooms);
fs.writeFileSync('example-filter-panel.html', `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example Filter Panel</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        ${filterPanelHtml}
    </div>
</body>
</html>
`);
console.log('   ✓ Generated example-filter-panel.html');

// Generate statistics HTML
const statisticsHtml = htmlGenerator.generateStatistics(items);
fs.writeFileSync('example-statistics.html', `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example Statistics</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        ${statisticsHtml}
    </div>
</body>
</html>
`);
console.log('   ✓ Generated example-statistics.html\n');

// Create sample coordinates file
console.log('8. Creating sample coordinates configuration...');
const sampleCoordinates = {
    version: '1.0',
    imageUrl: 'Screenshot 2025-11-15 at 12.29.07.png',
    timestamp: new Date().toISOString(),
    coordinates: items.slice(0, 10).map((item, index) => ({
        id: item.id,
        barcode: item.barcode,
        room: item.location.room,
        floor: item.location.floor,
        coordinates: {
            // Sample coordinates - these should be set using the point placer tool
            x: null,
            y: null
        }
    }))
};

fs.writeFileSync('sample-coordinates.json', JSON.stringify(sampleCoordinates, null, 2));
console.log('   ✓ Created sample-coordinates.json\n');

console.log('=== Example completed successfully! ===');
console.log('\nNext steps:');
console.log('1. Open demo-point-placer.html to place points on the floor plan');
console.log('2. Export the coordinates configuration');
console.log('3. Use the coordinates in demo-interactive-map.html to visualize the items');
console.log('4. Integrate the modules into your application');
