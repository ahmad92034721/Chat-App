const router = require("express").Router();
const Chat = require("../models/chat");
const Message = require("../models/message");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/new-message", authMiddleware, async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    const currentChat = await Chat.findOneAndUpdate(
      { _id: req.body.chatId },
      { lastMessage: savedMessage._id, $inc: { unreadMessageCount: 1 } },
    );
    res
      .status(201)
      .send({
        message: "Message sent successfully",
        success: true,
        data: savedMessage,
      });
  } catch (error) {
    res.status(400).send({message :error.Message, success: false});
  }
});

router.get("/get-all-messages/:chatId", authMiddleware, async (req, res) => {
  try {
    const chatMessages = await Message.find({ chatId: req.params.chatId }).sort({createdAt: 1});
    res.status(200).send({
      message: "Messages fetched successfully",
      success: true,
      data: chatMessages
    })
  } catch (error) {
    res.status(400).send({message: error.message, success: false});
  }
});
module.exports = router;
