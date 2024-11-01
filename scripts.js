// Select all elements with the class 'hoverImage'
const images = document.querySelectorAll(".hoverImage");

// Loop through each image and add event listeners for hover
images.forEach((img) => {
  // Change the extension to .gif on hover
  img.addEventListener("mouseenter", function () {
    this.src = this.src.replace(".jpg", ".gif");
  });

  // Change the extension back to .jpg when hover is over
  img.addEventListener("mouseleave", function () {
    this.src = this.src.replace(".gif", ".jpg");
  });
});

//Focus Input
var myModal = document.getElementById("searchModal");
var myInput = document.getElementById("searchInput");

myModal.addEventListener("shown.bs.modal", function () {
  myInput.focus();
});

// Function to hide all story divs
function hideAllStories() {
  const stories = document.querySelectorAll(".story_book");
  stories.forEach((story) => (story.style.display = "none"));
}

// Function to show the selected story
function showStory(storyId) {
  hideAllStories(); // Hide all stories first
  const story = document.getElementById(storyId);
  if (story) {
    story.style.display = "block"; // Show the selected story
  }
}

// Add event listeners to links
document.querySelectorAll(".story-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default link behavior

    // Print to the console to detect click
    console.log("Link clicked:", this.getAttribute("data-target"));

    const targetStory = this.getAttribute("data-target");
    showStory(targetStory);
  });
});

// Create an object with old paths as keys and new paths as values
const redirects = {
  "/mark-more.html": "/markmore.php",
  "/templates/": "/templates.html",
  "/Templates/": "/templates.html",
  "/Templates": "/templates.html",
  "/templates": "/templates.html",
  "/mark-more": "/markmore.html",
  "/about/": "/about.html",
  "/periodic-square/": "/periodic-square.html",
  "/2018/01/25/project-based-grading/": "https://mmacfadden.substack.com/p/project-based-grading",
  "/windsor" : "https://windsorgreetings.com",
  "/windsor/" : "https://windsorgreetings.com",
  "/windsor/index.html" : "https://windsorgreetings.com",
};

// Get the current path and search parameters
const currentPath = window.location.pathname;
const queryParams = window.location.search;

// Check if the current path exists in the redirects object
if (redirects[currentPath]) {
  // Redirect to the new URL and include the query parameters
  window.location.href = redirects[currentPath] + queryParams;
}

/*
// Create an object with old paths as keys and new paths as values
const redirects = {
  "/mark-more.html": "/markmore.php",
  "/templates/": "/templates.html",
  "/Templates/": "/templates.html",
  "/templates": "/templates.html",
  "/mark-more": "/markmore.html",
  "/about/": "/about.html",
  "/periodic-square/": "/periodic-square.html",
  "/2018/01/25/project-based-grading/": "https://mmacfadden.substack.com/p/project-based-grading",
};

// Get the current path
const currentPath = window.location.pathname;

// Check if the current path exists in the redirects object
if (redirects[currentPath]) {
  // Redirect to the new URL
  window.location.href = redirects[currentPath];
}

*/