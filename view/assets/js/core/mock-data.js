/**
 * LivrEx - Mock Data Initialization
 */
function initializeMockData() {
    // Initialize users if not exists
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            {
                id: 1,
                firstname: 'Admin',
                lastname: 'System',
                email: 'admin@livrex.com',
                password: 'admin123',
                role: 'admin',
                active: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                firstname: 'Jean',
                lastname: 'Dupont',
                email: 'client@livrex.com',
                password: 'client123',
                role: 'client',
                active: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                firstname: 'Pierre',
                lastname: 'Martin',
                email: 'livreur@livrex.com',
                password: 'livreur123',
                role: 'livreur',
                active: true,
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    // Initialize orders if not exists
    if (!localStorage.getItem('orders')) {
        const defaultOrders = [
            {
                id: 'CMD-001',
                userId: 2,
                title: 'Colis électronique',
                description: 'Ordinateur portable Dell XPS 15',
                fromAddress: '123 Rue de Paris, 75001 Paris',
                toAddress: '456 Avenue des Champs, 75008 Paris',
                weight: 2.5,
                status: 'created',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                deleted: false
            },
            {
                id: 'CMD-002',
                userId: 2,
                title: 'Documents importants',
                description: 'Contrats et documents juridiques',
                fromAddress: '789 Boulevard Haussmann, 75009 Paris',
                toAddress: '321 Rue de Rivoli, 75001 Paris',
                weight: 0.5,
                status: 'pending',
                acceptedOfferId: null,
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                deleted: false
            }
        ];
        localStorage.setItem('orders', JSON.stringify(defaultOrders));
    }

    // Initialize offers if not exists
    if (!localStorage.getItem('offers')) {
        const defaultOffers = [
            {
                id: 'OFF-001',
                orderId: 'CMD-002',
                livreurId: 3,
                price: 25.00,
                estimatedDuration: '2 heures',
                vehicleType: 'moto',
                express: false,
                fragile: true,
                status: 'pending',
                createdAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
        localStorage.setItem('offers', JSON.stringify(defaultOffers));
    }

    // Initialize notifications if not exists
    if (!localStorage.getItem('notifications')) {
        const defaultNotifications = [
            {
                id: 'NOT-001',
                userId: 2,
                type: 'offer',
                title: 'Nouvelle offre reçue',
                message: 'Pierre Martin a fait une offre pour votre commande CMD-002',
                read: false,
                createdAt: new Date(Date.now() - 3600000).toISOString()
            }
        ];
        localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
    }
}

// Auto-run if not in a module environment or explicitly called
document.addEventListener('DOMContentLoaded', () => {
    initializeMockData();
});
