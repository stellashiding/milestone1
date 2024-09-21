const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the CORS middleware

const app = express();
const imagesDir = path.join(__dirname, 'images');

// Enable CORS for all routes
app.use(cors());

// Serve static files (images, HTML, etc.)
app.use(express.static(__dirname));

// Endpoint to get the list of images in the 'images' directory
app.get('/images-list', (req, res) => {
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory');
    }

    // Filter image files (.jpg, .png)
    const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
    res.json(imageFiles); // Send the list of image filenames as JSON
  });
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
