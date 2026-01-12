<?php
session_start();
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Profil - LivrEx</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>

<body>
    <div class="dashboard">
        <header class="header">
            <div class="flex items-center gap-4">
                <a id="backToDashboard" href="#" class="flex items-center gap-4">
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
                <div id="notificationContainer" class="relative"></div>
                <div class="user-menu">
                    <div class="user-avatar" id="headerAvatar">--</div>
                    <span id="headerName">Chargement...</span>
                </div>
                <!-- <form action="../../src/index.php?action=logout" method="POST" style="display: inline;"> -->
                    <button class="btn btn-secondary btn-sm" onclick="window.history.back();">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Retour
                    </button>
                <!-- </form> -->
            </div>
        </header>

        <main class="dashboard-content">
            <div class="max-w-4xl mx-auto py-10">
                <h1 class="text-3xl font-bold mb-8" id="profileTitle">Mon Profil</h1>

                <div id="alertContainer"></div>

                <div class="glass-card p-8">
                    <form id="profileForm" class="space-y-8" action="../../src/index.php?action=updateProfile"
                        method="POST">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                            <div class="form-group mb-0">
                                <label class="form-label font-bold text-gray-300" for="firstname">Prénom</label>
                                <input type="text" name="firstname" id="firstname" 
                                    class="form-input bg-gray-900 text-white border-gray-700" placeholder="Votre prénom"
                                    value="<?php echo $_SESSION['firstname'] ?? ''; ?>"
                                    required>
                            </div>

                            <div class="form-group mb-0">
                                <label class="form-label font-bold text-gray-300" for="lastname">Nom</label>
                                <input type="text" name="lastname" id="lastname"
                                    class="form-input bg-gray-900 text-white border-gray-700" placeholder="Votre nom"
                                    value="<?php echo $_SESSION['lastname'] ?? ''; ?>"
                                    required>
                            </div>

                            <div class="form-group mb-0 md:col-span-2">
                                <label class="form-label font-bold text-gray-300" for="email">Email</label>
                                <input type="email" name="email" id="email"
                                    class="form-input bg-gray-900 text-white border-gray-700"
                                    value="<?php echo $_SESSION['email'] ?? ''; ?>"
                                    placeholder="votre@email.com" required>
                            </div>
                        </div>

                        <div class="pt-8 border-t border-gray-700">
                            <h2 class="text-xl font-bold mb-6 text-white">Changer le mot de passe</h2>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="form-group">
                                    <label class="form-label text-gray-400" for="oldPassword">Ancien mot de
                                        passe</label>
                                    <input type="password" name="oldPassword" id="oldPassword"
                                        class="form-input bg-gray-900 border-gray-700" placeholder="••••••••">
                                </div>

                                <div class="form-group">
                                    <label class="form-label text-gray-400" for="newPassword">Nouveau mot de
                                        passe</label>
                                    <input type="password" name="newPassword" id="newPassword"
                                        class="form-input bg-gray-900 border-gray-700" placeholder="••••••••">
                                        
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end gap-4 pt-4">
                            <button type="reset"
                                class="btn btn-secondary px-8 border border-gray-600 text-gray-300 hover:bg-gray-800" onclick="window.history.back();">
                                Annuler
                            </button>
                            <button type="submit" name="submitUpdate"
                                class="btn btn-primary px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>

    <!-- <script src="../assets/js/app.js"></script>
    <script src="../assets/js/auth.js"></script>
    <script src="../assets/js/notifications.js"></script>
    <script src="../assets/js/pages/profil.js"></script> -->
</body>

</html>