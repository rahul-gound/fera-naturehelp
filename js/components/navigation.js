// ===== Navigation Component =====
// Handles navigation updates based on auth state

const NavigationComponent = {
    // Update navigation based on auth state
    updateNavigation: async function() {
        const isAuth = await window.AuthService.isAuthenticated();
        const navMenu = document.querySelector('.nav-menu');
        
        if (!navMenu) return;
        
        // Remove existing auth links
        const existingAuthLinks = navMenu.querySelectorAll('.auth-link');
        existingAuthLinks.forEach(link => link.remove());
        
        if (isAuth) {
            await this.addAuthenticatedLinks(navMenu);
        } else {
            this.addUnauthenticatedLinks(navMenu);
        }
    },

    // Add links for authenticated users
    addAuthenticatedLinks: async function(navMenu) {
        const user = await window.AuthService.getCurrentUser();
        const profile = user ? await window.ProfileService.getUserProfile(user.id) : null;
        
        // Add user name
        const userLink = document.createElement('span');
        userLink.className = 'nav-link auth-link';
        userLink.style.cursor = 'default';
        userLink.innerHTML = `<i class="fas fa-user"></i> ${profile?.name || user?.email || 'User'}`;
        
        // Add logout link
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.className = 'nav-link auth-link';
        logoutLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutLink.onclick = async (e) => {
            e.preventDefault();
            await window.AuthService.signOut();
        };
        
        navMenu.appendChild(userLink);
        navMenu.appendChild(logoutLink);
    },

    // Add links for unauthenticated users
    addUnauthenticatedLinks: function(navMenu) {
        const loginLink = document.createElement('a');
        loginLink.href = 'login.html';
        loginLink.className = 'nav-link auth-link';
        loginLink.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        
        navMenu.appendChild(loginLink);
    }
};

// Export for use in other modules
window.NavigationComponent = NavigationComponent;

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    if (window.AuthService) {
        NavigationComponent.updateNavigation();
    }
});
