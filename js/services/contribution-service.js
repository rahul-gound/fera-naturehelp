// ===== Contribution Service =====
// Handles plant contributions and donations

const ContributionService = {
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
        if (window.ProfileService) {
            await window.ProfileService.updateStats(userId, {
                trees_planted: 1,
                co2_absorbed: plantData.co2PerYear
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
        if (window.ProfileService) {
            await window.ProfileService.updateStats(userId, {
                money_donated: amount
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
    }
};

// Export for use in other modules
window.ContributionService = ContributionService;
