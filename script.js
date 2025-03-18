er.onload = function (e) {
            imageSrc = e.target.result;
            lostItems.push({ name, location, phone, description, imageSrc });
            matchLostFoundItems();
            alert("✅ You have successfully reported a lost item!");
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        lostItems.push({ name, location, phone, description, imageSrc });
        matchLostFoundItems();
        alert("✅ You have successfully reported a lost item!");
    }
}

// Report a Found Item
function reportFoundItem() {
    let name = document.getElementById("found-item").value.trim();
    let location = document.getElementById("found-location").value.trim();
    let phone = document.getElementById("found-phone").value.trim();
    let description = document.getElementById("found-description").value.trim();
    let imageInput = document.getElementById("found-image");

    console.log("Found Item Reported:", { name, location, phone, description });

    if (name === "" || location === "" || phone === "") {
        alert("❌ Please enter all required details.");
        return;
    }

    let imageSrc = "";
    if (imageInput.files.length > 0) {
        let reader = new FileReader();
        reader.onload = function (e) {
            imageSrc = e.target.result;
            foundItems.push({ name, location, phone, description, imageSrc });
            matchLostFoundItems();
            alert("✅ You have successfully reported a found item!");
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        foundItems.push({ name, location, phone, description, imageSrc });
        matchLostFoundItems();
        alert("✅ You have successfully reported a found item!");
    }
}

// Debugging Function to See What's Stored
function matchLostFoundItems() {
    console.log("Current Lost Items:", lostItems);
    console.log("Current Found Items:", foundItems);
}
