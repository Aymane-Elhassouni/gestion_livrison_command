/**
 * LivrEx - Livreur Dashboard Page Logic
 */

let activeTab = 'available';

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('app:ready', () => {
        if (!Auth.requireAuth(['livreur'])) return;

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

        // Initial load
        loadOrders();
    });
});

function switchTab(tab) {
    activeTab = tab;
    const tabs = ['available', 'offers', 'missions'];
    const tabBtns = {
        available: document.getElementById('tabAvailable'),
        offers: document.getElementById('tabOffers'),
        missions: document.getElementById('tabMissions')
    };

    tabs.forEach(t => {
        const btn = tabBtns[t];
        if (!btn) return;

        if (t === tab) {
            btn.classList.add('active');
            btn.classList.remove('border-transparent', 'text-gray-400');
        } else {
            btn.classList.remove('active');
            btn.classList.add('border-transparent', 'text-gray-400');
        }
    });

    loadOrders();
}

function loadOrders() {
    const session = Auth.getSession();

    // Stats and Data preparation
    const allOffers = OfferManager.getByLivreurId(session.userId);
    const myAcceptedOffers = allOffers.filter(o => o.status === 'accepted');
    const myPendingOffers = allOffers.filter(o => o.status === 'pending');

    let ongoingCount = 0;
    let deliveredCount = 0;
    let earnings = 0;

    myAcceptedOffers.forEach(offer => {
        const order = OrderManager.getById(offer.orderId);
        if (order) {
            if (order.status === 'delivered') {
                deliveredCount++;
                earnings += offer.price;
            } else if (['pending', 'shipped'].includes(order.status)) {
                ongoingCount++;
            }
        }
    });

    const availEl = document.getElementById('availableOrders');
    const ongoingEl = document.getElementById('ongoingDeliveries');
    const deliveredEl = document.getElementById('deliveredOrders');

    if (availEl) availEl.textContent = OrderManager.getAvailable().length;
    if (ongoingEl) ongoingEl.textContent = ongoingCount;
    if (deliveredEl) deliveredEl.textContent = deliveredCount;

    const earningsEl = document.getElementById('totalEarnings');
    if (earningsEl) {
        const currentValue = parseFloat(earningsEl.textContent) || 0;
        if (currentValue !== earnings) {
            UI.animateCounter(earningsEl, earnings);
        } else {
            earningsEl.textContent = UI.formatCurrency(earnings);
        }
    }

    // Filter orders for the grid based on active tab
    let displayOrders = [];
    if (activeTab === 'available') {
        const available = OrderManager.getAvailable();
        // Hide orders where I already have an offer (they go to 'Mes Offres')
        displayOrders = available.filter(order => !allOffers.some(o => o.orderId === order.id));
    } else if (activeTab === 'offers') {
        // Show unique orders where I have pending offers
        const uniqueOrderIds = [...new Set(myPendingOffers.map(o => o.orderId))];
        displayOrders = uniqueOrderIds
            .map(id => OrderManager.getById(id))
            .filter(o => o && o.status === 'created')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
        // Show unique orders for my missions (accepted)
        const uniqueOrderIds = [...new Set(myAcceptedOffers.map(o => o.orderId))];
        displayOrders = uniqueOrderIds
            .map(id => OrderManager.getById(id))
            .filter(o => o)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const grid = document.getElementById('ordersGrid');
    const emptyState = document.getElementById('emptyState');

    if (!grid || !emptyState) return;

    if (displayOrders.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        const emptyTitle = emptyState.querySelector('.empty-title');
        if (emptyTitle) {
            if (activeTab === 'available') emptyTitle.textContent = 'Aucune commande disponible';
            else if (activeTab === 'offers') emptyTitle.textContent = 'Aucune offre en cours';
            else emptyTitle.textContent = 'Aucune mission pour le moment';
        }
        return;
    }

    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');

    grid.innerHTML = displayOrders.map(order => {
        const offers = OfferManager.getByOrderId(order.id);
        const myOfferForOrder = allOffers.find(o => o.orderId === order.id);
        const client = UserManager.getById(order.userId);

        return `
            <div class="glass-card glass-card-hover order-card animate-fade-in ${order.status === 'delivered' ? 'opacity-75' : ''}">
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
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        ${client?.firstname || 'Client'} ${client?.lastname || ''}
                    </div>
                    <div class="order-info">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        ${order.toAddress}
                    </div>
                    <div class="order-info">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        ${order.weight} kg
                    </div>
                    ${offers.length > 0 ? `
                        <div class="mt-3 pt-3 border-t border-gray-700">
                            <p class="text-sm text-gray-400 mb-2">${offers.length} offre(s)</p>
                            <div class="flex flex-wrap gap-2">
                                ${offers.filter(o => o.livreurId !== session.userId).map(o => {
            const l = UserManager.getById(o.livreurId);
            return `<span class="text-xs px-2 py-1 bg-gray-700 rounded">${l?.firstname || 'Livreur'}: ••.••€</span>`;
        }).join('')}
                                ${myOfferForOrder ? `
                                    <span class="text-xs px-2 py-1 ${myOfferForOrder.status === 'accepted' ? 'bg-green-500/20 text-green-300' : 'bg-indigo-500/30 text-indigo-300'} rounded font-medium">
                                        Votre offre: ${UI.formatCurrency(myOfferForOrder.price)}€ ${myOfferForOrder.status === 'accepted' ? '✅' : '⏳'}
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="order-actions">
                    ${activeTab !== 'available' ? `
                        <a href="order-detail.html?id=${order.id}" class="btn btn-secondary btn-sm w-full">Détails de la mission</a>
                    ` : `
                        <a href="make-offer.html?orderId=${order.id}" class="btn btn-primary btn-sm w-full">Proposer mes services</a>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

function showEarningDetails() {
    const session = Auth.getSession();
    const myAcceptedOffers = OfferManager.getByLivreurId(session.userId).filter(o => o.status === 'accepted');

    const deliveredMissions = [];
    let total = 0;

    myAcceptedOffers.forEach(offer => {
        const order = OrderManager.getById(offer.orderId);
        if (order && order.status === 'delivered') {
            deliveredMissions.push({
                id: order.id,
                title: order.title,
                date: order.createdAt,
                amount: offer.price
            });
            total += offer.price;
        }
    });

    const content = `
        <div class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <span class="text-gray-400">Total Accumulé</span>
                <span class="text-2xl font-bold text-white">${UI.formatCurrency(total)}€</span>
            </div>
            
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Commande</th>
                            <th>Date</th>
                            <th class="text-right">Gain</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${deliveredMissions.length === 0 ?
            '<tr><td colspan="3" class="text-center py-4 text-gray-500">Aucun gain pour le moment</td></tr>' :
            deliveredMissions.map(m => `
                                <tr>
                                    <td>
                                        <div class="font-medium">${m.title || 'Sans titre'}</div>
                                        <div class="text-xs text-gray-500">${m.id}</div>
                                    </td>
                                    <td class="text-sm text-gray-400">${UI.formatDate(m.date)}</td>
                                    <td class="text-right font-bold text-green-400">+${UI.formatCurrency(m.amount)}€</td>
                                </tr>
                            `).join('')
        }
                    </tbody>
                </table>
            </div>
        </div>
    `;

    UI.showModal('Détail de mes revenus', content);
}
