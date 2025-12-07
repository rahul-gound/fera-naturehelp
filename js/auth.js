// ===== Authentication Module =====

// Auth State Management
const AuthManager = {
    // Check if user is authenticated
    isAuthenticated: async function() {
        const supabase = window.getSupabaseClient();
        if (!supabase) return false;
        
        const { data: { session } } = await supabase.auth.getSession();
        return !!session;
    },

    // Get current user
    getCurrentUser: async function() {
        const supabase = window.getSupabaseClient();
        if (!supabase) return null;
        
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    // Get user profile from database
    getUserProfile: async function(userId) {
        const supabase = window.getSupabaseClient();
        if (!supabase) return null;
        
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        
        return data;
    },

    // Create or update user profile
    saveUserProfile: async function(userId, profileData) {
        const supabase = window.getSupabaseClient();
        if (!supabase) return null;
        
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                ...profileData,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        
        if (error) {
            console.error('Error saving profile:', error);
            return null;
        }
        
        return data;
    },

    // Sign up new user
    signUp: async function(email, password, name) {
        const supabase = window.getSupabaseClient();
        if (!supabase) return { error: { message: 'Supabase not initialized' } };
        
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name
                },
                emailRedirectTo: window.location.origin + '/dashboard.html'
            }
        });
        
        if (error) {
            return { error };
        }
        
        // Initialize user profile with zero values
        if (data.user) {
            await this.saveUserProfile(data.user.id, {
                name: name,
                email: email,
                trees_planted: 0,
                money_donated: 0,
                co2_absorbed: 0,
                created_at: new Date().toISOString()
            });
        }
        
        return { data };
    },

    // Sign in existing user
    signIn: async function(email, password) {
        const supabase = window.getSupabaseClient();
        if (!supabase) return { error: { message: 'Supabase not initialized' } };
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        return { data, error };
    },

    // Sign out user
    signOut: async function() {
        const supabase = window.getSupabaseClient();
        if (!supabase) return;
        
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            window.location.href = 'login.html';
        }
    },

    // Request password reset
    resetPassword: async function(email) {
        const supabase = window.getSupabaseClient();
        if (!supabase) return { error: { message: 'Supabase not initialized' } };
        
        // Validate email parameter
        if (!email || typeof email !== 'string' || email.trim() === '') {
            return { error: { message: 'Valid email address is required' } };
        }
        
        const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: window.location.origin + '/login.html?reset=true'
        });
        
        return { data, error };
    },

    // Update password
    updatePassword: async function(newPassword) {
        const supabase = window.getSupabaseClient();
        if (!supabase) return { error: { message: 'Supabase not initialized' } };
        
        // Validate password parameter
        if (!newPassword || typeof newPassword !== 'string' || newPassword.trim() === '') {
            return { error: { message: 'Password is required' } };
        }
        
        if (newPassword.length < 6) {
            return { error: { message: 'Password must be at least 6 characters long' } };
        }
        
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });
        
        return { data, error };
    },

    // Add plant contribution
    addPlantContribution: async function(userId, plantData) {
        const supabase = window.getSupabaseClient();
        if (!supabase) return null;
        
        const { data, error } = await supabase
            .from('contributions')
            .insert({
                user_id: userId,
                plant_id: plantData.plantId,
                plant_name: plantData.plantName,
                location: plantData.location,
                photo_url: plantData.photoUrl,
                co2_per_year: plantData.co2PerYear,
                created_at: new Date().toISOString()
            })
            .select()
            .single();
        
        if (error) {
            console.error('Error adding contribution:', error);
            return null;
        }
        
        // Update user's total trees and CO2
        const profile = await this.getUserProfile(userId);
        if (profile) {
            await this.saveUserProfile(userId, {
                trees_planted: (profile.trees_planted || 0) + 1,
                co2_absorbed: (profile.co2_absorbed || 0) + plantData.co2PerYear
            });
        }
        
        return data;
    },

    // Add donation
    addDonation: async function(userId, amount) {
        const supabase = window.getSupabaseClient();
        if (!supabase) return null;
        
        const { data, error } = await supabase
            .from('donations')
            .insert({
                user_id: userId,
                amount: amount,
                created_at: new Date().toISOString()
            })
            .select()
            .single();
        
        if (error) {
            console.error('Error adding donation:', error);
            return null;
        }
        
        // Update user's total donations
        const profile = await this.getUserProfile(userId);
        if (profile) {
            await this.saveUserProfile(userId, {
                money_donated: (profile.money_donated || 0) + amount
            });
        }
        
        return data;
    },

    // Get user contributions
    getUserContributions: async function(userId) {
        const supabase = window.getSupabaseClient();
        if (!supabase) return [];
        
        const { data, error } = await supabase
            .from('contributions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching contributions:', error);
            return [];
        }
        
        return data || [];
    },

    // Get user donations
    getUserDonations: async function(userId) {
        const supabase = window.getSupabaseClient();
        if (!supabase) return [];
        
        const { data, error } = await supabase
            .from('donations')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching donations:', error);
            return [];
        }
        
        return data || [];
    },

    // Get leaderboard
    getLeaderboard: async function(limit = 10) {
        const supabase = window.getSupabaseClient();
        if (!supabase) return [];
        
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('trees_planted', { ascending: false })
            .limit(limit);
        
        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
        
        return data || [];
    }
};

// Protect pages that require authentication
async function protectPage() {
    const isAuth = await AuthManager.isAuthenticated();
    if (!isAuth) {
        window.location.href = 'login.html';
    }
}

// Update navigation based on auth state
async function updateNavigation() {
    const isAuth = await AuthManager.isAuthenticated();
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navMenu) return;
    
    // Remove existing auth links
    const existingAuthLinks = navMenu.querySelectorAll('.auth-link');
    existingAuthLinks.forEach(link => link.remove());
    
    if (isAuth) {
        const user = await AuthManager.getCurrentUser();
        const profile = user ? await AuthManager.getUserProfile(user.id) : null;
        
        // Add user name and logout
        const userLink = document.createElement('span');
        userLink.className = 'nav-link auth-link';
        userLink.style.cursor = 'default';
        userLink.innerHTML = `<i class="fas fa-user"></i> ${profile?.name || user?.email || 'User'}`;
        
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.className = 'nav-link auth-link';
        logoutLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutLink.onclick = async (e) => {
            e.preventDefault();
            await AuthManager.signOut();
        };
        
        navMenu.appendChild(userLink);
        navMenu.appendChild(logoutLink);
    } else {
        // Add login link
        const loginLink = document.createElement('a');
        loginLink.href = 'login.html';
        loginLink.className = 'nav-link auth-link';
        loginLink.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        
        navMenu.appendChild(loginLink);
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
});
