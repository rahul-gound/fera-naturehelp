// ===== Dashboard Page JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    loadUserProfile();
    loadEnvironmentalImpact();
    loadPlantBreakdown();
    loadMyPlants();
    loadRecentActivity();
}

function loadUserProfile() {
    const user = DataStore.getCurrentUser();
    const contributions = DataStore.getContributions().filter(c => c.email === user.email);
    const donations = DataStore.getDonations().filter(d => d.email === user.email);

    // Calculate totals
    const totalTrees = user.trees || contributions.length;
    const totalCO2 = user.co2 || DataStore.calculateUserCO2(user.email);
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0) + (user.donations || 0);
    
    // Get user rank
    const leaderboard = DataStore.getLeaderboard();
    const rank = leaderboard.findIndex(u => u.email === user.email) + 1;
    
    // Calculate months active
    const joinDate = user.joinDate || new Date().toISOString();
    const monthsActive = Math.max(1, Math.ceil((new Date() - new Date(joinDate)) / (1000 * 60 * 60 * 24 * 30)));

    // Update UI
    const nameEl = document.getElementById('user-name');
    const avatarEl = document.getElementById('user-avatar');
    const rankEl = document.getElementById('user-rank');
    const treesEl = document.getElementById('user-trees');
    const co2El = document.getElementById('user-co2');
    const donationsEl = document.getElementById('user-donations');
    const monthsEl = document.getElementById('user-months');

    if (nameEl) nameEl.textContent = user.name;
    if (avatarEl) avatarEl.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=228B22&color=fff&size=120`;
    if (rankEl) rankEl.innerHTML = `<i class="fas fa-trophy"></i> Rank #${rank || 'N/A'}`;
    if (treesEl) treesEl.textContent = totalTrees;
    if (co2El) co2El.textContent = totalCO2 + ' kg';
    if (donationsEl) donationsEl.textContent = '$' + totalDonations;
    if (monthsEl) monthsEl.textContent = monthsActive;

    // Update certificate info
    const certRecipient = document.getElementById('cert-recipient');
    const certTrees = document.getElementById('cert-trees');
    const certCO2 = document.getElementById('cert-co2');

    if (certRecipient) certRecipient.textContent = user.name;
    if (certTrees) certTrees.textContent = totalTrees;
    if (certCO2) certCO2.textContent = totalCO2 + ' kg';
}

function loadEnvironmentalImpact() {
    const user = DataStore.getCurrentUser();
    const contributions = DataStore.getContributions().filter(c => c.email === user.email);

    // Calculate impact
    let totalCO2 = user.co2 || 0;
    contributions.forEach(c => {
        const plant = DataStore.getPlantById(c.plantId);
        if (plant) {
            totalCO2 += plant.co2PerYear;
        }
    });

    // Oxygen calculation: roughly 2.9x the CO2 absorption
    const oxygen = Math.round(totalCO2 * 2.92);
    
    // Water conservation: roughly 400 liters per tree per year
    const trees = user.trees || contributions.length;
    const water = trees * 400;

    // Update UI
    const co2El = document.getElementById('impact-co2');
    const oxygenEl = document.getElementById('impact-oxygen');
    const waterEl = document.getElementById('impact-water');

    if (co2El) co2El.textContent = totalCO2 + ' kg';
    if (oxygenEl) oxygenEl.textContent = formatNumber(oxygen) + ' kg';
    if (waterEl) waterEl.textContent = formatNumber(water) + ' L';
}

function loadPlantBreakdown() {
    const container = document.getElementById('plant-breakdown');
    if (!container) return;

    const user = DataStore.getCurrentUser();
    const contributions = DataStore.getContributions().filter(c => c.email === user.email);
    
    // Group by plant type
    const plantCounts = {};
    contributions.forEach(c => {
        const plant = DataStore.getPlantById(c.plantId);
        if (plant) {
            if (!plantCounts[plant.name]) {
                plantCounts[plant.name] = { count: 0, co2: plant.co2PerYear };
            }
            plantCounts[plant.name].count++;
        }
    });

    // If no contributions, show default data
    if (Object.keys(plantCounts).length === 0) {
        const defaultPlants = [
            { name: 'Neem Tree', count: 5, co2: 25 },
            { name: 'Mango Tree', count: 3, co2: 30 },
            { name: 'Banyan Tree', count: 2, co2: 45 },
            { name: 'Bamboo', count: 2, co2: 35 }
        ];
        defaultPlants.forEach(p => {
            plantCounts[p.name] = { count: p.count, co2: p.co2 };
        });
    }

    const totalPlants = Object.values(plantCounts).reduce((sum, p) => sum + p.count, 0);

    container.innerHTML = `
        <div class="breakdown-chart">
            ${Object.entries(plantCounts).map(([name, data], index) => {
                const percentage = Math.round((data.count / totalPlants) * 100);
                const colors = ['#228B22', '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800'];
                const color = colors[index % colors.length];
                return `
                    <div class="breakdown-item" style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span><i class="fas fa-tree" style="color: ${color};"></i> ${name}</span>
                            <span>${data.count} (${percentage}%)</span>
                        </div>
                        <div style="background: #e0e0e0; border-radius: 10px; height: 10px; overflow: hidden;">
                            <div style="width: ${percentage}%; background: ${color}; height: 100%; border-radius: 10px;"></div>
                        </div>
                        <small style="color: #666;">CO2: ${data.count * data.co2} kg/year</small>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function loadMyPlants() {
    const container = document.getElementById('my-plants-grid');
    if (!container) return;

    const user = DataStore.getCurrentUser();
    const contributions = DataStore.getContributions().filter(c => c.email === user.email);
    
    // Get unique plants with images
    const myPlants = [];
    contributions.forEach(c => {
        const plant = DataStore.getPlantById(c.plantId);
        if (plant) {
            myPlants.push({
                ...plant,
                date: c.date,
                location: c.location
            });
        }
    });

    // If no contributions, show default plants
    if (myPlants.length === 0) {
        const defaultPlantIds = [1, 2, 3, 5, 7, 8];
        defaultPlantIds.forEach(id => {
            const plant = DataStore.getPlantById(id);
            if (plant) {
                myPlants.push({
                    ...plant,
                    date: new Date().toISOString(),
                    location: 'Local Park'
                });
            }
        });
    }

    container.innerHTML = myPlants.map(plant => `
        <div class="my-plant-card">
            <img src="${plant.image}" alt="${plant.name}" onerror="this.src='https://via.placeholder.com/200x120/228B22/ffffff?text=${encodeURIComponent(plant.name)}'">
            <div class="plant-name">
                <h4>${plant.name}</h4>
                <p><i class="fas fa-cloud"></i> ${plant.co2PerYear} kg CO2/year</p>
            </div>
        </div>
    `).join('');
}

function loadRecentActivity() {
    const container = document.getElementById('activity-list');
    if (!container) return;

    const user = DataStore.getCurrentUser();
    const contributions = DataStore.getContributions().filter(c => c.email === user.email);
    const donations = DataStore.getDonations().filter(d => d.email === user.email);

    // Combine and sort activities
    const activities = [];

    contributions.forEach(c => {
        const plant = DataStore.getPlantById(c.plantId);
        activities.push({
            type: 'plant',
            icon: 'fas fa-seedling',
            color: '#228B22',
            text: `Planted a ${plant ? plant.name : 'tree'}`,
            location: c.location,
            date: c.date
        });
    });

    donations.forEach(d => {
        activities.push({
            type: 'donation',
            icon: 'fas fa-heart',
            color: '#e91e63',
            text: `Donated $${d.amount}`,
            date: d.date
        });
    });

    // Sort by date (newest first)
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    // If no activities, show default
    if (activities.length === 0) {
        const defaultActivities = [
            { icon: 'fas fa-seedling', color: '#228B22', text: 'Planted a Neem Tree', location: 'City Park', date: new Date(Date.now() - 86400000).toISOString() },
            { icon: 'fas fa-seedling', color: '#228B22', text: 'Planted a Mango Tree', location: 'School Garden', date: new Date(Date.now() - 172800000).toISOString() },
            { icon: 'fas fa-heart', color: '#e91e63', text: 'Donated $50', date: new Date(Date.now() - 259200000).toISOString() },
            { icon: 'fas fa-seedling', color: '#228B22', text: 'Planted a Banyan Tree', location: 'Community Center', date: new Date(Date.now() - 432000000).toISOString() },
            { icon: 'fas fa-trophy', color: '#FFD700', text: 'Reached Rank #5 on Leaderboard', date: new Date(Date.now() - 604800000).toISOString() }
        ];
        activities.push(...defaultActivities);
    }

    container.innerHTML = `
        <style>
            .activity-item {
                display: flex;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid #eee;
            }
            .activity-item:last-child {
                border-bottom: none;
            }
            .activity-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
            }
            .activity-content {
                flex: 1;
            }
            .activity-content h4 {
                margin: 0;
                font-size: 0.95rem;
            }
            .activity-content p {
                margin: 5px 0 0;
                font-size: 0.85rem;
                color: #666;
            }
            .activity-date {
                color: #999;
                font-size: 0.8rem;
            }
        </style>
        ${activities.slice(0, 10).map(activity => `
            <div class="activity-item">
                <div class="activity-icon" style="background-color: ${activity.color}20;">
                    <i class="${activity.icon}" style="color: ${activity.color};"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.text}</h4>
                    ${activity.location ? `<p><i class="fas fa-map-marker-alt"></i> ${activity.location}</p>` : ''}
                </div>
                <span class="activity-date">${formatRelativeTime(activity.date)}</span>
            </div>
        `).join('')}
    `;
}

function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}
