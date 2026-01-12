/**
 * LivrEx - Offer Management Logic
 */
const OfferManager = {
    getAll() {
        return Storage.get('offers') || [];
    },

    getById(id) {
        const offers = this.getAll();
        return offers.find(o => o.id === id);
    },

    getByOrderId(orderId) {
        return this.getAll().filter(o => o.orderId === orderId);
    },

    getByLivreurId(livreurId) {
        return this.getAll().filter(o => o.livreurId === livreurId);
    },

    create(offerData) {
        const offers = this.getAll();
        const offerCount = offers.length + 1;
        const newOffer = {
            id: `OFF-${String(offerCount).padStart(3, '0')}`,
            ...offerData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        offers.push(newOffer);
        Storage.set('offers', offers);
        return newOffer;
    },

    update(id, updates) {
        const offers = this.getAll();
        const index = offers.findIndex(o => o.id === id);
        if (index !== -1) {
            offers[index] = { ...offers[index], ...updates };
            Storage.set('offers', offers);
            return offers[index];
        }
        return null;
    },

    accept(id) {
        const offer = this.update(id, { status: 'accepted' });
        if (offer) {
            // Reject other offers for the same order
            const offers = this.getAll();
            offers.forEach(o => {
                if (o.orderId === offer.orderId && o.id !== id) {
                    this.update(o.id, { status: 'rejected' });
                }
            });
            // Update order status (Note: depends on OrderManager)
            if (window.OrderManager) {
                OrderManager.update(offer.orderId, {
                    status: 'pending',
                    acceptedOfferId: id
                });
            }
        }
        return offer;
    }
};

window.OfferManager = OfferManager;
