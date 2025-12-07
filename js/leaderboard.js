// ===== Leaderboard Page JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    initializeLeaderboard();
});

function initializeLeaderboard() {
    loadTopContributors();
    loadLeaderboardTable();
}

function loadTopContributors() {
    const container = document.getElementById('top-contributors');
    if (!container) return;

    const leaderboard = DataStore.getLeaderboard();
    const top3 = leaderboard.slice(0, 3);

    // Reorder for display: 2nd, 1st, 3rd
    const displayOrder = [top3[1], top3[0], top3[2]];
    const badges = ['silver', 'gold', 'bronze'];
    const ranks = [2, 1, 3];

    container.innerHTML = displayOrder.map((user, index) => {
        if (!user) return '';
        return `
            <div class="top-card ${badges[index]}">
                <div class="rank-badge">${ranks[index]}</div>
                <img src="${user.avatar || generateAvatar(user.name)}" alt="${user.name}" class="avatar" onerror="this.src='${generateAvatar(user.name)}'">
                <h3>${user.name}</h3>
                <p class="trees-count"><i class="fas fa-tree"></i> ${user.trees} trees</p>
                <p class="co2-absorbed">${user.co2} kg CO2 absorbed</p>
                <button class="btn btn-primary certificate-btn" onclick="openCertificateModal('${user.name}', ${user.trees}, ${user.co2})">
                    <i class="fas fa-certificate"></i> View Certificate
                </button>
            </div>
        `;
    }).join('');
}

function loadLeaderboardTable() {
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;

    const leaderboard = DataStore.getLeaderboard();

    tbody.innerHTML = leaderboard.map((user, index) => {
        const rank = index + 1;
        const rankIcon = getRankIcon(rank);
        
        return `
            <tr>
                <td>${rankIcon} ${rank}</td>
                <td>
                    <div class="user-info">
                        <img src="${user.avatar || generateAvatar(user.name)}" alt="${user.name}" onerror="this.src='${generateAvatar(user.name)}'">
                        <span>${user.name}</span>
                    </div>
                </td>
                <td><i class="fas fa-tree" style="color: #228B22;"></i> ${user.trees}</td>
                <td><i class="fas fa-cloud" style="color: #4CAF50;"></i> ${user.co2} kg</td>
                <td>
                    <button class="btn btn-secondary certificate-btn" onclick="openCertificateModal('${user.name}', ${user.trees}, ${user.co2})">
                        <i class="fas fa-certificate"></i> Certificate
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function getRankIcon(rank) {
    switch(rank) {
        case 1:
            return '<i class="fas fa-trophy" style="color: #FFD700;"></i>';
        case 2:
            return '<i class="fas fa-medal" style="color: #C0C0C0;"></i>';
        case 3:
            return '<i class="fas fa-medal" style="color: #CD7F32;"></i>';
        default:
            return '';
    }
}

function generateAvatar(name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=228B22&color=fff`;
}
