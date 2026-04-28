const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // check if user exist
    if (user) {
      return res.status(400).send({ message: "User already exists", success: false });
    }
    // encrypt password before saving in database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    // create new user and save it in the database
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send({ message: "User created successfully!", success: true });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

router.post("/login", async (req, res) => {
  try{
    const user = await User.findOne({ email: req.body.email }).select("+password");
    if (!user) {
      return res.status(400).send({ message: "User doesn't exist", success: false });
    }
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(400).send({ message: "password is not correct", success: false });
    }
    const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "1d"});
    return res.send({ message: "User logged-in successfully", success: true, token: token});
  }catch(error)
  {
    res.status(400).send({ message: error.message, success: false });
  }
});

module.exports = router;
