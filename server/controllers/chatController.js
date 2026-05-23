const router = require("express").Router();
const Chat = require("../models/chat");
const authMiddleware = require("../middlewares/authMiddleware");
const Message = require("../models/message")
router.post("/create-new-chat", authMiddleware, async (req, res) => {
  try {
    const chat = new Chat(req.body);
    const savedChat = await chat.save();
    await savedChat.populate('members');
    res
      .status(201)
      .send({
        message: "Chat created successfully",
        success: true,
        data: savedChat,
      });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});
router.get("/get-all-chats", authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ members: { $in: req.userId } })
      .populate("members")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });
    res
      .status(200)
      .send({
        message: "Chats fetched successfully",
        success: true,
        data: chats,
      });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

router.post("/clear-unread-message", authMiddleware, async (req, res) => {
  try {
    const chatId = req.body.chatId;
    let updatedChat = await Chat.findByIdAndUpdate(chatId, {unreadMessageCount: 0}, {new: true}).populate('members').populate('lastMessage');
    if(!updatedChat)
    {
      res.send({
        message: 'Chat not found with given id',
        success: false
      })
    }
    await Message.updateMany({chatId: chatId, read: false}, {read: true});
    res.status(200).send({
      message: "Unread messages cleared successfully",
      success: true,
      data: updatedChat
    })
  } catch (error) {
    res.send({ message: error.message, success: false });
  }
});

module.exports = router;
