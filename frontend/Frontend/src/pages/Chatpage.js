import react from "react";
import { useChatState } from "../context/chatprovider";
import SideDrawer from "../miscellenous/sidedrawer";
import MyChats from "../miscellenous/mychats";
import Chatbox from "../miscellenous/chatbox";
import {Box} from "@chakra-ui/react";
import { useState } from "react";
 import "./chatpage.css"
const Chatpage=()=>{
    
  const {user}=useChatState();
    const[fetchAgain,setFetchAgain]=useState(false);
    return(
<div style={{width:"100%"}}>
 {user && <SideDrawer/>}
 <Box display="flex"      justifyContent="space-between" flex-direction="column"
    alignItems="center"
    
    w="100%"
    h="100%"
    p="5px 10px 5px 10px"
    borderWidth="5px"
    borderStyle="solid">
  {user && <MyChats fetchAgain={fetchAgain} />} 
   
  {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
</Box>

    




</div>
    )
}
export default Chatpage;