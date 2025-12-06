// ===== Plants Page JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    initializePlantsPage();
});

let selectedPlant = null;

function initializePlantsPage() {
    loadPlants();
    setupUploadForm();
    setupImagePreview();
}

function loadPlants() {
    const container = document.getElementById('plants-container');
    if (!container) return;

    const plants = DataStore.getPlants();
    
    container.innerHTML = plants.map(plant => `
        <div class="plant-select-card" data-plant-id="${plant.id}" onclick="selectPlant(${plant.id})">
            <img src="${plant.image}" alt="${plant.name}" onerror="this.src='https://via.placeholder.com/300x180/228B22/ffffff?text=${encodeURIComponent(plant.name)}'">
            <div class="plant-details">
                <h3>${plant.name}</h3>
                <p>${plant.description}</p>
                <div class="plant-co2">
                    <i class="fas fa-cloud"></i>
                    <span>Absorbs ${plant.co2PerYear} kg CO2/year</span>
                </div>
            </div>
        </div>
    `).join('');
}

function selectPlant(plantId) {
    const plant = DataStore.getPlantById(plantId);
    if (!plant) return;

    selectedPlant = plant;

    // Update UI
    document.querySelectorAll('.plant-select-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-plant-id="${plantId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    // Update form
    const plantNameInput = document.getElementById('selected-plant-name');
    const plantIdInput = document.getElementById('selected-plant-id');
    
    if (plantNameInput) {
        plantNameInput.value = `${plant.name} (${plant.co2PerYear} kg CO2/year)`;
    }
    if (plantIdInput) {
        plantIdInput.value = plant.id;
    }

    // Scroll to upload section
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function setupImagePreview() {
    const fileInput = document.getElementById('plant-photo');
    const previewImage = document.getElementById('preview-image');
    const uploadArea = document.getElementById('upload-area');

    if (fileInput && previewImage) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please upload an image file.');
                    return;
                }

                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Please upload an image smaller than 5MB.');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(event) {
                    previewImage.src = event.target.result;
                    previewImage.style.display = 'block';
                    if (uploadArea) {
                        uploadArea.querySelector('i').style.display = 'none';
                        uploadArea.querySelector('p').style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Drag and drop functionality
    if (uploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.style.backgroundColor = '#e8f5e9';
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.style.backgroundColor = '';
            });
        });

        uploadArea.addEventListener('drop', function(e) {
            const files = e.dataTransfer.files;
            if (files.length > 0 && fileInput) {
                fileInput.files = files;
                const event = new Event('change');
                fileInput.dispatchEvent(event);
            }
        });
    }
}

function setupUploadForm() {
    const form = document.getElementById('upload-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate plant selection
        if (!selectedPlant) {
            alert('Please select a plant first.');
            return;
        }

        // Get form data
        const formData = {
            name: document.getElementById('user-name').value.trim(),
            email: document.getElementById('user-email').value.trim(),
            plantId: selectedPlant.id,
            plantName: selectedPlant.name,
            location: document.getElementById('location').value.trim(),
            notes: document.getElementById('notes').value.trim(),
            co2: selectedPlant.co2PerYear
        };

        // Validate required fields
        if (!formData.name || !formData.email) {
            alert('Please fill in all required fields.');
            return;
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Check for photo
        const photoInput = document.getElementById('plant-photo');
        if (!photoInput.files || photoInput.files.length === 0) {
            alert('Please upload a photo of your planted tree.');
            return;
        }

        // Save contribution
        const contribution = DataStore.saveContribution(formData);

        // Update or create user
        let user = DataStore.getUser(formData.email);
        if (user) {
            user.trees = (user.trees || 0) + 1;
            user.co2 = (user.co2 || 0) + selectedPlant.co2PerYear;
        } else {
            user = {
                name: formData.name,
                email: formData.email,
                trees: 1,
                co2: selectedPlant.co2PerYear,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=228B22&color=fff`
            };
        }
        DataStore.saveUser(user);
        DataStore.setCurrentUser(user);

        // Show success message
        showSuccessMessage('Your contribution has been recorded. Thank you for helping the environment!');

        // Reset form
        form.reset();
        selectedPlant = null;
        document.querySelectorAll('.plant-select-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const previewImage = document.getElementById('preview-image');
        if (previewImage) {
            previewImage.style.display = 'none';
        }
        
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.querySelector('i').style.display = 'block';
            uploadArea.querySelector('p').style.display = 'block';
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
