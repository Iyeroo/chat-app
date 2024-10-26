const Message = require("../models/messageModel");
const User = require("../models/usermode");
const Chat = require("../models/chattingmodel");
const mongoose = require('mongoose');
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
const allMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Check if chatId is present and is a valid ObjectId
    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "A valid chatId is required" });
    }

    // Fetch messages associated with the chatId
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name mobile moodleid")
      .populate("chat");

    if (!messages.length) {
      console.log('No messages found for the given chatId');
    }

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};



  





module.exports={sendMessages,allMessages};