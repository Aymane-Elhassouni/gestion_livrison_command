/**
 * LivrEx - Register Page Logic
 */

// Redirect if already logged in
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('app:ready', () => {
        if (Auth.isLoggedIn()) {
            Auth.redirectIfLoggedIn();
            return;
        }

        // Initialize UI Logic
        initRegisterFlow();
    });
});

// Form submission
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
    });

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;

    let hasError = false;

    // Validation
    if (!name) {
        showError('nameError', 'Le nom est requis');
        hasError = true;
    }

    if (!email) {
        showError('emailError', 'L\'email est requis');
        hasError = true;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Email invalide');
        hasError = true;
    }

    if (!password) {
        showError('passwordError', 'Le mot de passe est requis');
        hasError = true;
    } else if (password.length < 6) {
        showError('passwordError', 'Minimum 6 caractères');
        hasError = true;
    }

    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Les mots de passe ne correspondent pas');
        hasError = true;
    }

    if (!role) {
        showError('roleError', 'Veuillez sélectionner un rôle');
        hasError = true;
    }

    if (hasError) return;

    // Split name into first and last
    const nameParts = name.split(' ');
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(' ') || '';

    // Register user
    const result = Auth.register({
        firstname,
        lastname,
        email,
        password,
        role
    });

    if (result.success) {
        showAlert('Compte créé avec succès! Redirection...', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    } else {
        showAlert(result.error, 'danger');
    }
});

function showError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showAlert(message, type) {
    const container = document.getElementById('alertContainer');
    if (!container) return;
    container.innerHTML = `<div class="alert alert-${type} mb-4">${message}</div>`;
}
