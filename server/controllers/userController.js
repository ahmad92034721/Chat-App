const router = require("express").Router();
const User = require("../models/user");
const authMiddleware = require("../middlewares/authMiddleware");
const cloudinary = require("../cloudinary");
router.get("/get-logged-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    res.send({
      message: "user fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).send({ message: error.message, success: true });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } });
    res.send({
      message: "users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(400).send({ message: error.message, success: true, data: [] });
  }
});

router.post("/upload-profile-pic", authMiddleware, async (req, res) => {
  try {
    const image = req.body.image;
    console.log("CLOUDINARY CONFIG:");
    console.log(cloudinary.config());
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "chat-app",
      resource_type: "image",
    });
    const user = await User.findByIdAndUpdate(
      { _id: req.userId },
      { profilePicture: uploadedImage.secure_url },
      { new: true },
    );
    res.status(201).send({
      message: "image uploaded successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    res.status(401).send({ message: error.message, success: false });
  }
});

module.exports = router;
