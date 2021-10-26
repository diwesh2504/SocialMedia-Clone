import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter as Router,Route,Switch} from "react-router-dom"
import Register from './components/Register';
import Login from './components/Login';
import PrivateRoute from './PrivateRoute';
import MainPage from './components/MainPage';
import AuthProvider from './AuthProvider'
import Chats from './sub-components/Chats';
import CompleteProfile from './components/CompleteProfile';

ReactDOM.render(
  <React.StrictMode>

     <Router>
       <AuthProvider>
         <Switch>
           <PrivateRoute exact path="/" component={MainPage}/>
           <PrivateRoute path="/complete" component={CompleteProfile}/>
           <Route  path="/register" component={Register}/>
           <Route path="/login" component={Login}/>
           <PrivateRoute path="/chats" component={Chats}/>
           {/* <PrivateRoute path="/main" component={MainPage}/> */}
         </Switch>
       </AuthProvider>
     </Router>
  </React.StrictMode>,
  document.getElementById('root')
);


