//UX Menu Fucntion
document.querySelectorAll('.nav-skinny a').forEach(icon => {
    icon.addEventListener('click', function() {
        const target = document.querySelector(this.dataset.target);

        // Toggle navigation panels
        document.querySelectorAll('.expanded-nav').forEach(nav => {
            if (nav !== target) nav.classList.remove('open');
        });
        target.classList.toggle('open');

        // Highlight selected icon
        document.querySelectorAll('.nav-skinny a').forEach(navIcon => {
            navIcon.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// Select the icon element
const icon = document.getElementById('settingsIcon');

// Add a click event to stop the animation
document.addEventListener("DOMContentLoaded", () => {
    // Select all elements with the class "icon"
    const icons = document.querySelectorAll('.icon');

    // Add a click event listener to each icon
    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            icon.classList.remove('flash'); // Remove the flashing animation
            icon.classList.add('clicked'); // Add the clicked class for any custom styles
        });
    });
});

// Close any open expanded navigation panels when clicking on the main content
document.querySelector('.main-content').addEventListener('click', function() {
    document.querySelectorAll('.expanded-nav').forEach(nav => {
        nav.classList.remove('open');
    });
});

//ADD IMAGEe
document.addEventListener('DOMContentLoaded', function() {
    // Get all the image containers
    const imageContainers = document.querySelectorAll('.image-container');

    // Get the word container where the images will be added
    const wordContainer = document.getElementById('wordContainer');

    // Loop through each image container
    imageContainers.forEach(container => {
        // Add a click event listener to each image container
        container.addEventListener('click', function() {
            // Get the image element inside the clicked container
            const imgElement = container.querySelector('img');

            // Create a new image element
            const newImg = document.createElement('img');
            newImg.src = imgElement.src; // Set the source of the new image
            newImg.classList.add('img-fluid', 'displayed-image'); // Add the same classes as the original image

            // Append the new image to the word container
            wordContainer.appendChild(newImg);
        });
    });
});

// Clear Words Function
function clearContainer() {
    let container = document.getElementById("wordContainer");
    container.innerHTML = ""; // Clear previous results
}

document.getElementById("clearContainer").addEventListener('click', clearContainer);


// COLOR PICKER
let primaryColor = "#30bdb6"; // Default color

// Update primary color when the color picker changes
document.getElementById("primaryColorPicker").addEventListener("input", function (e) {
    primaryColor = e.target.value;
});




// Function to generate shades with greater contrast
function generateShades(baseColor, count) {
    let shades = [];
    let baseRgb = hexToRgb(baseColor);

    for (let i = 0; i < count; i++) {
        if (i === 3) {
            // Fourth word: Black background with primary color as text
            shades.push({ backgroundColor: "#000000", color: baseColor });
        } else if (i === 4) {
            // Fifth word: White background with black text
            shades.push({ backgroundColor: "#ffffff", color: "#000000" });
        } else {
            // Generate lighter and darker shades for the first three words
            let factor = (i / (count - 3)) * 2 - 1; // Range from -1 to 1
            let shade = shadeColor(baseRgb, factor * 0.8); // Increase shade intensity
            // Change the text color to black for the third item (index 2)
            let textColor = (i === 2) ? "#000000" : "#ffffff";
            shades.push({ backgroundColor: shade, color: textColor });
        }
    }

    return shades;
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

// Helper function to shade a color
function shadeColor(rgb, factor) {
    let r = Math.round(rgb.r + (255 - rgb.r) * factor);
    let g = Math.round(rgb.g + (255 - rgb.g) * factor);
    let b = Math.round(rgb.b + (255 - rgb.b) * factor);
    return `rgb(${r}, ${g}, ${b})`;
}


// Update generateWords function to include font settings
function generateWords() {
    let word = document.getElementById("wordInput").value.trim();
    if (!word) return;

    let container = document.getElementById("wordContainer");
    //container.innerHTML = ""; // Clear previous results - Commented out, you might want to keep or remove this based on your preference

    let shades = generateShades(primaryColor, 5);
    let selectedFont = document.getElementById("fontSelector").value;
    let selectedSize = document.getElementById("fontSize").value + 'px';
    let selectedStyle = document.getElementById("fontStyle").value.split(' ');

    for (let i = 0; i < 5; i++) {
        let div = document.createElement("div");
        div.textContent = word;
        div.className = "word-box";
        div.style.backgroundColor = shades[i].backgroundColor;
        div.style.color = shades[i].color;
        
        // Apply font settings
        div.style.fontFamily = `'${selectedFont}', sans-serif`; // Fallback to sans-serif if Google Font fails to load
        div.style.fontSize = selectedSize;
        div.style.fontStyle = selectedStyle.includes('italic') ? 'italic' : 'normal';
        div.style.fontWeight = selectedStyle.includes('bold') ? 'bold' : 'normal';

        container.appendChild(div);
    }
}

