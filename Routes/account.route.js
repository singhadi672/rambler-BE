const express = require("express");
const { extend } = require("lodash");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const Account = require("../Models/account.model");
const User = require("../Models/user.model");
const bcrypt = require("bcrypt");
const cloudinaryCloudName = process.env.cloudinaryCloudName;
const cloudinaryAPIKey = process.env.cloudinaryAPIKey;
const cloudinaryAPISecret = process.env.cloudinaryAPISecret;
const saltRounds = process.env.saltRounds;

router.route("/").get(async (req, res) => {
  const { account } = req;
  const response = await Account.findById(account._id)
    .populate("followers following user", " username profilePicture")
    .populate("posts");
  response.__v = undefined;

  res.status(200).json({ success: true, account: response });
});

router.route("/:userId").get(async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await Account.findOne({ user: userId })
      .populate("followers following user", " username profilePicture")
      .populate("posts");
    response.__v = undefined;

    res.status(200).json({ success: true, account: response });
  } catch (error) {
    console.log(error);
  }
});

router.route("/edit").post(async (req, res, next) => {
  const { username, accountDescription, password } = req.body;
  cloudinary.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryAPIKey,
    api_secret: cloudinaryAPISecret,
  });
  const filepath = req.files?.profilePicture;
  let result = null;
  if (filepath) {
    result = await cloudinary.uploader.upload(
      filepath.tempFilePath,
      (err, result) => {
        return result;
      }
    );
  }

  const { userID } = req;
  let { account } = req;
  let user = await User.findById(userID);
  if (filepath) {
    user = extend(user, { username, profilePicture: result.secure_url });
  } else {
    user = extend(user, { username });
  }
  if (password) {
    const newPassword = await bcrypt.hash(password, parseInt(saltRounds));
    user = extend(user, {
      password: newPassword,
    });
  }
  account = extend(account, { accountDescription });
  await user.save();
  await account.save();
  const response = await Account.findById(account._id).populate(
    "followers following user",
    " username profilePicture"
  );
  response.__v = undefined;
  res.status(201).json({ success: true, account: response });
});

module.exports = router;
