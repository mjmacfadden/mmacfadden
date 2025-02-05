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

//ADD IMAGE
document.addEventListener('DOMContentLoaded', function() {
    const imageContainers = document.querySelectorAll('.image-container');
    const wordContainer = document.getElementById('wordContainer');

    imageContainers.forEach(container => {
        container.addEventListener('click', function() {
            const imgElement = container.querySelector('img');

            // Create a wrapper div for the image and rotation handle
            const wrapper = document.createElement('div');
            wrapper.className = 'image-wrapper draggable';

            // Create the new image element
            const newImg = document.createElement('img');
            newImg.src = imgElement.src;
            newImg.classList.add('img-fluid', 'displayed-image');

            // Create the rotation handle with Bootstrap icon
            const rotateHandle = document.createElement("i");
            rotateHandle.className = "bi bi-arrow-repeat rotate-handle";

            // Append the image and rotation handle to the wrapper
            wrapper.appendChild(newImg);
            wrapper.appendChild(rotateHandle);

            // Append the wrapper to the word container
            wordContainer.appendChild(wrapper);
            addDeleteFunctionality(wrapper); // Add this line
        });
    });
});

//ADD IMAGE FROM DIRECT URL
document.addEventListener('DOMContentLoaded', function() {
    const imageUrlInput = document.getElementById('imageUrlInput');
    const addImageButton = document.getElementById('addImageFromUrl');
    const wordContainer = document.getElementById('wordContainer');

    addImageButton.addEventListener('click', function() {
        const imageUrl = imageUrlInput.value.trim();
        if (imageUrl) {
            addImageToCanvas(imageUrl);
            imageUrlInput.value = ''; // Clear the input field
        }
    });

    function addImageToCanvas(url) {
        // Create a wrapper div for the image and rotation handle
        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper draggable';

        // Create the new image element
        const newImg = document.createElement('img');
        newImg.src = url;
        newImg.classList.add('img-fluid', 'displayed-image');

        // Create the rotation handle with Bootstrap icon
        const rotateHandle = document.createElement("i");
        rotateHandle.className = "bi bi-arrow-repeat rotate-handle";

        // Create the trash can icon for deletion
        const trashIcon = document.createElement("i");
        trashIcon.className = "bi bi-trash delete-icon";

        newImg.onerror = function() {
            alert('Failed to load image. Please check the URL and try again.');
        };

        newImg.onload = function() {
            // Append elements to the wrapper
            wrapper.appendChild(newImg);
            wrapper.appendChild(rotateHandle);

            // Append the wrapper to the word container
            wordContainer.appendChild(wrapper);

            // Add delete functionality
            addDeleteFunctionality(wrapper);
        };
    }
});


// Clear Words Function
function clearContainer() {
    let container = document.getElementById("wordContainer");
    
    // Remove all child elements except those with class "ruler"
    Array.from(container.children).forEach(child => {
        if (!child.classList.contains('ruler')) {
            child.remove();
        }
    });
}


document.getElementById("clearContainer").addEventListener('click', clearContainer);


// COLOR PICKER
let primaryColor = "#30bdb6"; // Default background color
let textColor = "#ffffff"; // Default text color

// Update background color when the color picker changes
document.getElementById("primaryColorPicker").addEventListener("input", function (e) {
    primaryColor = e.target.value;
});
// Update text color when the color picker changes
document.getElementById("textColorPicker").addEventListener("input", function (e) {
    textColor = e.target.value;
});



// Function to generate shades with greater contrast
function generateShades(baseColor, textColor, count) {
    let shades = [];
    let baseRgb = hexToRgb(baseColor);
    let textRgb = hexToRgb(textColor);

    for (let i = 0; i < count; i++) {
        if (i === 3) {
            // Fourth word: Black background with primary color as text
            shades.push({ backgroundColor: "#000000", color: baseColor });
        } else if (i === 4) {
            // Fifth word: White background with text color
            shades.push({ backgroundColor: "#ffffff", color: "#000000" });
        } else {
            // Generate lighter and darker shades for the first three words
            let factor = (i / (count - 3)) * 2 - 1; // Range from -1 to 1
            let shade = shadeColor(baseRgb, factor * 0.8); // Increase shade intensity
            // Use the provided text color for all words
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


// Update the generateWords function
function generateWords() {
    let word = document.getElementById("wordInput").value.trim();
    if (!word) return;

    let container = document.getElementById("wordContainer");
    let generateShadesOption = document.getElementById('shadeOption').checked;
    let selectedFont = document.getElementById("fontSelector").value;
    let selectedSize = document.getElementById("fontSize").value + 'px';
    let selectedStyle = document.getElementById("fontStyle").value.split(' ');

    if (generateShadesOption) {
        let shades = generateShades(primaryColor, textColor, 5);
        for (let i = 0; i < 5; i++) {
            createWordBox(word, shades[i], selectedFont, selectedSize, selectedStyle);
        }
    } else {
        createWordBox(word, { backgroundColor: primaryColor, color: textColor }, selectedFont, selectedSize, selectedStyle);
    }

    function createWordBox(word, style, font, size, fontStyle) {
        let div = document.createElement("div");
        div.textContent = word;
        div.className = "word-box draggable";
        div.style.backgroundColor = style.backgroundColor;
        div.style.color = style.color;
        div.style.fontFamily = `'${font}', sans-serif`;
        div.style.fontSize = size;
        div.style.fontStyle = fontStyle.includes('italic') ? 'italic' : 'normal';
        div.style.fontWeight = fontStyle.includes('bold') ? 'bold' : 'normal';
        
        // Add rotation handle with Bootstrap icon
        let rotateHandle = document.createElement("i");
        rotateHandle.className = "bi bi-arrow-repeat rotate-handle";
        div.appendChild(rotateHandle);

        container.appendChild(div);
        addDeleteFunctionality(div); // Add this line
    }

}

//TRASH FUNCTIONALITY
function addDeleteFunctionality(element) {
    // Create the trash icon
    const trashIcon = document.createElement('i');
    trashIcon.className = 'bi bi-trash delete-icon trash';

    // Add click event listener for deletion
    trashIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        element.remove();
    });

    // Append the trash icon to the element
    element.appendChild(trashIcon);
    element.style.position = 'relative'; // Ensure proper positioning of the icon
}


//RULER
function createRulerMarks(ruler, isHorizontal) {
    const dpi = 96; // Default browser DPI
    const inches = isHorizontal ? ruler.offsetWidth / dpi : ruler.offsetHeight / dpi;
    for (let i = 0; i <= inches; i++) {
        let mark = document.createElement('div');
        mark.style[isHorizontal ? 'left' : 'top'] = `${i * dpi}px`;
        mark.textContent = i;
        ruler.appendChild(mark);
    }
}
createRulerMarks(document.getElementById('ruler-top'), true);
createRulerMarks(document.getElementById('ruler-left'), false);


//INTERACT.JS
interact('.draggable')
    .draggable({
        listeners: {
            move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                const angle = parseFloat(target.getAttribute('data-angle')) || 0;
                target.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }
    })
    .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        modifiers: [
            // Maintain aspect ratio
            interact.modifiers.aspectRatio({
                // Get initial aspect ratio from the element's dimensions
                ratio: function(event) {
                    const target = event.target;
                    // If we haven't stored the initial ratio yet, calculate and store it
                    if (!target.getAttribute('data-initial-ratio')) {
                        const rect = target.getBoundingClientRect();
                        const initialRatio = rect.width / rect.height;
                        target.setAttribute('data-initial-ratio', initialRatio);
                        return initialRatio;
                    }
                    // Return stored ratio for subsequent resizes
                    return parseFloat(target.getAttribute('data-initial-ratio'));
                }
            })
        ],
        listeners: {
            move(event) {
                let { width, height } = event.rect;
                event.target.style.width = `${width}px`;
                event.target.style.height = `${height}px`;
            }
        }
    });

interact('.rotate-handle').draggable({
    listeners: {
        move(event) {
            const box = event.target.parentElement;
            const rect = box.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            let angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
            angle = Math.round(angle / 15) * 15; // Snap to 15-degree increments
            box.style.transform = `translate(${box.getAttribute('data-x') || 0}px, ${box.getAttribute('data-y') || 0}px) rotate(${angle}deg)`;
            box.setAttribute('data-angle', angle);
        }
    }
});

//DOWNLOAD PDF
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const content = document.getElementById("wordContainer");

    if (!content) {
        console.error("Error: Element with ID 'wordContainer' not found.");
        return;
    }

    // Temporarily hide rulers
    const rulers = document.querySelectorAll("#wordContainer .ruler, #wordContainer .ruler *");
    rulers.forEach(el => el.style.visibility = "hidden");

    // Temporarily remove translateX for accurate capture
    content.style.transform = "none";

    setTimeout(() => {
        html2canvas(content, { 
            scale: 2, 
            useCORS: true, 
            logging: true, 
            width: content.scrollWidth,
            height: content.scrollHeight 
        }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("download.pdf");

            // Restore transform after capturing
            content.style.transform = "translateX(-50%)";

            // Restore ruler visibility
            rulers.forEach(el => el.style.visibility = "visible");
        }).catch(error => console.error("html2canvas error:", error));
    }, 300);
}

