const express = require("express");
const User = require("../Models/user.model");
const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    const { userID } = req;
    const response = await User.findById(userID).select(
      "username profilePicture"
    );
    res.status(200).json({ success: true, user: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
});

router.route("/all").get(async (req, res) => {
  const { userID } = req;
  const response = await User.find({ _id: { $ne: userID } });
  res.status(200).json({ success: true, users: response });
});

module.exports = router;
