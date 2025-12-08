// ===== Authentication Service =====
// Handles authentication operations with Supabase

const AuthService = {
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
        
        return { data, error };
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
    }
};

// Export for use in other modules
window.AuthService = AuthService;
