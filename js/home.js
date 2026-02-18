/* ============================================
   Home Page - Load Featured Products from API
   ============================================ */

class HomePage {
    constructor() {
        this.products = [];
        this.init();
    }

    async init() {
        // Load products with retry (handling Render cold starts)
        await this.loadProductsWithRetry();
    }

    async loadProductsWithRetry(maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // console.log(`Loading featured products (attempt ${attempt}/${maxRetries})...`);
                await this.loadProducts();
                return; // Success, exit
            } catch (error) {
                console.warn(`Attempt ${attempt} failed:`, error.message);
                if (attempt < maxRetries) {
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }
        }
        // All retries failed
        this.showError('No se pudieron cargar los productos destacados.');
    }

    async loadProducts() {
        const productsGrid = document.querySelector('.collection__grid');
        if (!productsGrid) return;

        try {
            // Show loading state if needed (HTML might already have a spinner or skeleton)
            // For now, we'll just clear the grid when we are ready to render

            // Fetch products from API
            const response = await window.api.getProducts();

            if (response.success) {
                // Determine which products to show
                // Since we don't have a "featured" flag yet, we'll take the first 8-12 products
                // Or shuffle them to make it look dynamic? Let's keep it consistent for now.
                this.products = response.data.slice(0, 8);
                this.renderProducts();
            } else {
                throw new Error('Failed to load products');
            }

        } catch (error) {
            console.error('Error loading products:', error);
            throw error; // Re-throw for retry logic
        }
    }

    renderProducts() {
        const productsGrid = document.querySelector('.collection__grid');
        if (!productsGrid) return;

        if (this.products.length === 0) {
            productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <p style="font-size: 1.1rem; color: var(--mid-gray);">
            Proximamente nuevos productos
          </p>
        </div>
      `;
            return;
        }

        productsGrid.innerHTML = this.products.map((product, index) => `
      <div class="product-card reveal reveal-delay-${(index % 3) + 1} visible">
        <a href="product.html?id=${product.id}" class="product-card__link">
          <div class="product-card__image">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
            ${product.badge ? `<span class="product-card__badge">${product.badge}</span>` : ''}
          </div>
          <div class="product-card__info">
            <h3 class="product-card__name">${product.name}</h3>
            <p class="product-card__price">S/ ${parseFloat(product.price).toFixed(2)}</p>
          </div>
        </a>
      </div>
    `).join('');

        // Note: I removed the Quick Add button from homepage for cleaner look, 
        // as per the observed "Collection" section style in index.html which didn't seem to have buttons in the snippet I saw?
        // Wait, looking at index.html snippet (lines 101-124), they did NOT have quick add buttons. 
        // They were just links. So I will keep it simple as links.

        // Trigger reveal animations
        const revealCards = productsGrid.querySelectorAll('.reveal');
        revealCards.forEach((card, index) => {
            // Add visible class immediately or with slight stagger
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
    }

    showError(message) {
        const productsGrid = document.querySelector('.collection__grid');
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--mid-gray);">
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});
