const express = require("express");
const User = require("../Models/user.model");

async function findUserByEmail(req, res, next) {
  const { email } = req.body;
  const data = await User.findOne({ email: email });
  if (data && data.email) {
    req.emailPresent = true;
    data.__v = undefined;
    req.data = data;
    next();
  } else {
    req.emailPresent = false;
    next();
  }
}

module.exports = { findUserByEmail };
