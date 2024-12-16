const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Enable CORS

// Import your Mongoose models
const Ingredient = require('./models/ingredientModel');
const Pizza = require('./models/pizzaModel');

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/pizzaDatabase'; // Replace with your database name

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit if connection fails
  });

// Define API endpoints

// Get all ingredients
app.get('/api/ingredients', async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ingredients', error: err });
  }
});

// Get all pizzas
app.get('/api/pizzas', async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pizzas', error: err });
  }
});

// Close the MongoDB connection when server shuts down
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
