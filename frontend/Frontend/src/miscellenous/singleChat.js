import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/layout";
import { useEffect, useState, react } from "react";
import { useCallback } from "react";
import { useChatState } from "../context/chatprovider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ScrollableChat from "./ScrollableChat";

import "./styles.css";
import io  from "socket.io-client";


import axios from "axios";

import ProfileModal from "../miscellenous/profilemodel";
const ENDPOINT = "http://localhost:200";
var socket, selectedChatCompare;
const SingleChat = () => {
  const { user, selectedChat, setSelectedChat } = useChatState([]);
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState();
  const [newMessage, setNewMessage] = useState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  useEffect(()=>{
    socket =io(ENDPOINT);
    socket.emit("setup",user);
    socket.on("connection",()=>setSocketConnected(true))
      },[user])
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat || !user?.token) {
        console.log("Missing selectedChat or token");
        return;
      }

      console.log("Selected Chat ID:", selectedChat._id);
      console.log("User Token:", user.token);

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:200/api/message/${selectedChat._id}`,
          config
        );
        setMessages(data);
        setLoading(false);
        socket.emit("join chat",selectedChat._id);
        console.log(messages);
      } catch (error) {
        console.error("Error fetching messages:", error.response); // Log the full error
        toast({
          title: "Error Occurred",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    };

    fetchMessages();
    selectedChatCompare=selectedChat
  }, [selectedChat, user.token, toast]);
  useEffect(()=>{
    socket.on("message recieved",(newMessageRecieved)=>{
      if(!selectedChatCompare||selectedChatCompare._id!==newMessageRecieved.chat._id
        
      ){
        //give notificcation

      }
      else{
        setMessages([...messages,newMessageRecieved])
      }
    })
  })

  // Add fetchMessages to the dependency array

  // Add selectedChat and user.token as dependencies

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:200/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
socket.emit("new message",data)
        setMessages([...messages, data]);
        console.log("response -> ", data);
        // console.log(messages)
        // console.log(messages[0].content);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };
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
            <div className="messages">
              {Array.isArray(messages) && messages.length > 0 ? (
                <ScrollableChat messages={messages} />
              ) : (
                <Text>No messages to display.</Text>
              )}
            </div>

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
