import React from 'react'
import {BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css';



import Homepage  from './pages/Homepage';

import Chatpage  from './pages/Chatpage';

function   App() {
    return (
      <div className="App">
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={Chatpage} />
      </div>
    );
  }
    
    /* <Switch>
    <Route exact  path="/">
          <Homepage />
        </Route>
        <Route path="/chats" >
          <Chatpage />
        </Route>
        
    </Switch> */


 
export default App;