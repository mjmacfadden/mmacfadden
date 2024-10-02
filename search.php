<?php include 'header.php';
?>

<div class="page_header">
  <div class="container py-4">
    <div class="row py-4">
      <!-- First Row -->
      <div class="col">
        <h1>Search</h1>
      </div>
    </div>
  </div>
</div>

<div class="container py-4">
    <div class="row py-4">
        <div class="col search_page">

            <script async src="https://cse.google.com/cse.js?cx=b6ff33f7cf29f42a9">
            </script>
            <div class="gcse-searchresults-only"></div>

            <form class="d-flex" action="search.php" method="GET">
                <!-- Search Input -->
                <input class="form-control me-2 searchInput" type="search" placeholder="search..." name="q" aria-label="Search" autofocus>
                <!-- Submit Button -->
                <button class="btn btn-primary searchSubmit" type="submit">GO</button>
            </form>
        </div>
    </div>
</div>

<?php include 'footer.php';
?>