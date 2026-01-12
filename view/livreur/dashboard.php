<?php
    session_start();
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Livreur - LivrEx</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>

<body>
    <div class="dashboard">
        <header class="header">
            <div class="flex items-center gap-4">
                <div class="logo-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                </div>
                <span class="logo text-xl">LivrEx</span>
            </div>
            <div class="header-actions">
                <div id="notificationContainer" class="relative"></div>
                <a href="../shared/profil.php" class="user-menu">
                    <div class="user-avatar" id="userAvatar"><?php $initials = strtoupper(substr($_SESSION['firstname'] ?? 'U', 0, 1) . substr($_SESSION['lastname'] ?? 'N', 0, 1));
                        echo htmlspecialchars($initials);?>
                    </div>
                    <span id="userName"><?php echo htmlspecialchars(($_SESSION['firstname'] ?? '') . ' ' . ($_SESSION['lastname'] ?? '')); ?></span>
                </a>
                <form action="../../src/index.php?action=logout" method="POST" style="display: inline;">
                    <button class="btn btn-secondary btn-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Déconnexion
                    </button>
                </form>
            </div>
        </header>

        <main class="dashboard-content">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 class="page-title">Commandes disponibles</h1>
                    <p class="page-subtitle">Parcourez les commandes et proposez vos services</p>
                </div>
            </div>

            <!-- Stats -->
            <div class="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="glass-card stat-card">
                    <div class="stat-icon primary">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path
                                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                            </path>
                        </svg>
                    </div>
                    <div>
                        <div class="stat-value" id="availableOrders">0</div>
                        <div class="stat-label">Disponibles</div>
                    </div>
                </div>
                <div class="glass-card stat-card">
                    <div class="stat-icon warning">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div>
                        <div class="stat-value" id="ongoingDeliveries">0</div>
                        <div class="stat-label">En cours</div>
                    </div>
                </div>
                <div class="glass-card stat-card">
                    <div class="stat-icon success">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <div>
                        <div class="stat-value" id="deliveredOrders">0</div>
                        <div class="stat-label">Livrées</div>
                    </div>
                </div>
                <div class="glass-card stat-card cursor-pointer hover:bg-slate-800/60 transition-all group"
                    onclick="showEarningDetails()">
                    <div class="stat-icon group-hover:scale-110 transition-transform"
                        style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                    </div>
                    <div>
                        <div class="stat-value"><span id="totalEarnings">0</span>€</div>
                        <div class="stat-label">Gains totaux</div>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="flex gap-4 mb-6 border-b border-gray-700">
                <button class="px-6 py-3 text-sm font-medium border-b-2 transition-colors active tab-btn"
                    id="tabAvailable" onclick="switchTab('available')">
                    Commandes disponibles
                </button>
                <button
                    class="px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-white transition-colors tab-btn"
                    id="tabOffers" onclick="switchTab('offers')">
                    Mes Offres
                </button>
                <button
                    class="px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-white transition-colors tab-btn"
                    id="tabMissions" onclick="switchTab('missions')">
                    Mes Missions
                </button>
            </div>

            <!-- Orders Grid -->
            <div id="ordersGrid" class="orders-grid"></div>

            <div id="emptyState" class="glass-card empty-state hidden">
                <div class="empty-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path
                            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                        </path>
                    </svg>
                </div>
                <h3 class="empty-title">Aucune commande disponible</h3>
                <p class="empty-description">Revenez plus tard pour voir les nouvelles commandes</p>
            </div>
        </main>
    </div>

    <!-- <script src="../assets/js/app.js"></script>
    <script src="../assets/js/auth.js"></script>
    <script src="../assets/js/notifications.js"></script>
    <script src="../assets/js/pages/livreur-dashboard.js"></script> -->
</body>

</html>