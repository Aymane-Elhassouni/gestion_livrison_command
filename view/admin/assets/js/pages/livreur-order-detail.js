/**
 * Livreur Order Detail Page Logic
 */

let currentOrder = null;
let myOffer = null;

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('app:ready', () => {
        if (!Auth.requireAuth(['livreur'])) return;
        initNotifications('notificationContainer');
        loadOrder();
    });
});

/**
 * Load order data and render the page
 */
function loadOrder() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');

    if (!orderId) {
        window.location.href = 'dashboard.html';
        return;
    }

    currentOrder = OrderManager.getById(orderId);
    if (!currentOrder) {
        window.location.href = 'dashboard.html';
        return;
    }

    const session = Auth.getSession();
    myOffer = OfferManager.getByOrderId(orderId).find(o => o.livreurId === session.userId);
    const client = UserManager.getById(currentOrder.userId);

    // Update UI elements
    document.getElementById('orderTitle').textContent = currentOrder.title || 'Sans titre';
    document.getElementById('orderId').textContent = currentOrder.id;
    document.getElementById('orderStatus').innerHTML = UI.getStatusBadge(currentOrder.status);
    document.getElementById('clientName').textContent = `${client?.firstname || 'Client'} ${client?.lastname || ''}`;
    document.getElementById('fromAddress').textContent = currentOrder.fromAddress;
    document.getElementById('toAddress').textContent = currentOrder.toAddress;
    document.getElementById('weight').textContent = currentOrder.weight + ' kg';
    document.getElementById('createdAt').textContent = UI.formatDate(currentOrder.createdAt);
    document.getElementById('description').textContent = currentOrder.description || 'Aucune description';

    renderMyOffer();
    renderActions();
}

/**
 * Render the current user's offer details
 */
function renderMyOffer() {
    const section = document.getElementById('myOfferSection');

    if (!myOffer) {
        section.classList.add('hidden');
        return;
    }

    section.classList.remove('hidden');

    const statusBadge = myOffer.status === 'accepted' ?
        '<span class="badge badge-delivered">Acceptée</span>' :
        myOffer.status === 'rejected' ?
            '<span class="badge badge-cancelled">Refusée</span>' :
            '<span class="badge badge-pending">En attente</span>';

    section.innerHTML = `
        <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold">Votre offre</h3>
            ${statusBadge}
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
                <span class="text-gray-400">Prix:</span>
                <span class="text-white font-bold ml-1">${UI.formatCurrency(myOffer.price)}€</span>
            </div>
            <div>
                <span class="text-gray-400">Durée:</span>
                <span class="text-white ml-1">${myOffer.estimatedDuration}</span>
            </div>
            <div>
                <span class="text-gray-400">Véhicule:</span>
                <span class="text-white ml-1 capitalize">${myOffer.vehicleType}</span>
            </div>
            <div class="flex gap-2">
                ${myOffer.express ? '<span class="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">Express</span>' : ''}
                ${myOffer.fragile ? '<span class="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">Fragile</span>' : ''}
            </div>
        </div>
    `;
}

/**
 * Render available actions based on order status
 */
function renderActions() {
    const section = document.getElementById('actionsSection');
    section.classList.remove('hidden');

    if (myOffer?.status === 'accepted' && currentOrder.status === 'pending') {
        section.innerHTML = `
            <button class="btn btn-primary" onclick="markAsShipped()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                Marquer comme Expédiée
            </button>
        `;
    } else if (currentOrder.status === 'shipped') {
        section.innerHTML = `
            <div class="flex items-center gap-2 text-purple-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                En cours de livraison - En attente de confirmation client
            </div>
        `;
    } else if (currentOrder.status === 'delivered') {
        section.innerHTML = `
            <div class="flex items-center gap-2 text-green-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Livraison terminée avec succès!
            </div>
        `;
    } else {
        section.classList.add('hidden');
    }
}

/**
 * Mark the order as shipped
 */
window.markAsShipped = function () {
    if (confirm('Confirmer que la commande est en cours de livraison?')) {
        OrderManager.updateStatus(currentOrder.id, 'shipped');

        // Notify client
        NotificationManager.create({
            userId: currentOrder.userId,
            type: 'shipped',
            orderId: currentOrder.id,
            title: 'Commande expédiée',
            message: `Votre commande ${currentOrder.id} est en cours de livraison`
        });

        showAlert('Statut mis à jour!', 'success');
        loadOrder();
    }
};

/**
 * Display alert message
 * @param {string} message 
 * @param {string} type 
 */
function showAlert(message, type) {
    const container = document.getElementById('alertContainer');
    if (container) {
        container.innerHTML = `<div class="alert alert-${type} mb-4">${message}</div>`;
    }
}
