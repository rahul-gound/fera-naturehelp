// ===== Profile Service =====
// Handles user profile operations

const ProfileService = {
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

    // Initialize new user profile with default values
    initializeProfile: async function(userId, name, email) {
        return await this.saveUserProfile(userId, {
            name: name,
            email: email,
            trees_planted: 0,
            money_donated: 0,
            co2_absorbed: 0,
            created_at: new Date().toISOString()
        });
    },

    // Update user statistics
    updateStats: async function(userId, statsUpdate) {
        const profile = await this.getUserProfile(userId);
        if (!profile) return null;

        const updatedData = {};
        if (statsUpdate.trees_planted !== undefined) {
            updatedData.trees_planted = (profile.trees_planted || 0) + statsUpdate.trees_planted;
        }
        if (statsUpdate.money_donated !== undefined) {
            updatedData.money_donated = (profile.money_donated || 0) + statsUpdate.money_donated;
        }
        if (statsUpdate.co2_absorbed !== undefined) {
            updatedData.co2_absorbed = (profile.co2_absorbed || 0) + statsUpdate.co2_absorbed;
        }

        return await this.saveUserProfile(userId, updatedData);
    }
};

// Export for use in other modules
window.ProfileService = ProfileService;
