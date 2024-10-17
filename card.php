<?php 
  $page_title = "Mike Macfadden - About";
  $meta_description = "My name is Mike Macfadden. I'm a high school teacher. I write a lot about creativity and innovation in teaching and learning.";
  $og_title = "Mike Macfadden - About";
  //$og_url = "https://yourwebsite.com/custom-page";
  //$og_image = "https://yourwebsite.com/custom-image.jpg";

  include 'header.php';
?>

<div class="page_header">
  <div class="container py-4">
    <div class="row py-4">
      <!-- First Row -->
      <div class="col">
        <h1>Greeting Card</h1>
      </div>
    </div>
  </div>
</div>

<div class="container py-4">
  <div class="row py-4">
        <div class="col">
            <h1>Create Your Greeting Card</h1>
            <input type="text" id="messageInput" placeholder="Enter your message">
            <button onclick="generateCard()">Generate Greeting Card</button>

            <div class="card" id="greetingCard" style="display: none;">
                <h2>Your Greeting:</h2>
                <p id="greetingMessage"></p>
            </div>

            <script src="app.js"></script>

        </div>
    </div>
</div>


<?php
    include 'footer.php'; // Include footer
?>
