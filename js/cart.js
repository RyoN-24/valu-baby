/* ============================================
   VALÚ Baby — Shopping Cart JavaScript
   Cart state management with localStorage
   ============================================ */

class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
        this.updateUI();
    }

    // Load cart from localStorage
    loadFromStorage() {
        const savedCart = localStorage.getItem('valu_cart');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                this.items = parsed.items || [];
            } catch (e) {
                console.error('Error loading cart:', e);
                this.items = [];
            }
        }
    }

    // Save cart to localStorage
    saveToStorage() {
        localStorage.setItem('valu_cart', JSON.stringify({
            items: this.items,
            updatedAt: new Date().toISOString()
        }));
    }

    // Add item to cart
    addItem(product) {
        // Check if item with same ID and size already exists
        const existingIndex = this.items.findIndex(
            item => item.id === product.id && item.size === product.size
        );

        if (existingIndex > -1) {
            // Increase quantity
            this.items[existingIndex].quantity += product.quantity || 1;
        } else {
            // Add new item
            this.items.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                size: product.size,
                quantity: product.quantity || 1,
                image: product.image
            });
        }

        this.saveToStorage();
        this.updateUI();
        this.showNotification(`${product.name} agregado al carrito`);
    }

    // Remove item from cart
    removeItem(id, size) {
        this.items = this.items.filter(
            item => !(item.id === id && item.size === size)
        );
        this.saveToStorage();
        this.updateUI();
    }

    // Update item quantity
    updateQuantity(id, size, quantity) {
        const item = this.items.find(
            item => item.id === id && item.size === size
        );

        if (item) {
            if (quantity <= 0) {
                this.removeItem(id, size);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
                this.updateUI();
            }
        }
    }

    // Get cart totals
    getTotals() {
        const subtotal = this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        const itemCount = this.items.reduce((sum, item) => {
            return sum + item.quantity;
        }, 0);

        return {
            subtotal: subtotal.toFixed(2),
            itemCount
        };
    }

    // Clear cart
    clear() {
        this.items = [];
        this.saveToStorage();
        this.updateUI();
    }

    // Update all UI elements
    updateUI() {
        this.updateBadge();
        this.updateCartSidebar();
    }

    // Update cart badge
    updateBadge() {
        const badge = document.getElementById('cartBadge');
        const totals = this.getTotals();

        if (badge) {
            badge.textContent = totals.itemCount;
            badge.style.display = totals.itemCount > 0 ? 'inline-flex' : 'none';
        }
    }

    // Update cart sidebar
    updateCartSidebar() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const emptyCart = document.getElementById('emptyCart');
        const cartFooter = document.querySelector('.cart-footer');

        if (!cartItemsContainer) return;

        const totals = this.getTotals();

        // Show/hide empty state
        if (this.items.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartFooter) cartFooter.style.display = 'none';
            cartItemsContainer.innerHTML = '';
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        if (cartFooter) cartFooter.style.display = 'flex';

        // Render cart items
        cartItemsContainer.innerHTML = this.items.map(item => `
      <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
        <img src="${item.image}" alt="${item.name}" class="cart-item__image">
        <div class="cart-item__details">
          <h4 class="cart-item__name">${item.name}</h4>
          <p class="cart-item__size">Talla: ${item.size}</p>
          <p class="cart-item__price">S/ ${item.price.toFixed(2)}</p>
          
          <div class="cart-item__quantity">
            <button class="qty-btn minus" data-action="decrease">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn plus" data-action="increase">+</button>
          </div>
        </div>
        <button class="cart-item__remove" data-action="remove">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `).join('');

        // Update subtotal
        if (cartSubtotal) {
            cartSubtotal.textContent = `S/ ${totals.subtotal}`;
        }

        // Attach event listeners to cart items
        this.attachCartItemListeners();
    }

    // Attach event listeners to cart item buttons
    attachCartItemListeners() {
        const cartItems = document.querySelectorAll('.cart-item');

        cartItems.forEach(item => {
            const id = item.dataset.id;
            const size = item.dataset.size;

            // Remove button
            const removeBtn = item.querySelector('[data-action="remove"]');
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    this.removeItem(id, size);
                });
            }

            // Quantity buttons
            const decreaseBtn = item.querySelector('[data-action="decrease"]');
            const increaseBtn = item.querySelector('[data-action="increase"]');
            const qtyValue = item.querySelector('.qty-value');

            if (decreaseBtn) {
                decreaseBtn.addEventListener('click', () => {
                    const currentQty = parseInt(qtyValue.textContent);
                    this.updateQuantity(id, size, currentQty - 1);
                });
            }

            if (increaseBtn) {
                increaseBtn.addEventListener('click', () => {
                    const currentQty = parseInt(qtyValue.textContent);
                    this.updateQuantity(id, size, currentQty + 1);
                });
            }
        });
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Show with animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Toggle cart sidebar
    toggleSidebar() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');

        if (sidebar && overlay) {
            const isOpen = sidebar.classList.contains('open');

            if (isOpen) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                sidebar.classList.add('open');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Cart toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const cartToggle = document.getElementById('cartToggle');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cartToggle) {
        cartToggle.addEventListener('click', () => cart.toggleSidebar());
    }

    if (cartClose) {
        cartClose.addEventListener('click', () => cart.toggleSidebar());
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => cart.toggleSidebar());
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.items.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
});

// Export for use in other files
window.ShoppingCart = ShoppingCart;
window.cart = cart;
