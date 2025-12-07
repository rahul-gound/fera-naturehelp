// ===== Supabase Client Configuration =====

const supabaseUrl = 'https://svjswwethhhqbapxhqrm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2anN3d2V0aGhocWJhcHhocXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMDY0ODUsImV4cCI6MjA4MDY4MjQ4NX0.oFQwds4XC2j-wR9_D2Rt83_TphH3PhlAFe4t74DQll8';

// Initialize Supabase client (will be created after loading the library)
let supabase = null;

// Initialize after library loads
function initSupabase() {
    if (typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        console.log('Supabase client initialized');
    } else {
        console.error('Supabase library not loaded');
    }
}

// Export for use in other modules
window.getSupabaseClient = function() {
    return supabase;
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase();
}
