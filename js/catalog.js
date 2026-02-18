/* ============================================
   Catalog Page - Load Products from API
   ============================================ */

class CatalogPage {
    constructor() {
        this.products = [];
        this.currentCategory = 'all';
        this.init();
    }

    async init() {
        // Check if backend is running
        const isBackendUp = await window.api.healthCheck();

        if (!isBackendUp) {
            this.showError();
            return;
        }

        // Load products
        await this.loadProducts();

        // Setup category filters
        this.setupFilters();
    }

    async loadProducts(category = null) {
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        const productsGrid = document.getElementById('productsGrid');

        try {
            // Show loading
            if (loadingState) loadingState.style.display = 'flex';
            if (errorState) errorState.style.display = 'none';
            if (productsGrid) productsGrid.style.display = 'none';

            // Fetch products from API
            const response = await window.api.getProducts(category);

            if (response.success) {
                this.products = response.data;
                this.renderProducts();
            } else {
                throw new Error('Failed to load products');
            }

        } catch (error) {
            console.error('Error loading products:', error);
            this.showError(error.message);
        }
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const loadingState = document.getElementById('loadingState');

        if (!productsGrid) return;

        // Hide loading
        if (loadingState) loadingState.style.display = 'none';
        productsGrid.style.display = 'grid';

        if (this.products.length === 0) {
            productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <p style="font-size: 1.1rem; color: var(--mid-gray);">
            No hay productos en esta categoría
          </p>
        </div>
      `;
            return;
        }

        productsGrid.innerHTML = this.products.map((product, index) => `
      <div class="product-card reveal reveal-delay-${(index % 3) + 1}">
        <div class="product-card__image">
          <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
          ${product.badge ? `<span class="product-card__badge">${product.badge}</span>` : ''}
        </div>
        <div class="product-card__info">
          <h3 class="product-card__name">${product.name}</h3>
          <p class="product-card__price">S/ ${parseFloat(product.price).toFixed(2)}</p>
          <button class="quick-add-btn" data-product='${JSON.stringify({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            sizes: product.sizes,
            stock: product.stock
        })}'>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Compra Rápida</span>
          </button>
        </div>
      </div>
    `).join('');

        // Setup quick add buttons
        this.setupQuickAddButtons();
    }

    setupQuickAddButtons() {
        const buttons = document.querySelectorAll('.quick-add-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productData = JSON.parse(btn.dataset.product);

                if (window.quickAddModal) {
                    window.quickAddModal.open(productData);
                }
            });
        });
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Get category
                const category = btn.dataset.category;
                this.currentCategory = category;

                // Load products
                await this.loadProducts(category === 'all' ? null : category);
            });
        });
    }

    showError(message) {
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        const productsGrid = document.getElementById('productsGrid');

        if (loadingState) loadingState.style.display = 'none';
        if (errorState) {
            errorState.style.display = 'flex';
            if (message) {
                const msgEl = errorState.querySelector('.error-message');
                if (msgEl) msgEl.innerHTML += `<br><small>${message}</small>`;
            }
        }
        if (productsGrid) productsGrid.style.display = 'none';
    }
}

// Initialize catalog page
document.addEventListener('DOMContentLoaded', () => {
    new CatalogPage();
});
