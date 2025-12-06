// ===== NatureHelp Main Application JavaScript =====

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// ===== Data Storage (Using localStorage for demo) =====
const DataStore = {
    // Plants Data
    plants: [
        {
            id: 1,
            name: 'Neem Tree',
            scientificName: 'Azadirachta indica',
            co2PerYear: 25,
            description: 'Known for its medicinal properties and air purification capabilities.',
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300'
        },
        {
            id: 2,
            name: 'Mango Tree',
            scientificName: 'Mangifera indica',
            co2PerYear: 30,
            description: 'Provides delicious fruits while absorbing significant CO2.',
            image: 'https://images.unsplash.com/photo-1509223197845-458d87a6c1aa?w=300'
        },
        {
            id: 3,
            name: 'Banyan Tree',
            scientificName: 'Ficus benghalensis',
            co2PerYear: 45,
            description: 'A majestic tree that provides extensive shade and absorbs large amounts of CO2.',
            image: 'https://images.unsplash.com/photo-1564429238980-c7e7fd4e54e2?w=300'
        },
        {
            id: 4,
            name: 'Peepal Tree',
            scientificName: 'Ficus religiosa',
            co2PerYear: 40,
            description: 'Sacred tree known for releasing oxygen 24/7.',
            image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300'
        },
        {
            id: 5,
            name: 'Teak Tree',
            scientificName: 'Tectona grandis',
            co2PerYear: 35,
            description: 'Valuable timber tree that helps in carbon sequestration.',
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300'
        },
        {
            id: 6,
            name: 'Ashoka Tree',
            scientificName: 'Saraca asoca',
            co2PerYear: 20,
            description: 'Beautiful flowering tree with medicinal properties.',
            image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=300'
        },
        {
            id: 7,
            name: 'Jamun Tree',
            scientificName: 'Syzygium cumini',
            co2PerYear: 28,
            description: 'Fruit-bearing tree with excellent environmental benefits.',
            image: 'https://images.unsplash.com/photo-1476673160081-cf065bc4cf47?w=300'
        },
        {
            id: 8,
            name: 'Gulmohar Tree',
            scientificName: 'Delonix regia',
            co2PerYear: 32,
            description: 'Known for its stunning red flowers and shade.',
            image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=300'
        },
        {
            id: 9,
            name: 'Bamboo',
            scientificName: 'Bambusoideae',
            co2PerYear: 35,
            description: 'Fast-growing plant that absorbs CO2 rapidly.',
            image: 'https://images.unsplash.com/photo-1564979395092-281876b4c4c6?w=300'
        },
        {
            id: 10,
            name: 'Tulsi Plant',
            scientificName: 'Ocimum tenuiflorum',
            co2PerYear: 5,
            description: 'Sacred plant with medicinal and air-purifying properties.',
            image: 'https://images.unsplash.com/photo-1603356033288-acfcb54801e6?w=300'
        }
    ],

    // Get all plants
    getPlants: function() {
        return this.plants;
    },

    // Get plant by ID
    getPlantById: function(id) {
        return this.plants.find(plant => plant.id === parseInt(id));
    },

    // Get contributions from localStorage
    getContributions: function() {
        const contributions = localStorage.getItem('naturehelp_contributions');
        return contributions ? JSON.parse(contributions) : [];
    },

    // Save contribution
    saveContribution: function(contribution) {
        const contributions = this.getContributions();
        contribution.id = Date.now();
        contribution.date = new Date().toISOString();
        contributions.push(contribution);
        localStorage.setItem('naturehelp_contributions', JSON.stringify(contributions));
        return contribution;
    },

    // Get user data
    getUser: function(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    },

    // Get all users
    getUsers: function() {
        const users = localStorage.getItem('naturehelp_users');
        return users ? JSON.parse(users) : this.getDefaultUsers();
    },

    // Save user
    saveUser: function(userData) {
        const users = this.getUsers();
        const existingIndex = users.findIndex(u => u.email === userData.email);
        if (existingIndex >= 0) {
            users[existingIndex] = { ...users[existingIndex], ...userData };
        } else {
            userData.id = Date.now();
            userData.joinDate = new Date().toISOString();
            users.push(userData);
        }
        localStorage.setItem('naturehelp_users', JSON.stringify(users));
        return userData;
    },

    // Get donations
    getDonations: function() {
        const donations = localStorage.getItem('naturehelp_donations');
        return donations ? JSON.parse(donations) : [];
    },

    // Save donation
    saveDonation: function(donation) {
        const donations = this.getDonations();
        donation.id = Date.now();
        donation.date = new Date().toISOString();
        donations.push(donation);
        localStorage.setItem('naturehelp_donations', JSON.stringify(donations));
        return donation;
    },

    // Get current user (for demo, using localStorage)
    getCurrentUser: function() {
        const currentUser = localStorage.getItem('naturehelp_current_user');
        if (currentUser) {
            return JSON.parse(currentUser);
        }
        // Return demo user
        return {
            name: 'John Doe',
            email: 'john@example.com',
            trees: 12,
            co2: 300,
            donations: 150,
            rank: 5
        };
    },

    // Set current user
    setCurrentUser: function(user) {
        localStorage.setItem('naturehelp_current_user', JSON.stringify(user));
    },

    // Get default users for leaderboard
    getDefaultUsers: function() {
        return [
            { id: 1, name: 'Sarah Green', email: 'sarah@example.com', trees: 45, co2: 1125, avatar: 'https://ui-avatars.com/api/?name=Sarah+Green&background=228B22&color=fff' },
            { id: 2, name: 'Michael Forest', email: 'michael@example.com', trees: 38, co2: 950, avatar: 'https://ui-avatars.com/api/?name=Michael+Forest&background=228B22&color=fff' },
            { id: 3, name: 'Emma Woods', email: 'emma@example.com', trees: 32, co2: 800, avatar: 'https://ui-avatars.com/api/?name=Emma+Woods&background=228B22&color=fff' },
            { id: 4, name: 'David Nature', email: 'david@example.com', trees: 28, co2: 700, avatar: 'https://ui-avatars.com/api/?name=David+Nature&background=228B22&color=fff' },
            { id: 5, name: 'John Doe', email: 'john@example.com', trees: 12, co2: 300, avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=228B22&color=fff' },
            { id: 6, name: 'Lisa Plant', email: 'lisa@example.com', trees: 22, co2: 550, avatar: 'https://ui-avatars.com/api/?name=Lisa+Plant&background=228B22&color=fff' },
            { id: 7, name: 'Robert Earth', email: 'robert@example.com', trees: 18, co2: 450, avatar: 'https://ui-avatars.com/api/?name=Robert+Earth&background=228B22&color=fff' },
            { id: 8, name: 'Jennifer Leaf', email: 'jennifer@example.com', trees: 15, co2: 375, avatar: 'https://ui-avatars.com/api/?name=Jennifer+Leaf&background=228B22&color=fff' },
            { id: 9, name: 'William Tree', email: 'william@example.com', trees: 10, co2: 250, avatar: 'https://ui-avatars.com/api/?name=William+Tree&background=228B22&color=fff' },
            { id: 10, name: 'Amanda Seed', email: 'amanda@example.com', trees: 8, co2: 200, avatar: 'https://ui-avatars.com/api/?name=Amanda+Seed&background=228B22&color=fff' }
        ];
    },

    // Calculate CO2 for a user
    calculateUserCO2: function(userEmail) {
        const contributions = this.getContributions().filter(c => c.email === userEmail);
        let totalCO2 = 0;
        contributions.forEach(c => {
            const plant = this.getPlantById(c.plantId);
            if (plant) {
                totalCO2 += plant.co2PerYear;
            }
        });
        return totalCO2;
    },

    // Get user plant count
    getUserPlantCount: function(userEmail) {
        return this.getContributions().filter(c => c.email === userEmail).length;
    },

    // Get leaderboard data
    getLeaderboard: function() {
        const users = this.getUsers();
        // Sort by trees planted
        return users.sort((a, b) => b.trees - a.trees);
    }
};

// ===== Utility Functions =====
function showSuccessMessage(message) {
    const successEl = document.getElementById('success-message');
    if (successEl) {
        const messageP = successEl.querySelector('p');
        if (messageP && message) {
            messageP.textContent = message;
        }
        successEl.classList.add('show');
        setTimeout(() => {
            successEl.classList.remove('show');
        }, 4000);
    }
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// ===== Certificate Functions =====
function openCertificateModal(userName, trees, co2) {
    const modal = document.getElementById('certificate-modal');
    if (modal) {
        document.getElementById('cert-recipient').textContent = userName;
        document.getElementById('cert-trees').textContent = trees;
        document.getElementById('cert-co2').textContent = co2 + ' kg';
        document.getElementById('cert-date').textContent = 'Issued on ' + formatDate(new Date().toISOString());
        modal.classList.add('active');
    }
}

function closeCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function downloadCertificate() {
    // Create a simple certificate download (in production, you'd generate a PDF)
    const recipientName = document.getElementById('cert-recipient').textContent;
    const trees = document.getElementById('cert-trees').textContent;
    const co2 = document.getElementById('cert-co2').textContent;
    const date = document.getElementById('cert-date').textContent;

    const certificateText = `
=====================================
    CERTIFICATE OF APPRECIATION
=====================================

This certificate is presented to

        ${recipientName}

For outstanding contribution to
environmental conservation through
the NatureHelp platform.

Trees Planted: ${trees}
CO2 Absorbed: ${co2}

${date}

NatureHelp - Plant Trees, Save Earth
=====================================
    `;

    const blob = new Blob([certificateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NatureHelp_Certificate_${recipientName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSuccessMessage('Certificate downloaded successfully!');
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('certificate-modal');
    if (modal && e.target === modal) {
        closeCertificateModal();
    }
});

// ===== Initialize Stats on Homepage =====
function initializeHomeStats() {
    const users = DataStore.getUsers();
    const contributions = DataStore.getContributions();
    const donations = DataStore.getDonations();

    // Calculate totals
    let totalTrees = users.reduce((sum, u) => sum + (u.trees || 0), 0);
    let totalCO2 = users.reduce((sum, u) => sum + (u.co2 || 0), 0);
    let totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0) + 12450; // Base amount

    // Update stats on homepage
    const totalTreesEl = document.getElementById('total-trees');
    const totalUsersEl = document.getElementById('total-users');
    const totalCO2El = document.getElementById('total-co2');
    const totalDonationsEl = document.getElementById('total-donations');

    if (totalTreesEl) totalTreesEl.textContent = formatNumber(totalTrees + contributions.length);
    if (totalUsersEl) totalUsersEl.textContent = formatNumber(users.length + 500);
    if (totalCO2El) totalCO2El.textContent = formatNumber(totalCO2) + ' kg';
    if (totalDonationsEl) totalDonationsEl.textContent = '$' + formatNumber(totalDonations);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeHomeStats();
});
