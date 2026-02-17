/* ============================================
   Checkout Page JavaScript
   Order processing with Peru payment methods
   ============================================ */

class CheckoutPage {
    constructor() {
        this.cart = window.cart;
        this.shippingCost = 10.00; // Default regular shipping
        this.init();
    }

    init() {
        // Check if cart is empty
        if (!this.cart || this.cart.items.length === 0) {
            alert('Tu carrito está vacío');
            window.location.href = 'index.html';
            return;
        }

        // Render order summary
        this.renderOrderSummary();

        // Setup event listeners
        this.setupShippingListeners();
        this.setupFormSubmit();

        // Update totals
        this.updateTotals();
    }

    renderOrderSummary() {
        const orderItemsContainer = document.getElementById('orderItems');

        if (!orderItemsContainer || !this.cart) return;

        orderItemsContainer.innerHTML = this.cart.items.map(item => `
      <div class="order-item">
        <img src="${item.image}" alt="${item.name}" class="order-item__image">
        <div class="order-item__details">
          <h4 class="order-item__name">${item.name}</h4>
          <p class="order-item__meta">Talla: ${item.size} · Cantidad: ${item.quantity}</p>
          <p class="order-item__price">S/ ${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    `).join('');
    }

    setupShippingListeners() {
        const shippingInputs = document.querySelectorAll('input[name="shipping"]');

        shippingInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.shippingCost = parseFloat(e.target.dataset.price);
                this.updateTotals();
            });
        });
    }

    updateTotals() {
        const subtotalElement = document.getElementById('orderSubtotal');
        const shippingElement = document.getElementById('orderShipping');
        const totalElement = document.getElementById('orderTotal');

        if (!this.cart) return;

        const totals = this.cart.getTotals();
        const subtotal = parseFloat(totals.subtotal);
        const total = subtotal + this.shippingCost;

        if (subtotalElement) {
            subtotalElement.textContent = `S/ ${subtotal.toFixed(2)}`;
        }

        if (shippingElement) {
            shippingElement.textContent = this.shippingCost === 0
                ? 'GRATIS'
                : `S/ ${this.shippingCost.toFixed(2)}`;
        }

        if (totalElement) {
            totalElement.textContent = `S/ ${total.toFixed(2)}`;
        }
    }

    setupFormSubmit() {
        const form = document.querySelector('.checkout-form');
        const placeOrderBtn = document.getElementById('placeOrderBtn');

        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.validateAndSubmit();
            });
        }
    }

    validateAndSubmit() {
        // Get form values
        const formData = {
            customerName: document.getElementById('customerName')?.value.trim(),
            customerEmail: document.getElementById('customerEmail')?.value.trim(),
            customerPhone: document.getElementById('customerPhone')?.value.trim(),
            customerDNI: document.getElementById('customerDNI')?.value.trim(),
            shippingAddress: {
                departamento: document.getElementById('departamento')?.value,
                provincia: document.getElementById('provincia')?.value.trim(),
                distrito: document.getElementById('distrito')?.value,
                direccion: document.getElementById('direccion')?.value.trim(),
                referencia: document.getElementById('referencia')?.value.trim()
            }
        };

        // Validate required fields
        if (!formData.customerName || formData.customerName.length < 3) {
            alert('Por favor ingresa tu nombre completo');
            document.getElementById('customerName')?.focus();
            return;
        }

        if (!formData.customerEmail || !this.validateEmail(formData.customerEmail)) {
            alert('Por favor ingresa un email válido');
            document.getElementById('customerEmail')?.focus();
            return;
        }

        if (!formData.customerPhone || formData.customerPhone.length < 9) {
            alert('Por favor ingresa un teléfono válido');
            document.getElementById('customerPhone')?.focus();
            return;
        }

        if (!formData.shippingAddress.departamento) {
            alert('Por favor selecciona un departamento');
            document.getElementById('departamento')?.focus();
            return;
        }

        if (!formData.shippingAddress.distrito) {
            alert('Por favor selecciona un distrito');
            document.getElementById('distrito')?.focus();
            return;
        }

        if (!formData.shippingAddress.direccion) {
            alert('Por favor ingresa tu dirección');
            document.getElementById('direccion')?.focus();
            return;
        }

        // Get selected shipping and payment methods
        const shippingMethod = document.querySelector('input[name="shipping"]:checked');
        const paymentMethod = document.querySelector('input[name="payment"]:checked');

        if (!shippingMethod) {
            alert('Por favor selecciona un método de envío');
            return;
        }

        if (!paymentMethod) {
            alert('Por favor selecciona un método de pago');
            return;
        }

        // Build order object
        const orderData = {
            ...formData,
            items: this.cart.items,
            subtotal: parseFloat(this.cart.getTotals().subtotal),
            shipping: this.shippingCost,
            shippingMethod: shippingMethod.value,
            total: parseFloat(this.cart.getTotals().subtotal) + this.shippingCost,
            paymentMethod: paymentMethod.value,
            notes: ''
        };

        // Save order to localStorage temporarily
        localStorage.setItem('pending_order', JSON.stringify(orderData));

        // Redirect to confirmation page with payment method
        window.location.href = `order-confirmation.html?payment=${paymentMethod.value}`;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutPage();
});
