const { json } = require("express");
const express = require("express");
const Account = require("../Models/account.model");

async function findAccount(req, res, next) {
  const { userID } = req;
  try {
    const account = await Account.findOne({ user:userID });
    req.account = account;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
}

module.exports = { findAccount };
