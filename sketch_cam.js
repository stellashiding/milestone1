let classifier;
let video;
let currentEmotion = '';
let previousEmotion = '';
let emotionDetectedTime = 0;

function preload() {
  console.log("Preloading model...");
  // Load the Teachable Machine model
  const modelURL = 'https://teachablemachine.withgoogle.com/models/4tsQGMC31/model.json';
  classifier = ml5.imageClassifier(modelURL, () => {
    console.log("Model loaded successfully!");
  });
}

function setup() {
  console.log("Setting up...");
  createCanvas(640, 480);
  // Create a video capture
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // Hide the video element, and just show the canvas
  // Start classifying the video
  classifyVideo();
}

function draw() {
  image(video, 0, 0); // Draw the video frame to canvas
  // Display the current emotion
  fill(255);
  textSize(24);
  textAlign(CENTER);
  text(currentEmotion, width / 2, height - 20);
}

function classifyVideo() {
  classifier.classify(video)
    .then(results => {
      gotResult(results);
      classifyVideo(); // Classify again
    })
    .catch(error => {
      console.error("Error during classification: ", error);
      classifyVideo(); // Try again in case of error
    });
}

function gotResult(results) {
  console.log("Processing classification result...");

  // Check if results are available
  if (!results || results.length === 0) {
    console.error("No results returned from classifier.");
    return;
  }

  // Get the label with the highest confidence (results[0])
  let label = results[0].label;
  let confidence = results[0].confidence;
  console.log(`Detected emotion: ${label} (${(confidence * 100).toFixed(2)}%)`);

  // Update the current emotion
  currentEmotion = label;

  // Check for negative emotions
  if (label === 'angry' || label === 'sad' || label === 'disgust') {
    // Trigger emotional support if the emotion persists for more than 2 seconds
    if (previousEmotion === label) {
      if (millis() - emotionDetectedTime > 2000) {
        triggerEmotionalSupport(label);
      }
    } else {
      previousEmotion = label;
      emotionDetectedTime = millis();
    }
  } else {
    // Reset if the emotion is not negative
    previousEmotion = '';
    emotionDetectedTime = 0;
  }
}

function triggerEmotionalSupport(emotion) {
  console.log(`Triggering emotional support for emotion: ${emotion}`);
  // Display an alert or any other support mechanism
  alert(`It seems you're feeling ${emotion}. Remember, it's okay to feel this way. Take a deep breath, and know that you're not alone.`);
  // Reset to avoid multiple triggers
  previousEmotion = '';
  emotionDetectedTime = 0;
}
