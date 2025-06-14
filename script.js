
   
        positions[i + 2] = (Math.random() - 0.5) * 50;
        
        // Color variation
        colors[i] = Math.random() * 0.5 + 0.5; // R
        colors[i + 1] = Math.random() * 0.3;   // G
        colors[i + 2] = Math.random() * 0.5 + 0.5; // B
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({ 
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    return new THREE.Points(particleGeometry, particleMaterial);
}

// Application Initialization
function initApp() {
    // Initialize data stores
    let lostItems = JSON.parse(localStorage.getItem('lostItems')) || [];
    let foundItems = JSON.parse(localStorage.getItem('foundItems')) || [];
    
    // Setup navigation buttons
    setupNavigation();
    
    // Setup form handlers
    setupForms();
    
    // Initialize match display
    updateMatches();
    
    // Setup search functionality
    setupSearch();
    
    // Setup analytics tracking
    setupAnalytics();
}

function setupNavigation() {
    const reportLostButton = document.querySelector('.lost-card .btn-gradient');
    const reportFoundButton = document.querySelector('.found-card .btn-gradient');
    const viewMatchesButton = document.querySelector('.matches-card .btn-gradient');
    const searchButton = document.querySelector('.search-card .btn-gradient');

    if (reportLostButton) {
        reportLostButton.addEventListener('click', () => {
            trackEvent('Navigation', 'Click', 'Report Lost');
            window.location.href = 'lost.html';
        });
    }

    if (reportFoundButton) {
        reportFoundButton.addEventListener('click', () => {
            trackEvent('Navigation', 'Click', 'Report Found');
            window.location.href = 'found.html';
        });
    }
    
    if (viewMatchesButton) {
        viewMatchesButton.addEventListener('click', () => {
            trackEvent('Navigation', 'Click', 'View Matches');
            window.location.href = 'matches.html';
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            trackEvent('Navigation', 'Click', 'Search Items');
            window.location.href = 'search.html';
        });
    }
}

function setupForms() {
    if (document.getElementById('lost-form')) {
        document.getElementById('lost-form').addEventListener('submit', (e) => {
            e.preventDefault();
            reportLostItem();
        });
        
        // Add image preview for lost items
        setupImagePreview('lost-image', 'lost-image-preview');
    }

    if (document.getElementById('found-form')) {
        document.getElementById('found-form').addEventListener('submit', (e) => {
            e.preventDefault();
            reportFoundItem();
        });
        
        // Add image preview for found items
        setupImagePreview('found-image', 'found-image-preview');
    }
}

function setupImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (input && preview) {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });
    }
}

function reportLostItem() {
    const formData = getFormData('lost');
    
    if (!validateFormData(formData)) {
        showAlert('❌ Please fill in all required fields!', 'error');
        return;
    }
    
    // Process with image if available
    if (formData.imageInput.files.length > 0) {
        processWithImage(formData, 'lost');
    } else {
        processWithoutImage(formData, 'lost');
    }
}

function reportFoundItem() {
    const formData = getFormData('found');
    
    if (!validateFormData(formData)) {
        showAlert('❌ Please fill in all required fields!', 'error');
        return;
    }
    
    // Process with image if available
    if (formData.imageInput.files.length > 0) {
        processWithImage(formData, 'found');
    } else {
        processWithoutImage(formData, 'found');
    }
}

function getFormData(type) {
    return {
        name: document.getElementById(`${type}-item`).value.trim(),
        location: document.getElementById(`${type}-location`).value.trim(),
        phone: document.getElementById(`${type}-phone`).value.trim(),
        description: document.getElementById(`${type}-description`).value.trim(),
        date: document.getElementById(`${type}-date`).value.trim(),
        category: document.getElementById(`${type}-category`).value.trim(),
        imageInput: document.getElementById(`${type}-image`),
        reward: type === 'lost' ? document.getElementById('lost-reward').value.trim() : ''
    };
}

function validateFormData(formData) {
    return formData.name && formData.location && formData.phone;
}

function processWithImage(formData, type) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const newItem = {
            ...formData,
            imageSrc: e.target.result,
            id: generateId(),
            timestamp: new Date().toISOString(),
            status: 'unresolved'
        };
        
        saveItem(newItem, type);
        showAlert(`✅ ${type === 'lost' ? 'Lost' : 'Found'} item reported successfully! Checking for matches...`, 'success');
        resetForm(type);
        updateMatches();
        trackEvent('Item', 'Report', type);
    };
    reader.readAsDataURL(formData.imageInput.files[0]);
}

function processWithoutImage(formData, type) {
    const newItem = {
        ...formData,
        imageSrc: '',
        id: generateId(),
        timestamp: new Date().toISOString(),
        status: 'unresolved'
    };
    
    saveItem(newItem, type);
    showAlert(`✅ ${type === 'lost' ? 'Lost' : 'Found'} item reported successfully! Checking for matches...`, 'success');
    resetForm(type);
    updateMatches();
    trackEvent('Item', 'Report', type);
}

function saveItem(item, type) {
    const items = JSON.parse(localStorage.getItem(`${type}Items`)) || [];
    items.push(item);
    localStorage.setItem(`${type}Items`, JSON.stringify(items));
}

function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function resetForm(type) {
    document.getElementById(`${type}-form`).reset();
    const preview = document.getElementById(`${type}-image-preview`);
    if (preview) {
        preview.src = '';
        preview.style.display = 'none';
    }
}

function updateMatches() {
    const matchList = document.getElementById('match-list');
    if (!matchList) return;

    const lostItems = JSON.parse(localStorage.getItem('lostItems')) || [];
    const foundItems = JSON.parse(localStorage.getItem('foundItems')) || [];
    
    matchList.innerHTML = '';
    
    let matchesFound = false;

    // Find matches based on name, description, or category similarity
    lostItems.forEach(lost => {
        if (lost.status === 'resolved') return;
        
        foundItems.forEach(found => {
            if (found.status === 'resolved') return;
            
            const nameMatch = lost.name.toLowerCase() === found.name.toLowerCase();
            const descMatch = lost.description && found.description && 
                             (lost.description.toLowerCase().includes(found.name.toLowerCase()) || 
                              found.description.toLowerCase().includes(lost.name.toLowerCase()));
            const categoryMatch = lost.category && found.category && 
                                lost.category.toLowerCase() === found.category.toLowerCase();
            const locationMatch = lost.location && found.location && 
                                lost.location.toLowerCase() === found.location.toLowerCase();
            
            if (nameMatch || descMatch || (categoryMatch && locationMatch)) {
                matchesFound = true;
                createMatchCard(lost, found);
                
                // Mark as resolved after displaying
                lost.status = 'resolved';
                found.status = 'resolved';
            }
        });
    });
    
    // Update storage with resolved status
    localStorage.setItem('lostItems', JSON.stringify(lostItems));
    localStorage.setItem('foundItems', JSON.stringify(foundItems));
    
    if (!matchesFound) {
        matchList.innerHTML = `
            <div class="no-matches">
                <i class="fas fa-search"></i>
                <p>No matches found yet. Keep searching!</p>
            </div>
        `;
    }
}

function createMatchCard(lost, found) {
    const matchList = document.getElementById('match-list');
    const matchCard = document.createElement('div');
    matchCard.classList.add('match-card');
    
    matchCard.innerHTML = `
        <div class="match-header">
            <h3>✨ Potential Match Found!</h3>
            <span class="match-confidence">High Confidence</span>
        </div>
        
        <div class="match-content">
            <div class="lost-info">
                <h4>Lost Item</h4>
                <p><strong>${lost.name}</strong></p>
                <p>📍 ${lost.location}</p>
                <p>📅 ${formatDate(lost.date)}</p>
                <p>${lost.description}</p>
                ${lost.reward ? `<p class="reward">🏆 Reward: ${lost.reward}</p>` : ''}
                ${lost.imageSrc ? `<img src="${lost.imageSrc}" alt="Lost Item" class="item-image">` : ''}
            </div>
            
            <div class="found-info">
                <h4>Found Item</h4>
                <p><strong>${found.name}</strong></p>
                <p>📍 ${found.location}</p>
                <p>📅 ${formatDate(found.date)}</p>
                <p>${found.description}</p>
                ${found.imageSrc ? `<img src="${found.imageSrc}" alt="Found Item" class="item-image">` : ''}
            </div>
        </div>
        
        <div class="match-actions">
            <p class="contact-info">Contact the finder: <strong>${found.phone}</strong></p>
            <button class="btn-gradient resolve-btn">Mark as Resolved</button>
        </div>
    `;
    
    matchList.appendChild(matchCard);
    
    // Add event listener for resolve button
    const resolveBtn = matchCard.querySelector('.resolve-btn');
    if (resolveBtn) {
        resolveBtn.addEventListener('click', () => {
            matchCard.classList.add('resolved');
            matchCard.innerHTML = `
                <div class="resolved-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Case Resolved!</h3>
                    <p>Thank you for using our service.</p>
                </div>
            `;
            trackEvent('Match', 'Resolve', 'Successful');
        });
    }
}

function formatDate(dateString) {
    if (!dateString) return 'Date not specified';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function setupSearch() {
    const searchForm = document.getElementById('search-form');
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch();
    });
}

function performSearch() {
    const query = document.getElementById('search-query').value.trim().toLowerCase();
    const category = document.getElementById('search-category').value.toLowerCase();
    const location = document.getElementById('search-location').value.trim().toLowerCase();
    const searchResults = document.getElementById('search-results');
    
    if (!searchResults) return;
    
    searchResults.innerHTML = '';
    
    if (!query && !category && !location) {
        searchResults.innerHTML = '<p class="no-results">Please enter search criteria</p>';
        return;
    }
    
    // Search both lost and found items
    const lostItems = JSON.parse(localStorage.getItem('lostItems')) || [];
    const foundItems = JSON.parse(localStorage.getItem('foundItems')) || [];
    
    const allItems = [...lostItems.map(item => ({...item, type: 'lost'})), 
                     ...foundItems.map(item => ({...item, type: 'found'}))];
    
    const results = allItems.filter(item => {
        const matchesQuery = query ? 
            (item.name.toLowerCase().includes(query) || 
             (item.description && item.description.toLowerCase().includes(query))) : true;
        
        const matchesCategory = category ? 
            (item.category && item.category.toLowerCase().includes(category)) : true;
        
        const matchesLocation = location ? 
            (item.location && item.location.toLowerCase().includes(location)) : true;
        
        return matchesQuery && matchesCategory && matchesLocation;
    });
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-circle"></i>
                <p>No items found matching your search criteria</p>
            </div>
        `;
        return;
    }
    
    results.forEach(item => {
        const resultCard = document.createElement('div');
        resultCard.classList.add('result-card', item.type);
        
        resultCard.innerHTML = `
            <div class="result-header">
                <h3>${item.name}</h3>
                <span class="item-type ${item.type}">${item.type === 'lost' ? 'Lost' : 'Found'}</span>
            </div>
            
            <div class="result-body">
                <p><i class="fas fa-map-marker-alt"></i> ${item.location || 'Location not specified'}</p>
                <p><i class="fas fa-calendar-alt"></i> ${formatDate(item.date)}</p>
                ${item.category ? `<p><i class="fas fa-tag"></i> ${item.category}</p>` : ''}
                ${item.description ? `<p class="description">${item.description}</p>` : ''}
                ${item.type === 'lost' && item.reward ? `<p class="reward"><i class="fas fa-gift"></i> Reward: ${item.reward}</p>` : ''}
            </div>
            
            <div class="result-footer">
                ${item.imageSrc ? `<img src="${item.imageSrc}" alt="${item.name}" class="item-thumbnail">` : ''}
                <button class="btn-gradient contact-btn" data-phone="${item.phone}">
                    <i class="fas fa-phone"></i> Contact
                </button>
            </div>
        `;
        
        searchResults.appendChild(resultCard);
    });
    
    // Add event listeners to contact buttons
    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const phone = this.getAttribute('data-phone');
            trackEvent('Search', 'Contact', phone);
            alert(`Contact number: ${phone}`);
        });
    });
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.add('fade-out');
        setTimeout(() => {
            alertDiv.remove();
        }, 500);
    }, 3000);
}

function setupAnalytics() {
    // Track page view
    trackEvent('Page', 'View', document.title);
    
    // Track outbound links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Outbound', 'Click', this.href);
        });
    });
}

function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    // Simple console log for demonstration
    console.log(`Event: ${category} - ${action} - ${label}`);
}
