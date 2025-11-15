/**
 * Map Page JavaScript
 * Handles interactive map display with point placement and tooltips
 */

// Global state
let allItems = [];
let interactiveMap = null;

// Floor image mapping
const floorImageMap = {
    'rdc': 'rdc.png',
    '1er etage': '1.png',
    '2eme etage': '2.png',
    '3eme etage': '3.png',
    '4eme etage': '4.png'
};

// Initialize the page
async function initMapPage() {
    try {
        // Initialize i18n
        await initI18n();
        updatePageTranslations();
        
        // Load data
        await loadData();
        
        // Setup event listeners
        setupEventListeners();
        
        // Populate floor filter
        populateFloorFilter();
    } catch (error) {
        console.error('Error initializing map page:', error);
        alert(t('errors.loadingData'));
    }
}

// Load data
async function loadData() {
    try {
        allItems = await loadInventoryData();
        console.log(`Loaded ${allItems.length} items`);
        
        // Initialize coordinates if not present
        allItems.forEach((item, index) => {
            if (!item.coordinates) {
                item.coordinates = { x: null, y: null };
            }
            // For demo purposes, add some sample coordinates to a few items
            // This simulates having placed points on the map
            if (index < 5 && item.coordinates.x === null) {
                item.coordinates = {
                    x: 0.2 + (index * 0.15),
                    y: 0.3 + (index * 0.1)
                };
            }
        });
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('load-map').addEventListener('click', loadMap);
}

// Populate floor filter
function populateFloorFilter() {
    const floors = [...new Set(allItems.map(item => item.location.floor))].filter(Boolean).sort();
    const select = document.getElementById('map-floor-filter');
    
    floors.forEach(floor => {
        const option = document.createElement('option');
        option.value = floor;
        option.textContent = floor;
        select.appendChild(option);
    });
}

// Load and display map
function loadMap() {
    const floor = document.getElementById('map-floor-filter').value;
    if (!floor) {
        alert(t('map.selectFloorPrompt'));
        return;
    }

    const mapContainer = document.getElementById('map-container');
    const mapWrapper = document.querySelector('.map-container-wrapper');
    
    const imageName = floorImageMap[floor] || 'rdc.png';
    const imagePath = `/assets/images/floors/${imageName}`;
    
    // Filter items for the selected floor
    const floorItems = allItems.filter(item => item.location.floor === floor);
    
    mapContainer.innerHTML = `
        <div class="floor-map-overlay">
            <div class="floor-info-bar">
                <span class="floor-name">${escapeHtml(floor)}</span>
                <button class="close-map" onclick="closeMap()">✕</button>
            </div>
            <div class="floor-map-content" id="interactive-map-wrapper">
            </div>
        </div>
    `;
    
    // Show the map overlay
    mapWrapper.classList.add('active');
    
    // Initialize interactive map with tooltips
    setTimeout(() => {
        try {
            interactiveMap = new InteractiveMap('interactive-map-wrapper', imagePath, floorItems);
            
            // Handle item selection events
            document.getElementById('interactive-map-wrapper').addEventListener('itemsSelected', (event) => {
                const selectedItems = event.detail.items;
                console.log('Selected items:', selectedItems);
                // You can add more functionality here, like showing item details
            });
        } catch (error) {
            console.error('Error initializing interactive map:', error);
            handleImageError(document.querySelector('#interactive-map-wrapper img'));
        }
    }, 100);
}

// Close map view
function closeMap() {
    const mapContainer = document.getElementById('map-container');
    const mapWrapper = document.querySelector('.map-container-wrapper');
    
    // Clean up interactive map
    if (interactiveMap && interactiveMap.tooltipElement) {
        interactiveMap.tooltipElement.remove();
    }
    interactiveMap = null;
    
    mapContainer.innerHTML = '';
    mapWrapper.classList.remove('active');
}

// Handle image loading errors
function handleImageError(img) {
    if (!img) return;
    img.style.display = 'none';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'empty-state';
    errorDiv.style.display = 'flex';
    errorDiv.style.color = '#fff';
    errorDiv.innerHTML = `
        <h3>${t('map.imageNotAvailable')}</h3>
        <p>${t('map.imageNotAvailableHint')}</p>
    `;
    if (img.parentElement) {
        img.parentElement.appendChild(errorDiv);
    }
}

// Utility: Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMapPage);
} else {
    initMapPage();
}
