const router = require ("express").Router();
const TypeModel = require ("../models/Type.model");

//******************CREATE A PLANT******************
router.post("/create-type", async(req,res)=>{
    try{
        const createdPlant = await TypeModel.create(req.body)
        //console.log(createdPlant)
        res.status(201).json(createdPlant)
    }
    catch(error){
        console.log(error)
        res.status(500).json({errorMessage: "Problems creating a new type."})
    }
})
//**********************GETTING ALL TYPES OF***********************/
router.get("/all-types", async (req,res) =>{
    try{
        const allTypes = await TypeModel.find()
        //console.log(allTypes)
        res.status(200).json(allTypes)
    }
    catch(error){
        console.log(error)
        res.status(500).json({errorMessage: "Problems getting all the types"})
    }
})


module.exports = router;