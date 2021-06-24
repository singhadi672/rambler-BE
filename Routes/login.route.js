const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/user.model");
const router = express.Router();
const secret = process.env.secret;

router.route("/").post(async (req, res) => {
  const { password } = req.body;
  const { data } = req;
  try {
    const isUserPresent = await bcrypt.compare(password, data.password);
    if (isUserPresent) {
      const token = jwt.sign(
        { userID: data._id, username: data.username },
        secret,
        { expiresIn: "15d" }
      );
      data.password = undefined;
      data.email = undefined;
      data.accountDetails = undefined;
      res.status(200).json({ success: true, token, user: data });
    } else {
      res.status(404).json({success:false,message:"user not found"});
    }
  } catch (error) {
    res.status(401).json({ success: false, message: "unauthorised user" });
  }
});

module.exports = router;
