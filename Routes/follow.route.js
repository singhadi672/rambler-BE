const express = require("express");
const Account = require("../Models/account.model");
const router = express.Router();
const Notification = require("../Models/notification.model");
const User = require("../Models/user.model");

router.route("/:followingId").post(async (req, res) => {
  try {
    const { userID } = req;
    const { followingId } = req.params;

    await Account.updateOne(
      { user: userID },
      { $push: { following: followingId }, $inc: { followingCount: 1 } }
    );

    const newNotification = new Notification({
      type: "follow",
      notificationText: "started following you",
      sourceUser: userID,
      targetUser: followingId,
      postId: null,
    });

    await Account.findOneAndUpdate(
      { user: followingId },
      {
        $push: { followers: userID, notifications: newNotification._id },
        $inc: { followersCount: 1 },
      }
    );

    await newNotification.save();

    const response = await User.findById(followingId);
    response.password = undefined;
    response.accountDetails = undefined;
    response.email = undefined;
    response.__v = undefined;
    res.status(200).json({ success: true, user: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
});

router.route("/unfollow/:followingId").post(async (req, res) => {
  try {
    const { userID } = req;
    const { followingId } = req.params;

    await Account.updateOne(
      { user: userID },
      { $pull: { following: followingId }, $inc: { followingCount: -1 } }
    );

    await Account.updateOne(
      { user: followingId },
      { $pull: { followers: userID }, $inc: { followersCount: -1 } }
    );

    res.status(200).json({ success: true, message: "done" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
});
module.exports = router;
