// ===== Leaderboard Service =====
// Handles leaderboard data retrieval

const LeaderboardService = {
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
    },

    // Get user rank
    getUserRank: async function(userId) {
        const supabase = window.getSupabaseClient();
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('id, trees_planted')
            .order('trees_planted', { ascending: false });

        if (error) {
            console.error('Error fetching leaderboard for rank:', error);
            return null;
        }

        const userIndex = data.findIndex(profile => profile.id === userId);
        return userIndex >= 0 ? userIndex + 1 : null;
    }
};

// Export for use in other modules
window.LeaderboardService = LeaderboardService;
