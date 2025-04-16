const router = require("express").Router();
const PlantsModel = require("../models/Plants.model")
const mongoose = require('mongoose');

//*********************GET PLANT BY  ID***************************/

router.get("/type/:plantId", async (req, res) => {
    const { plantId } = req.params;
    try {
        const selectedPlant = await PlantsModel.findById(plantId);
        
        if (!selectedPlant) {
            return res.status(404).json({ errorMessage: "Plant not found!" });
        }
        console.log(selectedPlant);
        res.status(200).json(selectedPlant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ errorMessage: "Having problems to show that plant!" });
    }
});



//**********************GETTING ALL PLANTS***********************/
router.get("/all-plants", async (req, res) =>{
    try{
        const allPlants = await PlantsModel.find()
        console.log(allPlants)
        res.status(200).json(allPlants)
    }
    catch(error){
        console.log(error)
        res.status(500).json({errorMessage: "Problems getting all the plants"})
    }
})

//******************CREATE A PLANT******************

router.post("/create-plant", async (req,res) =>{
    try{
       const createdPlant = await PlantsModel.create(req.body)
        console.log("Topic created!", createdPlant)
        res.status(201).json(createdPlant);
       }
    catch(error){
        console.log(error);
        res.status(500).json({errorMessage: "Having problems creating a plant."});
       };
    });


//******************DELETE PLANT******************

router.delete("/delete-plant/:plantId", async (req,res)=>{
    const {plantId} = req.params;
    try{
        const deletedPlant = await PlantsModel.findByIdAndDelete(plantId)
        res.status(200).json("Successful deleted:", deletedPlant)
    }
    catch (error){
        console.log(error);
        res.status(500).json({errorMessage: "Problems deleting the chosen plant"})
    }
})
module.exports = router; 