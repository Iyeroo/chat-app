const express=require('express');
const bodyParser = require("body-parser");
const user_route=express();

user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({ extended: true }));
user_route.use(express.static('public'));
const messagecontroller=require("../controllers/messagecontroller")
const usercontroller=require("../controllers/usercontroller");
const chatcontroller=require("../controllers/chatcontroller");
user_route.post("/api/chat",chatcontroller.accessChat)
user_route.post("/api/signup",usercontroller.register);
user_route.post("/login",usercontroller.login);
user_route.get("/allusers",usercontroller.allusers);
user_route.post("/api/chat",chatcontroller.accessChat);
user_route.get("/fetchall",chatcontroller.fetchChat);
user_route.post("/group",chatcontroller.createGroupChat);
user_route.put("/rename",chatcontroller.renameGroup);
user_route.put("/addtogroup",chatcontroller.addToGroup);
user_route.put("/removefromgroup",chatcontroller.removeFromGroup);
user_route.post("/api/message",messagecontroller.sendMessages);
user_route.get("/api/message/:chatId",messagecontroller.allMessages);
module.exports=user_route;