import React, { useRef,useState } from 'react'
import '../styles/Register.css';
import {Link,useHistory} from "react-router-dom";
import {FaTelegramPlane} from 'react-icons/fa'
import Button from '@material-ui/core/Button';
import {UseAuth} from '../AuthProvider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';

class ValidationError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = ""; // (2)
  }
}

function Register() {
    const history=useHistory();
    const {signup}=UseAuth();
    //States for Feedback from Firebase
    const [message,setMessage]=useState("")
    const [loading, setLoading] = useState(false)

    //State for Snackbar Open and Close
    const [open, setOpen] = useState(false);
    //Functions for Handling Snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
      
    const idRef=useRef("");
    const passRef=useRef("");
    const handleSubmit=async (e)=>{
        //e.preventDefault();
{        // Create User Account with auth
}        try{
            if(idRef.current.value ===""|| passRef.current.value===""){
                throw new ValidationError("Fields can't be empty")
            }
            setLoading(true)
            console.log(idRef.current.value,passRef.current.value)
            await signup(idRef.current.value,passRef.current.value);
            setLoading(false)
            history.push("/complete");
        }catch(err){
            console.log(err)
            setLoading(false)
            setMessage(err.message)
            setOpen(true)
        }
        

    }
    
    return (
        <>
        <div id="register_container">
        <div id="top">Welcome to SocialMedia-App</div>
        <div style={{margin:"auto auto"}}>
            <div style={{marginLeft:"20px"}}>Enter Details Below to create Account<FaTelegramPlane/></div>
            <form id="register_form" onSubmit={(e)=>e.preventDefault()}>
                <input type="text" placeholder="Enter Email ID" id="register_id" name="register_id" ref={idRef}/>
                <input type="password" placeholder="Enter Password" id="register_password" name="register_password" ref={passRef}/>
                <Button onClick={handleSubmit} variant="contained" color="primary" disableElevation>{loading?<CircularProgress color="secondary" />:"Create Account"}</Button>
            </form>
            <div style={{marginTop:"5px"}}>So easy to create. Already have an account? <Link to ="/login">Login</Link></div>
        </div>
        <div></div>
        </div>
        <Snackbar anchorOrigin={{vertical:'bottom',horizontal:'center'}} open={open} autoHideDuration={1500} onClose={handleClose} message={message}>
      </Snackbar>
        </>
    )
}

export default Register
