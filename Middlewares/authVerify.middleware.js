const express = require("express");
const jwt = require("jsonwebtoken");
const secret = process.env.secret;

function authVerify(req, res, next) {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, secret);
    req.userID = decoded.userID;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: err });
  }
}

module.exports = { authVerify };
