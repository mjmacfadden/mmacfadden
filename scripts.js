// Select all elements with the class 'hoverImage'
const images = document.querySelectorAll('.hoverImage');

// Loop through each image and add event listeners for hover
images.forEach((img) => {
    // Change the extension to .gif on hover
    img.addEventListener('mouseenter', function() {
        this.src = this.src.replace('.jpg', '.gif');
    });

    // Change the extension back to .jpg when hover is over
    img.addEventListener('mouseleave', function() {
        this.src = this.src.replace('.gif', '.jpg');
    });
});

//Focus Input
var myModal = document.getElementById('searchModal')
var myInput = document.getElementById('searchInput')

myModal.addEventListener('shown.bs.modal', function () {
  myInput.focus()
})


// Check if the current URL is "mark-more.php"
if (window.location.pathname === "/mark-more.php") {
    // Redirect to "markmore.php"
    window.location.href = "/markmore.php";
}