const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use the provided port or 3000 as a default

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Hello, Express.js!');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});