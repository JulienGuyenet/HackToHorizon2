/**
 * Inventory Page JavaScript
 * Handles inventory display and filtering
 */

// Global state
let allItems = [];
let filteredItems = [];
let currentFilters = {
    search: '',
    floor: '',
    room: '',
    type: '',
    family: '',
    supplier: '',
    user: ''
};

// Initialize the page
async function initInventoryPage() {
    try {
        // Initialize i18n
        await initI18n();
        updatePageTranslations();
        
        // Load data
        await loadData();
        
        // Setup event listeners
        setupEventListeners();
        
        // Populate filters
        populateFilters();
        
        // Display items
        displayItems(allItems);
    } catch (error) {
        console.error('Error initializing inventory page:', error);
        showError(t('errors.loadingData'));
    }
}

// Load data
async function loadData() {
    try {
        allItems = await loadInventoryData();
        filteredItems = allItems;
        console.log(`Loaded ${allItems.length} items`);
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
    document.getElementById('search-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') applyFilters();
    });
}

// Populate filter dropdowns
function populateFilters() {
    populateSelect('floor-filter', [...new Set(allItems.map(item => item.location.floor))].filter(Boolean).sort());
    populateSelect('room-filter', [...new Set(allItems.map(item => item.location.room))].filter(Boolean).sort());
    populateSelect('type-filter', [...new Set(allItems.map(item => item.type))].filter(Boolean).sort());
    populateSelect('family-filter', [...new Set(allItems.map(item => item.family))].filter(Boolean).sort());
    populateSelect('supplier-filter', [...new Set(allItems.map(item => item.supplier))].filter(Boolean).sort());
    populateSelect('user-filter', [...new Set(allItems.map(item => item.user))].filter(Boolean).sort());
}

// Populate a select element
function populateSelect(selectId, values) {
    const select = document.getElementById(selectId);
    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}

// Apply filters
function applyFilters() {
    currentFilters = {
        search: document.getElementById('search-input').value.toLowerCase(),
        floor: document.getElementById('floor-filter').value,
        room: document.getElementById('room-filter').value,
        type: document.getElementById('type-filter').value,
        family: document.getElementById('family-filter').value,
        supplier: document.getElementById('supplier-filter').value,
        user: document.getElementById('user-filter').value
    };

    filteredItems = allItems.filter(item => {
        // Search filter
        if (currentFilters.search) {
            const searchString = `${item.designation} ${item.reference} ${item.barcode} ${item.user}`.toLowerCase();
            if (!searchString.includes(currentFilters.search)) {
                return false;
            }
        }

        // Floor filter
        if (currentFilters.floor && item.location.floor !== currentFilters.floor) {
            return false;
        }

        // Room filter
        if (currentFilters.room && item.location.room !== currentFilters.room) {
            return false;
        }

        // Type filter
        if (currentFilters.type && item.type !== currentFilters.type) {
            return false;
        }

        // Family filter
        if (currentFilters.family && item.family !== currentFilters.family) {
            return false;
        }

        // Supplier filter
        if (currentFilters.supplier && item.supplier !== currentFilters.supplier) {
            return false;
        }

        // User filter
        if (currentFilters.user && item.user !== currentFilters.user) {
            return false;
        }

        return true;
    });

    displayItems(filteredItems);
}

// Reset filters
function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('floor-filter').value = '';
    document.getElementById('room-filter').value = '';
    document.getElementById('type-filter').value = '';
    document.getElementById('family-filter').value = '';
    document.getElementById('supplier-filter').value = '';
    document.getElementById('user-filter').value = '';
    
    currentFilters = {
        search: '',
        floor: '',
        room: '',
        type: '',
        family: '',
        supplier: '',
        user: ''
    };
    
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
                <h3 data-i18n="inventory.noResults">${t('inventory.noResults')}</h3>
                <p data-i18n="inventory.noResultsHint">${t('inventory.noResultsHint')}</p>
            </div>
        `;
        return;
    }

    const html = `
        <div style="margin-bottom: 15px; color: #495057;">
            <strong>${items.length}</strong> ${t('inventory.itemsFound')}
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
            <span class="label">${t('inventory.user')}:</span>
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
                    <span class="label">${t('inventory.reference')}:</span>
                    <span class="value">${escapeHtml(item.reference)}</span>
                </div>
                <div class="item-detail">
                    <span class="label">${t('inventory.type')}:</span>
                    <span class="value">${escapeHtml(item.type)}</span>
                </div>
                <div class="item-detail">
                    <span class="label">${t('inventory.family')}:</span>
                    <span class="value">${escapeHtml(item.family)}</span>
                </div>
                ${userRow}
                <div class="item-detail">
                    <span class="label">${t('inventory.location')}:</span>
                    <span class="value">${escapeHtml(item.location.floor || 'N/A')} - ${t('inventory.room')} ${escapeHtml(item.location.room || 'N/A')}</span>
                </div>
            </div>
        </div>
    `;
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
            <h3>${t('errors.generic')}</h3>
            <p>${escapeHtml(message)}</p>
        </div>
    `;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInventoryPage);
} else {
    initInventoryPage();
}
