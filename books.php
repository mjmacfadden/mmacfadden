<?php 
$page_title = "Mike Macfadden - Books";
$meta_description = "Sometimes I write children's stories for my two boys and then publish them to Amazon KDP, but you can read them here for free.";
$og_title = "Mike Macfadden - Books";
//$og_url = "https://yourwebsite.com/custom-page";
//$og_image = "https://yourwebsite.com/custom-image.jpg";

include 'header.php';
?>

<div class="page_header">
  <div class="container py-4">
    <div class="row py-4">
      <!-- First Row -->
      <div class="col">
        <h1>Books</h1>
      </div>
    </div>
  </div>
</div>

<div class="container py-4 books">
    <div class="row py-4">
        <div class="col-md-8">
            <h2>Somtimes I write Children's Stories</h3>
            <p>I wrote a few children's stories for my two boys, and I published them on Amazon KDP.</p>
            <a href="https://www.amazon.com/s?i=digital-text&rh=p_27%3AMichael+Macfadden&s=relevancerank&text=Michael+Macfadden&ref=dp_byline_sr_ebooks_1" target="_blank">
                <img src="img/some_friends.webp" class="img-fluid" alt="Some Friends - Children's Stories" />
            </a>
        </div>

        <?php
            include 'sidebar.php'; //Include sidebar
        ?>
    </div>
</div>

<?php
    include 'footer.php';
?>