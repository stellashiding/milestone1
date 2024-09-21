let classifier;
let imageIndex = 0;
let imageURLs = []; // This will hold the image URLs fetched from the server
let successCount = 0; // Count how many images are classified as frustration
let failureCount = 0; // Count how many images are classified as neutral or happy

function preload() {
  console.log("Preloading model...");
  // Load the Teachable Machine model
  const modelURL = 'https://teachablemachine.withgoogle.com/models/4tsQGMC31/model.json';
  classifier = ml5.imageClassifier(modelURL, () => {
    console.log("Model loaded successfully!");
    // Fetch image URLs from the server after the model is loaded
    fetchImageURLs();
  });
}

function fetchImageURLs() {
  console.log("Fetching image URLs from the server...");
  fetch('/images-list') // Fetch the list of images from the '/images-list' endpoint
    .then(response => response.json())
    .then(data => {
      imageURLs = data.map(file => '/images/' + file); // Prefix each image filename with '/images/'
      console.log("Image URLs fetched: ", imageURLs);
      // Start classifying images
      classifyNextImage();
    })
    .catch(error => {
      console.error("Error fetching image URLs: ", error);
    });
}

function setup() {
  console.log("Setting up...");
  noCanvas();
}

function classifyNextImage() {
  if (imageIndex < imageURLs.length) {
    let currentImage = imageURLs[imageIndex];
    console.log("Classifying next image: " + currentImage);

    // Load the image
    loadImage(currentImage, img => {
      console.log("Image loaded: " + currentImage);
      // Classify the loaded image
      classifier.classify(img)
        .then(results => {
          console.log("Image classification completed for: " + currentImage);
          gotResult(results, currentImage);
        })
        .catch(error => {
          console.error("Error during classification: ", error);
        });
    });
  } else {
    // If all images are classified, calculate and display the success rate
    displaySuccessRate();
  }
}

function gotResult(results, currentImage) {
  console.log("Processing classification result...");

  // Check if results are available
  if (!results || results.length === 0) {
    console.error("No results returned for image: " + currentImage);
    return;
  }

  // Log the full results array to inspect
  console.log("Results for image " + currentImage + ": ", results);

  // Get the label with the highest confidence (results[0])
  let label = results[0].label;
  console.log('Highest confidence label: ' + label);

  // Determine if the label belongs to frustration (angry, sad, or disgust)
  if (label === 'angry' || label === 'sad' || label === 'disgust') {
    console.log('Output: frustration');
    successCount++; // Increment success count
  } else if (label === 'neutral' || label === 'happy') {
    console.log('Output: failure');
    failureCount++; // Increment failure count
  }

  // Move to the next image
  imageIndex++;
  console.log("Moving to the next image...");
  classifyNextImage();
}

// Function to calculate and display the success rate
function displaySuccessRate() {
  const totalImages = successCount + failureCount;
  const successRate = (successCount / totalImages) * 100;

  console.log(`Test completed.`);
  console.log(`Total Images: ${totalImages}`);
  console.log(`Successful Classifications (Frustration): ${successCount}`);
  console.log(`Failed Classifications: ${failureCount}`);
  console.log(`Success Rate: ${successRate.toFixed(2)}%`);
}
