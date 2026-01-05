/**
 * LivrEx - App Registry & Loader
 * This file serves as a central entry point to load all core modules.
 */

(function () {
    // Detect environment and set base path
    const isInsideFolder = window.location.pathname.includes('/auth/') ||
        window.location.pathname.includes('/client/') ||
        window.location.pathname.includes('/livreur/') ||
        window.location.pathname.includes('/admin/') ||
        window.location.pathname.includes('/shared/');

    const basePath = isInsideFolder ? '../assets/js/core/' : 'assets/js/core/';

    // Core modules in order of dependency
    const coreModules = [
        'storage.js',
        'user-manager.js',
        'order-manager.js',
        'offer-manager.js',
        'stats.js',
        'ui-utils.js',
        'mock-data.js'
    ];

    // Function to load scripts sequentially to maintain global variable availability
    function loadScripts(scripts, index = 0) {
        if (index >= scripts.length) {
            // All core modules loaded, app is ready
            document.dispatchEvent(new CustomEvent('app:ready'));
            return;
        }

        const scriptUrl = basePath + scripts[index];
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = false; // Important for dependency order

        script.onload = () => {
            loadScripts(scripts, index + 1);
        };

        script.onerror = () => {
            console.error(`Failed to load core module: ${scripts[index]}`);
            loadScripts(scripts, index + 1);
        };

        document.head.appendChild(script);
    }

    // Start loading
    loadScripts(coreModules);
})();
