const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors'); 
const app = express();
const port = 5000;

// Middleware
app.use(cors());

// Import Models
const Ingredient = require('./models/ingredientModel');
const Pizza = require('./models/pizzaModel');

// Import Data Synchronization Function
const synchronizeData = require('./setup/setup');

// MongoDB connection URI
const mongoURI = 'mongodb://127.0.0.1:27017/task_nexus';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to MongoDB successfully');
    
    // Run Data Synchronization
    await synchronizeData();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// API Endpoints

// Synchronize data on demand
app.post('/api/synchronize', async (req, res) => {
    try {
      await synchronizeData();
      res.status(200).json({ message: 'Data synchronization completed successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error during data synchronization', error: error.message });
    }
  });
  
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

// Close MongoDB connection on server shutdown
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
