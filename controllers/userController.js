const router = require("express").Router();
const User = require("../models/user");
const authMiddleware = require('../middlewares/authMiddleware');
router.get('/get-logged-user', authMiddleware, async (req, res) =>{
  try {
    const user = await User.findOne({_id: req.userId});
    res.send({message: 'user fetched successfully', success: true, data: user});
  }
  catch(error) {
    res.status(400).send({message: error.message, success: true})
  }
})

router.get('/get-all-users', authMiddleware, async (req, res) => {
  try{
    const users = await User.find({_id: {$ne: req.userId}});
    res.send({message: 'users fetched successfully', success: true, data: users});
  }
  catch(error)
  {
    res.status(400).send({message: error.message, success: true})
  }
})

module.exports = router;