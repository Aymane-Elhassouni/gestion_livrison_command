<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Créer une commande - LivrEx</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>

<body>
    <div class="dashboard">
        <!-- Header -->
        <header class="header">
            <div class="flex items-center gap-4">
                <a href="dashboard.html" class="flex items-center gap-4">
                    <div class="logo-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                    </div>
                    <span class="logo text-xl">LivrEx</span>
                </a>
            </div>
            <div class="header-actions">
                <a onclick="window.history.back();" class="btn btn-secondary btn-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Retour
                </a>
            </div>
        </header>

        <!-- Main Content -->
        <main class="dashboard-content">
            <div class="max-w-2xl mx-auto">
                <h1 class="page-title">Nouvelle commande</h1>
                <p class="page-subtitle">Remplissez les informations de votre livraison</p>

                <div class="glass-card p-6 md:p-8 animate-slide-up">
                    <div id="alertContainer"></div>

                    <form id="createOrderForm" class="space-y-5">
                        <div class="form-group">
                            <label class="form-label" for="title">Titre de la commande</label>
                            <input type="text" id="title" class="form-input" placeholder="Ex: Colis électronique"
                                required>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="fromAddress">Adresse de départ</label>
                            <input type="text" id="fromAddress" class="form-input"
                                placeholder="123 Rue de Paris, 75001 Paris" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="toAddress">Adresse de destination</label>
                            <input type="text" id="toAddress" class="form-input"
                                placeholder="456 Avenue des Champs, 75008 Paris" required>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label" for="weight">Poids (kg)</label>
                                <input type="number" id="weight" class="form-input" placeholder="2.5" step="0.1"
                                    min="0.1" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="description">Description</label>
                            <textarea id="description" class="form-input" rows="3"
                                placeholder="Détails sur le contenu du colis..."></textarea>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="submit" class="btn btn-primary flex-1">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Créer la commande
                            </button>
                            <a href="dashboard.php" class="btn btn-secondary">Annuler</a>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>

    <!-- <script src="../assets/js/app.js"></script>
    <script src="../assets/js/auth.js"></script>
    <script src="../assets/js/pages/client-create-order.js"></script> -->
</body>

</html>