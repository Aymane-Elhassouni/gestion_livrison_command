/**
 * LivrEx - Create Order Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('app:ready', () => {
        if (!Auth.requireAuth(['client'])) return;

        document.getElementById('createOrderForm').addEventListener('submit', function (e) {
            e.preventDefault();

            const session = Auth.getSession();
            const title = document.getElementById('title').value.trim();
            const fromAddress = document.getElementById('fromAddress').value.trim();
            const toAddress = document.getElementById('toAddress').value.trim();
            const weight = parseFloat(document.getElementById('weight').value);
            const description = document.getElementById('description').value.trim();

            if (!title || !fromAddress || !toAddress || !weight) {
                showAlert('Veuillez remplir tous les champs obligatoires', 'danger');
                return;
            }

            const order = OrderManager.create({
                userId: session.userId,
                title,
                fromAddress,
                toAddress,
                weight,
                description
            });

            showAlert('Commande créée avec succès!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    });
});

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        alertContainer.innerHTML = `<div class="alert alert-${type} mb-4">${message}</div>`;
    }
}
