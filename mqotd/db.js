// Get today's date in the format of "Month day, year"
const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

const quotesOfTheDay = [
    {
      date: "April 17, 2023",
      quote: "What, I thought we were in the trust tree in the nest, were we not?",
      id: 11635,
      src: "https://www.youtube.com/embed/umkovqvw714?start=81&end=86",
    },
    {
      date: "April 18, 2023",
      quote: "Stop chasing me!",
      id: 640,
      src: "https://www.youtube.com/embed/pRi-o9-utSE?start=58&end=65",
    },
    {
      date: "April 19, 2023",
      quote: "The most valuable commodity I know of is information. Wouldn't you agree?",
      id: 10673,
      src: "https://www.youtube.com/embed/7tZBkOtIYkU?start=13&end=20",
    },

    
  ];
  

  const todaysQuote = quotesOfTheDay.find((quote) => quote.date === today);
  
  let id;

  
  // Loop through the quotesOfTheDay array
  for (let i = 0; i < quotesOfTheDay.length; i++) {
    // Check if the date property matches today's date
    if (quotesOfTheDay[i].date === today) {
        id = quotesOfTheDay[i].id;
      // Do something with the ID, e.g. fetch movie data and display it
      break; // exit the loop since we found a match
    }
  }
  
  const apiKey = 'fe02516c84b34aff3bd02db47d61ec88';
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const title = data.title;
        const tagline = data.tagline;
        const release_date = data.release_date;
        const runtime = data.runtime;
        const overview = data.overview;
        const posterPath = data.poster_path;
        const posterUrl = 'https://image.tmdb.org/t/p/w500' + posterPath;
    

        var elements = document.getElementsByClassName('title');
        for(var i=0; i<elements.length; i++) {
            elements[i].textContent = title;
        }
        var elements = document.getElementsByClassName('overview');
        for(var i=0; i<elements.length; i++) {
            elements[i].textContent = overview;
        }
        document.getElementById('poster').setAttribute('src', posterUrl);

    
        //DISPLAY TODAY'S DATE AND QUOTE
        document.getElementById('quote').textContent = '\"' + todaysQuote.quote + '\"';
        document.getElementById('date').textContent = todaysQuote.date;

        //YOUTUBE
        document.getElementById("youTube").src = todaysQuote.src;


        

        const form = document.getElementById('guess-form');
        form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting
 
        // Get the user's answer from the input box
        const userAnswer = document.getElementById('guess').value;
        if (success == false){
          numberOfGuesses = numberOfGuesses + 1;
        }
        console.log('Number of Guesses:' + numberOfGuesses.toString());
        document.getElementById('guess-count').textContent = numberOfGuesses.toString();

        // Check if the user's answer matches the movie title
        if (userAnswer.toLowerCase().trim() === title.toLowerCase().trim()) {
            // If the answer is correct, show the "answer" element
            success = true;
            document.getElementById('answer').style.height = 'auto';
            document.getElementById('answer').style.opacity = '1';
            document.getElementById('answer').style.transition = 'opacity .3s';
            const modal = document.getElementById('answerModal');
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();

            document.getElementById('guess-count').textcontent = 'numberOfGuesses';


            // Get the og:title meta tag
            var ogTitle = document.querySelector('meta[property="og:title"]');
            // Set the new title value
            var newTitle = "Guesses: " + numberOfGuesses.toString() + ", Hints: " + numberOfHints.toString();
            // Set the content attribute of the og:title meta tag to the new title value
            ogTitle.setAttribute("content", newTitle);

            
            

            // If the answer is incorrect, show an error message
            document.getElementById('error-message').style.display = 'none';
            document.getElementById('error-message').textContent = '';
            console.log ('foo');
        } else {
            // If the answer is incorrect, show an error message
            console.log ('nope');
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('error-message').textContent = 'Sorry, that answer is incorrect. Click above for a hint.';
            // If the answer is correct, show the "answer" element
            document.getElementById('answer').style.height = '0';
            document.getElementById('answer').style.opacity = '0';
        }
        });

        const hints = [release_date, runtime, tagline, overview]; // Array of hints
        const hintsCount = hints.length;
        var success = false;
        let currentHint = 0; // Current hint index
        const closeButton = '<span aria-hidden="true"><i class="bi bi-x-circle close hint-exit" aria-label="Close" onclick="hideHint()""></i></span>';

        const hintButton = document.getElementById('hint-button');

        hintButton.addEventListener('click', function() {
            // Your code here
            console.log('Hint clicked!');

            if (numberOfHints < hintsCount){
              numberOfHints = numberOfHints + 1;
            }
            console.log('Number of Hints:' + numberOfHints.toString());
            document.getElementById('hint-count').textContent = numberOfHints.toString();

            const hintElement = document.getElementById('hint');
            hintElement.style.display = 'block'; 

            // Set the hint text to the current hint and increment the counter
            const hintLabels = ['Release Date:', 'Runtime:', 'Tagline:', 'Overview:']; // Array of hint labels
            hintElement.innerHTML = closeButton + '<strong>' + hintLabels[currentHint] + '</strong> ' + hints[currentHint];

            currentHint = (currentHint + 1) % hints.length; // Wrap around to the beginning of the array if necessary

          
        });
        

    })
    .catch(error => {
      console.log(error);
    });

    function hideHint() {
        const hintElement = document.getElementById('hint');
        hintElement.style.display = 'none';
      }


var numberOfHints = 0;
var numberOfGuesses = 0;



//WEB SHARE API
const shareButton = document.querySelector('#share-button');
const imgElement = document.querySelector('#image');

if (navigator.share) {
  shareButton.addEventListener('click', async () => {
    try {
      // Fetch the image file and convert it to a Blob
      const response = await fetch('img/og-img.png');
      const blob = await response.blob();

      // Create a new File object from the Blob
      const file = new File([blob], 'og-img.png', { type: 'image/png' });

      // Share the data including the file
      await navigator.share({
        title: 'MQOTD',
        text: 'MQOTD: Guesses: ' + numberOfGuesses.toString() + ', Hints: ' + numberOfHints.toString(),
        //url: 'https://example.com/web-share-api',
        files: [file],
      });

      console.log('Successful share');
    } catch (error) {
      console.log('Error sharing:', error);
    }
  });
} else {
  // Web Share API is not supported, provide a fallback option
  document.getElementById('share-button').addEventListener('click', function() {
    const textToCopy = 'MQOTD: Guesses: ' + numberOfGuesses.toString() + ', Hints: ' + numberOfHints.toString();
    navigator.clipboard.writeText(textToCopy)
    .then(() => alert('Copied stats to clipboard!'))
    .catch((error) => console.log('Error copying text:', error));
  });
}
