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

const PORT = 500;
const path = require("path");
const { type } = require("os");
connectmongodb("mongodb://0.0.0.0:27017/login")
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

app.post("/api/message",protect,user_route);
app.get("/api/message/:chatId",protect,user_route);
app.use((req, res, next) => {
  console.log(req);
  const useruid = req.cookies?.uid;
  const user = getuser(useruid);

  
  req.user = user;
  next();
});


const server=app.listen(PORT, () => {
  console.log("server started");
});
const io=require('socket.io')(server,{
  pingTimeout:60000,
  cors:{
    origin:"*",
  }
  
})
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
    socket.on("join chat",(room)=>{
      socket.join(room);
      console.log("user joined room"+room)
    })
    socket.on("new message",(newMessageRecieved)=>{
      var chat=newMessageRecieved.chat;
      if(!chat.users) return console.log("chat.users is not defined");
      chat.users.forEach((user)=>{
        if(user._id==newMessageRecieved.sender._id) return;
        socket.in(user._id).emit("message recieved",newMessageRecieved)
      })

    })

})
});
const NODE_ENV="production";
const _dirname1=path.resolve();
if(NODE_ENV=="production"){
  app.use(express.static(path.join(_dirname1,"frontend","Frontend","build")));
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(_dirname1,"frontend","Frontend","build","index.html"))
  })
}
else{app.get("/",(req,res)=>{
res.send("api running in succes")
})
}