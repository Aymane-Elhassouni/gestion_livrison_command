/**
 * LivrEx - Client Edit Order Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Wait for core modules to load via app.js
    document.addEventListener('app:ready', () => {
        if (!Auth.requireAuth(['client'])) return;
        initPage();
    });
});

function initPage() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');

    if (!orderId) {
        window.location.href = 'dashboard.html';
        return;
    }

    const order = OrderManager.getById(orderId);
    if (!order || order.status !== 'created') {
        // Only allow editing orders in 'created' status
        window.location.href = 'dashboard.html';
        return;
    }

    // Populate form
    document.getElementById('orderIdDisplay').textContent = `Modification de la commande ${orderId}`;
    document.getElementById('title').value = order.title || '';
    document.getElementById('fromAddress').value = order.fromAddress || '';
    document.getElementById('toAddress').value = order.toAddress || '';
    document.getElementById('weight').value = order.weight || '';
    document.getElementById('description').value = order.description || '';

    // Set back buttons
    const backBtn = document.getElementById('backBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const detailUrl = `order-detail.html?id=${orderId}`;
    if (backBtn) backBtn.href = detailUrl;
    if (cancelBtn) cancelBtn.href = detailUrl;

    // Handle form submission
    const form = document.getElementById('editOrderForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const updates = {
            title: document.getElementById('title').value,
            fromAddress: document.getElementById('fromAddress').value,
            toAddress: document.getElementById('toAddress').value,
            weight: parseFloat(document.getElementById('weight').value),
            description: document.getElementById('description').value
        };

        const updatedOrder = OrderManager.update(orderId, updates);

        if (updatedOrder) {
            UI.showAlert('Commande mise à jour avec succès !', 'success');
            setTimeout(() => {
                window.location.href = `order-detail.html?id=${orderId}`;
            }, 1000);
        } else {
            UI.showAlert('Erreur lors de la mise à jour.', 'danger');
        }
    });

    // Init notifications
    if (typeof initNotifications === 'function') {
        initNotifications('notificationContainer');
    }
}
