// CARD FLIP
document.querySelectorAll('.flip').forEach(card => {
    card.addEventListener('click', function() {
        card.classList.toggle('flipped');
    });
});

// Function to check if card is flipped and flip it
function flipCardIfNotFlipped() {
    const card = document.querySelector('.flip');
    if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
    }
}

// Function to get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        to: params.get('to') || '', 
        from: params.get('from') || '', 
        message: params.get('message') || '',
        imageId: params.get('imageId') || '1', // Default to image 1
        hideClass: params.get('hide') || 'false' // New hide parameter
    };
}

// Function to update the card with input values// Function to update the card with input values and trigger flip
function updateCardAndUrl() {
    const toValue = document.getElementById('toInput').value || '';
    const fromValue = document.getElementById('fromInput').value || '';
    const messageValue = document.getElementById('messageInput').value || '';
    const imageId = document.querySelector('.front').getAttribute('data-image-id') || '1';
    const hideClass = document.querySelector('.hide') ? 'true' : 'false';

    // Update the card with new values
    document.getElementById('to').innerHTML = `To: ${toValue}`;
    document.getElementById('from').innerHTML = `From: ${fromValue}`;
    document.getElementById('message').innerHTML = messageValue;

    // Flip the card if input is typed and it's not already flipped
    if (toValue || fromValue || messageValue) {
        flipCardIfNotFlipped();
    }

    // Update the URL with new parameters
    const newUrl = `${window.location.pathname}?to=${encodeURIComponent(toValue)}&from=${encodeURIComponent(fromValue)}&message=${encodeURIComponent(messageValue)}&imageId=${encodeURIComponent(imageId)}&hide=${encodeURIComponent(hideClass)}`;
    window.history.replaceState({}, '', newUrl);
}

// Add event listeners to input fields to update the card and flip
document.getElementById('toInput').addEventListener('input', updateCardAndUrl);
document.getElementById('fromInput').addEventListener('input', updateCardAndUrl);
document.getElementById('messageInput').addEventListener('input', updateCardAndUrl);

// Function to update the front card background image and flip to front
function updateBackgroundImage(imageUrl, imageId) {
    const frontDiv = document.querySelector('.front');
    const card = document.querySelector('.flip');
    
    // Update the background image
    frontDiv.style.backgroundImage = `url(${imageUrl})`;
    frontDiv.setAttribute('data-image-id', imageId); // Store the image ID
    updateCardAndUrl();

    // Ensure the card flips to the front if it's currently on the back
    if (card.classList.contains('flipped')) {
        card.classList.remove('flipped');
    }
}

// Add event listeners to all image thumbnails
const thumbnails = document.querySelectorAll('.thumb');
thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', function() {
        const imageUrl = thumb.src;  // Get the source of the clicked image
        const imageId = thumb.getAttribute('id');  // Get the ID of the clicked image
        updateBackgroundImage(imageUrl, imageId);  // Update the background image of the card and flip to front
    });
});


// Function to hide elements with the 'hide' class
function hideElements() {
    const hideElements = document.querySelectorAll('.hide');
    hideElements.forEach(element => {
        element.style.display = 'none'; // Apply display: none;
    });
    document.getElementById('conditional-full-width').style.width = '100%';
}

// Set initial values from URL parameters when the page loads
window.onload = function() {
    const params = getUrlParams();
    
    // Update the card content
    document.getElementById('to').innerHTML = `To: ${params.to}`;
    document.getElementById('from').innerHTML = `From: ${params.from}`;
    document.getElementById('message').innerHTML = params.message;
    
    // Optional: Populate input fields with the current URL values
    document.getElementById('toInput').value = params.to !== '' ? params.to : '';
    document.getElementById('fromInput').value = params.from !== '' ? params.from : '';
    document.getElementById('messageInput').value = params.message !== '' ? params.message : '';

    // Set the image based on the URL parameter
    const selectedImage = document.getElementById(params.imageId);
    if (selectedImage) {
        const imageUrl = selectedImage.src;
        updateBackgroundImage(imageUrl, params.imageId);  // Update the background image based on the saved imageId
    }

    // Hide elements if the 'hide' parameter is true
    if (params.hideClass === 'true') {
        hideElements();
    }
};

// Function to copy the current URL with parameters to the clipboard
function copyUrlToClipboard() {
    const currentUrl = window.location.href; // Get the full URL including parameters

    // Copy the URL to the clipboard
    navigator.clipboard.writeText(currentUrl).catch(err => {
        console.error('Failed to copy the URL: ', err);
    });
}