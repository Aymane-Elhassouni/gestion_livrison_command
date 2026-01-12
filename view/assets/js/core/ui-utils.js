/**
 * LivrEx - UI Utilities
 */
const UI = {
    formatCurrency(amount) {
        return parseFloat(amount).toFixed(2);
    },

    showAlert(message, type = 'info', container = null) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} animate-slide-down`;
        alert.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${this.getAlertIcon(type)}
            </svg>
            <span>${message}</span>
        `;

        const targetContainer = container || document.querySelector('.dashboard-content') || document.body;
        targetContainer.insertBefore(alert, targetContainer.firstChild);

        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 4000);
    },

    getAlertIcon(type) {
        const icons = {
            success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
            danger: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
            warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
            info: '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>'
        };
        return icons[type] || icons.info;
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'À l\'instant';
        if (minutes < 60) return `Il y a ${minutes} min`;
        if (hours < 24) return `Il y a ${hours}h`;
        if (days < 7) return `Il y a ${days}j`;
        return this.formatDate(dateString);
    },

    getStatusBadge(status) {
        const statusConfig = {
            created: { class: 'badge-created', label: 'Créée' },
            pending: { class: 'badge-pending', label: 'En cours' },
            shipped: { class: 'badge-shipped', label: 'Expédiée' },
            delivered: { class: 'badge-delivered', label: 'Livrée' },
            cancelled: { class: 'badge-cancelled', label: 'Annulée' }
        };
        const config = statusConfig[status] || statusConfig.created;
        return `<span class="badge ${config.class}"><span class="badge-dot" style="background: currentColor;"></span>${config.label}</span>`;
    },

    animateCounter(element, target, duration = 1500) {
        let start = 0;
        const increment = target / (duration / 16);

        function update() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(update);
            } else {
                element.textContent = target % 1 === 0 ? target : target.toFixed(2);
            }
        }

        requestAnimationFrame(update);
    },

    showModal(title, content) {
        const existing = document.getElementById('modalOverlay');
        if (existing) existing.remove();

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'modalOverlay';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal glass-card animate-scale-up">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close" id="closeModal">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="closeModalBtn">Fermer</button>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);
        setTimeout(() => modalOverlay.classList.add('show'), 10);

        const close = () => {
            modalOverlay.classList.remove('show');
            setTimeout(() => modalOverlay.remove(), 300);
        };

        document.getElementById('closeModal').addEventListener('click', close);
        document.getElementById('closeModalBtn').addEventListener('click', close);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) close();
        });
    }
};

window.UI = UI;
