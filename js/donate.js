// ===== Donate Page JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    initializeDonatePage();
});

let selectedAmount = 50;

function initializeDonatePage() {
    setupDonationOptions();
    setupCustomAmount();
    setupDonateForm();
    updateImpactStats();
}

function setupDonationOptions() {
    const options = document.querySelectorAll('.donation-card');
    
    options.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected from all
            options.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected to clicked
            this.classList.add('selected');
            
            // Update amount
            selectedAmount = parseInt(this.dataset.amount);
            updateDonationAmount();
            updateImpactStats();

            // Clear custom amount
            const customInput = document.getElementById('custom-amount');
            if (customInput) {
                customInput.value = '';
            }
        });
    });
}

function setupCustomAmount() {
    const customInput = document.getElementById('custom-amount');
    if (!customInput) return;

    customInput.addEventListener('input', function() {
        const value = parseInt(this.value);
        if (value > 0) {
            selectedAmount = value;
            
            // Remove selected from preset options
            document.querySelectorAll('.donation-card').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            updateDonationAmount();
            updateImpactStats();
        }
    });
}

function updateDonationAmount() {
    const amountDisplay = document.getElementById('donation-amount');
    if (amountDisplay) {
        amountDisplay.value = '$' + selectedAmount;
    }
}

function updateImpactStats() {
    // Calculate impact based on donation amount
    // Assuming $10 = 1 tree, each tree absorbs 25kg CO2/year and produces 73kg oxygen/year
    const trees = Math.floor(selectedAmount / 10);
    const co2 = trees * 25;
    const oxygen = trees * 73;

    const treesEl = document.getElementById('impact-trees');
    const co2El = document.getElementById('impact-co2');
    const oxygenEl = document.getElementById('impact-oxygen');

    if (treesEl) treesEl.textContent = trees;
    if (co2El) co2El.textContent = co2 + ' kg';
    if (oxygenEl) oxygenEl.textContent = oxygen + ' kg';
}

function setupDonateForm() {
    const form = document.getElementById('donate-form');
    if (!form) return;

    // Format card number
    const cardInput = document.getElementById('card-number');
    if (cardInput) {
        cardInput.addEventListener('input', function() {
            let value = this.value.replace(/\s/g, '').replace(/\D/g, '');
            let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
            this.value = formatted;
        });
    }

    // Format expiry date
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            this.value = value;
        });
    }

    // CVV - numbers only
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate
        const name = document.getElementById('donor-name').value.trim();
        const email = document.getElementById('donor-email').value.trim();
        const cardNumber = document.getElementById('card-number').value.trim();
        const expiry = document.getElementById('expiry').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        if (!name || !email || !cardNumber || !expiry || !cvv) {
            alert('Please fill in all required fields.');
            return;
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Validate card number (basic check - 15+ digits for Amex, 16 for others)
        if (cardNumber.replace(/\s/g, '').length < 15) {
            alert('Please enter a valid card number.');
            return;
        }

        // Validate expiry (MM/YY format)
        const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryPattern.test(expiry)) {
            alert('Please enter a valid expiry date (MM/YY).');
            return;
        }

        // Validate CVV
        if (cvv.length < 3) {
            alert('Please enter a valid CVV.');
            return;
        }

        // Save donation
        const donation = {
            name: name,
            email: email,
            amount: selectedAmount,
            recurring: document.getElementById('recurring').checked,
            message: document.getElementById('message').value.trim(),
            treesSponsored: Math.floor(selectedAmount / 10)
        };

        DataStore.saveDonation(donation);

        // Update user if exists
        let user = DataStore.getUser(email);
        if (user) {
            user.donations = (user.donations || 0) + selectedAmount;
            DataStore.saveUser(user);
        }

        // Show success message
        showSuccessMessage('Thank you for your generous donation of $' + selectedAmount + '!');

        // Reset form
        form.reset();
        selectedAmount = 50;
        updateDonationAmount();
        updateImpactStats();
        
        // Reset donation cards
        document.querySelectorAll('.donation-card').forEach((opt, index) => {
            opt.classList.remove('selected');
            if (parseInt(opt.dataset.amount) === 50) {
                opt.classList.add('selected');
            }
        });
    });
}
