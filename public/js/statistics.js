/**
 * Statistics Page JavaScript
 * Handles statistics display and calculations
 */

// Global state
let allItems = [];

// Initialize the page
async function initStatisticsPage() {
    try {
        // Initialize i18n
        await initI18n();
        updatePageTranslations();
        
        // Load data
        await loadData();
        
        // Update statistics
        updateStatistics();
    } catch (error) {
        console.error('Error initializing statistics page:', error);
        alert(t('errors.loadingData'));
    }
}

// Load data
async function loadData() {
    try {
        allItems = await loadInventoryData();
        console.log(`Loaded ${allItems.length} items`);
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
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
    const byType = {};

    allItems.forEach(item => {
        const floor = item.location.floor || t('statistics.unknown');
        const family = item.family || t('statistics.unknown');
        const type = item.type || t('statistics.unknown');

        byFloor[floor] = (byFloor[floor] || 0) + 1;
        byFamily[family] = (byFamily[family] || 0) + 1;
        byType[type] = (byType[type] || 0) + 1;
    });

    const detailedStatsHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <div class="info-section">
                <h3 data-i18n="statistics.byFloor">${t('statistics.byFloor')}</h3>
                ${Object.entries(byFloor).sort((a, b) => b[1] - a[1]).map(([floor, count]) => `
                    <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #dee2e6;">
                        <span>${escapeHtml(floor)}</span>
                        <strong>${count}</strong>
                    </div>
                `).join('')}
            </div>
            <div class="info-section">
                <h3 data-i18n="statistics.byFamily">${t('statistics.byFamily')}</h3>
                ${Object.entries(byFamily).sort((a, b) => b[1] - a[1]).map(([family, count]) => `
                    <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #dee2e6;">
                        <span>${escapeHtml(family)}</span>
                        <strong>${count}</strong>
                    </div>
                `).join('')}
            </div>
            <div class="info-section">
                <h3 data-i18n="statistics.byType">${t('statistics.byType')}</h3>
                ${Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([type, count]) => `
                    <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #dee2e6;">
                        <span>${escapeHtml(type)}</span>
                        <strong>${count}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.getElementById('detailed-stats').innerHTML = detailedStatsHTML;
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
    document.addEventListener('DOMContentLoaded', initStatisticsPage);
} else {
    initStatisticsPage();
}
