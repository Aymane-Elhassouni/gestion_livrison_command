/**
 * LivrEx - Notifications JavaScript
 */

const NotificationManager = {
    getAll() {
        return Storage.get('notifications') || [];
    },

    getByUserId(userId) {
        return this.getAll().filter(n => n.userId === userId);
    },

    getUnreadCount(userId) {
        return this.getByUserId(userId).filter(n => !n.read).length;
    },

    create(notificationData) {
        const notifications = this.getAll();
        const newNotification = {
            id: `NOT-${Date.now()}`,
            ...notificationData,
            read: false,
            createdAt: new Date().toISOString()
        };
        notifications.unshift(newNotification);
        Storage.set('notifications', notifications);
        return newNotification;
    },

    markAsRead(id) {
        const notifications = this.getAll();
        const index = notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            notifications[index].read = true;
            Storage.set('notifications', notifications);
            return notifications[index];
        }
        return null;
    },

    markAllAsRead(userId) {
        const notifications = this.getAll();
        const user = UserManager.getById(userId);
        notifications.forEach(n => {
            // Admins mark all as read, others mark only theirs
            if (user?.role === 'admin' || n.userId === userId) {
                n.read = true;
            }
        });
        Storage.set('notifications', notifications);
    },

    delete(id) {
        const notifications = this.getAll();
        const filtered = notifications.filter(n => n.id !== id);
        Storage.set('notifications', filtered);
    }
};

// Unified notification type configuration
const notificationTypeConfig = {
    offer: { icon: '💬', color: 'bg-indigo-500/20 text-indigo-400', colorHex: '#6366f1', label: 'Offre' },
    accepted: { icon: '✅', color: 'bg-green-500/20 text-green-400', colorHex: '#10b981', label: 'Acceptée' },
    shipped: { icon: '🚚', color: 'bg-purple-500/20 text-purple-400', colorHex: '#8b5cf6', label: 'Expédiée' },
    delivered: { icon: '📦', color: 'bg-green-500/20 text-green-400', colorHex: '#10b981', label: 'Livrée' },
    cancelled: { icon: '❌', color: 'bg-red-500/20 text-red-400', colorHex: '#ef4444', label: 'Annulée' }
};

// Notification UI Component
function initNotifications(containerId) {
    const session = Auth.getSession();
    if (!session) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    // Admin sees all notifications, Others see only theirs
    const notifications = session.role === 'admin'
        ? NotificationManager.getAll()
        : NotificationManager.getByUserId(session.userId);

    const unreadCount = notifications.filter(n => !n.read).length;

    const roleColors = {
        client: 'bg-blue-500/20 text-blue-400',
        livreur: 'bg-purple-500/20 text-purple-400',
        admin: 'bg-red-500/20 text-red-400'
    };

    container.innerHTML = `
        <button class="notification-btn" id="notificationBtn" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            ${unreadCount > 0 ? `<span class="notification-badge">${unreadCount}</span>` : ''}
        </button>
        <div class="notification-dropdown" id="notificationDropdown" style="width: 380px;">
            <div class="notification-header">
                <span style="font-weight: 600;">🔔 Notifications</span>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 0.7rem; color: var(--text-muted);">${unreadCount} non lus</span>
                    ${unreadCount > 0 ? `<button onclick="NotificationManager.markAllAsRead(${session.userId}); initNotifications('${containerId}');" 
                            style="font-size: 0.7rem; color: var(--primary); background: none; border: none; cursor: pointer;">
                        Tout marquer lu
                    </button>` : ''}
                </div>
            </div>
            ${notifications.length === 0 ?
            '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">Aucune notification</div>' :
            notifications.slice(0, 10).map(n => {
                const config = notificationTypeConfig[n.type] || notificationTypeConfig.offer;
                const user = UserManager.getById(n.userId);
                const userRole = user?.role || 'client';

                return `
                    <div class="notification-item ${n.read ? '' : 'unread'}" style="padding: 1rem; cursor: pointer;" onclick="handleNotificationClick('${n.id}', '${containerId}')">
                        <div class="notification-icon ${config.color}" style="font-size: 1.25rem;">
                            ${config.icon}
                        </div>
                        <div class="notification-content" style="flex: 1;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span class="notification-title" style="font-weight: 600;">${n.title}</span>
                                    <span class="px-1.5 py-0.5 rounded ${config.color}" style="font-size: 0.6rem;">${config.label}</span>
                                </div>
                                <button onclick="event.stopPropagation(); NotificationManager.delete('${n.id}'); initNotifications('${containerId}');" 
                                        style="background:none; border:none; color:var(--text-muted); cursor:pointer; padding: 2px;" title="Supprimer">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            <div class="notification-message" style="margin: 0.25rem 0 0.5rem 0;">${n.message}</div>
                            <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.7rem; color: var(--text-muted);">
                                <span style="display: flex; align-items: center; gap: 0.25rem;">
                                    <span class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${roleColors[userRole]}">${user?.firstname?.[0] || 'U'}</span>
                                    ${n.userId === session.userId ? 'Moi' : (user?.firstname || 'Utilisateur')}
                                </span>
                                <span class="px-1.5 py-0.5 rounded ${roleColors[userRole]}" style="font-size: 0.6rem; text-transform: uppercase;">${userRole}</span>
                                <span>📅 ${UI.formatRelativeTime(n.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')
        }
        </div>
    `;

    // Toggle dropdown
    document.getElementById('notificationBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('notificationDropdown').classList.toggle('show');
    });

    // Close on outside click
    document.addEventListener('click', () => {
        document.getElementById('notificationDropdown')?.classList.remove('show');
    });
}

function handleNotificationClick(id, containerId) {
    const notifications = NotificationManager.getAll();
    const n = notifications.find(notif => notif.id === id);
    if (!n) return;

    // Mark as read
    NotificationManager.markAsRead(id);
    initNotifications(containerId);

    const session = Auth.getSession();

    // SPECIAL HANDLING FOR ADMIN: Show Modal
    if (session.role === 'admin') {
        const config = notificationTypeConfig[n.type] || notificationTypeConfig.offer;
        const recipient = UserManager.getById(n.userId);
        const recipientRole = recipient?.role || 'client';

        const modalContent = `
            <div class="text-center mb-6">
                <div class="w-16 h-16 rounded-full ${config.color} mx-auto mb-4 flex items-center justify-center" style="font-size: 2rem;">
                    ${config.icon}
                </div>
                <h4 class="text-xl font-bold">${n.title}</h4>
                <div class="flex items-center justify-center gap-2 mt-2">
                    <span class="badge ${config.color}">${config.label}</span>
                    <span class="text-xs text-gray-500">${UI.formatDate(n.createdAt)}</span>
                </div>
            </div>
            
            <div class="glass-card p-5 mb-6 bg-slate-800/40">
                <p class="text-gray-200 leading-relaxed text-center">${n.message}</p>
            </div>

            <div class="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-white/5">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm border border-white/10">
                        ${recipient?.firstname?.[0] || 'U'}
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-white">${recipient ? (recipient.firstname + ' ' + recipient.lastname) : 'Utilisateur inconnu'}</p>
                        <p class="text-xs text-gray-400">${recipient?.email || ''}</p>
                    </div>
                </div>
                <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${recipientRole === 'client' ? 'bg-blue-500/10 text-blue-400' :
                recipientRole === 'livreur' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-red-500/10 text-red-400'
            }">${recipientRole}</span>
            </div>
        `;

        UI.showModal('Détail de la notification (Admin)', modalContent);
        return;
    }

    // REDIRECTION FOR CLIENT/LIVREUR
    const isInsideRoleFolder = window.location.pathname.includes('/client/') ||
        window.location.pathname.includes('/livreur/') ||
        window.location.pathname.includes('/admin/');

    // Path resolution
    const prefix = isInsideRoleFolder ? '../' : '';
    let targetUrl = '';
    const orderId = n.orderId || (n.message.match(/CMD-\d+/) ? n.message.match(/CMD-\d+/)[0] : null);

    if (orderId) {
        if (session.role === 'client') {
            targetUrl = prefix + `client/order-detail.html?id=${orderId}`;
        } else if (session.role === 'livreur') {
            targetUrl = prefix + `livreur/order-detail.html?id=${orderId}`;
        }
    } else {
        targetUrl = prefix + session.role + '/dashboard.html';
    }

    if (targetUrl) {
        const currentUrl = window.location.href;
        const targetFullUrl = new URL(targetUrl, window.location.origin + window.location.pathname).href;

        if (currentUrl === targetFullUrl) {
            window.location.reload();
        } else {
            window.location.href = targetUrl;
        }
    }
}

function getNotificationColor(type) {
    return notificationTypeConfig[type]?.colorHex || '#6366f1';
}

function getNotificationIcon(type) {
    return notificationTypeConfig[type]?.icon || '💬';
}

window.NotificationManager = NotificationManager;
window.initNotifications = initNotifications;
window.notificationTypeConfig = notificationTypeConfig;
window.handleNotificationClick = handleNotificationClick;
