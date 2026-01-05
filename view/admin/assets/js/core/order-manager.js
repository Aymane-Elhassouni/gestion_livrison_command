/**
 * LivrEx - Order Management Logic
 */
const OrderManager = {
    getAll() {
        return Storage.get('orders') || [];
    },

    getActive() {
        return this.getAll().filter(o => !o.deleted);
    },

    getById(id) {
        const orders = this.getAll();
        return orders.find(o => o.id === id);
    },

    getByUserId(userId) {
        return this.getActive().filter(o => o.userId === userId);
    },

    getAvailable() {
        return this.getActive().filter(o => o.status === 'created');
    },

    create(orderData) {
        const orders = this.getAll();
        const orderCount = orders.length + 1;
        const newOrder = {
            id: `CMD-${String(orderCount).padStart(3, '0')}`,
            ...orderData,
            status: 'created',
            createdAt: new Date().toISOString(),
            deleted: false
        };
        orders.push(newOrder);
        Storage.set('orders', orders);
        return newOrder;
    },

    update(id, updates) {
        const orders = this.getAll();
        const index = orders.findIndex(o => o.id === id);
        if (index !== -1) {
            orders[index] = { ...orders[index], ...updates };
            Storage.set('orders', orders);
            return orders[index];
        }
        return null;
    },

    delete(id) {
        // Permanent deletion (Admin only)
        const orders = this.getAll();
        const filteredOrders = orders.filter(o => o.id !== id);
        Storage.set('orders', filteredOrders);

        // Also delete associated offers (Note: depends on OfferManager)
        if (window.OfferManager) {
            const offers = OfferManager.getAll();
            const filteredOffers = offers.filter(o => o.orderId !== id);
            Storage.set('offers', filteredOffers);
        }
    },

    softDelete(id) {
        return this.update(id, { deleted: true });
    },

    cancel(id) {
        return this.update(id, { status: 'cancelled' });
    },

    updateStatus(id, status) {
        return this.update(id, { status });
    }
};

window.OrderManager = OrderManager;
