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

// Function to hide all story divs
function hideAllStories() {
  const stories = document.querySelectorAll(".story_book");
  stories.forEach((story) => (story.style.display = "none"));
}

// Function to show the selected story
function showStory(storyId) {
  hideAllStories(); // Hide all stories first
  const story = document.getElementById(storyId);
  if (story) {
    story.style.display = "block"; // Show the selected story
  }
}

// Add event listeners to links
document.querySelectorAll(".story-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default link behavior

    // Print to the console to detect click
    console.log("Link clicked:", this.getAttribute("data-target"));

    const targetStory = this.getAttribute("data-target");
    showStory(targetStory);
  });
});


/*
//RSS Feed
const feedUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://mmacfadden.substack.com/feed?t=1699981800`;


async function fetchLatestPost() {
  try {
    const response = await fetch(feedUrl);
    const data = await response.json();

    // Check if data has items and get the first item
    const latestItem = data.items && data.items[0];
    if (latestItem) {
      const title = latestItem.title;
      const link = latestItem.link;
      const pubDate = new Date(latestItem.pubDate);
      const formattedDate = pubDate.toLocaleDateString();
      const subtitle = latestItem.description; // Subtitle/description of the post
      const content = latestItem.content; // Full HTML content of the post

      // Update HTML with the latest post details
      document.getElementById('latest-post').innerHTML = `
        <h3><a href="${link}" target="_blank">${title}</a></h3>
        <p><strong>${subtitle}</strong></p> <!-- Display the subtitle -->
        <p>Published on: ${formattedDate}</p>
        <div>${content}</div> <!-- Display the full content -->
      `;
    } else {
      document.getElementById('latest-post').textContent = 'No posts available.';
    }
  } catch (error) {
    document.getElementById('latest-post').textContent = 'Failed to load the latest post.';
    console.error('Error fetching the RSS feed:', error);
  }
}

fetchLatestPost();
*/

// Redirects: Create an object with old paths as keys and new paths as values
const redirects = {
  "/mark-more.html": "/markmore.php",
  "/templates/": "/templates.html",
  "/Templates/": "/templates.html",
  "/Templates": "/templates.html",
  "/templates": "/templates.html",
  "/mark-more": "/markmore.html",
  "/about/": "/about.html",
  "/periodic-square/": "/periodic-square.html",
  "/2018/01/25/project-based-grading/": "https://mmacfadden.substack.com/p/project-based-grading",
  "/windsor" : "https://windsorgreetings.com",
  "/windsor/" : "https://windsorgreetings.com",
  "/windsor/index.html" : "https://windsorgreetings.com",
};

// Get the current path and search parameters
const currentPath = window.location.pathname;
const queryParams = window.location.search;

// Check if the current path exists in the redirects object
if (redirects[currentPath]) {
  // Redirect to the new URL and include the query parameters
  window.location.href = redirects[currentPath] + queryParams;
}

const feedUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://mmacfadden.substack.com/feed&t=1699981800`;

async function fetchLatestPosts() {
  try {
    const response = await fetch(feedUrl);
    const data = await response.json();

    // Get up to three items from the feed
    const latestItems = (data.items || []).slice(0, 3);

    if (latestItems.length > 0) {
      const postsHTML = latestItems.map(item => {
        // Assuming the first image in the content is the featured image
        const imageUrlMatch = item.content.match(/<img src="([^"]+)"/);
        const imageUrl = imageUrlMatch ? imageUrlMatch[1] : ''; // Default to empty if no image found

        // Extract title and subtitle (assuming subtitle is in the description)
        const title = item.title;
        const subtitle = item.description || 'No Subtitle Provided';

        return `
          <div class="post col-md-4">
            <a href="${item.link}" class="link_with_image" target="_blank">
              <div class="post_image_wrapper">
                ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="featured-image">` : ''}
              </div>
              <div class="post_meta_data">
                <h3>${title}</h3>
                <p><strong>${subtitle}</strong></p>
              </div>
            </a>
          </div>
        `;
      }).join('');

      // Update HTML with the latest posts details
      document.getElementById('latest-posts').innerHTML = postsHTML;
    } else {
      document.getElementById('latest-posts').textContent = 'No posts available.';
    }
  } catch (error) {
    document.getElementById('latest-posts').textContent = 'Failed to load the latest posts.';
    console.error('Error fetching the RSS feed:', error);
  }
}

fetchLatestPosts();