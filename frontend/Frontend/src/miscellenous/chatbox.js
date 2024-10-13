import { Box } from "@chakra-ui/layout";

import SingleChat from "./singleChat";
import { useChatState } from "../context/chatprovider";
import { useState } from "react";

const Chatbox = () => {
  const { selectedChat } = useChatState();
  

  return (

    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "100%" }}
      borderRadius="lg"
      borderWidth="1px"
      h="100%"
    >
    
      <SingleChat />
    </Box>
  );
};

export default Chatbox;