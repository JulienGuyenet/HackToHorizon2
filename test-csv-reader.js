/**
 * Test CSV Reader functionality
 */

const csvReader = require('./src/readers/csvReader');
const path = require('path');

console.log('Testing CSV Reader...\n');

try {
    // Test reading CSV file
    const csvFilePath = path.join(__dirname, 'VIOTTE_Inventaire_20251114.csv');
    console.log('Reading CSV file:', csvFilePath);
    
    const items = csvReader.readCSVData(csvFilePath);
    
    console.log('\n✓ CSV file read successfully');
    console.log(`  Total items: ${items.length}`);
    
    if (items.length > 0) {
        console.log('\n✓ Sample item:');
        console.log(`  ID: ${items[0].id}`);
        console.log(`  Reference: ${items[0].reference}`);
        console.log(`  Designation: ${items[0].designation}`);
        console.log(`  Floor: ${items[0].location.floor}`);
        console.log(`  Room: ${items[0].location.room}`);
    }
    
    // Test filtering functions
    const floors = csvReader.getUniqueFloors(items);
    console.log(`\n✓ Unique floors (${floors.length}):`);
    floors.forEach(floor => console.log(`  - ${floor}`));
    
    const rooms = csvReader.getUniqueRooms(items);
    console.log(`\n✓ Unique rooms: ${rooms.length} total`);
    
    // Test filtering by floor
    if (floors.length > 0) {
        const firstFloor = floors[0];
        const floorItems = csvReader.filterByFloor(items, firstFloor);
        console.log(`\n✓ Items on "${firstFloor}": ${floorItems.length}`);
    }
    
    // Export to JSON
    const jsonPath = path.join(__dirname, 'inventory-data-from-csv.json');
    csvReader.exportToJSON(items, jsonPath);
    console.log(`\n✓ Data exported to: ${jsonPath}`);
    
    console.log('\n✅ All CSV tests passed!');
    
} catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
}
