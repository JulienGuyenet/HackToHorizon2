#!/usr/bin/env node
/**
 * Excel to JSON Converter
 * Converts the Excel inventory file to JSON format for browser consumption
 */

const { readExcelData } = require('../src/readers/excelReader');
const fs = require('fs');
const path = require('path');

const EXCEL_FILE = path.join(__dirname, '../data/VIOTTE_Inventaire_20251114.xlsx');
const OUTPUT_FILE = path.join(__dirname, '../public/data/inventory.json');

async function convertExcelToJson() {
    try {
        console.log('Reading Excel file:', EXCEL_FILE);
        const data = readExcelData(EXCEL_FILE);
        
        console.log(`Found ${data.length} items`);
        
        // Ensure output directory exists
        const outputDir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Write JSON file
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
        
        console.log('Successfully converted to:', OUTPUT_FILE);
        console.log(`Total items: ${data.length}`);
        
        // Print some statistics
        const floors = [...new Set(data.map(item => item.location.floor))].filter(Boolean);
        const rooms = [...new Set(data.map(item => item.location.room))].filter(Boolean);
        const families = [...new Set(data.map(item => item.family))].filter(Boolean);
        
        console.log(`Floors: ${floors.length}`);
        console.log(`Rooms: ${rooms.length}`);
        console.log(`Families: ${families.length}`);
        
    } catch (error) {
        console.error('Error converting Excel to JSON:', error);
        process.exit(1);
    }
}

convertExcelToJson();
