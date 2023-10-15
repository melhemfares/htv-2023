console.clear();

const express = require('express');
const cors = require('cors');

// Loads environment variables
require('dotenv').config();

// Creates Express server
const app = express();
const port = process.env.PORT || 3000; // Use the provided port or 3000 as a default

// Middleware to allow us to parse JSON
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow session cookies to be sent with requests.
  optionsSuccessStatus: 204
}

app.use(cors(corsOptions));
app.use(express.json());

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Hello, Express.js!');
});

const spotifyRouter = require('./routes/spotify.js')
app.use('/spotify', spotifyRouter)

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});