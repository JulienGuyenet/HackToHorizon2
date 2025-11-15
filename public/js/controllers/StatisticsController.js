/**
 * StatisticsController - Controls the statistics page
 * Handles statistics calculations and display
 */

class StatisticsController {
    constructor(inventoryService, i18nService) {
        this.inventoryService = inventoryService;
        this.i18nService = i18nService;
    }

    /**
     * Initialize the page
     */
    async init() {
        try {
            // i18n is already initialized by Application
            this.i18nService.updatePageTranslations();
            
            await this.loadData();
            this.updateStatistics();
        } catch (error) {
            console.error('Error initializing statistics page:', error);
            alert(this.i18nService.translate('errors.loadingData'));
        }
    }

    /**
     * Load data
     */
    async loadData() {
        await this.inventoryService.loadItems();
        console.log(`Loaded ${this.inventoryService.getAllItems().length} items`);
    }

    /**
     * Update statistics display
     */
    updateStatistics() {
        const stats = this.inventoryService.getStatistics();

        document.getElementById('total-items').textContent = stats.total;
        document.getElementById('total-floors').textContent = stats.floors;
        document.getElementById('total-rooms').textContent = stats.rooms;
        document.getElementById('total-families').textContent = stats.families;

        this.generateDetailedStats(stats);
    }

    /**
     * Generate detailed statistics
     */
    generateDetailedStats(stats) {
        const detailedStatsHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                <div class="info-section">
                    <h3 data-i18n="statistics.byFloor">${this.i18nService.translate('statistics.byFloor')}</h3>
                    ${this.generateStatsTable(stats.byFloor)}
                </div>
                <div class="info-section">
                    <h3 data-i18n="statistics.byFamily">${this.i18nService.translate('statistics.byFamily')}</h3>
                    ${this.generateStatsTable(stats.byFamily)}
                </div>
                <div class="info-section">
                    <h3 data-i18n="statistics.byType">${this.i18nService.translate('statistics.byType')}</h3>
                    ${this.generateStatsTable(stats.byType, 10)}
                </div>
            </div>
        `;

        document.getElementById('detailed-stats').innerHTML = detailedStatsHTML;
    }

    /**
     * Generate statistics table
     */
    generateStatsTable(data, limit = null) {
        const entries = Object.entries(data)
            .sort((a, b) => b[1] - a[1]);
        
        const limitedEntries = limit ? entries.slice(0, limit) : entries;
        
        return limitedEntries.map(([key, count]) => `
            <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #dee2e6;">
                <span>${this.escapeHtml(key)}</span>
                <strong>${count}</strong>
            </div>
        `).join('');
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
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
}

// Export for browser
if (typeof window !== 'undefined') {
    window.StatisticsController = StatisticsController;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StatisticsController };
}
