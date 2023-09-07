const express = require("express");
const app = express();
const cors = require("cors");
const env = require("dotenv");
const fileUpload = require("express-fileupload");
env.config();
const DBConnection = require("./DBConnections/connection.Database");
const loginRoute = require("./Routes/login.route");
const signupRoute = require("./Routes/signup.route");
const accountRoute = require("./Routes/account.route");
const postRoute = require("./Routes/post.route");
const feedRoute = require("./Routes/feed.route");
const followRoute = require("./Routes/follow.route");
const userRoute = require("./Routes/user.route");
const commentRoute = require("./Routes/comment.route");
const ramblerMapRoute = require("./Routes/ramblerMap.route");
const notificationRoute = require("./Routes/notification.route");
const { findUserByEmail } = require("./Middlewares/findUserByEmail.middleware");
const { authVerify } = require("./Middlewares/authVerify.middleware");
const { findAccount } = require("./Middlewares/findAccount.middleware");
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(cors());
app.use(express.json());

DBConnection();

app.use("/login", findUserByEmail, loginRoute);
app.use("/signup", findUserByEmail, signupRoute);
app.use("/notification", authVerify, notificationRoute);
app.use("/account", authVerify, findAccount, accountRoute);
app.use("/post", authVerify, findAccount, postRoute);
app.use("/feed", authVerify, feedRoute);
app.use("/follow", authVerify, findAccount, followRoute);
app.use("/comment", authVerify, commentRoute);
app.use("/user", authVerify, userRoute);
app.use("/ramblerMap", authVerify, ramblerMapRoute);
app.get("/", (req, res) => {
  res.send("rambler API");
});

app.listen(process.env.PORT || 4000, () => {
  console.log("server started");
});
