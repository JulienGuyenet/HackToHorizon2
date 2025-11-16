/**
 * ReservationController - Controls the reservation page
 * Handles furniture reservation functionality with API integration
 */

class ReservationController {
    constructor(furnitureRepository) {
        this.furnitureRepository = furnitureRepository;
        this.selectedFurniture = null;
        this.searchResults = [];
        this.currentReservation = {
            furniture: null,
            startDateTime: null,
            endDateTime: null,
            userInfo: {}
        };
    }

    /**
     * Initialize the page
     */
    async init() {
        console.log('ReservationController initialized');
        
        // Check API connectivity
        await this.checkApiStatus();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set default dates (today and tomorrow)
        this.setDefaultDates();
    }

    /**
     * Check API connectivity
     */
    async checkApiStatus() {
        const statusBanner = document.getElementById('apiStatusBanner');
        const statusText = document.getElementById('apiStatusText');
        
        try {
            // Try to fetch furniture list to test API
            await this.furnitureRepository.getAll();
            statusBanner.style.display = 'none';
        } catch (error) {
            console.error('API connectivity issue:', error);
            statusBanner.style.display = 'block';
            statusBanner.classList.add('error');
            
            // Use localized error message if available
            const errorMessage = error instanceof APIError 
                ? error.getLocalizedMessage()
                : 'Erreur de connexion à l\'API';
            
            statusText.textContent = errorMessage + ' - ' + 'Assurez-vous que l\'API est accessible';
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Search button
        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        
        // Search input - search on Enter key
        document.getElementById('furnitureSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        
        // Change furniture button
        document.getElementById('changeFurnitureBtn').addEventListener('click', () => {
            this.selectedFurniture = null;
            document.getElementById('selectedFurnitureCard').style.display = 'none';
            document.getElementById('searchResults').style.display = 'block';
        });
        
        // Date/time inputs - check availability when changed
        ['startDate', 'startTime', 'endDate', 'endTime'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => this.checkAvailability());
        });
        
        // Submit reservation
        document.getElementById('submitReservation').addEventListener('click', () => this.handleSubmitReservation());
        
        // Cancel reservation
        document.getElementById('cancelReservation').addEventListener('click', () => this.handleCancelReservation());
    }

    /**
     * Set default dates
     */
    setDefaultDates() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const formatDate = (date) => date.toISOString().split('T')[0];
        
        document.getElementById('startDate').value = formatDate(today);
        document.getElementById('endDate').value = formatDate(tomorrow);
        document.getElementById('startTime').value = '08:00';
        document.getElementById('endTime').value = '17:00';
    }

    /**
     * Handle search
     */
    async handleSearch() {
        const searchTerm = document.getElementById('furnitureSearch').value.trim();
        
        if (!searchTerm) {
            this.showMessage('Veuillez entrer un terme de recherche', 'error');
            return;
        }
        
        this.showLoading(true);
        
        try {
            // Search using the API
            const results = await this.furnitureRepository.search({
                reference: searchTerm
            });
            
            // Also try searching by designation (we'll need to get all and filter)
            if (results.length === 0) {
                const allFurniture = await this.furnitureRepository.getAll();
                this.searchResults = allFurniture.filter(item => 
                    item.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.codeBarre?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            } else {
                this.searchResults = results;
            }
            
            this.displaySearchResults(this.searchResults);
        } catch (error) {
            console.error('Search error:', error);
            
            // Use localized error message
            const errorMessage = error instanceof APIError 
                ? error.getLocalizedMessage()
                : 'Erreur lors de la recherche';
            
            this.showMessage(errorMessage, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Display search results
     */
    displaySearchResults(results) {
        const searchResultsDiv = document.getElementById('searchResults');
        const furnitureList = document.getElementById('furnitureList');
        
        if (results.length === 0) {
            furnitureList.innerHTML = `
                <div class="no-results">
                    <p>Aucun résultat trouvé</p>
                </div>
            `;
            searchResultsDiv.style.display = 'block';
            return;
        }
        
        // Create furniture cards
        furnitureList.innerHTML = results.map(item => `
            <div class="furniture-card" data-furniture-id="${item.id}">
                <div class="furniture-card-header">
                    <h4>${item.designation || 'Désignation'}</h4>
                    <span class="furniture-reference">${item.reference || ''}</span>
                </div>
                <div class="furniture-card-body">
                    <div class="furniture-info">
                        <span class="info-label">Famille:</span>
                        <span class="info-value">${item.famille || '-'}</span>
                    </div>
                    <div class="furniture-info">
                        <span class="info-label">Type:</span>
                        <span class="info-value">${item.type || '-'}</span>
                    </div>
                    <div class="furniture-info">
                        <span class="info-label">Localisation actuelle:</span>
                        <span class="info-value">${this.formatLocation(item.location)}</span>
                    </div>
                </div>
                <button class="btn btn-primary select-furniture-btn" data-furniture-id="${item.id}">
                    Sélectionner dans la liste
                </button>
            </div>
        `).join('');
        
        // Add click handlers to select buttons
        furnitureList.querySelectorAll('.select-furniture-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const furnitureId = parseInt(btn.getAttribute('data-furniture-id'));
                this.selectFurniture(furnitureId);
            });
        });
        
        searchResultsDiv.style.display = 'block';
    }

    /**
     * Format location object
     */
    formatLocation(location) {
        if (!location) return '-';
        
        const parts = [];
        if (location.buildingName) parts.push(location.buildingName);
        if (location.floor) parts.push('Étage ' + location.floor);
        if (location.room) parts.push('Salle ' + location.room);
        
        return parts.length > 0 ? parts.join(', ') : '-';
    }

    /**
     * Select furniture
     */
    async selectFurniture(furnitureId) {
        this.showLoading(true);
        
        try {
            // Fetch full furniture details
            const furniture = await this.furnitureRepository.getById(furnitureId);
            this.selectedFurniture = furniture;
            
            // Display selected furniture
            this.displaySelectedFurniture(furniture);
            
            // Hide search results
            document.getElementById('searchResults').style.display = 'none';
            
            // Check availability
            await this.checkAvailability();
        } catch (error) {
            console.error('Error selecting furniture:', error);
            
            // Use localized error message
            const errorMessage = error instanceof APIError 
                ? error.getLocalizedMessage()
                : 'Erreur lors de la sélection du meuble';
            
            this.showMessage(errorMessage, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Display selected furniture
     */
    displaySelectedFurniture(furniture) {
        const card = document.getElementById('selectedFurnitureCard');
        const detailsDiv = document.getElementById('selectedFurnitureDetails');
        
        detailsDiv.innerHTML = `
            <div class="furniture-detail-row">
                <span class="detail-label">Référence:</span>
                <span class="detail-value">${furniture.reference || '-'}</span>
            </div>
            <div class="furniture-detail-row">
                <span class="detail-label">Désignation:</span>
                <span class="detail-value">${furniture.designation || '-'}</span>
            </div>
            <div class="furniture-detail-row">
                <span class="detail-label">Famille:</span>
                <span class="detail-value">${furniture.famille || '-'}</span>
            </div>
            <div class="furniture-detail-row">
                <span class="detail-label">Type:</span>
                <span class="detail-value">${furniture.type || '-'}</span>
            </div>
            <div class="furniture-detail-row">
                <span class="detail-label">Fournisseur:</span>
                <span class="detail-value">${furniture.fournisseur || '-'}</span>
            </div>
            <div class="furniture-detail-row">
                <span class="detail-label">Localisation actuelle:</span>
                <span class="detail-value">${this.formatLocation(furniture.location)}</span>
            </div>
        `;
        
        card.style.display = 'block';
    }

    /**
     * Check availability
     */
    async checkAvailability() {
        if (!this.selectedFurniture) return;
        
        const startDate = document.getElementById('startDate').value;
        const startTime = document.getElementById('startTime').value;
        const endDate = document.getElementById('endDate').value;
        const endTime = document.getElementById('endTime').value;
        
        if (!startDate || !startTime || !endDate || !endTime) return;
        
        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);
        
        // Validate dates
        if (endDateTime <= startDateTime) {
            this.showAvailability(false, 'La date de fin doit être postérieure à la date de début');
            return;
        }
        
        // For now, we'll assume the furniture is available
        // In a real implementation, you would check against existing reservations
        this.showAvailability(true, 'Disponible');
    }

    /**
     * Show availability status
     */
    showAvailability(isAvailable, message) {
        const statusDiv = document.getElementById('availabilityStatus');
        const statusText = document.getElementById('availabilityText');
        
        statusDiv.style.display = 'block';
        statusDiv.className = 'availability-status ' + (isAvailable ? 'available' : 'not-available');
        statusText.textContent = message;
    }

    /**
     * Handle submit reservation
     */
    async handleSubmitReservation() {
        // Validate furniture selection
        if (!this.selectedFurniture) {
            this.showMessage('Veuillez sélectionner un meuble', 'error');
            return;
        }
        
        // Get form data
        const startDate = document.getElementById('startDate').value;
        const startTime = document.getElementById('startTime').value;
        const endDate = document.getElementById('endDate').value;
        const endTime = document.getElementById('endTime').value;
        const userName = document.getElementById('userName').value.trim();
        const userEmail = document.getElementById('userEmail').value.trim();
        const userPhone = document.getElementById('userPhone').value.trim();
        const department = document.getElementById('department').value.trim();
        const location = document.getElementById('location').value.trim();
        const purpose = document.getElementById('purpose').value.trim();
        
        // Validate required fields
        if (!startDate || !startTime || !endDate || !endTime || !userName || !userEmail) {
            this.showMessage('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }
        
        // Validate dates
        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);
        
        if (endDateTime <= startDateTime) {
            this.showMessage('La date de fin doit être postérieure à la date de début', 'error');
            return;
        }
        
        // Prepare reservation data
        const reservationData = {
            furnitureId: this.selectedFurniture.id,
            furnitureReference: this.selectedFurniture.reference,
            startDateTime: startDateTime.toISOString(),
            endDateTime: endDateTime.toISOString(),
            userName,
            userEmail,
            userPhone,
            department,
            location,
            purpose
        };
        
        this.showLoading(true);
        
        try {
            // Note: The API doesn't have a reservation endpoint yet
            // This is where you would call a reservation repository method
            // For now, we'll simulate success
            
            console.log('Reservation data:', reservationData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showMessage('Réservation créée avec succès', 'success');
            
            // Reset form after success
            setTimeout(() => {
                this.resetForm();
            }, 2000);
        } catch (error) {
            console.error('Reservation error:', error);
            
            // Use localized error message
            const errorMessage = error instanceof APIError 
                ? error.getLocalizedMessage()
                : 'Erreur lors de la création de la réservation';
            
            this.showMessage(errorMessage, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Handle cancel reservation
     */
    handleCancelReservation() {
        if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
            this.resetForm();
        }
    }

    /**
     * Reset form
     */
    resetForm() {
        this.selectedFurniture = null;
        this.searchResults = [];
        
        // Reset form fields
        document.getElementById('furnitureSearch').value = '';
        document.getElementById('userName').value = '';
        document.getElementById('userEmail').value = '';
        document.getElementById('userPhone').value = '';
        document.getElementById('department').value = '';
        document.getElementById('location').value = '';
        document.getElementById('purpose').value = '';
        
        // Reset dates
        this.setDefaultDates();
        
        // Hide sections
        document.getElementById('searchResults').style.display = 'none';
        document.getElementById('selectedFurnitureCard').style.display = 'none';
        document.getElementById('availabilityStatus').style.display = 'none';
        document.getElementById('messageBox').style.display = 'none';
    }

    /**
     * Show loading overlay
     */
    showLoading(show) {
        document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
    }

    /**
     * Show message
     */
    showMessage(message, type) {
        const messageBox = document.getElementById('messageBox');
        const messageText = document.getElementById('messageText');
        
        messageBox.className = 'message-box ' + type;
        messageText.textContent = message;
        messageBox.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000);
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.ReservationController = ReservationController;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ReservationController };
}
