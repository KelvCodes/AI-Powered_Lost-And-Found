    specular: 0x6e44ff,
            shininess: 50,
            emissive: 0x330000
        });
        const torusKnot = new THREE.Mesh(geometry, material);
        scene.add(torusKnot);

        const light = new THREE.PointLight(0xff577f, 1.5, 100);
        light.position.set(5, 5, 5);
        scene.add(light);
        const ambientLight = new THREE.AmbientLight(0x16213e, 0.5);
        scene.add(ambientLight);

        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 30;
            positions[i + 1] = (Math.random() - 0.5) * 30;
            positions[i + 2] = (Math.random() - 0.5) * 30;
        }
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({ 
            color: 0xff577f, 
            size: 0.15, 
            transparent: true,
            opacity: 0.8 
        });
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        camera.position.z = 5;

        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.05;
            torusKnot.rotation.x += 0.02;
            torusKnot.rotation.y += 0.02;
            torusKnot.scale.setScalar(1 + Math.sin(time) * 0.1);
            particles.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });

        const startButton = document.querySelector('.get-started-btn');
        if (startButton) {
            startButton.addEventListener('click', () => {
                canvas.style.opacity = '0.7';
            });
        }
    }

    let lostItems = JSON.parse(localStorage.getItem('lostItems')) || [];
    let foundItems = JSON.parse(localStorage.getItem('foundItems')) || [];

    const reportLostButton = document.querySelector('.lost-card .btn-gradient');
    const reportFoundButton = document.querySelector('.found-card .btn-gradient');

    if (reportLostButton) {
        reportLostButton.addEventListener('click', () => {
            window.location.href = 'lost.html';
        });
    }

    if (reportFoundButton) {
        reportFoundButton.addEventListener('click', () => {
            window.location.href = 'found.html';
        });
    }

    if (document.getElementById('lost-form')) {
        document.getElementById('lost-form').addEventListener('submit', (e) => {
            e.preventDefault();
            reportLostItem();
        });
    }

    if (document.getElementById('found-form')) {
        document.getElementById('found-form').addEventListener('submit', (e) => {
            e.preventDefault();
            reportFoundItem();
        });
    }
});

function reportLostItem() {
    let name = document.getElementById('lost-item').value.trim();
    let location = document.getElementById('lost-location').value.trim();
    let phone = document.getElementById('lost-phone').value.trim();
    let description = document.getElementById('lost-description').value.trim();
    let imageInput = document.getElementById('lost-image');

    if (!name || !location || !phone) {
        alert('❌ Fill the void or face the consequences!');
        return;
    }

    let imageSrc = '';
    if (imageInput.files.length > 0) {
        let reader = new FileReader();
        reader.onload = function (e) {
            imageSrc = e.target.result;
            const newItem = { name, location, phone, description, imageSrc };
            lostItems.push(newItem);
            localStorage.setItem('lostItems', JSON.stringify(lostItems));
            alert('✅ Lost item sealed in the abyss! Checking for matches...');
            resetForm('lost');
            updateMatches();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        const newItem = { name, location, phone, description, imageSrc };
        lostItems.push(newItem);
        localStorage.setItem('lostItems', JSON.stringify(lostItems));
        alert('✅ Lost item sealed in the abyss! Checking for matches...');
        resetForm('lost');
        updateMatches();
    }
}

function reportFoundItem() {
    let name = document.getElementById('found-item').value.trim();
    let location = document.getElementById('found-location').value.trim();
    let phone = document.getElementById('found-phone').value.trim();
    let description = document.getElementById('found-description').value.trim();
    let imageInput = document.getElementById('found-image');

    if (!name || !location || !phone) {
        alert('❌ Fill the void or face the consequences!');
        return;
    }

    let imageSrc = '';
    if (imageInput.files.length > 0) {
        let reader = new FileReader();
        reader.onload = function (e) {
            imageSrc = e.target.result;
            const newItem = { name, location, phone, description, imageSrc };
            foundItems.push(newItem);
            localStorage.setItem('foundItems', JSON.stringify(foundItems));
            alert('✅ Found item unleashed! Checking for matches...');
            resetForm('found');
            updateMatches();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        const newItem = { name, location, phone, description, imageSrc };
        foundItems.push(newItem);
        localStorage.setItem('foundItems', JSON.stringify(foundItems));
        alert('✅ Found item unleashed! Checking for matches...');
        resetForm('found');
        updateMatches();
    }
}

function resetForm(type) {
    document.getElementById(`${type}-form`).reset();
}

function updateMatches() {
    const matchList = document.getElementById('match-list');
    if (!matchList) return;

    matchList.innerHTML = '';

    lostItems.forEach((lost) => {
        foundItems.forEach((found) => {
            if (
                lost.name.toLowerCase() === found.name.toLowerCase() ||
                (lost.description && found.description && 
                 lost.description.toLowerCase().includes(found.name.toLowerCase())) ||
                (lost.name.toLowerCase().includes(found.description.toLowerCase()))
            ) {
                const matchCard = document.createElement('div');
                matchCard.classList.add('match-card');
                matchCard.innerHTML = `
                    <p><strong>Fate Aligns!</strong></p>
                    <p>🔍 Lost: ${lost.name} | Location: ${lost.location}</p>
                    <p>📢 Found: ${found.name} | Location: ${found.location}</p>
                    <p>Contact: ${found.phone}</p>
                    ${lost.imageSrc ? `<img src="${lost.imageSrc}" alt="Lost Item" style="max-width: 100px;">` : ''}
                    ${found.imageSrc ? `<img src="${found.imageSrc}" alt="Found Item" style="max-width: 100px;">` : ''}
                `;
                matchList.appendChild(matchCard);
            }
        });
    });

    if (matchList.innerHTML === '') {
        matchList.innerHTML = '<p>No souls reunited yet. Keep the hunt alive! 🔪</p>';
    }
}
