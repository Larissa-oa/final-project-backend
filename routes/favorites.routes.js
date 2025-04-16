const mongoose = require("mongoose");
const FavoritesModel = require("../models/Favorites.model");
const PlantModel = require("../models/Plants.model");
const MushroomModel = require("../models/Mushrooms.model");
const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// Map itemType to the correct model
const modelMap = {
  Plant: PlantModel,
  Mushroom: MushroomModel,
};

router.post("/adding", isAuthenticated, async (req, res) => {
  try {
    const { item, itemType } = req.body;
    const { _id: user_id } = req.payload;

    const favorite = new FavoritesModel({
      item,
      itemType,
      user_id,
    });

    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Problems creating a favorite." });
  }
});

router.get("/user-favorites", isAuthenticated, async (req, res) => {
  try {
    const userId = req.payload._id;

    const favorites = await FavoritesModel.find({ user_id: userId });
console.log("Fetched favorites:", favorites); // 👈 Add this line
const populatedFavorites = await Promise.all(
    favorites.map(async (fav) => {
      const { itemType } = fav;
  
      if (!itemType || !modelMap[itemType]) {
        console.warn(`Skipping favorite with unknown itemType: ${itemType}`, fav);
        return null; // 👈 skip it
      }
  
      const Model = modelMap[itemType];
      const item = await Model.findById(fav.item);
  
      return {
        _id: fav._id,
        itemType,
        item,
      };
    })
  );
  
  // Filter out nulls
  const cleanFavorites = populatedFavorites.filter(Boolean);
  res.status(200).json(cleanFavorites);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Could not fetch favorites" });
  }
});

router.delete("/remove/:favId", isAuthenticated, async (req, res) => {
  try {
    const { favId } = req.params;
    const userId = req.payload._id;

    const deleted = await FavoritesModel.findOneAndDelete({
      _id: favId,
      user_id: userId,
    });

    if (!deleted) {
      return res.status(400).json({ message: "Favorite not found." });
    }

    res.status(200).json({ message: "Favorite removed." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Error removing favorite." });
  }
});

module.exports = router;
