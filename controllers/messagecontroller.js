const Message = require("../models/messageModel");
const User = require("../models/usermode");
const Chat = require("../models/chattingmodel");
const sendMessages=async(req,res)=>{
    const {content,chatId}=req.body;
    if(!content||!chatId){
        return res.status(400).json({message:"invalid data passed into request"});
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
      };
    
      try {
        var message = await Message.create(newMessage);
    
        message = await message.populate("sender", "name moodleid");
        message = await message.populate("chat");
        message = await User.populate(message, {
          path: "chat.users",
          select: "name mobile moodleid",
        });
    
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    
        res.json(message);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    
}
const allMessages=async(req,res)=>{
  
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name mobile moodleid")
        .populate("chat");
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
}










module.exports={sendMessages,allMessages};