const mongoose = require("mongoose");
require("mongoose-type-email");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: "Please enter user name" },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: "please enter correct Email",
  },
  password: { type: String, required: "please enter password" },
  profilePicture: {
    type: String,
    default: "https://www.booksie.com/files/profiles/22/mr-anonymous.png",
  },
  accountDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: "no account created,please check backend",
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
