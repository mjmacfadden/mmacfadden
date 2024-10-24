// Array of arrays to hold image data
const imagesData = [
    {filename: "birthday_balloon_cake", alt: "Birthday - Balloon Cake", id: "1", classes: "thumb img-thumbnail"},
    {filename: "birthday_cupcake_cart", alt: "Birthday - Cupcake Cart", id: "2", classes: "thumb img-thumbnail"},
    {filename: "birthday_cupcake_line_art", alt: "Birthday - Cupcake Line Art", id: "3", classes: "thumb img-thumbnail"},
    {filename: "birthday_gift_box", alt: "Birthday - Gift Box", id: "4", classes: "thumb img-thumbnail"},
    {filename: "birthday_happy_cake", alt: "Birthday - Happy Cake", id: "5", classes: "thumb img-thumbnail"},
    {filename: "birthday_owl", alt: "Birthday - Owl", id: "6", classes: "thumb img-thumbnail"},
    {filename: "birthday_unicorn", alt: "Birthday - Unicorn", id: "7", classes: "thumb img-thumbnail"},
    {filename: "birthday_wreath", alt: "Birthday - Wreath", id: "8", classes: "thumb img-thumbnail"},
    {filename: "halloween_jackolanterns", alt: "Halloween - Jackolanterns", id: "9", classes: "thumb img-thumbnail"},
    {filename: "halloween_haunted_hill", alt: "Halloween - Haunted Hill", id: "10", classes: "thumb img-thumbnail"},
    {filename: "halloween_jackolantern_and_skull", alt: "Halloween - Jackolantern and Skull", id: "11", classes: "thumb img-thumbnail"},
    {filename: "halloween_kitty", alt: "Halloween - Kitty", id: "12", classes: "thumb img-thumbnail"},
    {filename: "thankyou_bouquet", alt: "Thank You - Bouquet", id: "13", classes: "thumb img-thumbnail"},
    {filename: "thankyou_hand_heart", alt: "Thank You - Hand Heart", id: "14", classes: "thumb img-thumbnail"},
    {filename: "thankyou_heart_and_roses", alt: "Thank You - Heart and Roses", id: "15", classes: "thumb img-thumbnail"},
    {filename: "thankyou_watercolor_landscape", alt: "Thank You - Watercolor Landscape", id: "16", classes: "thumb img-thumbnail"},
    {filename: "thankyou_sun", alt: "Thank You - Sun", id: "17", classes: "thumb img-thumbnail"},
    {filename: "thankyou_sunrise", alt: "Thank You - Sunrise", id: "18", classes: "thumb img-thumbnail"},
    {filename: "thankyou_unicorn", alt: "Thank You - Unicorn", id: "19", classes: "thumb img-thumbnail"},
    {filename: "thankyou_elephant", alt: "Thank You - Elephant", id: "20", classes: "thumb img-thumbnail"},
    {filename: "hanukkah_clay", alt: "Hanukkah - Clay", id: "21", classes: "thumb img-thumbnail"},
    {filename: "hanukkah_snowy_menorah", alt: "Hanukkah - Snowy Menorah", id: "22", classes: "thumb img-thumbnail"},
    {filename: "christmas_santa_cottage", alt: "Christmas - Santa Cottage", id: "23", classes: "thumb img-thumbnail"},
    {filename: "christmas_vintage_vector", alt: "Christmas - Vintage Vector", id: "24", classes: "thumb img-thumbnail"},

];

function displayImages() {
    imagesData.forEach(image => {
    const imgElement = document.createElement('img');
    imgElement.src = `img/${image.filename}.jpg`;
    imgElement.alt = image.alt;
    imgElement.id = image.id;
    imgElement.className = image.classes;

    document.getElementById('card_images').appendChild(imgElement);
    });
    // Add event listeners to all image thumbnails
    const thumbnails = document.querySelectorAll('.thumb');
    thumbnails.forEach((thumb) => {
        thumb.addEventListener('click', function() {
            const imageId = thumb.getAttribute('id');  // Get the ID of the clicked image
            updateBackgroundImage(imageId);  // Update the background image of the card and flip to front
        });
    });
}

// CARD FLIP
document.querySelectorAll('.flip').forEach(card => {
    card.addEventListener('click', function() {
        card.classList.toggle('flipped');
    });
});
// Trigger flip using another element (like a button)
document.getElementById('flipTrigger').addEventListener('click', function() {
    const card = document.querySelector('.flip'); // Select the card you want to flip
    card.classList.toggle('flipped'); // Toggle the 'flipped' class on the card
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
function updateBackgroundImage(imageId) {
    const frontDiv = document.querySelector('.front');
    const card = document.querySelector('.flip');
    
    // Ensure the elements exist
    if (!frontDiv || !card) {
        console.error('Front card or flip element not found in the DOM.');
        return;
    }
    
    // Find the image data by ID in the imagesData array
    const imageData = imagesData.find(image => image.id === imageId.toString());
    
    if (imageData) {
        // Construct the image URL from the filename in the array
        const imageUrl = `img/${imageData.filename}.jpg`;
        
        // Update the background image
        frontDiv.style.backgroundImage = `url(${imageUrl})`;
        frontDiv.setAttribute('data-image-id', imageId); // Store the image ID
        updateCardAndUrl(); // Assuming this updates the card's URL and other details
        
        // Ensure the card flips to the front if it's currently on the back
        if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');
        }
    } else {
        console.error(`Image with ID ${imageId} not found in imagesData`);
    }
}

// Function to hide elements with the 'hide' class
function hideElements() {
    const hideElements = document.querySelectorAll('.hide');
    hideElements.forEach(element => {
        element.style.display = 'none'; // Apply display: none;
    });
    document.getElementById('conditional-full-width').style.width = '100%';
}

// Set initial values from URL parameters when the page loads
function urlParams() {
    const params = getUrlParams();

    // Define default values
    const defaultParams = {
        to: '',
        from: '',
        message: '',
        imageId: '1', // Default image ID
        hideClass: 'false'
    };

    // Compare URL parameters with default values
    const isParamsDifferent = (
        params.to !== defaultParams.to ||
        params.from !== defaultParams.from ||
        params.message !== defaultParams.message ||
        params.imageId !== defaultParams.imageId ||
        params.hideClass !== defaultParams.hideClass
    );

    // Only update the card if the URL parameters differ from defaults
    if (isParamsDifferent) {
        // Update the card content
        document.getElementById('to').innerHTML = `To: ${params.to}`;
        document.getElementById('from').innerHTML = `From: ${params.from}`;
        document.getElementById('message').innerHTML = params.message;

        // Optional: Populate input fields with the current URL values
        document.getElementById('toInput').value = params.to !== '' ? params.to : '';
        document.getElementById('fromInput').value = params.from !== '' ? params.from : '';
        document.getElementById('messageInput').value = params.message !== '' ? params.message : '';

        // Load the image from URL parameters
        loadImageFromUrlParams(params.imageId); // Pass the imageId directly to the function
    }

    // Hide elements if the 'hide' parameter is true
    if (params.hideClass === 'true') {
        hideElements();
    }
}

// Function to load the image based on the image ID from URL parameters
function loadImageFromUrlParams(imageId) {
    // Find the image data by the image ID from the URL parameters
    const selectedImage = imagesData.find(image => image.id === imageId.toString()); // Ensure ID is a string

    if (selectedImage) {
        // Construct the image URL
        const imageUrl = `img/${selectedImage.filename}.jpg`;

        // Update the background image with the selected image data
        updateBackgroundImage(selectedImage.id);  // Pass the image ID to update the background
    } else {
        console.error(`Image with ID ${imageId} not found in imagesData.`);
    }
}

// Function to copy the current URL with parameters to the clipboard
function copyUrlToClipboard() {
    const currentUrl = window.location.href; // Get the full URL including parameters

    // Copy the URL to the clipboard
    navigator.clipboard.writeText(currentUrl).catch(err => {
        console.error('Failed to copy the URL: ', err);
    });
}

//Display "copied url" message after button click
function copyUrlToClipboard() {
    // Copy URL to clipboard
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);

    // Show the copied message
    const copiedMessage = document.querySelector('.copied');
    copiedMessage.style.display = 'block';

    // Hide the message after 1.5 seconds
    setTimeout(() => {
        copiedMessage.style.display = 'none';
    }, 2000); // 1.5 seconds
}

window.onload = function() {
    displayImages();
    urlParams();
};