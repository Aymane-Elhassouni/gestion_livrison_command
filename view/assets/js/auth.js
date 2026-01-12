/**
 * LivrEx - Authentication JavaScript
 */

const Auth = {
    getSession() {
        return Storage.get('session');
    },

    getCurrentUser() {
        const session = this.getSession();
        if (!session) return null;
        return UserManager.getById(session.userId);
    },

    login(email, password) {
        const user = UserManager.getByEmail(email);

        // Generic error message for security (prevents user enumeration)
        const genericError = 'Email ou mot de passe incorrect';

        if (!user) return { success: false, error: genericError };
        if (user.password !== password) return { success: false, error: genericError };
        if (!user.active) return { success: false, error: 'Compte désactivé' };

        const session = {
            userId: user.id,
            email: user.email,
            role: user.role,
            firstname: user.firstname,
            lastname: user.lastname,
            loginAt: new Date().toISOString()
        };

        Storage.set('session', session);
        return { success: true, user, session };
    },

    register(userData) {
        if (UserManager.getByEmail(userData.email)) {
            return { success: false, error: 'Cet email est déjà utilisé' };
        }
        const user = UserManager.create(userData);
        return { success: true, user };
    },

    logout() {
        Storage.remove('session');
        window.location.href = '/auth/login.html';
    },

    isLoggedIn() {
        return this.getSession() !== null;
    },

    hasRole(role) {
        const session = this.getSession();
        return session && session.role === role;
    },

    getRedirectUrl(role) {
        const map = { client: '/client/dashboard.html', livreur: '/livreur/dashboard.html', admin: '/admin/dashboard.html' };
        return map[role] || '/auth/login.html';
    },

    requireAuth(allowedRoles = []) {
        const session = this.getSession();
        if (!session) { window.location.href = '/auth/login.html'; return false; }
        if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
            window.location.href = this.getRedirectUrl(session.role);
            return false;
        }
        return true;
    },

    redirectIfLoggedIn() {
        const session = this.getSession();
        if (session) { window.location.href = this.getRedirectUrl(session.role); return true; }
        return false;
    }
};

window.Auth = Auth;
