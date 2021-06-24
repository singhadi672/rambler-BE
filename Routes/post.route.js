const express = require("express");
const { extend } = require("lodash");
const Post = require("../Models/post.model");
const Account = require("../Models/account.model");
const Comment = require("../Models/comment.model");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const Notification = require("../Models/notification.model");
const cloudinaryCloudName = process.env.cloudinaryCloudName;
const cloudinaryAPIKey = process.env.cloudinaryAPIKey;
const cloudinaryAPISecret = process.env.cloudinaryAPISecret;

router.route("/new").post(async (req, res) => {
  const { postType, postDescription, postData } = req.body;
  let tempPostData = "";
  try {
    if (postType === "image") {
      cloudinary.config({
        cloud_name: cloudinaryCloudName,
        api_key: cloudinaryAPIKey,
        api_secret: cloudinaryAPISecret,
      });
      const filepath = req.files.postData;
      const result = await cloudinary.uploader.upload(
        filepath.tempFilePath,
        (err, result) => {
          return result;
        }
      );

      tempPostData = result.secure_url;
    }
    const { userID } = req;
    let { account } = req;
    const postDesc = postType === "text" ? null : postDescription;

    const newPost = await new Post({
      postType,
      postData: postType === "text" ? postData : tempPostData,
      postDescription: postDesc,
      user: userID,
    });

    const { followers } = await Account.findOne({ user: userID });
    if (followers.length > 0) {
      followers.forEach(async (follower) => {
        const newNotification = new Notification({
          type: "new post",
          notificationText: "created a new post",
          sourceUser: userID,
          targetUser: follower,
          postId: newPost._id,
        });
        await newNotification.save();
        await Account.findOneAndUpdate(
          { user: follower },
          { $push: { notifications: newNotification._id } }
        );
      });
    }

    await Account.updateOne(
      { _id: account._id },
      {
        $push: { posts: newPost._id },
        $inc: { postCount: 1 },
      }
    );
    await newPost.save();
    const response = await Post.findOne({ _id: newPost._id }).populate(
      "user post",
      "username profilePicture"
    );
    response.__v = undefined;
    res.status(201).json({ success: true, post: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ succes: false, message: error });
  }
});

router.param("postId", async (req, res, next, postId) => {
  try {
    const post = await Post.findById(postId);
    req.post = post;
    next();
  } catch (error) {
    console.log(error);
    res.status(409).json({ success: false, message: error });
  }
});

router.route("/:postId").get(async (req, res) => {
  const { postId } = req.params;
  const response = await Post.findById(postId).populate(
    "user",
    "username profilePicture"
  );
  res.status(200).json({ success: true, post: response });
});

router.route("/:postId/like").post(async (req, res) => {
  try {
    const { post } = req;
    const { userID } = req;
    const postFind = await Post.findById(post._id);
    let response = "";
    let type = null;
    const isUserLiked = postFind.likes.findIndex((item) => item == userID);
    if (isUserLiked !== -1) {
      response = await Post.updateOne(
        { _id: post._id },
        { $inc: { likesCount: -1 }, $pull: { likes: userID } }
      );
      type = "dec";
    } else {
      response = await Post.updateOne(
        { _id: post._id },
        { $inc: { likesCount: 1 }, $push: { likes: userID } }
      );
      type = "inc";
    }
    if (type === "inc") {
      const newNotification = new Notification({
        type: "like",
        notificationText: "liked your post",
        sourceUser: userID,
        targetUser: post.user,
        postId: post._id,
      });

      await newNotification.save();
      await Account.findOneAndUpdate(
        { user: post.user },
        { $push: { notifications: newNotification._id } }
      );
    }

    res.status(200).json({ success: true, response, type });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err });
  }
});

router.route("/:postId/comment").post(async (req, res) => {
  const { userID, post } = req;
  const { commentText } = req.body;
  try {
    const newComment = await new Comment({
      postID: post._id,
      commentOwner: userID,
      commentText,
    });
    await newComment.save();
    await Post.updateOne(
      { _id: post._id },
      {
        $push: { comments: newComment._id },
        $inc: { commentsCount: 1 },
      }
    );
    const response = await Comment.findById(newComment._id).populate(
      "commentOwner",
      "username profilePicture"
    );

    const newNotification = new Notification({
      type: "comment",
      notificationText: "commented on your post",
      sourceUser: userID,
      targetUser: post.user,
      postId: post._id,
    });
    await newNotification.save();
    await Account.findOneAndUpdate(
      { user: post.user },
      { $push: { notifications: newNotification._id } }
    );

    res.status(201).json({ succes: true, comment: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
});

router.route("/:postId/delete").post(async (req, res) => {
  const { post, userID } = req;
  const response = await Post.findByIdAndDelete(post._id);
  const data = await Account.updateOne(
    { user: post.user },
    { $inc: { postCount: -1 }, $pull: { posts: post._id } }
  );

  console.log(data);

  res.status(204).json({ success: true, data });
});

module.exports = router;
