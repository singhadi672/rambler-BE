const express = require("express");
const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema(
  {
    type: { type: String, enum: ["like", "comment", "new post", "follow"] },
    notificationText: { type: String, required: "no text for notification" },
    sourceUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isRead: { type: Boolean, default: false },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
