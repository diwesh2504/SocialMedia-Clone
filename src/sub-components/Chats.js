import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import '../styles/Chats.css';
import {db,fv} from "../firebase/initialize";
import {UseAuth} from "../AuthProvider";

//import from Material UI
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import send from "../images/send.mp3";
import { CircularProgress } from '@material-ui/core';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import {useHistory} from "react-router-dom";
import profile_pic from "../images/profile_pic.jpg"
import { TextField } from '@material-ui/core';
import SendRoundedIcon from '@material-ui/icons/SendRounded';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
export default function Chats() {
  const {currentUser,logout}=UseAuth();
  const [currentChattingFriend,setCurrentChattingFriend]=useState("");
  const [loadingChat,setLoadingChat]=useState(false);
  const [roomID,setRoomID]=useState(null);
  const history=useHistory();
  const [loadChatHistory,setLoadChatHistory]=useState([]);
  const [viewFriendsInfo,setViewFriendsInfo]=useState([]);
  const classes = useStyles();
  const s={sent:"individual_chat",received:"individual_chat_rec"};
  const ss={sender:"first_from_sender",user:"first_from_user"};
  const [valueToSend,setValueToSend]=useState("");
  //Opening chat with friend
  //Gen Room ID
  function genRoomID(user1,user2){
    return user1<user2===true? user1+user2:user2+user1;
  }


  const handleChat=({currentTarget})=>{
    var jsn=currentTarget.id.split(",")
    setCurrentChattingFriend(jsn[1]);
    setRoomID(()=>genRoomID(currentUser.email,jsn[0]));

    console.log(currentTarget.id)
  }
  
  
  //function for sending chat
  const sendChat=async ()=>{
    var sound=new Audio(send);
    const message=valueToSend;
    const json={
      from:currentUser.email,
      message,
      timestamp:fv.serverTimestamp()
    };
    const docExists=await db.collection("chats").doc(roomID).get()
    if(docExists && docExists.exists){
      await db.collection("chats").doc(roomID).collection('messages').add(json)
    .then((doc)=>{
      console.log("Sent!")
    }).catch(err=>{
        console.log("Couldnt Send Message",err);
    })
    }else
    {
      await db.collection("chats").doc(roomID).collection('messages').doc().set(json).then((doc)=>{
        console.log("Message Sent")
      })
    
    }
    setValueToSend("")
      sound.play()
    
  }
  // To Format Time
  const timeDisplay=(date)=>{
    var hour= date?.getHours();
    var min=date?.getMinutes()
    return `${hour==12?12:hour%12}:${min<10?`0${min}`:min} ${hour>=12?"PM":"AM"} `
  }
  
 

  //useEffect for Personal Chats --->Re-renders on roomID change.
  React.useEffect(()=>{
    
    if(roomID){
    var reloadFlag=0
    setLoadingChat(true);
    
    const un=db.collection('chats').doc(roomID).collection('messages').orderBy("timestamp","asc").onSnapshot((qs)=>{
     setLoadChatHistory([]);
     qs.forEach(doc=>{
       setLoadChatHistory(prev=>[...prev,doc.data()])
     })
    })
    setLoadingChat(false);
    return un;}
  },[roomID])

  React.useEffect(()=>{
      setLoadChatHistory([])
      const promise1=db.collection("user_info").where("email_id","==",currentUser.email).onSnapshot((qs)=>{
        setViewFriendsInfo([])
          qs.forEach(doc=>{
              setViewFriendsInfo(prev=>[...prev,...doc.data().friends])
            
          })
        })
      
    return promise1;
  },[])
  return (
    <>
      <div id="chats-container">
        <div id="chats-container-1" className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                Chats
              </Typography>
              <Button onClick={()=>history.push("/")} color="inherit">Profile</Button>
              <Button onClick={()=>logout()} color="inherit">Logout</Button>
            </Toolbar>
          </AppBar>
        </div>
        <div id="chats-module">
          <div id="chats-module-left">
            <div id="chats-module-left-a">My Messages</div>
            <div id="chats-module-left-b">
            
              <List>
                
                {viewFriendsInfo.length>0 && viewFriendsInfo.map((person,idx) => {
                  return (
                    <ListItem button id={`${person.email},${person.name}`} onClick={handleChat}>
                    <ListItemAvatar>
                      <Avatar>{person.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={person.name}
                    />
                  </ListItem>
                  );
                })}
              </List>
            </div>
          </div>
          {currentChattingFriend === "" ? (
            <p>Switch to a Chat</p>
          ) : (
            <div id="chats-module-right">
              <div id="chats-module-right-a">
              
                <ListItem dense="true">
                  <ListItemAvatar>
                    <Avatar alt="User Photo" src={profile_pic}/>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle2">{currentChattingFriend}</Typography>} />
                </ListItem>
              </div>
              <div id="chats-module-right-b">
                  
                <div id="individual_chat_container">
                    {loadingChat===true?<CircularProgress/>:""}
                    {loadChatHistory.length!==0 && loadChatHistory.map((chat)=>{
                      return (<div id={chat.from===currentUser.email?s.sent:s.received}>
                        <div style={{marginTop:"5px"}} className={`msg ${chat.from===currentUser.email?ss.user:ss.sender}`}>
                          {chat.message}
                          <div className="span-time">
                          {timeDisplay(chat.timestamp?.toDate())}{chat.from===currentUser.email?<DoneAllIcon color="primary"/>:""}
                          </div>
                        </div>
                      </div>)
                    })}
                </div>
                  
              </div>
              <div id="chats-module-right-c">
              <div>
                <IconButton onClick={()=>alert("This feature will be added soon!")} color="primary" aria-label="upload picture" component="span">
                    <PhotoCamera />
                </IconButton>
              </div>
              
                <TextField id="standard-size-small" placeholder="Type your message.." size="small" value={valueToSend} onChange={(e)=>setValueToSend(e.target.value)}/>
              
                <div>
                  <IconButton color="primary"onClick={sendChat} variant="text">
                    <SendRoundedIcon />
                  </IconButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
