// CARD FLIP
document.querySelectorAll('.flip').forEach(card => {
    card.addEventListener('click', function() {
        card.classList.toggle('flipped');
    });
});

// Function to get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        to: params.get('to') || 'Recipient', 
        from: params.get('from') || 'Sender', 
        message: params.get('message') || 'Happy Birthday! We are so proud of you and all that you\'ve accomplished. Here\'s to many more amazing moments ahead!',
        imageId: params.get('imageId') || '1', // Default to image 1
        hideClass: params.get('hide') || 'false' // New hide parameter
    };
}

// Function to update the card with input values
function updateCardAndUrl() {
    const toValue = document.getElementById('toInput').value || 'Recipient';
    const fromValue = document.getElementById('fromInput').value || 'Sender';
    const messageValue = document.getElementById('messageInput').value || 'Happy Birthday! We are so proud of you and all that you\'ve accomplished. Here\'s to many more amazing moments ahead!';
    const imageId = document.querySelector('.front').getAttribute('data-image-id') || '1'; // Get the selected image ID
    const hideClass = document.querySelector('.hide') ? 'true' : 'false'; // Check if hide class is present

    // Update the card with new values
    document.getElementById('to').innerHTML = `To: ${toValue}`;
    document.getElementById('from').innerHTML = `From: ${fromValue}`;
    document.getElementById('message').innerHTML = messageValue;

    // Update the URL with new parameters
    const newUrl = `${window.location.pathname}?to=${encodeURIComponent(toValue)}&from=${encodeURIComponent(fromValue)}&message=${encodeURIComponent(messageValue)}&imageId=${encodeURIComponent(imageId)}&hide=${encodeURIComponent(hideClass)}`;
    window.history.replaceState({}, '', newUrl);
}

// Function to update the front card background image
function updateBackgroundImage(imageUrl, imageId) {
    const frontDiv = document.querySelector('.front');
    frontDiv.style.backgroundImage = `url(${imageUrl})`;
    frontDiv.setAttribute('data-image-id', imageId); // Store the image ID
}

// Add event listeners to all image thumbnails
const thumbnails = document.querySelectorAll('.thumb');
thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', function() {
        const imageUrl = thumb.src;  // Get the source of the clicked image
        const imageId = thumb.getAttribute('id');  // Get the ID of the clicked image
        updateBackgroundImage(imageUrl, imageId);  // Update the background image of the card and store ID
    });
});

// Function to hide elements with the 'hide' class
function hideElements() {
    const hideElements = document.querySelectorAll('.hide');
    hideElements.forEach(element => {
        element.style.display = 'none'; // Apply display: none;
    });
}

// Set initial values from URL parameters when the page loads
window.onload = function() {
    const params = getUrlParams();
    
    // Update the card content
    document.getElementById('to').innerHTML = `To: ${params.to}`;
    document.getElementById('from').innerHTML = `From: ${params.from}`;
    document.getElementById('message').innerHTML = params.message;
    
    // Optional: Populate input fields with the current URL values
    document.getElementById('toInput').value = params.to !== 'Recipient' ? params.to : '';
    document.getElementById('fromInput').value = params.from !== 'Sender' ? params.from : '';
    document.getElementById('messageInput').value = params.message !== 'Happy Birthday! We are so proud of you and all that you\'ve accomplished. Here\'s to many more amazing moments ahead!' ? params.message : '';

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

// Add event listener to update card and URL when the button is clicked
document.getElementById('updateButton').addEventListener('click', updateCardAndUrl);
