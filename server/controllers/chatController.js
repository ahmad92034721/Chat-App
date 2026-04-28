const router = require('express').Router();
const Chat = require('../models/chat');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create-new-chat', authMiddleware, async (req, res) => {
  try {
    const chat = new Chat(req.body);
    const savedChat = await chat.save();
    res.status(201).send({message: 'Chat created successfully', success: true, data: savedChat})
  }
  catch(error)
  {
    res.status(400).send({message: error.message, success: false})
  }
})
router.get('/get-all-chats', authMiddleware, async (req, res) => {
  try {
   const chats = await Chat.find({members: {$in : req.userId}}).populate('members').sort({updatedAt: -1});
    res.status(200).send({message: 'Chats fetched successfully', success: true, data: chats})
  }
  catch(error)
  {
    res.status(400).send({message: error.message, success: false})
  }
})

module.exports = router;