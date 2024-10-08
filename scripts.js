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

// Create an object with old paths as keys and new paths as values
const redirects = {
  "/mark-more.html": "/markmore.php",
  "/templates/": "/templates.html",
  "/Templates/": "/templates.html",
  "/templates": "/templates.html",
  "/mark-more": "/markmore.html",
  "/about/": "/about.html",
  "/periodic-square/": "periodic-square.html",
  "/2018/01/25/project-based-grading/": "https://mmacfadden.substack.com/p/project-based-grading",
};

// Get the current path
const currentPath = window.location.pathname;

// Check if the current path exists in the redirects object
if (redirects[currentPath]) {
  // Redirect to the new URL
  window.location.href = redirects[currentPath];
}
