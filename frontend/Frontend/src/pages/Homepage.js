import {React,useEffect} from "react";
import {useHistory} from "react-router-dom";
import { Container,Box,Text ,Tabs, TabList, TabPanels, Tab, TabPanel} from "@chakra-ui/react";

import Login  from '../authentication/login';
import App  from '../authentication/signup';
import "./App.css"


const Homepage=()=>{
  const history=useHistory();
  useEffect(()=>{
    const user=localStorage.getItem('userInfo');
    if(user)  history.push('/chats');

  },[history]);
    return  <Container className="container" >
    <Box
       
        
       
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          EduConnect
        </Text>
      </Box>


<Box bg="white" w="100%" p={4} borderRadius="1g" borderWidth="1px">
<Tabs w="100%">
  <TabList d="flex" justifyContent={"space-between"}>
    <Tab width="100%">Login</Tab>
    <Tab width="100%">Signup</Tab>
    
  </TabList>

  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <App/>
    </TabPanel>
   
  </TabPanels>
</Tabs>
</Box>


    </Container>
}
export  default Homepage;