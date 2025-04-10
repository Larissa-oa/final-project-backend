const router = require("express").Router();
const MushroomModel = require("../models/Mushrooms.model")


//**********************GETTING ALL PLANTS***********************/
router.get("/all-mush", async (req, res) =>{
    try{
        const allMushroom = await MushroomModel.find()
        console.log(allMushroom)
        res.status(200).json(allMushroom)
    }
    catch(error){
        console.log(error)
        res.status(500).json({errorMessage: "Problems getting all the plants"})
    }
})

//******************CREATE A PLANT******************

router.post("/create-mush", async (req,res) =>{
    try{
       const createdMush = await MushroomModel.create(req.body)
        console.log("Topic created!", createdMush)
        res.status(201).json(createdMush);
       }
    catch(error){
        console.log(error);
        res.status(500).json({errorMessage: "Having problems creating a plant."});
       };
    });


//******************DELETE PLANT******************

router.delete("/delete-mush/:mushId", async (req,res)=>{
    const {mushId} = req.params;
    try{
        const deletedMush = await MushroomModel.findByIdAndDelete(mushId)
        res.status(200).json("Successful deleted:", deletedMush)
    }
    catch (error){
        console.log(error);
        res.status(500).json({errorMessage: "Problems deleting the chosen mushroom"})
    }
})
module.exports = router;