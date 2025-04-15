// /routes/message.routes.js
const express = require("express");
const router = express.Router();
const MessageModel = require("../models/Message.model");
const UserModel = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// Create a message
router.post("/post", isAuthenticated, async (req, res) => {
  try {
    const { recipient_id, message_body } = req.body;
    const sender_id = req.payload._id; 

    const message = new MessageModel({
      sender_id,
      recipient_id,
      message_body,
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(400).json({ error: "Error sending message", details: error });
  }
});

// Get all messages 
router.get("/inbox", isAuthenticated, async (req, res) => {
  try {
    const userId = req.payload._id;

    const messages = await MessageModel.find({ recipient_id: userId }).populate(
      "sender_id",
      "username profileImage"
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching inbox:", error);
    res.status(400).json({ error: "Error fetching messages", details: error });
  }
});

// Delete a message
router.delete("/delete/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.payload._id;

  try {
    const message = await MessageModel.findById(id);

    if (!message) {
      return res.status(404).json({ errorMessage: "Message not found" });
    }

    await MessageModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Message successfully deleted", messageId: id });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ errorMessage: "Problems deleting the message", details: error });
  }
});

module.exports = router;
