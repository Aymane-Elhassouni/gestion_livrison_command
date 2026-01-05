/**
 * LivrEx - Client Order Detail Page Logic
 */

let currentOrder = null;

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('app:ready', () => {
        if (!Auth.requireAuth(['client'])) return;
        initNotifications('notificationContainer');
        loadOrder();
    });
});

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

    // Populate order details
    const titleEl = document.getElementById('orderTitle');
    const idEl = document.getElementById('orderId');
    const statusEl = document.getElementById('orderStatus');
    const fromEl = document.getElementById('fromAddress');
    const toEl = document.getElementById('toAddress');
    const weightEl = document.getElementById('weight');
    const createdAtEl = document.getElementById('createdAt');
    const descEl = document.getElementById('description');

    if (titleEl) titleEl.textContent = currentOrder.title || 'Sans titre';
    if (idEl) idEl.textContent = currentOrder.id;
    if (statusEl) statusEl.innerHTML = UI.getStatusBadge(currentOrder.status);
    if (fromEl) fromEl.textContent = currentOrder.fromAddress;
    if (toEl) toEl.textContent = currentOrder.toAddress;
    if (weightEl) weightEl.textContent = currentOrder.weight + ' kg';
    if (createdAtEl) createdAtEl.textContent = UI.formatDate(currentOrder.createdAt);
    if (descEl) descEl.textContent = currentOrder.description || 'Aucune description';

    // Render components
    renderActions();
    renderOffers();
    renderTimeline();
}

function renderActions() {
    const container = document.getElementById('orderActions');
    if (!container) return;

    let html = '';

    if (currentOrder.status === 'created') {
        html = `
            <div class="flex gap-3">
                <a href="edit-order.html?id=${currentOrder.id}" class="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Modifier la commande
                </a>
                <button class="btn btn-warning" onclick="cancelCurrentOrder()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    Annuler la commande
                </button>
            </div>`;
    } else if (currentOrder.status === 'shipped') {
        html = `<button class="btn btn-success" onclick="validateDelivery()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Valider la livraison
        </button>`;
    } else if (currentOrder.status === 'delivered') {
        html = `
            <div class="flex items-center justify-between gap-4">
                <div class="text-green-400 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Commande livrée avec succès
                </div>
                <button class="btn btn-danger btn-sm" onclick="deleteOrder()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    Archiver
                </button>
            </div>`;
    } else if (currentOrder.status === 'cancelled') {
        html = `
            <div class="flex items-center justify-between gap-4">
                <div class="text-red-400 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    Commande annulée
                </div>
                <button class="btn btn-danger btn-sm" onclick="deleteOrder()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    Archiver
                </button>
            </div>`;
    }

    container.innerHTML = html;
}

function renderOffers() {
    const offers = OfferManager.getByOrderId(currentOrder.id);
    const container = document.getElementById('offersContainer');
    if (!container) return;

    if (offers.length === 0) {
        container.innerHTML = `<div class="text-center py-8 text-gray-400">
            <p>Aucune offre pour le moment</p>
            <p class="text-sm mt-1">Les livreurs verront votre commande et pourront vous proposer leurs services</p>
        </div>`;
        return;
    }

    container.innerHTML = offers.map(offer => {
        const livreur = UserManager.getById(offer.livreurId);
        const isAccepted = offer.status === 'accepted';

        return `
            <div class="p-4 rounded-lg bg-gray-800/50 border ${isAccepted ? 'border-green-500/50' : 'border-gray-700'} mb-3">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                            ${livreur?.firstname?.[0] || 'L'}${livreur?.lastname?.[0] || ''}
                        </div>
                        <div>
                            <p class="font-medium">${livreur?.firstname || 'Livreur'} ${livreur?.lastname || ''}</p>
                            <p class="text-sm text-gray-400">${UI.formatRelativeTime(offer.createdAt)}</p>
                        </div>
                    </div>
                    ${isAccepted ? '<span class="badge badge-delivered">Acceptée</span>' :
                offer.status === 'rejected' ? '<span class="badge badge-cancelled">Refusée</span>' : ''}
                </div>
                <div class="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                        <span class="text-gray-400">Prix:</span>
                        <span class="text-white font-bold text-lg ml-1">${UI.formatCurrency(offer.price)}€</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Durée:</span>
                        <span class="text-white ml-1">${offer.estimatedDuration}</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Véhicule:</span>
                        <span class="text-white ml-1 capitalize">${offer.vehicleType}</span>
                    </div>
                    <div class="flex gap-2">
                        ${offer.express ? '<span class="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Express</span>' : ''}
                        ${offer.fragile ? '<span class="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">Fragile</span>' : ''}
                    </div>
                </div>
                ${offer.status === 'pending' && currentOrder.status !== 'delivered' ? `
                    <button class="btn btn-success btn-sm w-full" onclick="acceptOffer('${offer.id}')">
                        Accepter cette offre
                    </button>
                ` : ''}
            </div>
        `;
    }).join('');
}

function renderTimeline() {
    const timelineEl = document.getElementById('timeline');
    if (!timelineEl) return;

    const currentStatus = currentOrder.status;
    const statuses = ['created', 'pending', 'shipped', 'delivered'];

    // Add cancelled state if needed
    if (currentStatus === 'cancelled') {
        statuses.push('cancelled');
    }

    const statusLabels = {
        created: 'Commande créée',
        pending: 'Offre acceptée',
        shipped: 'En cours de livraison',
        delivered: 'Livrée',
        cancelled: 'Annulée'
    };

    const currentIndex = statuses.indexOf(currentStatus);

    timelineEl.innerHTML = statuses.map((status, i) => {
        const isCompleted = i < currentIndex;
        const isActive = i === currentIndex;
        const isLast = i === statuses.length - 1;

        let dateHtml = '';
        const rawDate = currentOrder.createdAt;

        if (rawDate) {
            if (status === 'created') {
                dateHtml = `<div class="timeline-date">${UI.formatDate(rawDate)}</div>`;
            } else if (isActive || isCompleted) {
                // Mocking dates for other steps if completed/active for better visual
                try {
                    const baseDate = new Date(rawDate);
                    const stepDate = new Date(baseDate.getTime() + (i * 3600000)); // +1h per step
                    dateHtml = `<div class="timeline-date">${UI.formatDate(stepDate.toISOString())}</div>`;
                } catch (e) {
                    console.error("Date calculation error", e);
                }
            }
        }

        return `
            <div class="timeline-item">
                <div class="timeline-dot ${isCompleted ? 'completed' : isActive ? 'active' : ''}"></div>
                <div class="timeline-content">
                    <div class="timeline-title ${isCompleted || isActive ? 'text-white' : 'text-gray-500'}">
                        ${statusLabels[status] || status}
                    </div>
                    ${dateHtml}
                </div>
            </div>
        `;
    }).join('');
}

function acceptOffer(offerId) {
    if (confirm('Accepter cette offre?')) {
        OfferManager.accept(offerId);

        // Notify livreur
        const offer = OfferManager.getById(offerId);
        NotificationManager.create({
            userId: offer.livreurId,
            type: 'accepted',
            orderId: currentOrder.id,
            title: 'Offre acceptée!',
            message: `Votre offre pour ${currentOrder.id} a été acceptée`
        });

        showAlert('Offre acceptée!', 'success');
        loadOrder();
    }
}

function validateDelivery() {
    if (confirm('Confirmer la réception de la livraison?')) {
        OrderManager.updateStatus(currentOrder.id, 'delivered');

        // Notify livreur
        const offer = OfferManager.getByOrderId(currentOrder.id).find(o => o.status === 'accepted');
        if (offer) {
            NotificationManager.create({
                userId: offer.livreurId,
                type: 'delivered',
                orderId: currentOrder.id,
                title: 'Livraison confirmée',
                message: `Le client a confirmé la réception de ${currentOrder.id}`
            });
        }

        showAlert('Livraison validée!', 'success');
        loadOrder();
    }
}

function deleteOrder() {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande de votre historique ?')) {
        OrderManager.softDelete(currentOrder.id);
        window.location.href = 'dashboard.html';
    }
}

function cancelCurrentOrder() {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
        OrderManager.cancel(currentOrder.id);
        showAlert('Commande annulée avec succès', 'warning');
        loadOrder();
    }
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        alertContainer.innerHTML = `<div class="alert alert-${type} mb-4">${message}</div>`;
    }
}
