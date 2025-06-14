/**
 * Main entry point for the application.
 * Initializes the Three.js background and application functionality when the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.info('DOM fully loaded, initializing application...');
    // Initialize Three.js background if canvas exists
    initializeThreeJSBackground();
    
    // Initialize the main application logic
    initializeApplication();
});

/**
 * Initializes the Three.js background animation with a torus knot and particle system.
 */
function initializeThreeJSBackground() {
    // Check for canvas element
    const canvasElement = document.getElementById('three-js-background');
    if (!canvasElement) {
        console.warn('No canvas element found for Three.js background.');
        return;
    }

    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    
    const renderer = new THREE.WebGLRenderer({
        canvas: canvasElement,
        alpha: true, // Enable transparent background
        antialias: true // Enable anti-aliasing for smoother edges
    });
    
    // Configure renderer properties
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    console.log('Three.js renderer initialized with size:', window.innerWidth, 'x', window.innerHeight);

    // Create and configure the torus knot geometry
    const torusKnotGeometry = new THREE.TorusKnotGeometry(
        1, // Radius
        0.3, // Tube radius
        100, // Tubular segments
        16 // Radial segments
    );
    
    const torusKnotMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000, // Red base color
        specular: 0x6e44ff, // Specular highlight color
        shininess: 50, // Shininess factor
        emissive: 0x330000, // Emissive color for glow effect
        wireframe: false // Disable wireframe mode
    });
    
    const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
    torusKnot.castShadow = true;
    scene.add(torusKnot);
    console.info('Torus knot added to scene.');

    // Add lighting to the scene
    const pointLight = createPointLight();
    scene.add(pointLight);
    
    const ambientLight = createAmbientLight();
    scene.add(ambientLight);
    
    const directionalLight = createDirectionalLight();
    scene.add(directionalLight);
    
    // Create and add particle system
    const particleSystem = createParticleSystem(2000);
    scene.add(particleSystem);
    console.info('Particle system added to scene.');

    // Set camera position
    camera.position.z = 5;
    console.log('Camera positioned at z=5');

    // Animation loop setup
    let animationTime = 0;
    const animationClock = new THREE.Clock();
    
    /**
     * Main animation loop for rendering the scene.
     */
    function animateScene() {
        requestAnimationFrame(animateScene);
        
        const deltaTime = animationClock.getDelta();
        animationTime += deltaTime * 0.5;
        
        // Animate torus knot rotation and scale
        animateTorusKnot(torusKnot, animationTime);
        
        // Animate particle system
        animateParticles(particleSystem);
        
        // Animate point light intensity
        animatePointLight(pointLight, animationTime);
        
        // Render the scene
        renderer.render(scene, camera);
    }
    
    // Start the animation loop
    animateScene();
    console.info('Animation loop started.');

    // Handle window resize events
    setupResizeHandler(renderer, camera);
    
    // Setup button interaction effects
    setupButtonInteractions(canvasElement);
}

/**
 * Creates a point light for the scene.
 * @returns {THREE.PointLight} Configured point light
 */
function createPointLight() {
    const light = new THREE.PointLight(
        0xff577f, // Pinkish color
        1.5, // Intensity
        100 // Distance
    );
    light.position.set(5, 5, 5);
    light.castShadow = true;
    console.log('Point light created at position (5,5,5).');
    return light;
}

/**
 * Creates an ambient light for the scene.
 * @returns {THREE.AmbientLight} Configured ambient light
 */
function createAmbientLight() {
    const light = new THREE.AmbientLight(
        0x16213e, // Dark blue color
        0.5 // Intensity
    );
    console.log('Ambient light created.');
    return light;
}

/**
 * Creates a directional light for the scene.
 * @returns {THREE.DirectionalLight} Configured directional light
 */
function createDirectionalLight() {
    const light = new THREE.DirectionalLight(
        0xffffff, // White color
        0.8 // Intensity
    );
    light.position.set(0, 1, 0);
    console.log('Directional light created at position (0,1,0).');
    return light;
}

/**
 * Creates a particle system with the specified number of particles.
 * @param {number} particleCount Number of particles
 * @returns {THREE.Points} Particle system
 */
function createParticleSystem(particleCount) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Generate particle positions and colors
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 50; // X
        positions[i + 1] = (Math.random() - 0.5) * 50; // Y
        positions[i + 2] = (Math.random() - 0.5) * 50; // Z
        
        colors[i] = Math.random() * 0.5 + 0.5; // Red
        colors[i + 1] = Math.random() * 0.3; // Green
        colors[i + 2] = Math.random() * 0.5 + 0.5; // Blue
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    console.log(`Particle system created with ${particleCount} particles.`);
    return new THREE.Points(geometry, material);
}

/**
 * Animates the torus knot with rotation and scale effects.
 * @param {THREE.Mesh} torusKnot The torus knot mesh
 * @param {number} time Current animation time
 */
function animateTorusKnot(torusKnot, time) {
    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.01;
    torusKnot.scale.setScalar(1 + Math.sin(time) * 0.1);
}

/**
 * Animates the particle system with rotation.
 * @param {THREE.Points} particles The particle system
 */
function animateParticles(particles) {
    particles.rotation.y += 0.002;
}

/**
 * Animates the point light intensity with a pulsing effect.
 * @param {THREE.PointLight} light The point light
 * @param {number} time Current animation time
 */
function animatePointLight(light, time) {
    light.intensity = 1.5 + Math.sin(time) * 0.5;
}

/**
 * Sets up window resize event handler for responsive rendering.
 * @param {THREE.WebGLRenderer} renderer The renderer
 * @param {THREE.PerspectiveCamera} camera The camera
 */
function setupResizeHandler(renderer, camera) {
    window.addEventListener('resize', () => {
        console.log('Window resized, updating renderer and camera...');
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/**
 * Sets up button interaction effects for the canvas.
 * @param {HTMLCanvasElement} canvas The canvas element
 */
function setupButtonInteractions(canvas) {
    const startButton = document.querySelector('.get-started-btn');
    if (!startButton) {
        console.warn('Get started button not found.');
        return;
    }

    startButton.addEventListener('mouseenter', () => {
        console.log('Mouse entered start button, fading canvas...');
        canvas.style.transition = 'opacity 0.5s ease';
        canvas.style.opacity = '0.6';
    });
    
    startButton.addEventListener('mouseleave', () => {
        console.log('Mouse left start button, restoring canvas opacity...');
        canvas.style.transition = 'opacity 0.5s ease';
        canvas.style.opacity = '1';
    });
    
    startButton.addEventListener('click', () => {
        console.log('Start button clicked, applying temporary fade effect...');
        canvas.style.transition = 'opacity 0.3s ease';
        canvas.style.opacity = '0.4';
        setTimeout(() => {
            canvas.style.opacity = '1';
            console.log('Canvas opacity restored after click effect.');
        }, 300);
    });
}

/**
 * Initializes the main application logic.
 */
function initializeApplication() {
    console.info('Initializing application data and components...');
    // Initialize data stores
    const lostItems = loadItemsFromStorage('lostItems');
    const foundItems = loadItemsFromStorage('foundItems');
    
    // Setup navigation buttons
    setupNavigationHandlers();
    
    // Setup form handlers
    setupFormHandlers();
    
    // Initialize match display
    updateMatchDisplay();
    
    // Setup search functionality
    setupSearchFunctionality();
    
    // Setup analytics tracking
    setupAnalyticsTracking();
}

/**
 * Loads items from localStorage with the given key.
 * @param {string} key Storage key
 * @returns {Array} Array of items
 */
function loadItemsFromStorage(key) {
    const items = JSON.parse(localStorage.getItem(key)) || [];
    console.log(`Loaded ${items.length} ${key} from storage.`);
    return items;
}

/**
 * Sets up navigation button event listeners.
 */
function setupNavigationHandlers() {
    console.info('Setting up navigation handlers...');
    const buttonConfigs = [
        { selector: '.lost-card .btn-gradient', page: 'lost.html', label: 'Report Lost' },
        { selector: '.found-card .btn-gradient', page: 'found.html', label: 'Report Found' },
        { selector: '.matches-card .btn-gradient', page: 'matches.html', label: 'View Matches' },
        { selector: '.search-card .btn-gradient', page: 'search.html', label: 'Search Items' }
    ];

    buttonConfigs.forEach(config => {
        const button = document.querySelector(config.selector);
        if (button) {
            button.addEventListener('click', () => {
                console.log(`Navigating to ${config.page}...`);
                trackEvent('Navigation', 'Click', config.label);
                window.location.href = config.page;
            });
        } else {
            console.warn(`Button not found for selector: ${config.selector}`);
        }
    });
}

/**
 * Sets up form submission handlers for lost and found forms.
 */
function setupFormHandlers() {
    console.info('Setting up form handlers...');
    const lostForm = document.getElementById('lost-form');
    if (lostForm) {
        lostForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Lost item form submitted.');
            handleLostItemSubmission();
        });
        setupImagePreviewHandler('lost-image', 'lost-image-preview');
    }

    const foundForm = document.getElementById('found-form');
    if (foundForm) {
        foundForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Found item form submitted.');
            handleFoundItemSubmission();
        });
        setupImagePreviewHandler('found-image', 'found-image-preview');
    }
}

/**
 * Sets up image preview functionality for file inputs.
 * @param {string} inputId ID of the file input element
 * @param {string} previewId ID of the preview image element
 */
function setupImagePreviewHandler(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (input && preview) {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                console.log(`Image selected for ${inputId}: ${file.name}`);
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    console.log('Image preview updated.');
                };
                reader.readAsDataURL(file);
            }
        });
    } else {
        console.warn(`Image preview setup failed: input or preview element not found for ${inputId}`);
    }
}

/**
 * Handles submission of the lost item form.
 */
function handleLostItemSubmission() {
    const formData = collectFormData('lost');
    
    if (!validateFormData(formData)) {
        displayAlert('❌ Please fill in all required fields!', 'error');
        return;
    }
    
    console.log('Processing lost item submission...');
    processItemSubmission(formData, 'lost');
}

/**
 * Handles submission of the found item form.
 */
function handleFoundItemSubmission() {
    const formData = collectFormData('found');
    
    if (!validateFormData(formData)) {
        displayAlert('❌ Please fill in all required fields!', 'error');
        return;
    }
    
    console.log('Processing found item submission...');
    processItemSubmission(formData, 'found');
}

/**
 * Collects form data for the specified form type.
 * @param {string} type Form type ('lost' or 'found')
 * @returns {Object} Form data object
 */
function collectFormData(type) {
    const data = {
        name: document.getElementById(`${type}-item`).value.trim(),
        location: document.getElementById(`${type}-location`).value.trim(),
        phone: document.getElementById(`${type}-phone`).value.trim(),
        description: document.getElementById(`${type}-description`).value.trim(),
        date: document.getElementById(`${type}-date`).value.trim(),
        category: document.getElementById(`${type}-category`).value.trim(),
        imageInput: document.getElementById(`${type}-image`),
        reward: type === 'lost' ? document.getElementById('lost-reward').value.trim() : ''
    };
    console.log(`Collected ${type} form data:`, data);
    return data;
}

/**
 * Validates form data for required fields.
 * @param {Object} formData Form data object
 * @returns {boolean} True if valid, false otherwise
 */
function validateFormData(formData) {
    const isValid = formData.name && formData.location && formData.phone;
    console.log('Form validation result:', isValid);
    return isValid;
}

/**
 * Processes item submission with or without an image.
 * @param {Object} formData Form data object
 * @param {string} type Item type ('lost' or 'found')
 */
function processItemSubmission(formData, type) {
    if (formData.imageInput.files.length > 0) {
        console.log(`Processing ${type} item with image...`);
        processItemWithImage(formData, type);
    } else {
        console.log(`Processing ${type} item without image...`);
        processItemWithoutImage(formData, type);
    }
}

/**
 * Processes item submission with an image.
 * @param {Object} formData Form data object
 * @param {string} type Item type ('lost' or 'found')
 */
function processItemWithImage(formData, type) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const newItem = {
            ...formData,
            imageSrc: e.target.result,
            id: generateUniqueId(),
            timestamp: new Date().toISOString(),
            status: 'unresolved'
        };
        
        console.log(`Saving ${type} item with image:`, newItem);
        saveItemToStorage(newItem, type);
        displayAlert(`✅ ${type === 'lost' ? 'Lost' : 'Found'} item reported successfully! Checking for matches...`, 'success');
        resetFormFields(type);
        updateMatchDisplay();
        trackEvent('Item', 'Report', type);
    };
    reader.readAsDataURL(formData.imageInput.files[0]);
}

/**
 * Processes item submission without an image.
 * @param {Object} formData Form data object
 * @param {string} type Item type ('lost' or 'found')
 */
function processItemWithoutImage(formData, type) {
    const newItem = {
        ...formData,
        imageSrc: '',
        id: generateUniqueId(),
        timestamp: new Date().toISOString(),
        status: 'unresolved'
    };
    
    console.log(`Saving ${type} item without image:`, newItem);
    saveItemToStorage(newItem, type);
    displayAlert(`✅ ${type === 'lost' ? 'Lost' : 'Found'} item reported successfully! Checking for matches...`, 'success');
    resetFormFields(type);
    updateMatchDisplay();
    trackEvent('Item', 'Report', type);
}

/**
 * Saves an item to localStorage.
 * @param {Object} item Item object to save
 * @param {string} type Item type ('lost' or 'found')
 */
function saveItemToStorage(item, type) {
    const items = loadItemsFromStorage(`${type}Items`);
    items.push(item);
    localStorage.setItem(`${type}Items`, JSON.stringify(items));
    console.log(`Saved ${type} item to storage. Total items: ${items.length}`);
}

/**
 * Generates a unique ID for items.
 * @returns {string} UUID
 */
function generateUniqueId() {
    const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    console.log('Generated unique ID:', id);
    return id;
}

/**
 * Resets form fields and image preview.
 * @param {string} type Form type ('lost' or 'found')
 */
function resetFormFields(type) {
    document.getElementById(`${type}-form`).reset();
    const preview = document.getElementById(`${type}-image-preview`);
    if (preview) {
        preview.src = '';
        preview.style.display = 'none';
        console.log(`Reset ${type} form and image preview.`);
    }
}

/**
 * Updates the display of matched items.
 */
function updateMatchDisplay() {
    const matchList = document.getElementById('match-list');
    if (!matchList) {
        console.warn('Match list element not found.');
        return;
    }

    const lostItems = loadItemsFromStorage('lostItems');
    const foundItems = loadItemsFromStorage('foundItems');
    
    matchList.innerHTML = '';
    let matchesFound = false;

    console.log('Checking for matches between lost and found items...');
    lostItems.forEach(lost => {
        if (lost.status === 'resolved') return;
        
        foundItems.forEach(found => {
            if (found.status === 'resolved') return;
            
            if (isMatch(lost, found)) {
                matchesFound = true;
                createMatchCardElement(lost, found);
                
                // Update status to resolved
                lost.status = 'resolved';
                found.status = 'resolved';
                console.log(`Match found between lost item "${lost.name}" and found item "${found.name}".`);
            }
        });
    });
    
    // Save updated items
    localStorage.setItem('lostItems', JSON.stringify(lostItems));
    localStorage.setItem('foundItems', JSON.stringify(foundItems));
    
    if (!matchesFound) {
        matchList.innerHTML = `
            <div class="no-matches">
                <i class="fas fa-search"></i>
                <p>No matches found yet. Keep searching!</p>
            </div>
        `;
        console.log('No matches found.');
    }
}

/**
 * Checks if a lost and found item are a match based on criteria.
 * @param {Object} lost Lost item object
 * @param {Object} found Found item object
 * @returns {boolean} True if items match
 */
function isMatch(lost, found) {
    const nameMatch = lost.name.toLowerCase() === found.name.toLowerCase();
    const descMatch = lost.description && found.description && 
                     (lost.description.toLowerCase().includes(found.name.toLowerCase()) || 
                      found.description.toLowerCase().includes(lost.name.toLowerCase()));
    const categoryMatch = lost.category && found.category && 
                         lost.category.toLowerCase() === found.category.toLowerCase();
    const locationMatch = lost.location && found.location && 
                         lost.location.toLowerCase() === found.location.toLowerCase();
    
    return nameMatch || descMatch || (categoryMatch && locationMatch);
}

/**
 * Creates a match card element for a lost and found item pair.
 * @param {Object} lost Lost item object
 * @param {Object} found Found item object
 */
function createMatchCardElement(lost, found) {
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
                <p>📅 ${formatDateString(lost.date)}</p>
                <p>${lost.description}</p>
                ${lost.reward ? `<p class="reward">🏆 Reward: ${lost.reward}</p>` : ''}
                ${lost.imageSrc ? `<img src="${lost.imageSrc}" alt="Lost Item" class="item-image">` : ''}
            </div>
            
            <div class="found-info">
                <h4>Found Item</h4>
                <p><strong>${found.name}</strong></p>
                <p>📍 ${found.location}</p>
                <p>📅 ${formatDateString(found.date)}</p>
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
    console.log('Match card created and appended to match list.');
    
    // Add event listener for resolve button
    const resolveBtn = matchCard.querySelector('.resolve-btn');
    if (resolveBtn) {
        resolveBtn.addEventListener('click', () => {
            console.log('Resolve button clicked for match.');
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

/**
 * Formats a date string for display.
 * @param {string} dateString Date string
 * @returns {string} Formatted date
 */
function formatDateString(dateString) {
    if (!dateString) {
        console.log('No date specified, returning default message.');
        return 'Date not specified';
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formatted = new Date(dateString).toLocaleDateString(undefined, options);
    console.log(`Formatted date: ${formatted}`);
    return formatted;
}

/**
 * Sets up search form functionality.
 */
function setupSearchFunctionality() {
    const searchForm = document.getElementById('search-form');
    if (!searchForm) {
        console.warn('Search form not found.');
        return;
    }
    
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Search form submitted.');
        executeSearch();
    });
}

/**
 * Executes the search functionality based on user input.
 */
function executeSearch() {
    const query = document.getElementById('search-query').value.trim().toLowerCase();
    const category = document.getElementById('search-category').value.toLowerCase();
    const location = document.getElementById('search-location').value.trim().toLowerCase();
    const searchResults = document.getElementById('search-results');
    
    if (!searchResults) {
        console.warn('Search results element not found.');
        return;
    }
    
    searchResults.innerHTML = '';
    
    if (!query && !category && !location) {
        searchResults.innerHTML = '<p class="no-results">Please enter search criteria</p>';
        console.log('No search criteria provided.');
        return;
    }
    
    console.log('Performing search with query:', query, 'category:', category, 'location:', location);
    const lostItems = loadItemsFromStorage('lostItems');
    const foundItems = loadItemsFromStorage('foundItems');
    
    const allItems = [
        ...lostItems.map(item => ({...item, type: 'lost'})),
        ...foundItems.map(item => ({...item, type: 'found'}))
    ];
    
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
        console.log('No search results found.');
        return;
    }
    
    console.log(`Found ${results.length} search results.`);
    results.forEach(item => {
        const resultCard = createSearchResultCard(item);
        searchResults.appendChild(resultCard);
    });
    
    // Add event listeners to contact buttons
    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const phone = this.getAttribute('data-phone');
            console.log(`Contact button clicked for phone: ${phone}`);
            trackEvent('Search', 'Contact', phone);
            alert(`Contact number: ${phone}`);
        });
    });
}

/**
 * Creates a search result card element.
 * @param {Object} item Item object
 * @returns {HTMLElement} Result card element
 */
function createSearchResultCard(item) {
    const resultCard = document.createElement('div');
    resultCard.classList.add('result-card', item.type);
    
    resultCard.innerHTML = `
        <div class="result-header">
            <h3>${item.name}</h3>
            <span class="item-type ${item.type}">${item.type === 'lost' ? 'Lost' : 'Found'}</span>
        </div>
        
        <div class="result-body">
            <p><i class="fas fa-map-marker-alt"></i> ${item.location || 'Location not specified'}</p>
            <p><i class="fas fa-calendar-alt"></i> ${formatDateString(item.date)}</p>
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
    
    console.log(`Created search result card for ${item.type} item: ${item.name}`);
    return resultCard;
}

/**
 * Displays an alert message with fade-out effect.
 * @param {string} message Alert message
 * @param {string} type Alert type ('success' or 'error')
 */
function displayAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    console.log(`Displaying ${type} alert: ${message}`);
    
    setTimeout(() => {
        alertDiv.classList.add('fade-out');
        setTimeout(() => {
            alertDiv.remove();
            console.log('Alert removed.');
        }, 500);
    }, 3000);
}

/**
 * Sets up analytics tracking for page views and outbound links.
 */
function setupAnalyticsTracking() {
    console.info('Setting up analytics tracking...');
    trackEvent('Page', 'View', document.title);
    
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', function() {
            console.log(`Outbound link clicked: ${this.href}`);
            trackEvent('Outbound', 'Click', this.href);
        });
    });
}

/**
 * Tracks an analytics event using gtag or console logging.
 * @param {string} category Event category
 * @param {string} action Event action
 * @param {string} label Event label
 */
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    console.log(`Tracking event: ${category} - ${action} - ${label}`);
}
