const ADMIN_API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:3001/api'
    : 'https://valu-baby-backend.onrender.com/api';

class AdminDashboard {
    constructor() {
        this.token = localStorage.getItem('adminToken');
        this.orders = [];
        this.currentFilter = 'ALL';

        this.init();
    }

    init() {
        // Elements
        this.loginScreen = document.getElementById('loginScreen');
        this.dashboardScreen = document.getElementById('dashboardScreen');
        this.loginForm = document.getElementById('loginForm');
        this.loginError = document.getElementById('loginError');
        this.ordersTableBody = document.getElementById('ordersTableBody');

        // Listeners
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('refreshBtn').addEventListener('click', () => this.fetchOrders());

        // Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target));
        });

        // Close modal
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('orderModal').classList.remove('show');
        });

        // Initial check
        if (this.token) {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        this.loginScreen.classList.remove('hidden');
        this.dashboardScreen.classList.add('hidden');
    }

    showDashboard() {
        this.loginScreen.classList.add('hidden');
        this.dashboardScreen.classList.remove('hidden');
        this.fetchOrders();
    }

    async handleLogin(e) {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        this.loginError.textContent = '';

        try {
            const response = await fetch(`${ADMIN_API_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (data.success) {
                this.token = data.token;
                localStorage.setItem('adminToken', this.token);
                this.showDashboard();
            } else {
                this.loginError.textContent = 'Contraseña incorrecta';
            }
        } catch (error) {
            console.error(error);
            this.loginError.textContent = 'Error de conexión';
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem('adminToken');
        this.showLogin();
    }

    async fetchOrders() {
        try {
            const response = await fetch(`${ADMIN_API_URL}/orders`, {
                headers: {
                    'x-admin-token': this.token
                }
            });

            if (response.status === 401) {
                this.logout();
                return;
            }

            const data = await response.json();
            if (data.success) {
                this.orders = data.data;
                this.updateStats();
                this.renderOrders();
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    updateStats() {
        const pending = this.orders.filter(o => o.status === 'PENDING').length;
        const confirmed = this.orders.filter(o => ['CONFIRMED', 'PAID', 'SHIPPED'].includes(o.status)).length;
        const total = this.orders
            .filter(o => ['CONFIRMED', 'PAID', 'SHIPPED'].includes(o.status))
            .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

        document.getElementById('countPending').textContent = pending;
        document.getElementById('countConfirmed').textContent = confirmed;
        document.getElementById('totalSales').textContent = `S/ ${total.toFixed(2)}`;
    }

    setFilter(btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.status;
        this.renderOrders();
    }

    renderOrders() {
        let filtered = this.orders;
        if (this.currentFilter !== 'ALL') {
            filtered = this.orders.filter(o => o.status === this.currentFilter);
        }

        this.ordersTableBody.innerHTML = filtered.map(order => `
            <tr>
                <td>${order.orderNumber}</td>
                <td>
                    <b>${order.customerName}</b><br>
                    <small>${order.customerPhone}</small>
                </td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                <td>S/ ${parseFloat(order.total).toFixed(2)}</td>
                <td>
                    <button class="btn btn--small" onclick="admin.viewOrder('${order.id}')">Ver Detalle</button>
                </td>
            </tr>
        `).join('');

        if (filtered.length === 0) {
            this.ordersTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center">No hay pedidos</td></tr>';
        }
    }

    async viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const modal = document.getElementById('orderModal');
        const content = document.getElementById('orderDetailContent');

        content.innerHTML = `
            <h2>Orden #${order.orderNumber}</h2>
            <div class="status-badge status-${order.status}" style="display:inline-block; margin-bottom:1rem">${order.status}</div>

            <div class="detail-grid">
                <div class="detail-section">
                    <h3>Cliente</h3>
                    <p><strong>Nombre:</strong> ${order.customerName}</p>
                    <p><strong>Email:</strong> ${order.customerEmail}</p>
                    <p><strong>Teléfono:</strong> ${order.customerPhone}</p>
                    <p><strong>DNI:</strong> ${order.customerDNI || '-'}</p>
                </div>
                <div class="detail-section">
                    <h3>Envío</h3>
                    <p><strong>Dirección:</strong> ${order.shippingAddress.direccion}</p>
                    <p><strong>Distrito:</strong> ${order.shippingAddress.distrito}, ${order.shippingAddress.provincia}</p>
                    <p><strong>Referencia:</strong> ${order.shippingAddress.referencia || '-'}</p>
                </div>
            </div>

            <div class="detail-section">
                <h3>Productos</h3>
                <table class="data-table">
                    ${order.items.map(item => `
                        <tr>
                            <td>
                                <!-- <img src="${item.product.images[0]}" alt="${item.product.name}"> -->
                                <b>${item.product.name}</b> (${item.size})
                            </td>
                            <td>x${item.quantity}</td>
                            <td>S/ ${parseFloat(item.price).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>

            <div class="detail-grid">
                <div>
                   <h3>Pago</h3>
                   <p><strong>Método:</strong> ${order.paymentMethod}</p> 
                   <p><strong>Subtotal:</strong> S/ ${parseFloat(order.subtotal).toFixed(2)}</p>
                   <p><strong>Envío:</strong> S/ ${parseFloat(order.shipping).toFixed(2)}</p>
                   <p style="font-size:1.2rem; margin-top:0.5rem"><strong>Total:</strong> S/ ${parseFloat(order.total).toFixed(2)}</p>
                </div>
                <div style="text-align:right">
                    <h3>Acciones</h3>
                    ${order.status === 'PENDING' ? `
                        <button class="btn btn--primary" onclick="admin.updateStatus('${order.id}', 'CONFIRMED')">✅ Confirmar Pago</button>
                    ` : ''}
                    ${order.status === 'CONFIRMED' ? `
                        <button class="btn btn--primary" onclick="admin.updateStatus('${order.id}', 'SHIPPED')">📦 Marcar Enviado</button>
                    ` : ''}
                </div>
            </div>
        `;

        modal.classList.add('show');
    }

    async updateStatus(orderId, newStatus) {
        if (!confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) return;

        try {
            const response = await fetch(`${ADMIN_API_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': this.token
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                alert('Estado actualizado');
                document.getElementById('orderModal').classList.remove('show');
                this.fetchOrders();
            } else {
                alert('Error al actualizar estado');
            }
        } catch (error) {
            console.error(error);
        }
    }
}

const admin = new AdminDashboard();
window.admin = admin; // Expose for onclick handlers
