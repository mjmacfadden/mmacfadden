<?php 
$page_title = "Mike Macfadden - Freebies";
$meta_description = "Congratulations, you found my \"freebies\". Herein you'll find my Penmanship and Teaching the Research Paper quick start guides.";
$og_title = "Mike Macfadden - Freebies";
//$og_url = "https://yourwebsite.com/custom-page";
//$og_image = "https://yourwebsite.com/custom-image.jpg";

include 'header.php';
?>


<div class="page_header">
  <div class="container py-4">
    <div class="row py-4">
      <!-- First Row -->
      <div class="col">
        <h1>Freebies</h1>
      </div>
    </div>
  </div>
</div>

<div class="container freebies py-4">
    <div class="row my-4 py-4">
        <h2>Congrats, you’re subscribed!</h2>
        <p>As my way of saying thank you, please enjoy the freebies below. If you think they might be of use to someone you know, feel free to share them. My only ask is that you let them know where they came from.</p>
        <p>Thanks a bunch, you’re the best!</p>
        <!-- Nav tabs -->
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
            <button class="nav-link active" id="penmanship-tab" data-bs-toggle="tab" data-bs-target="#penmanship" type="button" role="tab" aria-controls="home" aria-selected="true">Penmanship</button>
            </li>
            <li class="nav-item" role="presentation">
            <button class="nav-link" id="research-tab" data-bs-toggle="tab" data-bs-target="#research" type="button" role="tab" aria-controls="profile" aria-selected="false">Teaching the Research Paper</button>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content mt-3">
            <div class="tab-pane fade show active" id="penmanship" role="tabpanel" aria-labelledby="penmanship-tab">
                <div class="row">
                    <div class="col-md-9">
                        <h3>Penmanship</h3>
                        <p>So here’s the deal. I used to hate my handwriting. As a teacher, this wasn’t great for me. After a bunch of research and trial and error, I fixed it. I’ve compiled what I learned improving my handwriting into an easy to follow three step guide.</p>
                        <p>Enhance your penmanship in a week with my three step guide. Click the image to the right to access your free PDF.</p>
                    </div>
                    <div class="col-md-3 text-center">
                        <a href="assets/penmanship.pdf" target="_blank">
                            <img src="img/freebies/penmanship.jpg" class="img-fluid" alt="Penmanship - Download"/>
                        </a>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="research" role="tabpanel" aria-labelledby="research-tab">
                <div class="row">
                        <div class="col-md-9">
                            <h3>Teaching the Research Paper</h3>
                            <p>This simple guide will provide you with everything you need to help you teach your students how to conduct research for the purpose of writing a research paper. Invaluable templates included!</p>
                            <p>Click the image to the right to access your free PDF.</p>
                        </div>
                        <div class="col-md-3 text-center">
                            <a href="assets/teaching_the_research_paper.pdf" target="_blank">
                                <img src="img/freebies/teaching_the_research_paper.jpg" class="img-fluid" alt="Penmanship - Download"/>
                            </a>
                        </div>
                    </div>
                </div>
        </div>
            
    </div>
</div>

<?php include 'footer.php';
?>