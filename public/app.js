// Global state
let allItems = [];
let filteredItems = [];
let currentFloor = '';
let currentRoom = '';
let currentSearch = '';

// Initialize the application
async function initApp() {
    try {
        await loadData();
        setupEventListeners();
        populateFilters();
        updateStatistics();
        displayItems(allItems);
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Erreur lors du chargement des données');
    }
}

// Load data
async function loadData() {
    allItems = generateSampleData();
    filteredItems = allItems;
}

// Generate sample data for demonstration
function generateSampleData() {
    const floors = ['rdc', '1er etage', '2eme etage', '3eme etage', '4eme etage'];
    const families = ['Mobilier de bureau', 'Informatique', 'Sécurité', 'Électroménager'];
    const types = ['Fauteuil', 'Bureau', 'Ordinateur', 'Imprimante', 'Défibrillateur'];
    
    const items = [];
    for (let i = 1; i <= 100; i++) {
        const floor = floors[Math.floor(Math.random() * floors.length)];
        const room = String(100 + Math.floor(Math.random() * 50));
        
        items.push({
            id: i,
            reference: `REF${String(i).padStart(5, '0')}`,
            designation: `Item ${i} - ${types[Math.floor(Math.random() * types.length)]}`,
            family: families[Math.floor(Math.random() * families.length)],
            type: types[Math.floor(Math.random() * types.length)],
            supplier: 'Fournisseur ' + (i % 5 + 1),
            user: i % 3 === 0 ? '' : 'Utilisateur ' + (i % 10 + 1),
            barcode: String(10000 + i),
            serialNumber: `SN${String(i).padStart(6, '0')}`,
            information: 'Information détaillée sur l\'item',
            deliveryDate: '2024-01-01',
            location: {
                floor: floor,
                room: room,
                fullPath: `25\\BESANCON\\Siege\\VIOTTE\\${floor}\\${room}`,
                building: 'VIOTTE',
                site: 'Siege',
                city: 'BESANCON'
            },
            coordinates: { x: null, y: null }
        });
    }
    return items;
}

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });

    // Filters
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
    document.getElementById('search-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') applyFilters();
    });

    // Map controls
    document.getElementById('load-map').addEventListener('click', loadMap);
}

// Switch between tabs
function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Populate filter dropdowns
function populateFilters() {
    const floors = [...new Set(allItems.map(item => item.location.floor))].filter(Boolean).sort();
    const rooms = [...new Set(allItems.map(item => item.location.room))].filter(Boolean).sort();

    const floorSelect = document.getElementById('floor-filter');
    const roomSelect = document.getElementById('room-filter');
    const mapFloorSelect = document.getElementById('map-floor-filter');

    floors.forEach(floor => {
        floorSelect.add(new Option(floor, floor));
        mapFloorSelect.add(new Option(floor, floor));
    });

    rooms.forEach(room => {
        roomSelect.add(new Option(room, room));
    });
}

// Apply filters
function applyFilters() {
    currentFloor = document.getElementById('floor-filter').value;
    currentRoom = document.getElementById('room-filter').value;
    currentSearch = document.getElementById('search-input').value.toLowerCase();

    filteredItems = allItems.filter(item => {
        let matches = true;

        if (currentFloor && item.location.floor !== currentFloor) {
            matches = false;
        }

        if (currentRoom && item.location.room !== currentRoom) {
            matches = false;
        }

        if (currentSearch) {
            const searchString = `${item.designation} ${item.reference} ${item.barcode} ${item.user}`.toLowerCase();
            if (!searchString.includes(currentSearch)) {
                matches = false;
            }
        }

        return matches;
    });

    displayItems(filteredItems);
}

// Reset filters
function resetFilters() {
    document.getElementById('floor-filter').value = '';
    document.getElementById('room-filter').value = '';
    document.getElementById('search-input').value = '';
    currentFloor = '';
    currentRoom = '';
    currentSearch = '';
    filteredItems = allItems;
    displayItems(allItems);
}

// Display items
function displayItems(items) {
    const container = document.getElementById('items-container');
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>Aucun item trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
            </div>
        `;
        return;
    }

    const html = `
        <div style="margin-bottom: 15px; color: #495057;">
            <strong>${items.length}</strong> item(s) trouvé(s)
        </div>
        <div class="items-grid">
            ${items.map(item => generateItemCardHTML(item)).join('')}
        </div>
    `;
    
    container.innerHTML = html;
}

// Generate item card HTML
function generateItemCardHTML(item) {
    const userRow = item.user ? `
        <div class="item-detail">
            <span class="label">Utilisateur:</span>
            <span class="value">${escapeHtml(item.user)}</span>
        </div>
    ` : '';
    
    return `
        <div class="item-card">
            <div class="item-header">
                <h3 class="item-designation">${escapeHtml(item.designation)}</h3>
                <span class="item-barcode">#${escapeHtml(item.barcode)}</span>
            </div>
            <div class="item-body">
                <div class="item-detail">
                    <span class="label">Référence:</span>
                    <span class="value">${escapeHtml(item.reference)}</span>
                </div>
                <div class="item-detail">
                    <span class="label">Type:</span>
                    <span class="value">${escapeHtml(item.type)}</span>
                </div>
                <div class="item-detail">
                    <span class="label">Famille:</span>
                    <span class="value">${escapeHtml(item.family)}</span>
                </div>
                ${userRow}
                <div class="item-detail">
                    <span class="label">Localisation:</span>
                    <span class="value">${escapeHtml(item.location.floor || 'N/A')} - Salle ${escapeHtml(item.location.room || 'N/A')}</span>
                </div>
            </div>
        </div>
    `;
}

// Update statistics
function updateStatistics() {
    const floors = [...new Set(allItems.map(item => item.location.floor))].filter(Boolean);
    const rooms = [...new Set(allItems.map(item => item.location.room))].filter(Boolean);
    const families = [...new Set(allItems.map(item => item.family))].filter(Boolean);

    document.getElementById('total-items').textContent = allItems.length;
    document.getElementById('total-floors').textContent = floors.length;
    document.getElementById('total-rooms').textContent = rooms.length;
    document.getElementById('total-families').textContent = families.length;

    generateDetailedStats();
}

// Generate detailed statistics
function generateDetailedStats() {
    const byFloor = {};
    const byFamily = {};

    allItems.forEach(item => {
        const floor = item.location.floor || 'Inconnu';
        const family = item.family || 'Inconnu';

        byFloor[floor] = (byFloor[floor] || 0) + 1;
        byFamily[family] = (byFamily[family] || 0) + 1;
    });

    const detailedStatsHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <div class="info-section">
                <h3>Par Étage</h3>
                ${Object.entries(byFloor).sort((a, b) => b[1] - a[1]).map(([floor, count]) => `
                    <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #dee2e6;">
                        <span>${escapeHtml(floor)}</span>
                        <strong>${count}</strong>
                    </div>
                `).join('')}
            </div>
            <div class="info-section">
                <h3>Par Famille</h3>
                ${Object.entries(byFamily).sort((a, b) => b[1] - a[1]).map(([family, count]) => `
                    <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #dee2e6;">
                        <span>${escapeHtml(family)}</span>
                        <strong>${count}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.getElementById('detailed-stats').innerHTML = detailedStatsHTML;
}

// Load map
function loadMap() {
    const floor = document.getElementById('map-floor-filter').value;
    if (!floor) {
        alert('Veuillez sélectionner un étage');
        return;
    }

    const mapContainer = document.getElementById('map-container');
    const mapWrapper = document.querySelector('.map-container-wrapper');
    const floorImageMap = {
        'rdc': 'rdc.png',
        '1er etage': '1.png',
        '2eme etage': '2.png',
        '3eme etage': '3.png',
        '4eme etage': '4.png'
    };
    
    const imageName = floorImageMap[floor] || 'rdc.png';
    const imagePath = `/assets/images/floors/${imageName}`;
    
    mapContainer.innerHTML = `
        <div class="floor-map-overlay">
            <div class="floor-info-bar">
                <span class="floor-name">${escapeHtml(floor)}</span>
                <button class="close-map" onclick="closeMap()">✕</button>
            </div>
            <div class="floor-map-content">
                <img src="${imagePath}" alt="Plan ${escapeHtml(floor)}" onerror="handleImageError(this)">
            </div>
        </div>
    `;
    
    // Show the map overlay
    mapWrapper.classList.add('active');
}

// Close map view
function closeMap() {
    const mapContainer = document.getElementById('map-container');
    const mapWrapper = document.querySelector('.map-container-wrapper');
    
    mapContainer.innerHTML = '';
    
    // Hide the map overlay
    mapWrapper.classList.remove('active');
}

// Handle image loading errors
function handleImageError(img) {
    img.style.display = 'none';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'empty-state';
    errorDiv.style.display = 'flex';
    errorDiv.style.color = '#fff';
    errorDiv.innerHTML = `
        <h3>Image non disponible</h3>
        <p>Le plan pour cet étage n'est pas disponible</p>
    `;
    img.parentElement.appendChild(errorDiv);
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

// Show error message
function showError(message) {
    const container = document.getElementById('items-container');
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <h3>Erreur</h3>
            <p>${escapeHtml(message)}</p>
        </div>
    `;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
