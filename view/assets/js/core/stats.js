/**
 * LivrEx - Statistics and Reporting Logic
 */
const Stats = {
    getOrderStats() {
        const orders = OrderManager.getActive();
        return {
            total: orders.length,
            created: orders.filter(o => o.status === 'created').length,
            pending: orders.filter(o => o.status === 'pending').length,
            shipped: orders.filter(o => o.status === 'shipped').length,
            delivered: orders.filter(o => o.status === 'delivered').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length
        };
    },

    getOfferStats() {
        const offers = OfferManager.getAll();
        return {
            total: offers.length,
            pending: offers.filter(o => o.status === 'pending').length,
            accepted: offers.filter(o => o.status === 'accepted').length,
            rejected: offers.filter(o => o.status === 'rejected').length
        };
    },

    getUserStats() {
        const users = UserManager.getAll();
        return {
            total: users.length,
            clients: users.filter(u => u.role === 'client').length,
            livreurs: users.filter(u => u.role === 'livreur').length,
            admins: users.filter(u => u.role === 'admin').length,
            active: users.filter(u => u.active).length,
            activeLivreurs: users.filter(u => u.role === 'livreur' && u.active).length
        };
    },

    getFinancialStats() {
        const orders = OrderManager.getActive();
        const offers = OfferManager.getAll();

        let totalRevenue = 0; // Only delivered
        let pendingVolume = 0; // Accepted offers for non-delivered orders

        orders.forEach(order => {
            if (order.acceptedOfferId) {
                const offer = offers.find(o => o.id === order.acceptedOfferId);
                if (offer) {
                    if (order.status === 'delivered') {
                        totalRevenue += offer.price;
                    } else if (order.status !== 'cancelled') {
                        pendingVolume += offer.price;
                    }
                }
            }
        });

        return {
            totalRevenue,
            pendingVolume,
            commissions: totalRevenue * 0.1 // 10% Platform fee
        };
    },

    getPlatformHealth() {
        const orders = OrderManager.getActive();
        const delivered = orders.filter(o => o.status === 'delivered').length;
        const cancelled = orders.filter(o => o.status === 'cancelled').length;
        const totalClosed = delivered + cancelled;

        const successRate = totalClosed > 0 ? Math.round((delivered / totalClosed) * 100) : 0;

        const ordersWithOffers = orders.filter(o => {
            const offers = OfferManager.getByOrderId(o.id);
            return offers.length > 0;
        }).length;

        const acceptanceRate = orders.length > 0 ? Math.round((ordersWithOffers / orders.length) * 100) : 0;

        return {
            successRate,
            acceptanceRate
        };
    }
};

window.Stats = Stats;
