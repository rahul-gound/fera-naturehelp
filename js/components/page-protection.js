// ===== Page Protection Component =====
// Handles page access control based on authentication

const PageProtection = {
    // Protect pages that require authentication
    protectPage: async function() {
        const isAuth = await window.AuthService.isAuthenticated();
        if (!isAuth) {
            window.location.href = 'login.html';
        }
    },

    // Redirect authenticated users away from login page
    redirectIfAuthenticated: async function() {
        // Check if there's a hash fragment (Supabase auth callback)
        const hasAuthHash = window.location.hash && 
            (window.location.hash.includes('access_token') || 
             window.location.hash.includes('error'));
        
        // Check if this is a password reset redirect
        const urlParams = new URLSearchParams(window.location.search);
        const isReset = urlParams.get('reset');
        
        // Only redirect if not processing callback
        if (!hasAuthHash && !isReset) {
            const isAuth = await window.AuthService.isAuthenticated();
            if (isAuth) {
                window.location.href = 'dashboard.html';
            }
        }
    },

    // Handle auth callbacks with delay for processing
    handleAuthCallback: async function() {
        const hasAuthHash = window.location.hash && 
            (window.location.hash.includes('access_token') || 
             window.location.hash.includes('error'));
        
        if (hasAuthHash) {
            // Wait for Supabase to process the hash
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
};

// Export for use in other modules
window.PageProtection = PageProtection;

// Make protectPage available globally for backward compatibility
window.protectPage = PageProtection.protectPage;
