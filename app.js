const express = require("express");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Chat = require("./models/chattingmodel");

const User = require("./models/usermode");

const bodyParser = require("body-parser");

const { connectmongodb } = require("./connection");
const { setuser, getuser } = require("./services/auth");

const { restricttologgedinusersonly } = require("./middleware/auth");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = 150;
const path = require("path");
const { type } = require("os");
connectmongodb("mongodb://127.0.0.1:27017/login")
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("mongo err", err);
  });
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());

const cors = require("cors");

app.use(cors("*"));

const { protect } = require("./middleware/auth");
const user_route = require("./routes/user");
app.post("/api/signup", user_route);

app.post("/login", user_route);

app.post("/api/chat", protect, user_route);
app.get("/fetchall", protect, user_route);

app.get("/allusers", async (req, res) => {
  console.log(req.user);
  const keyword = req.query.search
    ? {
        $or: [
          { mobile: { $regex: req.query.search, $options: "i" } },
          { name: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword);

  res.send(users);
});

app.post("/group", protect, user_route);
app.put("/rename", protect, user_route);
app.put("/addtogroup", protect, user_route);
app.put("/removefromgroup", protect, user_route);
app.get("/login", (Req, res) => {
  return res.render("login");
});
app.get("/signup", (req, res) => {
  return res.render("signup.ejs");
});
app.post("/api/message",protect,user_route);
app.get("/api/message/:chatId",protect,user_route);
app.use((req, res, next) => {
  console.log(req);
  const useruid = req.cookies?.uid;
  if (!useruid) return res.redirect("/login");
  const user = getuser(useruid);

  if (!user) return res.redirect("/login");
  req.user = user;
  next();
});
app.get("/home", (req, res) => {
  return res.render("chat.ejs");
});
app.listen(PORT, () => {
  console.log("server started");
});
