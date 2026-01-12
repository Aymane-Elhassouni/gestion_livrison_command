/**
 * LivrEx - Login Page Logic
 */

// Redirect if already logged in
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('app:ready', () => {
        // Clear session if already logged in? Or redirect?
        if (Auth.isLoggedIn()) {
            Auth.redirectIfLoggedIn();
            return;
        }

        // Form submission
        document.getElementById('loginForm').addEventListener('submit', function (e) {
            e.preventDefault();

            // Clear previous errors
            document.querySelectorAll('.form-error').forEach(el => {
                el.classList.add('hidden');
                el.textContent = '';
            });

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            let hasError = false;

            if (!email) {
                showError('emailError', 'L\'email est requis');
                hasError = true;
            }

            if (!password) {
                showError('passwordError', 'Le mot de passe est requis');
                hasError = true;
            }

            if (hasError) return;

            // Login
            const result = Auth.login(email, password);

            if (result.success) {
                showAlert('Connexion réussie! Redirection...', 'success');
                setTimeout(() => {
                    window.location.href = Auth.getRedirectUrl(result.session.role);
                }, 1000);
            } else {
                showAlert(result.error, 'danger');
            }
        });
    });

});

function showError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
}

function showAlert(message, type) {
    const container = document.getElementById('alertContainer');
    if (!container) return;
    container.innerHTML = `<div class="alert alert-${type} mb-4">${message}</div>`;
}
