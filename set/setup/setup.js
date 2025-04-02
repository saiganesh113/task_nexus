const mongoose = require("mongoose");
const Ingredient = require("../models/ingredientModel");
const Pizza = require("../models/pizzaModel");
const ingredientData = require("../setup/data/ingredients");
const pizzaData = require("../setup/data/pizzas");

const synchronizeData = async () => {
  try {
    console.log("Starting data synchronization...");

    // **1. Synchronize Ingredients**
    const existingIngredients = await Ingredient.find({}, { id: 1 });
    const existingIngredientIds = existingIngredients.map((doc) => doc.id);

    for (const ingredient of ingredientData) {
      if (!existingIngredientIds.includes(ingredient.id)) {
        await Ingredient.create(ingredient);
        console.log(`Added ingredient: ${ingredient.tname}`);
      }
    }

    // **2. Synchronize Pizzas**
    const existingPizzas = await Pizza.find({}, { id: 1 });
    const existingPizzaIds = existingPizzas.map((doc) => doc.id);

    for (const pizza of pizzaData) {
      if (!existingPizzaIds.includes(pizza.id)) {
        if (!Array.isArray(pizza.topping)) {
          console.error(`Skipping pizza ${pizza.name}: Invalid toppings format`);
          continue;
        }

        const toppingIds = [];
        for (const toppingName of pizza.topping) {
          const topping = await Ingredient.findOne({ tname: toppingName });
          if (topping) {
            toppingIds.push(topping._id);
          } else {
            console.warn(`Topping not found: ${toppingName}`);
          }
        }

        const newPizza = {
          ...pizza,
          toppings: toppingIds,
        };

        await Pizza.create(newPizza);
        console.log(`Added pizza: ${newPizza.name}`);
      }
    }

    console.log("Data synchronization complete.");
  } catch (error) {
    console.error("Error during data synchronization:", error.message);
  }
};

module.exports = synchronizeData;
