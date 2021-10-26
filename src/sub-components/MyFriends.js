import React, { useState } from 'react'
import '../styles/MainPage.css';
import {db} from "../firebase/initialize";
import {UseAuth} from "../AuthProvider";

//import for Material UI
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Fade from '@material-ui/core/Grow';
import { makeStyles } from '@material-ui/core/styles';
import PeopleIcon from '@material-ui/icons/People';


function MyFriends() {
    const {currentUser}=UseAuth();
    const [viewFriends,setViewFriends]=useState([])
    const [checked,setChecked]=useState(false);
    const useStyles = makeStyles((theme) => ({
      root: {
        height: 180,
      },
      container: {
        display: 'flex',
        margin:"0 auto"
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
    const classes=useStyles();
    const handleShow = () => {
      setChecked((prev) => !prev);
    };
    React.useEffect(()=>{
          const promise1=db.collection("user_info").where("email_id","==",currentUser.email).onSnapshot((qs)=>{
            console.log("Is it returning friends??")
            qs.docChanges().forEach(change=>{
                setViewFriends(change.doc.data().friends);
            })
        })

        return promise1;
    },[])
    return (
        <div id="myfriends-container">
            <div className={classes.container}>
                <Button variant="contained" color="primary" startIcon={<PeopleIcon fontSize="large"/>} onClick={handleShow}><Typography variant="h5" >My Friends..</Typography></Button>
            </div>
        <div>
            <Grid>
                <List>
                    {viewFriends&& viewFriends.map((friend)=>{
                        return (<div className={classes.container}>
                          <Fade in={checked}>
                          
                            <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <AccountCircleIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={<Typography variant="subtitle1">{friend.name}</Typography>}
                            />
                          </ListItem>
                            
                          </Fade>
                        </div>
                      )
                    })}
                </List>
            </Grid>
        </div>
        </div>
    )
}

export default MyFriends
