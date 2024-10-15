<?php 
$page_title = "Mike Macfadden - Books";
$meta_description = "Sometimes I write children's stories for my two boys and then publish them to Amazon KDP, but you can read them here for free.";
$og_title = "Mike Macfadden - Books";
//$og_url = "https://yourwebsite.com/custom-page";
$og_image = "https://mmacfadden.com/img/og/og_books.jpg";

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
            <h2>Sometimes I write Children's Stories</h3>
            <p>I wrote a few children's stories for my two boys, and I published them on <a href="https://www.amazon.com/s?i=digital-text&rh=p_27%3AMichael+Macfadden&s=relevancerank&text=Michael+Macfadden&ref=dp_byline_sr_ebooks_1" target="_blank">Amazon</a>, but you can read them for free below.</p>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="books.php/#" class="story-link" data-target="some_bears">Some Bears</a></li>
                <li class="breadcrumb-item"><a href="books.php/#" class="story-link" data-target="some_cows">Some Cows</a></li>
                <li class="breadcrumb-item"><a href="books.php/#" class="story-link" data-target="some_whales">Some Whales</a></li>
              </ol>
            </nav>
            <?php
                include 'books/somebears.php';
                include 'books/somewhales.php';
                include 'books/somecows.php';
            ?>      
            <div class="col text-center">
            <a href="https://www.amazon.com/s?i=digital-text&rh=p_27%3AMichael+Macfadden&s=relevancerank&text=Michael+Macfadden&ref=dp_byline_sr_ebooks_1" target="_blank"><button class="mb-4 btn btn-primary">BOY NOW <i class="bi bi-amazon"></i></button></a>
            </div>
        </div>

        <?php
            include 'sidebar.php'; //Include sidebar
        ?>
    </div>
</div>

<?php
    include 'footer.php';
?>