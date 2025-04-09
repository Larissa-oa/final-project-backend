const router = require ("express").Router();
const ForumModel = require ("../models/Forum.model");

//******************CREATE A FORUM TOPIC******************

router.post("/create-topic", async (req,res) =>{
    try{

       const createdTopic = await ForumModel.create(req.body) 
        console.log("Topic created!", createdTopic)
        res.status(201).json(createdTopic);
       }
    catch(error){
        console.log(error);
        res.status(500).json({errorMessage: "Having problems creating a."});
       };
    });


//******************GET ALL FORUM TOPICS******************

router.get("/all-topics", async (req, res)=>{
    try{
        const allTopics = await ForumModel.find()
        .populate("author")
        console.log("Here are all the topics")
        res.status(202).json(allTopics)
    }
    catch(error){
        console.log(error);
        res.status(500).json({errorMessage: "Having problems getting all topics of the forum."});
       };
})


//******************GET TOPICS BY ID******************

router.get("/the-topic/:topicId", async (req, res) =>{
    const {topicId} = req.params;
    try{
        const selectedTopic = await ForumModel.findById(topicId)
        .populate("author")
        console.log(selectedTopic);
        res.status(202).json(selectedTopic)
    }
    catch(error){
        res.status(500).json({errorMessage:"Having problems to show that topic!"})
    }
})


//******************UPDATE TOPIC******************

router.patch("/edit-topic/:topicId", async (req,res)=>{
    const {topicId} = req.params;
    try{
        const updatedTopic = await ForumModel.findByIdAndUpdate(
            topicId,
            req.body,
            {new:true}
        )
        .populate("author")
        console.log("Topic updated", updatedTopic)
        res.status(200).json(updatedTopic)
    }
    catch (error){
        console.log(error);
        res.status(500).json({errorMessage: "Problems updating the chosen topic"})
    }
})


//******************DELETE TOPIC******************

router.delete("/delete-topic/:topicId", async (req,res)=>{
    const {topicId} = req.params;
    try{
        const deletedTopic = await ForumModel.findByIdAndDelete(topicId)
        res.status(200).json("Successful deleted:", deletedTopic)
    }
    catch (error){
        console.log(error);
        res.status(500).json({errorMessage: "Problems deleting the chosen topic"})
    }
})
module.exports = router;