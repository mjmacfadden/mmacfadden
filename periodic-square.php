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
        <h1>Periodic Square</h1>
      </div>
    </div>
  </div>
</div>

<div class="container py-4 periodic_square">
    <div class="row py-4">
        <div class="col-md-4">

            <!-- Form to input element details -->
            <form id="elementForm" class="text-center">
                <input type="number" id="atomicNumber" placeholder="Atomic Number" required>
                <input type="text" id="atomicSymbol" placeholder="Atomic Symbol" required>
                <input type="text" id="atomicWeight" placeholder="Atomic Weight" required>
                <input type="text" id="elementName" placeholder="Element Name" required>
                <input type="text" id="urlInput" placeholder="URL for QR code" required>
                <button class="btn btn-dark" type="submit">Generate</button>
            </form>
        </div>
        <div class="col-md-8 text-center">

            <!-- Container for the generated periodic square -->
            <div id="periodicSquareContainer"></div>
            <!-- Download Button -->
            <i class="bi bi-download" id="downloadButton" style="display: none;"></i>


            <!-- Qrious Library -->
            <script src="https://cdn.jsdelivr.net/npm/qrious/dist/qrious.min.js"></script>
            <!-- html2canvas Library -->
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" integrity="sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
            <script>
                // Handle form submission
                document.getElementById('elementForm').addEventListener('submit', function(event) {
                    event.preventDefault(); // Prevent form submission

                    // Get input values
                    const atomicNumber = document.getElementById('atomicNumber').value;
                    const atomicSymbol = document.getElementById('atomicSymbol').value;
                    const atomicWeight = document.getElementById('atomicWeight').value;
                    const elementName = document.getElementById('elementName').value;
                    const url = document.getElementById('urlInput').value;

                    // Create the periodic square
                    const squareContainer = document.getElementById('periodicSquareContainer');
                    squareContainer.innerHTML = `
                        <div class="element-square" id="elementSquare">
                            <div class="element-number">${atomicNumber}</div>
                            <div class="element-symbol">${atomicSymbol}</div>
                            <canvas id="qrcode"></canvas>
                            <div class="element-name">${elementName}</div>
                            <div class="element-weight">${atomicWeight}</div>
                        </div>
                    `;

                    // Generate QR code for the given URL
                    const qr = new QRious({
                        element: document.getElementById('qrcode'),
                        size: 125,
                        value: url
                    });

                    // Show the download button
                    document.getElementById('downloadButton').style.display = 'block';

                    // Handle download button click
                    document.getElementById('downloadButton').addEventListener('click', function() {
                        html2canvas(document.getElementById('elementSquare')).then(function(canvas) {
                            const link = document.createElement('a');
                            link.download = 'periodic_square.jpg'; // Filename
                            link.href = canvas.toDataURL('image/jpeg', 1.0); // Convert canvas to JPEG
                            link.click(); // Trigger download
                        });
                    });
                });
            </script>
        </div>
    </div>
</div>

<?php
    include 'footer.php';
?>
