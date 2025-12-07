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

function getPlaceholderImage(plantName, width = 300, height = 180) {
    return `https://via.placeholder.com/${width}x${height}/228B22/ffffff?text=${encodeURIComponent(plantName)}`;
}

function loadPlants() {
    const container = document.getElementById('plants-container');
    if (!container) return;

    const plants = DataStore.getPlants();
    
    container.innerHTML = plants.map(plant => `
        <div class="plant-select-card" data-plant-id="${plant.id}" onclick="selectPlant(${plant.id})">
            <img src="${plant.image}" alt="${plant.name}" onerror="this.src='${getPlaceholderImage(plant.name)}'">
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

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate plant selection
        if (!selectedPlant) {
            alert('Please select a plant first.');
            return;
        }

        // Check authentication
        const authUser = await AuthManager.getCurrentUser();
        if (!authUser) {
            alert('Please log in to add contributions.');
            window.location.href = 'login.html';
            return;
        }

        // Get form data
        const location = document.getElementById('location').value.trim();
        const notes = document.getElementById('notes').value.trim();

        // Check for photo
        const photoInput = document.getElementById('plant-photo');
        if (!photoInput.files || photoInput.files.length === 0) {
            alert('Please upload a photo of your planted tree.');
            return;
        }

        // Disable submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        try {
            // For now, we'll just use a placeholder for photo URL
            // In production, you would upload to Supabase Storage
            const photoUrl = 'placeholder_photo_url';

            // Save contribution to Supabase
            const contribution = await AuthManager.addPlantContribution(authUser.id, {
                plantId: selectedPlant.id,
                plantName: selectedPlant.name,
                location: location || 'Not specified',
                photoUrl: photoUrl,
                co2PerYear: selectedPlant.co2PerYear
            });

            if (contribution) {
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

                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                alert('Failed to save contribution. Please try again.');
            }
        } catch (error) {
            console.error('Error saving contribution:', error);
            alert('An error occurred. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
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
