import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/react"; 
import { Box, Text } from "@chakra-ui/layout";
import { useEffect, useState,react } from "react";
import { useChatState } from "../context/chatprovider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ArrowBackIcon } from "@chakra-ui/icons";

import axios from "axios";

import ProfileModal from "../miscellenous/profilemodel";
const SingleChat=()=>{
  const {user,selectedChat,setSelectedChat}=useChatState([]);
  const toast=useToast();
    
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState();
    const [newMessage, setNewMessage] = useState();
    const [fetchAgain, setFetchAgain] = useState(false);
    const fetchMessages=async()=>{
      if (!selectedChat) return;
      try{
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        };
        setLoading(true);
        const {data}=await axios.get(`http:150//localhost:150/api/chat/${selectedChat._id}`,config
      );
      console.log(messages);
    setMessages(data);
    setLoading(false);
  }
  catch(error){
    toast({
      title:"Error Occured",
      description:error.message,
      status:"error",
      duration:3000,
      isClosable:true,
      position:"bottom"
    })
  }

    }
    console.log({user, selectedChat});
    useEffect(() => {
      fetchMessages();
    },[selectedChat])
    const sendMessage=async(event)=>{
      if(event.key==="Enter"  && newMessage){
        try{
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
        }
        setNewMessage("");
        const { data } = await axios.post("http://localhost:150/api/message",{
          content:newMessage,
          chatId:selectedChat._id
        },config);
       
        setMessages([...messages, data]);
        console.log("response -> ", data);

    }
    catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }}};
    const typingHandler=(e)=>{
      setNewMessage(e.target.value)
    }
    console.log(selectedChat);
    console.log(newMessage);
    return (
      <>
        {selectedChat ? (
          <>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              pb={3}
              px={2}
              w="100%"
              fontFamily="Work sans"
              display="flex"
              justifyContent={{ base: "space-between" }}
              alignItems="center"
            >
              <IconButton
                d={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
              />
              {messages &&
                (!selectedChat.isGroupChat ? (
                  <>
                    {getSender(user, selectedChat.users)}
                    <ProfileModal
                      user={getSenderFull(user, selectedChat.users)}
                    />
                  </>
                ) : (
                  <>
                    {selectedChat.chatName.toUpperCase()}
                    {/* <UpdateGroupChatModal
                      fetchMessages={fetchMessages}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    /> */}
                  </>
                ))}
            </Text>
            <Box
              display="flex"
              flexDir="column"
              justifyContent="flex-end"
              p={3}
              bg="#E8E8E8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
              {loading ? (
                <Spinner
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
                />
              ) : (
                
                <div></div>
              )}
  
              <FormControl
                onKeyDown={sendMessage}
                id="first-name"
                isRequired
                mt={3}
              >
               
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
              </FormControl>
            </Box>
          </>
        ) : (
          // to get socket.io on same page
          <Box d="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
              Click on a user to start chatting
            </Text>
          </Box>
        )}
      </>
    );
  };
  


export default SingleChat;