/**
 * ApiClient - Main API Client Class
 * Handles all HTTP communication with the backend API
 */

class ApiClient {
    constructor(config = {}) {
        this.config = {
            baseURL: config.baseURL || 'https://hacktohorizon2025-api.onrender.com/api',
            httpsBaseURL: config.httpsBaseURL || 'https://hacktohorizon2025-api.onrender.com/api',
            timeout: config.timeout || 10000,
            useHttps: config.useHttps || false
        };
    }

    /**
     * Get the base URL based on configuration
     */
    getBaseURL() {
        return this.config.useHttps ? this.config.httpsBaseURL : this.config.baseURL;
    }

    /**
     * Set HTTPS usage
     */
    setUseHttps(useHttps) {
        this.config.useHttps = useHttps;
    }

    /**
     * Set custom base URL
     */
    setBaseURL(url) {
        this.config.baseURL = url;
    }

    /**
     * Get Accept-Language header
     */
    getAcceptLanguageHeader() {
        return 'fr-FR,fr;q=0.9,en;q=0.8';
    }

    /**
     * Generic fetch wrapper with error handling
     */
    async fetch(endpoint, options = {}) {
        const url = `${this.getBaseURL()}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Accept-Language': this.getAcceptLanguageHeader()
            },
            ...options,
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Accept-Language': this.getAcceptLanguageHeader()
            }
        };

        try {
            const response = await fetch(url, defaultOptions);
            
            if (response.status === 204) {
                return { success: true };
            }
            
            if (!response.ok) {
                const errorData = await this.parseErrorResponse(response);
                throw new APIError(
                    errorData.error_code || this.getErrorCodeFromStatus(response.status),
                    errorData.message || `HTTP ${response.status}`,
                    response.status,
                    errorData
                );
            }
            
            return await response.json();
        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }
            
            console.error(`API call failed for ${endpoint}:`, error);
            throw new APIError('networkError', error.message, 0, { originalError: error });
        }
    }

    /**
     * Parse error response
     */
    async parseErrorResponse(response) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        
        const errorText = await response.text();
        return { message: errorText };
    }

    /**
     * Map HTTP status code to error code
     */
    getErrorCodeFromStatus(statusCode) {
        const statusMap = {
            400: 'validationError',
            401: 'unauthorized',
            403: 'forbidden',
            404: 'notFound',
            500: 'serverError',
            502: 'apiUnavailable',
            503: 'apiUnavailable',
            504: 'apiUnavailable'
        };
        
        return statusMap[statusCode] || 'generic';
    }

    /**
     * GET request
     */
    async get(endpoint) {
        return this.fetch(endpoint, { method: 'GET' });
    }

    /**
     * POST request
     */
    async post(endpoint, data) {
        return this.fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, data) {
        return this.fetch(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.fetch(endpoint, { method: 'DELETE' });
    }
}

/**
 * Custom API Error class
 */
class APIError extends Error {
    constructor(errorCode, message, statusCode, details = {}) {
        super(message);
        this.name = 'APIError';
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.details = details;
    }
    
    /**
     * Get localized error message
     */
    getLocalizedMessage() {
        return this.message || 'Une erreur est survenue';
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.ApiClient = ApiClient;
    window.APIError = APIError;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApiClient, APIError };
}
