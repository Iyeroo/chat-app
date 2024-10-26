import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";

import { Button } from "@chakra-ui/react";
import { useChatState } from "../context/chatprovider";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = useChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("http://localhost:500/fetchall", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

return(
  <Box
  display="flex"
  flexDir="column"
  p={3}
  bg="#F8F8F8"
  w="45%"
  h="100%"
  borderRadius="lg"
  
>
<Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
<Button> My Chats</Button>
<GroupChatModal>  
<Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
</GroupChatModal>
        
         
</Box>
  <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box onClick={() => setSelectedChat(chat)}
                    d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%"}}
      borderRadius="lg"
      borderWidth="1px"
      key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                
                
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}

      </Box>



</Box>
)

};

export default MyChats;