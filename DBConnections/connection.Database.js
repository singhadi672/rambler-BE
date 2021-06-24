const express = require("express");
const mongoose = require("mongoose");
const ConnectionURL = process.env.mongooseConnection;
const DBName = process.env.DBName;

async function DBConnection() {
  try {
    await mongoose.connect(`${ConnectionURL}/${DBName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`connection successfull with database ${DBName}`);
  } catch (err) {
    console.log(err);
  }
}

module.exports = DBConnection;
