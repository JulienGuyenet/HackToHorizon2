/**
 * Reservation Page Module
 * Handles furniture reservation functionality with API integration
 */

// State management
let selectedFurniture = null;
let searchResults = [];
let currentReservation = {
    furniture: null,
    startDateTime: null,
    endDateTime: null,
    userInfo: {}
};

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Reservation page initialized');
    
    // Check API connectivity
    await checkApiStatus();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set default dates (today and tomorrow)
    setDefaultDates();
});

/**
 * Check API connectivity
 */
async function checkApiStatus() {
    const statusBanner = document.getElementById('apiStatusBanner');
    const statusText = document.getElementById('apiStatusText');
    
    try {
        // Try to fetch furniture list to test API
        await getAllFurniture();
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
function setupEventListeners() {
    // Search button
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    
    // Search input - search on Enter key
    document.getElementById('furnitureSearch').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Change furniture button
    document.getElementById('changeFurnitureBtn').addEventListener('click', function() {
        selectedFurniture = null;
        document.getElementById('selectedFurnitureCard').style.display = 'none';
        document.getElementById('searchResults').style.display = 'block';
    });
    
    // Date/time inputs - check availability when changed
    ['startDate', 'startTime', 'endDate', 'endTime'].forEach(id => {
        document.getElementById(id).addEventListener('change', checkAvailability);
    });
    
    // Submit reservation
    document.getElementById('submitReservation').addEventListener('click', handleSubmitReservation);
    
    // Cancel reservation
    document.getElementById('cancelReservation').addEventListener('click', handleCancelReservation);
}

/**
 * Set default dates
 */
function setDefaultDates() {
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
async function handleSearch() {
    const searchTerm = document.getElementById('furnitureSearch').value.trim();
    
    if (!searchTerm) {
        showMessage('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        // Search using the API
        const results = await searchFurniture({
            reference: searchTerm
        });
        
        // Also try searching by designation (we'll need to get all and filter)
        if (results.length === 0) {
            const allFurniture = await getAllFurniture();
            searchResults = allFurniture.filter(item => 
                item.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.codeBarre?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else {
            searchResults = results;
        }
        
        displaySearchResults(searchResults);
    } catch (error) {
        console.error('Search error:', error);
        
        // Use localized error message
        const errorMessage = error instanceof APIError 
            ? error.getLocalizedMessage()
            : 'Erreur de connexion à l\'API';
        
        showMessage(errorMessage, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Display search results
 */
function displaySearchResults(results) {
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
                    <span class="info-value">${formatLocation(item.location)}</span>
                </div>
            </div>
            <button class="btn btn-primary select-furniture-btn" data-furniture-id="${item.id}">
                Sélectionner dans la liste
            </button>
        </div>
    `).join('');
    
    // Add click handlers to select buttons
    furnitureList.querySelectorAll('.select-furniture-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const furnitureId = parseInt(this.getAttribute('data-furniture-id'));
            selectFurniture(furnitureId);
        });
    });
    
    searchResultsDiv.style.display = 'block';
}

/**
 * Format location object
 */
function formatLocation(location) {
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
async function selectFurniture(furnitureId) {
    showLoading(true);
    
    try {
        // Fetch full furniture details
        const furniture = await getFurnitureById(furnitureId);
        selectedFurniture = furniture;
        
        // Display selected furniture
        displaySelectedFurniture(furniture);
        
        // Hide search results
        document.getElementById('searchResults').style.display = 'none';
        
        // Check availability
        await checkAvailability();
    } catch (error) {
        console.error('Error selecting furniture:', error);
        
        // Use localized error message
        const errorMessage = error instanceof APIError 
            ? error.getLocalizedMessage()
            : 'Erreur lors de la création de la réservation';
        
        showMessage(errorMessage, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Display selected furniture
 */
function displaySelectedFurniture(furniture) {
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
            <span class="detail-value">${formatLocation(furniture.location)}</span>
        </div>
    `;
    
    card.style.display = 'block';
}

/**
 * Check availability
 */
async function checkAvailability() {
    if (!selectedFurniture) return;
    
    const startDate = document.getElementById('startDate').value;
    const startTime = document.getElementById('startTime').value;
    const endDate = document.getElementById('endDate').value;
    const endTime = document.getElementById('endTime').value;
    
    if (!startDate || !startTime || !endDate || !endTime) return;
    
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    // Validate dates
    if (endDateTime <= startDateTime) {
        showAvailability(false, 'La date de fin doit être postérieure à la date de début');
        return;
    }
    
    // For now, we'll assume the furniture is available
    // In a real implementation, you would check against existing reservations
    showAvailability(true, 'Disponible');
}

/**
 * Show availability status
 */
function showAvailability(isAvailable, message) {
    const statusDiv = document.getElementById('availabilityStatus');
    const statusText = document.getElementById('availabilityText');
    
    statusDiv.style.display = 'block';
    statusDiv.className = 'availability-status ' + (isAvailable ? 'available' : 'not-available');
    statusText.textContent = message;
}

/**
 * Handle submit reservation
 */
async function handleSubmitReservation() {
    // Validate furniture selection
    if (!selectedFurniture) {
        showMessage('Veuillez sélectionner un meuble', 'error');
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
        showMessage('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Validate dates
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    if (endDateTime <= startDateTime) {
        showMessage('La date de fin doit être postérieure à la date de début', 'error');
        return;
    }
    
    // Prepare reservation data
    const reservationData = {
        furnitureId: selectedFurniture.id,
        furnitureReference: selectedFurniture.reference,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        userName,
        userEmail,
        userPhone,
        department,
        location,
        purpose
    };
    
    showLoading(true);
    
    try {
        // Note: The API doesn't have a reservation endpoint yet
        // This is where you would call createReservation(reservationData)
        // For now, we'll simulate success
        
        console.log('Reservation data:', reservationData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showMessage('Réservation créée avec succès', 'success');
        
        // Reset form after success
        setTimeout(() => {
            resetForm();
        }, 2000);
    } catch (error) {
        console.error('Reservation error:', error);
        
        // Use localized error message
        const errorMessage = error instanceof APIError 
            ? error.getLocalizedMessage()
            : 'Erreur lors de la création de la réservation';
        
        showMessage(errorMessage, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Handle cancel reservation
 */
function handleCancelReservation() {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
        resetForm();
    }
}

/**
 * Reset form
 */
function resetForm() {
    selectedFurniture = null;
    searchResults = [];
    
    // Reset form fields
    document.getElementById('furnitureSearch').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userPhone').value = '';
    document.getElementById('department').value = '';
    document.getElementById('location').value = '';
    document.getElementById('purpose').value = '';
    
    // Reset dates
    setDefaultDates();
    
    // Hide sections
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('selectedFurnitureCard').style.display = 'none';
    document.getElementById('availabilityStatus').style.display = 'none';
    document.getElementById('messageBox').style.display = 'none';
}

/**
 * Show loading overlay
 */
function showLoading(show) {
    document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
}

/**
 * Show message
 */
function showMessage(message, type) {
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
