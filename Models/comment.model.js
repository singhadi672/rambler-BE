const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postID: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    commentText: String,
    commentOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
