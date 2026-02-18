/* ============================================
   API Service - Frontend Backend Communication
   Auto-detects local vs production environment
   ============================================ */

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:3001/api'
    : 'https://valu-baby-backend.onrender.com/api';

class APIService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Generic fetch wrapper with error handling
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ========== PRODUCT ENDPOINTS ==========

    // Get all products (with optional category filter)
    async getProducts(category = null) {
        const endpoint = category ? `/products?category=${category}` : '/products';
        return this.request(endpoint);
    }

    // Get single product by ID
    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    // ========== CART ENDPOINTS ==========

    // Validate cart items (check availability, stock, sizes)
    async validateCart(items) {
        return this.request('/cart/validate', {
            method: 'POST',
            body: JSON.stringify({ items })
        });
    }

    // ========== ORDER ENDPOINTS ==========

    // Create new order
    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    // Get order by ID
    async getOrder(orderId) {
        return this.request(`/orders/${orderId}`);
    }

    // Get order by order number
    async getOrderByNumber(orderNumber) {
        return this.request(`/orders/number/${orderNumber}`);
    }

    // Update order status (admin)
    async updateOrderStatus(orderId, status) {
        return this.request(`/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    // Update payment status (admin)
    async updatePaymentStatus(orderId, paymentStatus, paymentId = null) {
        return this.request(`/orders/${orderId}/payment`, {
            method: 'PUT',
            body: JSON.stringify({ paymentStatus, paymentId })
        });
    }

    // ========== HEALTH CHECK ==========

    async healthCheck() {
        try {
            const healthUrl = API_BASE_URL.replace('/api', '/health');
            const response = await fetch(healthUrl);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

// Create singleton instance
const api = new APIService();

// Export for use in other files
window.api = api;
window.APIService = APIService;
