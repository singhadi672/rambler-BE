const express = require("express");
const Account = require("../Models/account.model");
const Post = require("../Models/post.model");
const router = express.Router();

router.route("/").get(async (req, res) => {
  const { userID } = req;
  try {
    const { following } = await Account.findOne({ user: userID });
    let data = [];
    for (let i = 0; i < following.length; i++) {
      const response = await Post.find({ user: following[i] }).populate(
        "user",
        "username profilePicture"
      );
      data = [...data, ...response];
    }
    data.sort((a, b) => b.createdAt - a.createdAt);
    res.json({ success: true, feed: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
});

module.exports = router;
