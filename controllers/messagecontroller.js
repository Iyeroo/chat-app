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
const allMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId; // Get chatId from the request params

    if (!chatId) {
      return res.status(400).json({ message: "chatId is required" });
    }

   // console.log('Fetching messages for chatId:', chatId);

    // Find messages based on chatId
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name mobile moodleid")
      .populate("chat");

    //console.log('Fetched messages:', messages);

    if (messages.length === 0) {
      console.log('No messages found for the given chatId');
    }

    res.json(messages); // Return the messages as the response
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(400);}}


  





module.exports={sendMessages,allMessages};