/**
 * LivrEx - Client Dashboard Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('app:ready', () => {
        // Check auth
        if (!Auth.requireAuth(['client'])) return;

        const session = Auth.getSession();

        // Update user info
        const avatar = document.getElementById('userAvatar');
        if (avatar) {
            avatar.textContent = session.firstname[0] + (session.lastname?.[0] || '');
        }

        const nameEl = document.getElementById('userName');
        if (nameEl) {
            nameEl.textContent = session.firstname + ' ' + session.lastname;
        }

        // Init notifications
        initNotifications('notificationContainer');

        // Load orders
        loadOrders();
    });
});

function loadOrders() {
    const session = Auth.getSession();
    const orders = OrderManager.getByUserId(session.userId).filter(o => !o.deleted);

    // Update stats
    const totalEl = document.getElementById('totalOrders');
    const pendingEl = document.getElementById('pendingOrders');
    const deliveredEl = document.getElementById('deliveredOrders');

    if (totalEl) totalEl.textContent = orders.length;
    if (pendingEl) pendingEl.textContent = orders.filter(o => ['created', 'pending', 'shipped'].includes(o.status)).length;
    if (deliveredEl) deliveredEl.textContent = orders.filter(o => o.status === 'delivered').length;

    const grid = document.getElementById('ordersGrid');
    const emptyState = document.getElementById('emptyState');

    if (!grid || !emptyState) return;

    if (orders.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');

    grid.innerHTML = orders.map(order => `
        <div class="glass-card glass-card-hover order-card animate-fade-in">
            <div class="order-header">
                <div>
                    <div class="order-id">${order.id}</div>
                    <div class="order-destination">${order.title || 'Sans titre'}</div>
                </div>
                ${UI.getStatusBadge(order.status)}
            </div>
            <div class="order-body">
                <div class="order-info">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    ${order.toAddress}
                </div>
                <div class="order-info">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${UI.formatDate(order.createdAt)}
                </div>
            </div>
            <div class="order-actions">
                <a href="order-detail.html?id=${order.id}" class="btn btn-secondary btn-sm">Détails</a>
                ${order.status === 'created' ? `
                    <a href="edit-order.html?id=${order.id}" class="btn btn-primary btn-sm">Modifier</a>
                    <button class="btn btn-warning btn-sm" onclick="cancelOrder('${order.id}')">Annuler</button>
                ` : ''}
                ${(order.status === 'delivered' || order.status === 'cancelled') && !order.deleted ? `
                    <button class="btn btn-danger btn-sm" onclick="deleteOrder('${order.id}')">Archiver</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function cancelOrder(id) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande?')) {
        OrderManager.cancel(id);
        loadOrders();
    }
}

function deleteOrder(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande?')) {
        OrderManager.softDelete(id);
        loadOrders();
    }
}
