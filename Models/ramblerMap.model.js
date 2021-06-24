const express = require("express");
const mongoose = require("mongoose");

const RamblerMapsSchema = mongoose.Schema(
  {
    location: { type: String, required: "location is empty" },
    dateOfJourney: { type: String, required: "DOJ is empty" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    preText: { type: String, required: "no pre-text" },
    postText: { type: String, required: "no post-text" },
  },
  { timestamps: true }
);

const RamblerMaps = mongoose.model("RamblerMaps", RamblerMapsSchema);

module.exports = RamblerMaps;
