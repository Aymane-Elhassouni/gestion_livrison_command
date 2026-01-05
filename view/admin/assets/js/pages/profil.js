/**
 * LivrEx - Profil Page Logic (Redesigned)
 */

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('app:ready', () => {
        if (!Auth.requireAuth(['client', 'livreur', 'admin'])) return;

        const session = Auth.getSession();
        const user = UserManager.getById(session.userId);

        if (!user) {
            Auth.logout();
            return;
        }

        // Set back links based on role
        const backBtn = document.getElementById('backToDashboard');
        const cancelBtn = document.getElementById('cancelBtn');
        const dashboardUrl = `../${user.role}/dashboard.html`;

        if (backBtn) backBtn.href = dashboardUrl;
        if (cancelBtn) cancelBtn.href = dashboardUrl;

        // Fill UI
        initProfileUI(user);
        initNotifications('notificationContainer');

        // Handle form
        document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    });
});

/**
 * Initialize UI with user data
 */
function initProfileUI(user) {
    // Header
    const initials = user.firstname[0] + (user.lastname?.[0] || '');
    document.getElementById('headerAvatar').textContent = initials;
    document.getElementById('headerName').textContent = `${user.firstname} ${user.lastname}`;

    // Form fields
    document.getElementById('fullname').value = `${user.firstname} ${user.lastname || ''}`.trim();
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('role').value = user.role.charAt(0).toUpperCase() + user.role.slice(1);

    // Address fields
    document.getElementById('address').value = user.address || '';
    document.getElementById('city').value = user.city || '';
    document.getElementById('zipcode').value = user.zipcode || '';
}

/**
 * Handle profile update
 */
function handleProfileUpdate(e) {
    e.preventDefault();

    const session = Auth.getSession();
    const user = UserManager.getById(session.userId);

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();

    // Split fullname
    const nameParts = fullname.split(' ');
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(' ') || '';

    const updates = {
        firstname,
        lastname,
        email,
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        zipcode: document.getElementById('zipcode').value.trim()
    };

    // Validation
    if (!firstname || !email) {
        UI.showAlert('Le nom et l\'email sont requis', 'danger', document.getElementById('alertContainer'));
        return;
    }

    // Password change logic
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (oldPassword || newPassword || confirmPassword) {
        // If any password field is touched, validate all
        if (!oldPassword || !newPassword || !confirmPassword) {
            UI.showAlert('Veuillez remplir tous les champs de mot de passe pour le changer', 'danger', document.getElementById('alertContainer'));
            return;
        }

        if (oldPassword !== user.password) {
            UI.showAlert('L\'ancien mot de passe est incorrect', 'danger', document.getElementById('alertContainer'));
            return;
        }

        if (newPassword !== confirmPassword) {
            UI.showAlert('Les nouveaux mots de passe ne correspondent pas', 'danger', document.getElementById('alertContainer'));
            return;
        }

        if (newPassword.length < 6) {
            UI.showAlert('Le nouveau mot de passe doit faire au moins 6 caractères', 'danger', document.getElementById('alertContainer'));
            return;
        }

        updates.password = newPassword;
    }

    // Update user in storage
    const updatedUser = UserManager.update(user.id, updates);

    if (updatedUser) {
        // Update session if critical info changed
        const currentSession = Auth.getSession();
        Auth.setSession({
            ...currentSession,
            firstname: updatedUser.firstname,
            lastname: updatedUser.lastname,
            email: updatedUser.email
        });

        UI.showAlert('Profil mis à jour avec succès!', 'success', document.getElementById('alertContainer'));

        // Refresh UI
        initProfileUI(updatedUser);

        // Clear password fields
        document.getElementById('oldPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    } else {
        UI.showAlert('Erreur lors de la mise à jour du profil', 'danger', document.getElementById('alertContainer'));
    }
}
