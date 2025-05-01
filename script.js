mageInput = document.getElementById('found-image');
ndItems.push(newItem);
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
