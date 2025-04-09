const router = require("express").Router();
const PlantsModel = require("../models/Plants.model")


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