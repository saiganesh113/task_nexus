const mongoose = require('mongoose');
const ingredientData = require('../setup/data/ingredients');
const pizzaData = require('../setup/data/pizzas');

// Database connection URI
const MONGO_URI = 'mongodb://localhost:27017/pizzaDatabase'; // Replace with your database URI

// Ingredient Schema
const IngredientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  quantity: { type: Number, default: 0 }, // Default quantity
});

// Pizza Schema
const PizzaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['veg', 'nonveg'], required: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
  ingredients: [{ type: String }], // Store raw ingredient names for simplicity
  toppings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }], // References to Ingredient model
});

// Models
const Ingredient = mongoose.model('Ingredient', IngredientSchema);
const Pizza = mongoose.model('Pizza', PizzaSchema);

const synchronizeData = async () => {
  try {
    // Connect to the database
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to the database');

    // Check for missing ingredients
    const existingIngredientIds = (await Ingredient.find({}, { id: 1 })).map((doc) => doc.id);
    const missingIngredients = ingredientData.filter((ingredient) => !existingIngredientIds.includes(ingredient.id.toString()));

    for (const ingredient of missingIngredients) {
      const transformedIngredient = {
        id: ingredient.id.toString(),
        name: ingredient.tname,
        price: ingredient.price,
        image: ingredient.image,
        quantity: ingredient.quantity || 0,
      };

      await Ingredient.create(transformedIngredient);
      console.log(`Added missing ingredient: ${transformedIngredient.name}`);
    }

    // Check for missing pizzas
    const existingPizzaIds = (await Pizza.find({}, { id: 1 })).map((doc) => doc.id);
    const missingPizzas = pizzaData.filter((pizza) => !existingPizzaIds.includes(pizza.id.toString()));

    for (const pizza of missingPizzas) {
      const toppingIds = [];
      for (const toppingName of pizza.topping) {
        const topping = await Ingredient.findOne({ name: toppingName });
        if (topping) {
          toppingIds.push(topping._id);
        } else {
          console.warn(`Topping not found in ingredients: ${toppingName}`);
        }
      }

      const transformedPizza = {
        id: pizza.id.toString(),
        name: pizza.name,
        type: pizza.type,
        price: pizza.price,
        image: pizza.image,
        description: pizza.description,
        ingredients: pizza.ingredients,
        toppings: toppingIds,
      };

      await Pizza.create(transformedPizza);
      console.log(`Added missing pizza: ${transformedPizza.name}`);
    }

    console.log('Data synchronization complete');
  } catch (error) {
    console.error('Error during data synchronization:', error.message);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the synchronization
synchronizeData();
