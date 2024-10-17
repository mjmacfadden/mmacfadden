// app.js

// Function to get URL parameters
function getUrlParameter(name) {
    let url = window.location.search.substring(1);
    let params = url.split('&');
    
    for (let i = 0; i < params.length; i++) {
        let param = params[i].split('=');
        if (param[0] === name) {
            return decodeURIComponent(param[1]);
        }
    }
    return null;
}

// Function to generate greeting card and update the URL
function generateCard() {
    const message = document.getElementById('messageInput').value;
    if (message) {
        const encodedMessage = encodeURIComponent(message);
        window.history.pushState({}, '', `?message=${encodedMessage}`);
        displayGreeting(encodedMessage);
    }
}

// Function to display the greeting card with the message
function displayGreeting(message) {
    const decodedMessage = decodeURIComponent(message);
    document.getElementById('greetingMessage').textContent = decodedMessage;
    document.getElementById('greetingCard').style.display = 'block';
}

// Check if there is a message in the URL when the page loads
window.onload = function() {
    const message = getUrlParameter('message');
    if (message) {
        displayGreeting(message);
    }
};
