/**
 * Simple validation tests for the modules
 */

const excelReader = require('./excelReader');
const htmlGenerator = require('./htmlGenerator');

console.log('Running validation tests...\n');

let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        passedTests++;
    } catch (error) {
        console.log(`✗ ${name}`);
        console.log(`  Error: ${error.message}`);
        failedTests++;
    }
}

// Test Excel Reader
test('Excel Reader: Read Excel data', () => {
    const items = excelReader.readExcelData('VIOTTE_Inventaire_20251114.xlsx');
    if (!Array.isArray(items)) throw new Error('Items should be an array');
    if (items.length === 0) throw new Error('Items array should not be empty');
});

test('Excel Reader: Parse location', () => {
    const location = excelReader.parseLocation('25\\BESANCON\\Siege\\VIOTTE\\1er etage\\105');
    if (location.floor !== '1er etage') throw new Error('Floor not parsed correctly');
    if (location.room !== '105') throw new Error('Room not parsed correctly');
    if (location.city !== 'BESANCON') throw new Error('City not parsed correctly');
});

test('Excel Reader: Get unique floors', () => {
    const items = excelReader.readExcelData('VIOTTE_Inventaire_20251114.xlsx');
    const floors = excelReader.getUniqueFloors(items);
    if (!Array.isArray(floors)) throw new Error('Floors should be an array');
    if (floors.length === 0) throw new Error('Should have at least one floor');
});

test('Excel Reader: Filter by floor', () => {
    const items = excelReader.readExcelData('VIOTTE_Inventaire_20251114.xlsx');
    const filtered = excelReader.filterByFloor(items, '1er etage');
    if (!Array.isArray(filtered)) throw new Error('Filtered result should be an array');
    filtered.forEach(item => {
        if (item.location.floor !== '1er etage') {
            throw new Error('All items should be from 1er etage');
        }
    });
});

test('Excel Reader: Group by floor', () => {
    const items = excelReader.readExcelData('VIOTTE_Inventaire_20251114.xlsx');
    const grouped = excelReader.groupByFloor(items);
    if (typeof grouped !== 'object') throw new Error('Grouped result should be an object');
    if (Object.keys(grouped).length === 0) throw new Error('Should have grouped items');
});

// Test HTML Generator
test('HTML Generator: Generate item card', () => {
    const item = {
        id: 1,
        designation: 'Test Item',
        barcode: '12345',
        type: 'Test Type',
        family: 'Test Family',
        user: 'Test User',
        reference: 'REF123',
        location: { floor: '1er etage', room: '105' },
        information: 'Test info'
    };
    const html = htmlGenerator.generateItemCard(item);
    if (typeof html !== 'string') throw new Error('Should return a string');
    if (!html.includes('Test Item')) throw new Error('Should contain item designation');
    if (!html.includes('12345')) throw new Error('Should contain barcode');
});

test('HTML Generator: Generate quick info', () => {
    const item = {
        designation: 'Test Item',
        type: 'Test Type',
        user: 'Test User',
        barcode: '12345',
        location: { room: '105' }
    };
    const html = htmlGenerator.generateQuickInfo(item);
    if (typeof html !== 'string') throw new Error('Should return a string');
    if (!html.includes('Test Item')) throw new Error('Should contain designation');
});

test('HTML Generator: Escape HTML', () => {
    const escaped = htmlGenerator.escapeHtml('<script>alert("xss")</script>');
    if (escaped.includes('<script>')) throw new Error('Should escape script tags');
    if (!escaped.includes('&lt;')) throw new Error('Should contain escaped characters');
});

test('HTML Generator: Generate floor selector', () => {
    const floors = ['1er etage', '2eme etage'];
    const html = htmlGenerator.generateFloorSelector(floors);
    if (typeof html !== 'string') throw new Error('Should return a string');
    if (!html.includes('1er etage')) throw new Error('Should contain floor names');
});

test('HTML Generator: Generate statistics', () => {
    const items = excelReader.readExcelData('VIOTTE_Inventaire_20251114.xlsx');
    const html = htmlGenerator.generateStatistics(items);
    if (typeof html !== 'string') throw new Error('Should return a string');
    if (!html.includes('Statistiques')) throw new Error('Should contain statistics title');
});

// Test data integrity
test('Data Integrity: All items have required fields', () => {
    const items = excelReader.readExcelData('VIOTTE_Inventaire_20251114.xlsx');
    const requiredFields = ['id', 'designation', 'location', 'coordinates'];
    items.forEach((item, index) => {
        requiredFields.forEach(field => {
            if (!(field in item)) {
                throw new Error(`Item ${index} missing field: ${field}`);
            }
        });
    });
});

test('Data Integrity: Coordinates are properly initialized', () => {
    const items = excelReader.readExcelData('VIOTTE_Inventaire_20251114.xlsx');
    items.forEach((item, index) => {
        if (!item.coordinates) {
            throw new Error(`Item ${index} missing coordinates object`);
        }
        if (!('x' in item.coordinates) || !('y' in item.coordinates)) {
            throw new Error(`Item ${index} coordinates missing x or y`);
        }
    });
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests passed: ${passedTests}`);
console.log(`Tests failed: ${failedTests}`);
console.log(`Total tests: ${passedTests + failedTests}`);
console.log('='.repeat(50));

if (failedTests > 0) {
    process.exit(1);
} else {
    console.log('\n✓ All tests passed!');
    process.exit(0);
}
