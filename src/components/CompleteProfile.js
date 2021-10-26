import React,{useRef, useState}from 'react'
import {UseAuth} from '../AuthProvider';
import { useHistory } from 'react-router-dom';
import { Button,CircularProgress,AppBar,Toolbar,Typography} from '@material-ui/core';
import '../styles/CompleteProfile.css'
import Snackbar from '@material-ui/core/Snackbar';
class ValidationError extends Error {
    constructor(message) {
      super(message); // (1)
      this.name = ""; // (2)
    }
  }
function CompleteProfile() {
    const history=useHistory();
    const [flag,setFlag]=useState(0)
    const [loading,setLoading]=useState(false);
    const displayRef=useRef("");
    const fullRef=useRef("");
    const {addProfileData,currentUser}=UseAuth();

    //Feedbacks
    const [message,setMessage]=useState("")
    //State for Snackbar Open and Close
    const [open, setOpen] = useState(false);
    //Functions for Handling Snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
    const handleSubmit=async ()=>{
        try{
            setLoading(true);
            if(displayRef.current.value===""||fullRef.current.value===""){
                throw new ValidationError("Fields Can't be Empty")
            }
            console.log(`Name for user.displayName ${fullRef.current.value},Name for nick name:${displayRef.current.value}`)
             await addProfileData(currentUser,fullRef.current.value,displayRef.current.value);
            setLoading(false)
             setMessage("Profile Updated")
             setOpen(true)
             setFlag(1)
        }catch(err){
            console.error(err);
            setMessage(err.message)
            setOpen(true)
            setLoading(false)
        }
    }
    const gotoLogin=()=>{
        history.push("/")
    }
    return (
        <>
        <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Complete Profile Details
          </Typography>
          <Button disabled={flag==1?false:true} onClick={gotoLogin} color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
        <div id="complete_container">
            <div></div>
            <div>
                <form id="complete" onSubmit={(e)=>e.preventDefault()}>
                    <input type="text" placeholder="Enter Full Name" id="full_name" name="display_name" ref={fullRef}/>
                    <input type="text" placeholder="Enter Nick Name" id="nick_name" name="nick_name" ref={displayRef}/>
                    <Button style={{display:"block",width:"100%"}} onClick={handleSubmit} variant="contained" color="primary" disableElevation>{loading?<CircularProgress color="secondary" />:"Update Info"}</Button>
                </form>
            </div>
            <div></div>
        </div>
        <Snackbar anchorOrigin={{vertical:'bottom',horizontal:'center'}} open={open} autoHideDuration={1500} onClose={handleClose} message={message}>
      </Snackbar>
        </>
    )
}

export default CompleteProfile
