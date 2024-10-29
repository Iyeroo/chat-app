import { IconButton, useToast, Spinner } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/layout";
import { useEffect, useState, useCallback } from "react";
import { useChatState } from "../context/chatprovider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ScrollableChat from "./ScrollableChat";

import "./styles.css";
import io from "socket.io-client";
import axios from "axios";

import ProfileModal from "../miscellenous/profilemodel";
import UpdateGroupChatModal from "./UpdateGroupChatModal";

const ENDPOINT = "https://chat-app-6-bzn0.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useChatState();
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  // Memoized fetchMessages function with useCallback
  const fetchMessages = useCallback(async () => {
    if (!selectedChat || !user.token) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      setLoading(true);
      const { data } = await axios.get(
        `https://chat-app-6-bzn0.onrender.com/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
      selectedChatCompare = selectedChat;

      // Store messages in local storage to sync across windows
      localStorage.setItem("messages", JSON.stringify(data));
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  }, [selectedChat, user.token, toast]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, [user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Sync messages across tabs/windows
  useEffect(() => {
    const syncMessages = (event) => {
      if (event.key === "messages") {
        setMessages(JSON.parse(event.newValue));
      }
    };

    window.addEventListener("storage", syncMessages);

    return () => {
      window.removeEventListener("storage", syncMessages);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // Show notification
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);

        // Update local storage to sync across tabs/windows
        localStorage.setItem(
          "messages",
          JSON.stringify([...messages, newMessageReceived])
        );
      }
    };

    socket.on("message received", handleMessageReceived);

    // Cleanup to avoid multiple listeners
    return () => {
      socket.off("message received", handleMessageReceived);
    };
  }, [selectedChatCompare, messages]);

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
          "https://chat-app-6-bzn0.onrender.com/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );
        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);

        // Update local storage to sync across tabs/windows
        localStorage.setItem("messages", JSON.stringify([...messages, data]));
      } catch (error) {
        toast({
          title: "Error Occurred!",
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
            {messages && !selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages} // Pass fetchMessages as a prop
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
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
              {loading ? (
                <Spinner size="xl" />
              ) : (
                Array.isArray(messages) && messages.length > 0 ? (
                  <ScrollableChat messages={messages} />
                ) : (
                  <Text>No messages to display.</Text>
                )
              )}
            </div>

            <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
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
