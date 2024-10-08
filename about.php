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
        <h1>About</h1>
      </div>
    </div>
  </div>
</div>

<div class="container py-4">
  <div class="row py-4">
    <div class="col-md-8">
      <h2>Hello There</h2>
      <p>I’m Mike Macfadden, and I am a high school teacher that writes about creativity and innovation in teaching and learning. I used to host a blog here, but now I write on <a href="https://mmacfadden.substack.com" target="_blank">Substack</a>.</p>
      <h2 class="mt-4 pt-4">What would you say I do here?</h2>
      <p>This website is my homebase online. Every now and then I get pulled into odd corners of the intenet, but I always find my way back here. Below are just some of the things I do here:</p>
      <ul>
        <li>Showcase various projects of mine.</li>
        <li>Link out to all of the other place I live online.</li>
        <li>Experiment with graphic design, code, and generally fool around with technology.</li>
      </ul>
      <h2 class="mt-4 pt-4">Somtimes I write Children's Stories</h3>
      <p>I wrote a few children's stories for my two boys, and I published them on Amazon. You can read them for free <a href="books.php">here</a></p>
      <a href="books.php" target="_blank">
        <img src="img/some_friends.jpg" class="img-fluid mx-auto d-block" style="width:100%; max-width:450px;" alt="Some Friends - Children's Stories" />
      </a>
      <h2 class="mt-4 pt-4">My Teaching CV</h2>
      <p>I am a business, technology, and design teacher at Glenbrook South High School.</p>
      <p>Instructionally, my areas of focus include teaching entrepreneurship, graphic design, web design, and video game design. I feel incredibly fortunate to get to teach what I&rsquo;m most passionate about to some of the most amazing students around.</p>
      <p>Previously, I was employed as a district level technology coach in Lake Villa School District 41, where I worked with teachers to integrate technology into their lessons.</p>
      <p>Prior to that, I worked in a charter school on Chicago&rsquo;s Northwest Side. There, I developed and refined a comprehensive technology curriculum that focused on 21st century literacy, which I have learned to define as &ldquo;fluency in all forms of communication.&rdquo;</p>
      <p>I earned my masters in Educational Leadership from Northeastern Illinois University. I earned a degree in History Education from Illinois State University. I hold Type 9 teaching and Type 75 administrative certificates. I also attended Oakton Community College, Northern Michigan University, and Governors State University, where I completed the requirements to earn Technology Education and Business, Marketing, and Computer Education teaching endorsements.</p>
      <p>In addition to teaching, I lead professional development in the areas of educational technology and speak on matters related to business education.</p>
    </div>

    <?php
      include 'sidebar.php'; //Include sidebar
    ?>

  </div>
</div>

<?php
    include 'footer.php'; // Include footer
?>
