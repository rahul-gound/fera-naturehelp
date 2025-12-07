// ===== Dashboard Page JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

async function initializeDashboard() {
    await loadUserProfile();
    await loadEnvironmentalImpact();
    await loadPlantBreakdown();
    await loadMyPlants();
    await loadRecentActivity();
}

async function loadUserProfile() {
    const authUser = await AuthManager.getCurrentUser();
    if (!authUser) {
        window.location.href = 'login.html';
        return;
    }

    const profile = await AuthManager.getUserProfile(authUser.id);
    const contributions = await AuthManager.getUserContributions(authUser.id);
    const donations = await AuthManager.getUserDonations(authUser.id);

    // Calculate totals
    const totalTrees = profile?.trees_planted || 0;
    const totalCO2 = profile?.co2_absorbed || 0;
    const totalDonations = profile?.money_donated || 0;
    
    // Get user rank
    const leaderboard = await AuthManager.getLeaderboard(100);
    const rank = leaderboard.findIndex(u => u.id === authUser.id) + 1;
    
    // Calculate months active
    const joinDate = profile?.created_at || authUser.created_at || new Date().toISOString();
    const monthsActive = Math.max(1, Math.ceil((new Date() - new Date(joinDate)) / (1000 * 60 * 60 * 24 * 30)));

    // Update UI
    const nameEl = document.getElementById('user-name');
    const avatarEl = document.getElementById('user-avatar');
    const rankEl = document.getElementById('user-rank');
    const treesEl = document.getElementById('user-trees');
    const co2El = document.getElementById('user-co2');
    const donationsEl = document.getElementById('user-donations');
    const monthsEl = document.getElementById('user-months');

    const displayName = profile?.name || authUser.email;
    if (nameEl) nameEl.textContent = displayName;
    if (avatarEl) avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=228B22&color=fff&size=120`;
    if (rankEl) rankEl.innerHTML = `<i class="fas fa-trophy"></i> Rank #${rank || 'N/A'}`;
    if (treesEl) treesEl.textContent = totalTrees;
    if (co2El) co2El.textContent = totalCO2 + ' kg';
    if (donationsEl) donationsEl.textContent = '$' + totalDonations;
    if (monthsEl) monthsEl.textContent = monthsActive;

    // Update certificate info
    const certRecipient = document.getElementById('cert-recipient');
    const certTrees = document.getElementById('cert-trees');
    const certCO2 = document.getElementById('cert-co2');

    if (certRecipient) certRecipient.textContent = displayName;
    if (certTrees) certTrees.textContent = totalTrees;
    if (certCO2) certCO2.textContent = totalCO2 + ' kg';
}

async function loadEnvironmentalImpact() {
    const authUser = await AuthManager.getCurrentUser();
    if (!authUser) return;

    const profile = await AuthManager.getUserProfile(authUser.id);
    const contributions = await AuthManager.getUserContributions(authUser.id);

    // Calculate impact
    let totalCO2 = profile?.co2_absorbed || 0;

    // Oxygen calculation: approximately 2.92x the CO2 absorption (based on photosynthesis ratio)
    const OXYGEN_TO_CO2_RATIO = 2.92;
    const oxygen = Math.round(totalCO2 * OXYGEN_TO_CO2_RATIO);
    
    // Water conservation: roughly 400 liters per tree per year
    const trees = profile?.trees_planted || 0;
    const water = trees * 400;

    // Update UI
    const co2El = document.getElementById('impact-co2');
    const oxygenEl = document.getElementById('impact-oxygen');
    const waterEl = document.getElementById('impact-water');

    if (co2El) co2El.textContent = totalCO2 + ' kg';
    if (oxygenEl) oxygenEl.textContent = formatNumber(oxygen) + ' kg';
    if (waterEl) waterEl.textContent = formatNumber(water) + ' L';
}

async function loadPlantBreakdown() {
    const container = document.getElementById('plant-breakdown');
    if (!container) return;

    const authUser = await AuthManager.getCurrentUser();
    if (!authUser) return;

    const contributions = await AuthManager.getUserContributions(authUser.id);
    
    // Group by plant type
    const plantCounts = {};
    contributions.forEach(c => {
        const plantName = c.plant_name;
        const co2PerYear = c.co2_per_year || 0;
        
        if (!plantCounts[plantName]) {
            plantCounts[plantName] = { count: 0, co2: co2PerYear };
        }
        plantCounts[plantName].count++;
    });

    // If no contributions, show message
    if (Object.keys(plantCounts).length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #666;">
                <i class="fas fa-seedling" style="font-size: 48px; margin-bottom: 15px; color: #228B22;"></i>
                <p>You haven't planted any trees yet.</p>
                <a href="plants.html" class="btn btn-primary" style="margin-top: 15px; display: inline-block;">
                    <i class="fas fa-plus"></i> Plant Your First Tree
                </a>
            </div>
        `;
        return;
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

async function loadMyPlants() {
    const container = document.getElementById('my-plants-grid');
    if (!container) return;

    const authUser = await AuthManager.getCurrentUser();
    if (!authUser) return;

    const contributions = await AuthManager.getUserContributions(authUser.id);
    
    // If no contributions, show message
    if (contributions.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #666; grid-column: 1 / -1;">
                <i class="fas fa-tree" style="font-size: 48px; margin-bottom: 15px; color: #228B22;"></i>
                <p>No trees planted yet. Start your journey!</p>
            </div>
        `;
        return;
    }

    // Get plant images from DataStore
    const plants = DataStore.getPlants();
    
    container.innerHTML = contributions.map(contribution => {
        const plant = plants.find(p => p.id === contribution.plant_id);
        const plantImage = plant?.image || 'https://via.placeholder.com/200x120/228B22/ffffff?text=Tree';
        
        return `
            <div class="my-plant-card">
                <img src="${plantImage}" alt="${contribution.plant_name}" onerror="this.src='https://via.placeholder.com/200x120/228B22/ffffff?text=${encodeURIComponent(contribution.plant_name)}'">
                <div class="plant-name">
                    <h4>${contribution.plant_name}</h4>
                    <p><i class="fas fa-cloud"></i> ${contribution.co2_per_year} kg CO2/year</p>
                </div>
            </div>
        `;
    }).join('');
}

async function loadRecentActivity() {
    const container = document.getElementById('activity-list');
    if (!container) return;

    const authUser = await AuthManager.getCurrentUser();
    if (!authUser) return;

    const contributions = await AuthManager.getUserContributions(authUser.id);
    const donations = await AuthManager.getUserDonations(authUser.id);

    // Combine and sort activities
    const activities = [];

    contributions.forEach(c => {
        activities.push({
            type: 'plant',
            icon: 'fas fa-seedling',
            color: '#228B22',
            text: `Planted a ${c.plant_name}`,
            location: c.location,
            date: c.created_at
        });
    });

    donations.forEach(d => {
        activities.push({
            type: 'donation',
            icon: 'fas fa-heart',
            color: '#e91e63',
            text: `Donated $${d.amount}`,
            date: d.created_at
        });
    });

    // Sort by date (newest first)
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    // If no activities, show message
    if (activities.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #666;">
                <i class="fas fa-history" style="font-size: 48px; margin-bottom: 15px; color: #999;"></i>
                <p>No activity yet. Start planting trees or making donations!</p>
            </div>
        `;
        return;
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
