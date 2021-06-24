const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/user.model");
const Account = require("../Models/account.model");
const { extend } = require("lodash");
const saltRounds = process.env.saltRounds;
const secret = process.env.secret;

router.route("/").post(async (req, res) => {
  const { username, email, password } = req.body;
  const { emailPresent } = req;
  try {
    if (emailPresent) {
      res.status(409).json({ success: false, message: "user exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, parseInt(saltRounds));
      let newUser = await new User({
        username,
        email,
        password: hashedPassword,
      });
      let newAccount = await new Account({
        user: newUser._id,
        following: newUser._id,
      });
      newUser = extend(newUser, { accountDetails: newAccount._id });
      await newUser.save();
      await newAccount.save();
      const token = jwt.sign(
        {
          userID: newUser._id,
          username: newUser.username,
        },
        secret,
        { expiresIn: "15d" }
      );

      res.status(201).json({ success: true, token });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
