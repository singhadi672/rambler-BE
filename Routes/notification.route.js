const express = require("express");
const Notification = require("../Models/notification.model");
const router = express.Router();

router.route("/").get(async (req, res) => {
  const { userID } = req;
  const notifications = await Notification.find({
    targetUser: userID,
    isRead: false,
  })
    .sort({ createdAt: "desc" })
    .populate("sourceUser targetUser", "profilePicture username");

  res.status(200).json({
    success: true,
    notifications,
    notificationsCount: notifications.length,
  });
});

router.route("/:notificationId").post(async (req, res) => {
  const { notificationId } = req.params;
  const response = await Notification.findOneAndUpdate(
    { _id: notificationId },
    { isRead: true }
  );
  res.status(200).json({ success: true, response });
});

module.exports = router;
