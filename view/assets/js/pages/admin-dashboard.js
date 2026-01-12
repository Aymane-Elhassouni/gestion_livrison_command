/**
 * LivrEx - Admin Dashboard Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('app:ready', () => {
        if (!Auth.requireAuth(['admin'])) return;

        const session = Auth.getSession();
        const avatar = document.getElementById('userAvatar');
        const nameEl = document.getElementById('userName');

        if (avatar) avatar.textContent = session.firstname[0] + (session.lastname?.[0] || '');
        if (nameEl) nameEl.textContent = session.firstname + ' ' + session.lastname;

        initNotifications('notificationContainer');
        loadAllData();
    });
});

function loadAllData() {
    loadStats();
    loadUsers();
}

function loadStats() {
    const orderStats = Stats.getOrderStats();
    const userStats = Stats.getUserStats();
    const financialStats = Stats.getFinancialStats();
    const healthStats = Stats.getPlatformHealth();

    // Main counters
    animateCounter('totalOrders', orderStats.total);
    animateCounter('deliveredOrders', orderStats.delivered);
    animateCounter('cancelledOrders', orderStats.cancelled);
    animateCounter('activeLivreurs', userStats.activeLivreurs);

    // Financial counters
    animateCounter('totalRevenue', financialStats.totalRevenue);
    animateCounter('commissions', financialStats.commissions);
    animateCounter('pendingVolume', financialStats.pendingVolume);

    // Platform health
    document.getElementById('successRate').textContent = healthStats.successRate + '%';
    document.getElementById('successRateBar').style.width = healthStats.successRate + '%';
    document.getElementById('acceptanceRate').textContent = healthStats.acceptanceRate + '%';
    document.getElementById('acceptanceRateBar').style.width = healthStats.acceptanceRate + '%';
}

function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const increment = Math.ceil(target / 30) || 1;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = (target % 1 === 0) ? target : target.toFixed(2);
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 30);
}

function showStatDetails(type) {
    let title = '';
    let data = [];
    let content = '';

    if (type === 'livreurs') {
        title = 'Livreurs Actifs';
        data = UserManager.getAll().filter(u => u.role === 'livreur' && u.active);
        content = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Véhicule</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(u => `
                            <tr>
                                <td>${u.firstname || 'Livreur'} ${u.lastname || ''}</td>
                                <td>${u.email || '-'}</td>
                                <td><span class="badge badge-shipped">${u.vehicle || 'Standard'}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else {
        const orders = OrderManager.getActive();
        if (type === 'total') {
            title = 'Toutes les commandes';
            data = orders;
        } else if (type === 'delivered') {
            title = 'Commandes terminées';
            data = orders.filter(o => o.status === 'delivered');
        } else if (type === 'cancelled') {
            title = 'Commandes annulées';
            data = orders.filter(o => o.status === 'cancelled');
        }

        content = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Client</th>
                            <th>Statut</th>
                            <th>Poids</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(o => {
            const client = UserManager.getById(o.userId);
            return `
                                <tr>
                                    <td><span class="text-xs font-mono text-gray-400">${o.id || 'N/A'}</span></td>
                                    <td>${client?.firstname || 'Client'} ${client?.lastname || ''}</td>
                                    <td>${UI.getStatusBadge(o.status || 'created')}</td>
                                    <td>${o.weight || '0'} kg</td>
                                </tr>
                            `;
        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    if (data.length === 0) {
        content = `<div class="text-center py-8 text-gray-500">Aucune donnée à afficher</div>`;
    }

    UI.showModal(title, content);
}

function loadUsers() {
    const users = UserManager.getAll();
    const session = Auth.getSession();

    document.getElementById('userCount').textContent = users.length;

    document.getElementById('usersTableBody').innerHTML = users.map(user => {
        const isCurrentUser = user.id === session.userId;
        return `
            <tr>
                <td>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                            ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                user.role === 'livreur' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-indigo-500/20 text-indigo-400'}">
                            ${(user.firstname || 'U')[0]}${(user.lastname || '')[0] || ''}
                        </div>
                        <div>
                            <div class="font-medium">${user.firstname || 'Utilisateur'} ${user.lastname || ''}</div>
                            <div class="text-xs text-gray-500">ID: ${user.id || '-'}</div>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>
                    <select class="form-select py-1 px-2 text-sm" onchange="changeRole(${user.id}, this.value)" ${isCurrentUser ? 'disabled' : ''}>
                        <option value="client" ${user.role === 'client' ? 'selected' : ''}>Client</option>
                        <option value="livreur" ${user.role === 'livreur' ? 'selected' : ''}>Livreur</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </td>
                <td>
                    ${user.active ?
                '<span class="badge badge-delivered">Actif</span>' :
                '<span class="badge badge-cancelled">Inactif</span>'}
                </td>
                <td>
                    ${!isCurrentUser ? `
                        <button class="btn ${user.active ? 'btn-danger' : 'btn-success'} btn-sm" onclick="toggleActive(${user.id})">
                            ${user.active ? 'Désactiver' : 'Activer'}
                        </button>
                    ` : '<span class="text-gray-500 text-sm">Vous</span>'}
                </td>
            </tr>
        `;
    }).join('');
}

function toggleActive(userId) {
    UserManager.toggleActive(userId);
    loadUsers();
    loadStats();
}

function changeRole(userId, newRole) {
    UserManager.update(userId, { role: newRole });
    loadUsers();
    loadStats();
}
