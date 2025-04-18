const router = require ("express").Router();
const ForumModel = require ("../models/Forum.model");
const uploader = require ("../middlewares/cloudinary.middleware");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
//******************CREATE A FORUM TOPIC******************

router.post("/create-topic", uploader.single("imageUrl"), async (req,res) =>{
    try{

       const createdTopic = await (await ForumModel.create({...req.body, image:req.file.path})).populate("author")
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
        res.status(200).json({allTopics})
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
        .populate("author").populate({path:"reply", populate:{path:"owner", model:"User"}})
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

//comments routes 

//post 
router.post("/:id/reply", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { text } = req.body; 
    const owner = req.payload._id
    const comment = {
      text,
      owner, 
      createdAt: new Date(),
    };
  
    try {
      const updatedForum = await ForumModel.findByIdAndUpdate(
        id,
        { $push: { reply: comment } },
        { new: true }
      ).populate("reply.owner", "username profileImage _id");
  
      res.status(201).json({
        message: "Comment posted! Yay!",
        updatedForum,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add comment" });
    }
  });

  //delete
  router.delete("/:topicId/delete-reply/:replyId", async (req, res) => {
    const { topicId, replyId } = req.params;
    try {
        const updatedForum = await ForumModel.findByIdAndUpdate(
            topicId,
            { $pull: { reply: { _id: replyId } } },
            { new: true }
        ).populate("reply.owner", "username profileImage _id");

        res.status(200).json({
            message: "Reply deleted successfully!",
            updatedForum,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errorMessage: "Error deleting reply." });
    }
});

module.exports = router;