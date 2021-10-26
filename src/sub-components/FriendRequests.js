import { Avatar, Snackbar } from '@material-ui/core';
import React, { useState } from 'react'
import {UseAuth} from "../AuthProvider"
import { db,fv } from '../firebase/initialize';
import "../styles/MainPage.css"

//import for Material UI
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Badge from '@material-ui/core/Badge';

function FriendRequests() {
    const {currentUser}=UseAuth();
    const [requests,setRequests]=useState([])
    const [message,setMessage]=useState("")
    const [open,setOpen]=useState("")
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
      

const useStyles = makeStyles((theme) => ({
  root: {
    height: 180,
    
  },
  container: {
    display: 'flex',
    margin:"0 auto",
  },
  paper: {
    margin: theme.spacing(1),
  },
  svg: {
    width: 100,
    height: 100,
  },
  polygon: {
    fill: theme.palette.common.white,
    stroke: theme.palette.divider,
    strokeWidth: 1,
  },
}));
const [checked, setChecked] = React.useState(false);

  const handleShow = () => {
    setChecked((prev) => !prev);
  };
const classes=useStyles();
    const handleAccept=async(e)=>{
        var jsn=e.currentTarget.id.split(",");
       var friend_to_accept=jsn[0];
       var req_to_change=jsn[1];
       var friend_full_name=jsn[2];

       //Now Add this to both 'Friends' array and upate accepted:true in the friend_request from collection
       try{
           //Add to current User
           var f={email:friend_to_accept,name:friend_full_name}
           const user_info_ref=db.collection("user_info").doc(currentUser.uid)
            user_info_ref.update({
                friends: fv.arrayUnion(f)
            });
            //Add to sent user
            await db.collection("user_info").where("email_id","==",friend_to_accept).get().then((qs)=>{
                var docs=""
                qs.forEach(doc=>{
                    docs=doc.id
                })
                //console.log("SENT USER-->",friend_to_accept,docs)
                return docs
            }).then(doci=>{
                if(doci==""){
                    throw "UNDEFINED PROBLEM" 
                }else{
                  var c={"email":currentUser.email,"name":currentUser.displayName}
                    var f_ref=db.collection("user_info").doc(doci)
                    f_ref.update({
                        friends: fv.arrayUnion(c)
                    });
                }
            })
            await db.collection("friend_requests").doc(req_to_change).delete();
            setMessage("Friend Added")
            setOpen(true)

       }catch(err){
           setMessage("Couldnt Add Friend :(")
           setOpen(true)
           console.log(err)
       }
    }
    //Listen to Friend_Requests
    React.useEffect(()=>{
        const unsub=db.collection("friend_requests").where("to", "==", currentUser.email)
        .onSnapshot((querySnapshot) => {
            if(querySnapshot.size>0){setMessage(`You have ${querySnapshot.size} New Friend Requests`)
            setOpen(true)}
            console.log("New Friend Request Added!")
            setRequests([])
            querySnapshot.forEach((doc) => {
                if(doc.exists)
                {setRequests((prevState)=>[...prevState,{service_id:doc.id,...doc.data()}])}

            });
            
            
        });
        return unsub;
    },[])
    return (
    <>
    <div className={classes.container}>
      
      <Button variant="contained" color="primary" endIcon={<><Badge overlap="circular" anchorOrigin={{vertical: 'top',horizontal: 'right'}} badgeContent={requests.length===0?"0":requests.length} ><PersonAddIcon fontSize="small"/></Badge></>} onClick={handleShow}><Typography variant="h5" >Friend Requests</Typography></Button>
    </div>
    <div className={classes.root}>
      <div className={classes.container}>
        <Grow
          in={checked}
          style={{ transformOrigin: '0 0 0' }}
          {...(checked ? { timeout: 1000 } : {})}
        >
          <Paper elevation={4} className={classes.paper}>
          <Grid>
    <List>
        {requests.map((friend)=>{
            return (<ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">{friend.from_name}</Typography>}
                />
                <ListItemSecondaryAction ariaLabel="accept-user" id={`${friend.from},${friend.service_id},${friend.from_name}`} onClick={handleAccept}>
                  <IconButton  edge="end" aria-label="delete">
                    <DeleteIcon/>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>)
        })}
    </List>
</Grid>
          </Paper>
        </Grow>
      </div>
    </div>
<Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
        autoHideDuration={1500}
        message={message}
        
      />
</>
    )
}

export default FriendRequests
