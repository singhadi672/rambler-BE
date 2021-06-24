const express = require("express");
const RamblerMaps = require("../Models/ramblerMap.model");
const router = express.Router();

router.route("/new").post(async (req, res) => {
  const { userID } = req;
  const { location, dateOfJourney } = req.body;
  const random_pretext = [
    "Hola fellow Ramblers!!",
    "Hi all!",
    "What's up gang!!",
  ];
  const random_posttext = [
    "and need fellow ramblers to join and travel together!!...so if interested, contact me!!",
    "and want to make friends on the way!!....interesing right? hit me upp!!",
    "and would like to share my experience with people😅...interesting people DM me!!",
  ];

  

  const random_num = Math.floor(Math.random() * 3);
  const data = new RamblerMaps({
    location,
    dateOfJourney,
    user: userID,
    preText: random_pretext[random_num],
    postText: random_posttext[random_num],
  });
  await data.save();

  const response = await RamblerMaps.findById(data._id)
    .populate("user", "username profilePicture")
    .exec();

  res.status(201).json({
    success: true,
    response,
  });
});

router.route("/").get(async (req, res) => {
  const response = await RamblerMaps.find({})
    .populate("user", "username profilePicture")
    .sort({ createdAt: "desc" });

  res.status(200).json({ success: true, response });
});
module.exports = router;
