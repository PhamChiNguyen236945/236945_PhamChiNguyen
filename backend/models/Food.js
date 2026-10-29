const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    foodId: {
      type: String,
      required: [true, "foodId is required"],
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "category is required"],
      trim: true,
    },

    cuisine: {
      type: String,
      required: [true, "cuisine is required"],
      trim: true,
    },

    ingredients: {
      type: [String],
      required: [true, "ingredients is required"],
      default: [],
    },

    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price must be greater than or equal to 0"],
    },

    quantity: {
      type: Number,
      required: [true, "quantity is required"],
      min: [0, "quantity must be greater than or equal to 0"],
    },

    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },

    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Food", foodSchema);
