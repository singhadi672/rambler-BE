const express = require("express");
const Comment = require("../Models/comment.model");
const router = express.Router();

router.param("postId", async (req, res, next, postId) => {
  try {
    const post = await Comment.find({ postID: postId })
      .populate("commentOwner", "username profilePicture")
      .sort({ createdAt: "desc" });
    req.post = post;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
});

router.route("/:postId").get(async (req, res) => {
  const { post } = req;
  res.status(200).json({ success: true, comments: post });
});

module.exports = router;
