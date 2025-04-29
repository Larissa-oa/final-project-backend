const router = require("express").Router()
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const UserModel = require("../models/User.model")
const {isAuthenticated} = require("../middlewares/jwt.middleware")
const PlantModel = require("../models/Plants.model");
const MushroomModel = require("../models/Mushrooms.model");
const FavoritesModel = require("../models/Favorites.model");
const ForumModel = require ("../models/Forum.model");
const axios = require("axios");

router.post("/signup", async (req, res) => {
    const salt = bcryptjs.genSaltSync(12);
    const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
    const hashedUser = {
        ...req.body,
        password: hashedPassword,
    };

    UserModel.create(hashedUser)
        .then((newUser) => {
            console.log("User created!! Yay!");
            res.status(201).json({ message: "User created!! Yay!" });
        })
        .catch((error) => {
            console.log("Something went wrong", error);
            res.status(500).json(error);
        });
})


router.post("/login", async (req, res) => {
    try {
        const foundUser = await UserModel.findOne({email: req.body.email})
        console.log(foundUser)
        if(!foundUser) {
            res.status(400).json({error: "User does not exist"})
        } else {
            const frontendPassword = req.body.password
            const passwordHashedInDB = foundUser.password
            const passwordMatch = bcryptjs.compareSync(
                frontendPassword,
                passwordHashedInDB
            )

            if(!passwordMatch) {
                res.status(400).json({error: "Password does not match"})
            } else {
                const data = {_id: foundUser._id, username: foundUser.username}
                const authToken = jwt.sign(data, process.env.TOKEN_SECRET, {
                    //check the implementation of algorithm     algorithm: "H2S56",
                    expiresIn: "12h"
                })
                res.status(200).json({message: "successfully logged in", authToken})
            }
        }
    }
    catch(error){
        res.status(500).json(error)
    }
})


router.get("/profile/:userId", (req, res) => {
    UserModel.findById(req.params.userId)
    .then(currentUser => {
        const userCopy = currentUser 
        userCopy.password = null 

        res.status(200).json(userCopy)
    })
    .catch( error => {
        res.status(500).json(error)
    })
})

router.get("/verify", isAuthenticated, async (req, res) => {
    try {
      const user = await UserModel.findById(req.payload._id).select("username email profileImage");
      res.status(200).json({ payload: user });
    } catch (err) {
      res.status(500).json({ message: "User verification failed." });
    }
  });
   

  const modelMap = {
    Plant: PlantModel,
    Mushroom: MushroomModel,
    Forum: ForumModel,
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
  
  /*GET FAVORITES*/
  router.get("/user-favorites", isAuthenticated, async (req, res) => {
    try {
      const userId = req.payload._id;
      const favorites = await FavoritesModel.find({ user_id: userId });
  
      const populatedFavorites = await Promise.all(
        favorites.map(async (fav) => {
          const { itemType } = fav;
  
          if (!itemType || !modelMap[itemType]) {
            console.warn(`Skipping favorite with unknown itemType: ${itemType}`, fav);
            return null;
          }
  
          const Model = modelMap[itemType];
          const item = await Model.findById(fav.item);
          if (!item) return null;
  
          return {
            _id: fav._id,
            itemType,
            item: {
              ...item.toObject(),
              type: itemType,     
            },
          };
        })
      );
  
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

  //location search 

 
module.exports = router 