/**
 * LivrEx - User Management Logic
 */
const UserManager = {
    getAll() {
        return Storage.get('users') || [];
    },

    getById(id) {
        const users = this.getAll();
        return users.find(u => u.id === id);
    },

    getByEmail(email) {
        const users = this.getAll();
        return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },

    create(userData) {
        const users = this.getAll();
        const newUser = {
            id: Date.now(),
            ...userData,
            active: true,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        Storage.set('users', users);
        return newUser;
    },

    update(id, updates) {
        const users = this.getAll();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            Storage.set('users', users);
            return users[index];
        }
        return null;
    },

    toggleActive(id) {
        const users = this.getAll();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index].active = !users[index].active;
            Storage.set('users', users);
            return users[index];
        }
        return null;
    }
};

window.UserManager = UserManager;
