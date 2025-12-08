// ===== Authentication Module =====
// This file maintains backward compatibility by delegating to modular services

// Main AuthManager object that delegates to new modular services
const AuthManager = {
    // Check if user is authenticated
    isAuthenticated: async function() {
        return await window.AuthService.isAuthenticated();
    },

    // Get current user
    getCurrentUser: async function() {
        return await window.AuthService.getCurrentUser();
    },

    // Get user profile from database
    getUserProfile: async function(userId) {
        return await window.ProfileService.getUserProfile(userId);
    },

    // Create or update user profile
    saveUserProfile: async function(userId, profileData) {
        return await window.ProfileService.saveUserProfile(userId, profileData);
    },

    // Sign up new user
    signUp: async function(email, password, name) {
        const { data, error } = await window.AuthService.signUp(email, password, name);
        
        if (error) {
            return { error };
        }
        
        // Initialize user profile with zero values
        if (data.user) {
            await window.ProfileService.initializeProfile(data.user.id, name, email);
        }
        
        return { data };
    },

    // Sign in existing user
    signIn: async function(email, password) {
        return await window.AuthService.signIn(email, password);
    },

    // Sign out user
    signOut: async function() {
        return await window.AuthService.signOut();
    },

    // Request password reset
    resetPassword: async function(email) {
        return await window.AuthService.resetPassword(email);
    },

    // Update password
    updatePassword: async function(newPassword) {
        return await window.AuthService.updatePassword(newPassword);
    },

    // Add plant contribution
    addPlantContribution: async function(userId, plantData) {
        return await window.ContributionService.addPlantContribution(userId, plantData);
    },

    // Add donation
    addDonation: async function(userId, amount) {
        return await window.ContributionService.addDonation(userId, amount);
    },

    // Get user contributions
    getUserContributions: async function(userId) {
        return await window.ContributionService.getUserContributions(userId);
    },

    // Get user donations
    getUserDonations: async function(userId) {
        return await window.ContributionService.getUserDonations(userId);
    },

    // Get leaderboard
    getLeaderboard: async function(limit = 10) {
        return await window.LeaderboardService.getLeaderboard(limit);
    }
};

// Backward compatibility functions that delegate to new components
async function protectPage() {
    return await window.PageProtection.protectPage();
}

async function updateNavigation() {
    return await window.NavigationComponent.updateNavigation();
}
