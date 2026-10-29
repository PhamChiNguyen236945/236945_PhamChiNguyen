const express = require("express");
const mongoose = require("mongoose");
const Food = require("../models/Food");

const router = express.Router();

function validateFood(data, isUpdate = false) {
  const requiredFields = [
    "foodId",
    "name",
    "category",
    "cuisine",
    "ingredients",
    "price",
    "quantity",
    "description",
  ];

  if (!isUpdate) {
    for (const field of requiredFields) {
      if (
        data[field] === undefined ||
        data[field] === null ||
        data[field] === ""
      ) {
        return `${field} is required`;
      }
    }
  }

  if (data.ingredients !== undefined && !Array.isArray(data.ingredients)) {
    return "ingredients must be an array";
  }

  if (
    data.price !== undefined &&
    (typeof data.price !== "number" || data.price < 0)
  ) {
    return "price must be a non-negative number";
  }

  if (
    data.quantity !== undefined &&
    (typeof data.quantity !== "number" || data.quantity < 0)
  ) {
    return "quantity must be a non-negative number";
  }

  return null;
}

async function findFoodById(id) {
  if (mongoose.isValidObjectId(id)) {
    const food = await Food.findById(id);
    if (food) return food;
  }

  return Food.findOne({ foodId: id });
}

// GET /api/foods
// GET /api/foods?search=pho
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search && search.trim()) {
      const keyword = search.trim();

      filter = {
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { category: { $regex: keyword, $options: "i" } },
          { cuisine: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    const foods = await Food.find(filter).sort({ createdAt: -1 });

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({
      message: "Cannot get foods",
      error: error.message,
    });
  }
});

// GET /api/foods/:id
router.get("/:id", async (req, res) => {
  try {
    const food = await findFoodById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({
      message: "Cannot get food",
      error: error.message,
    });
  }
});

// POST /api/foods
router.post("/", async (req, res) => {
  try {
    const validationError = validateFood(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const existingFood = await Food.findOne({
      foodId: req.body.foodId,
    });

    if (existingFood) {
      return res.status(409).json({
        message: "foodId already exists",
      });
    }

    const food = await Food.create(req.body);

    res.status(201).json(food);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "foodId already exists",
      });
    }

    res.status(500).json({
      message: "Cannot create food",
      error: error.message,
    });
  }
});

// PUT /api/foods/:id
router.put("/:id", async (req, res) => {
  try {
    const validationError = validateFood(req.body, true);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const currentFood = await findFoodById(req.params.id);

    if (!currentFood) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    if (req.body.foodId && req.body.foodId !== currentFood.foodId) {
      const duplicate = await Food.findOne({
        foodId: req.body.foodId,
        _id: { $ne: currentFood._id },
      });

      if (duplicate) {
        return res.status(409).json({
          message: "foodId already exists",
        });
      }
    }

    Object.assign(currentFood, req.body);

    const updatedFood = await currentFood.save();

    res.status(200).json(updatedFood);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "foodId already exists",
      });
    }

    res.status(500).json({
      message: "Cannot update food",
      error: error.message,
    });
  }
});

// DELETE /api/foods/:id
router.delete("/:id", async (req, res) => {
  try {
    const food = await findFoodById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    await Food.findByIdAndDelete(food._id);

    res.status(200).json({
      message: "Food deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot delete food",
      error: error.message,
    });
  }
});

module.exports = router;
