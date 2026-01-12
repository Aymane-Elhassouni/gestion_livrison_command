/**
 * Livreur Make Offer Page Logic
 */

let currentOrder = null;

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('app:ready', () => {
        if (!Auth.requireAuth(['livreur'])) return;
        initPage();
    });
});

function initPage() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');

    if (!orderId) {
        window.location.href = 'dashboard.html';
        return;
    }

    currentOrder = OrderManager.getById(orderId);
    if (!currentOrder) {
        window.location.href = 'dashboard.html';
        return;
    }

    renderOrderSummary();
    setupForm();
}

/**
 * Render summary of the order for which the offer is being made
 */
function renderOrderSummary() {
    const client = UserManager.getById(currentOrder.userId);
    const summaryContainer = document.getElementById('orderSummary');

    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p class="text-gray-400">Commande</p>
                    <p class="text-white font-medium">${currentOrder.id}</p>
                </div>
                <div>
                    <p class="text-gray-400">Client</p>
                    <p class="text-white font-medium">${client?.firstname || 'Client'} ${client?.lastname || ''}</p>
                </div>
                <div class="col-span-2">
                    <p class="text-gray-400">Destination</p>
                    <p class="text-white">${currentOrder.toAddress}</p>
                </div>
                <div>
                    <p class="text-gray-400">Poids</p>
                    <p class="text-white">${currentOrder.weight} kg</p>
                </div>
            </div>
        `;
    }
}

/**
 * Setup the offer form event listeners
 */
function setupForm() {
    const form = document.getElementById('offerForm');
    if (form) {
        form.addEventListener('submit', handleOfferSubmit);
    }
}

/**
 * Handle offer form submission
 * @param {Event} e 
 */
function handleOfferSubmit(e) {
    e.preventDefault();

    const session = Auth.getSession();
    const price = parseFloat(document.getElementById('price').value);
    const duration = document.getElementById('duration').value.trim();
    const vehicleType = document.getElementById('vehicleType').value;
    const express = document.getElementById('express').checked;
    const fragile = document.getElementById('fragile').checked;

    if (!price || !duration || !vehicleType) {
        showAlert('Veuillez remplir tous les champs', 'danger');
        return;
    }

    // Check if livreur already has an offer for this order
    const existingOffers = OfferManager.getByOrderId(currentOrder.id);
    const alreadyBidded = existingOffers.some(o => o.livreurId === session.userId);

    if (alreadyBidded) {
        showAlert('Vous avez déjà fait une offre pour cette commande', 'warning');
        return;
    }

    // Create offer
    const offer = OfferManager.create({
        orderId: currentOrder.id,
        livreurId: session.userId,
        price,
        estimatedDuration: duration,
        vehicleType,
        express,
        fragile
    });

    // Notify client
    NotificationManager.create({
        userId: currentOrder.userId,
        type: 'offer',
        orderId: currentOrder.id,
        title: 'Nouvelle offre reçue',
        message: `${session.firstname} ${session.lastname} propose ${UI.formatCurrency(price)}€ pour ${currentOrder.id}`
    });

    showAlert('Offre envoyée avec succès!', 'success');

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

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
