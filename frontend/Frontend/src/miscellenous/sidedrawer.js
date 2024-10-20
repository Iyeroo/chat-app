import { Tooltip,Box, Menu,MenuButton, MenuList, MenuItem, MenuDivider, useToast } from '@chakra-ui/react';
import {React,useState} from 'react';
import { Button } from "@chakra-ui/button";
import {BellIcon,ChevronDownIcon,Avatar} from "@chakra-ui/icons";
import ProfileModal from "./profilemodel";

import {Text,Input} from "@chakra-ui/react";
import { useChatState } from "../context/chatprovider";
import { useHistory } from 'react-router-dom';
import {useDisclosure} from "@chakra-ui/hooks";
import ChatLoading from './ChatLoading';
import UserListItem from './useravatar/UserListItem';
import axios from "axios";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Spinner } from "@chakra-ui/spinner";



const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    
    
const history=useHistory();
const {isOpen,onOpen,onClose}=useDisclosure();
    const {user,SelectedChat,setSelectedChat,chats,setChats}=useChatState();
    
    const toast=useToast();
    const logoutHandler=()=>{
      localStorage.removeItem('userInfo');
      history.push("/")
    }
    const handleSearch=async()=>{
      if(!search){
        toast({
          title: "Please Enter something in search",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
        return;
      }
      try{
        setLoading(true);
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }

        }
        console.log(user.token);
        const {data}=await axios.get(`http://localhost:200/allusers?search=${search}`,config);
        setLoading(false);
        setSearchResult(data);
      }catch(error){
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
    const accessChat = async (userId) => {
      console.log(userId);
  
      try {
        setLoadingChat(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(`http://localhost:200/api/chat`, { userId }, config);
  
        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        console.log(chats)
        setSelectedChat(data);
        setLoadingChat(false);
        onClose();
      } catch (error) {
        toast({
          title: "Error fetching the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
      console.log(SelectedChat);
    };
  
    
    
  
  return (
    <><Box display="flex"      justifyContent="space-between"
    alignItems="center"
    bg="white"
    w="100%"
    p="5px 10px 5px 10px"
    borderWidth="5px">
        <Tooltip label="search users to chat" hasArrow placement="bottom-end">
        <Button bg="white" variant="ghost" onClick={onOpen}>
        <i w="30px" h="30px" class="fa-solid fa-magnifying-glass"></i>
        <Text d={{base:"none",md:"flex"}}>
        Search User

        </Text>

        </Button>

        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          EduConnect
        </Text>
        <div>
          <Menu>
          <MenuButton p={1}>
          <BellIcon/>
          </MenuButton>
            
          </Menu>
          
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
            <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
              />
            </MenuButton>
            <MenuList>
            <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider/>
              <MenuItem onClick={logoutHandler}>
                Logout
              </MenuItem>
            </MenuList>
           

          </Menu> 
          
          
        </div>
    </Box>
    
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      </>
  )
}

export default SideDrawer