/* ============================================
   Quick Add to Cart Modal & Functionality
   ============================================ */

// Quick Add Modal Management
class QuickAddModal {
    constructor() {
        this.modal = null;
        this.currentProduct = null;
        this.selectedSize = null;
        this.init();
    }

    init() {
        // Create modal HTML
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        const modalHTML = `
      <div class="quick-add-modal" id="quickAddModal">
        <div class="quick-add-modal__overlay"></div>
        <div class="quick-add-modal__content">
          <button class="quick-add-modal__close" aria-label="Cerrar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div class="quick-add-modal__product">
            <img class="quick-add-modal__image" src="" alt="">
            <div class="quick-add-modal__info">
              <h3 class="quick-add-modal__name"></h3>
              <p class="quick-add-modal__price"></p>
            </div>
          </div>

          <div class="quick-add-modal__sizes">
            <label class="quick-add-modal__label">Selecciona una talla:</label>
            <div class="size-options" id="sizeOptions">
              <!-- Dynamic size buttons -->
            </div>
          </div>

          <button class="btn btn--primary btn--full" id="addToCartBtn" disabled>
            Agregar al Carrito
          </button>
        </div>
      </div>
    `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('quickAddModal');
    }

    attachEventListeners() {
        const closeBtn = this.modal.querySelector('.quick-add-modal__close');
        const overlay = this.modal.querySelector('.quick-add-modal__overlay');
        const addToCartBtn = document.getElementById('addToCartBtn');

        closeBtn.addEventListener('click', () => this.close());
        overlay.addEventListener('click', () => this.close());
        addToCartBtn.addEventListener('click', () => this.addToCart());

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(product) {
        this.currentProduct = product;
        this.selectedSize = null;

        // Update modal content
        const image = this.modal.querySelector('.quick-add-modal__image');
        const name = this.modal.querySelector('.quick-add-modal__name');
        const price = this.modal.querySelector('.quick-add-modal__price');
        const sizeOptions = document.getElementById('sizeOptions');

        image.src = product.image;
        image.alt = product.name;
        name.textContent = product.name;
        price.textContent = `S/ ${parseFloat(product.price).toFixed(2)}`;

        // Render size options
        sizeOptions.innerHTML = product.sizes.map(size => `
      <button class="size-option" data-size="${size}">
        ${size}
      </button>
    `).join('');

        // Attach size selection listeners
        this.attachSizeListeners();

        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    attachSizeListeners() {
        const sizeButtons = this.modal.querySelectorAll('.size-option');
        const addToCartBtn = document.getElementById('addToCartBtn');

        sizeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all
                sizeButtons.forEach(b => b.classList.remove('active'));

                // Add active to clicked
                btn.classList.add('active');
                this.selectedSize = btn.dataset.size;

                // Enable add to cart button
                addToCartBtn.disabled = false;
            });
        });
    }

    addToCart() {
        if (!this.selectedSize || !this.currentProduct) return;

        // Add to cart using global cart instance
        window.cart.addItem({
            id: this.currentProduct.id,
            name: this.currentProduct.name,
            price: this.currentProduct.price,
            size: this.selectedSize,
            quantity: 1,
            image: this.currentProduct.image
        });

        this.close();

        // Optional: Auto-open cart sidebar to show the added item
        setTimeout(() => {
            window.cart.toggleSidebar();
        }, 300);
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.selectedSize = null;
        this.currentProduct = null;
    }
}

// Initialize Quick Add Modal
const quickAddModal = new QuickAddModal();

// Attach Quick Add to product cards
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the page to load
    setTimeout(() => {
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach((card, index) => {
            // Extract product data from card
            const nameElement = card.querySelector('.product-card__name');
            const priceElement = card.querySelector('.product-card__price');
            const imageElement = card.querySelector('.product-card__image img');

            if (!nameElement || !priceElement || !imageElement) return;

            const productData = {
                id: `product-${index + 1}`, // Temporary ID until we connect to API
                name: nameElement.textContent.trim(),
                price: priceElement.textContent.replace('S/', '').trim(),
                image: imageElement.src,
                sizes: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'] // Default sizes
            };

            // Create Quick Add button
            const quickAddBtn = document.createElement('button');
            quickAddBtn.className = 'quick-add-btn';
            quickAddBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <span>Compra Rápida</span>
      `;

            quickAddBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                quickAddModal.open(productData);
            });

            // Add button to card
            const cardInfo = card.querySelector('.product-card__info');
            if (cardInfo) {
                cardInfo.appendChild(quickAddBtn);
            }
        });
    }, 100);
});

// Export for use
window.QuickAddModal = QuickAddModal;
window.quickAddModal = quickAddModal;
