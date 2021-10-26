import React, { useRef,useState } from 'react'
import '../styles/Register.css';
import {Link,useHistory} from "react-router-dom";
import Button from '@material-ui/core/Button';
import {UseAuth} from '../AuthProvider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';



function Login() {
    const history=useHistory();
    const {signin}=UseAuth();
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
        // Create User Account with auth
        try{
            setLoading(true)
            console.log(idRef.current.value,passRef.current.value)
            await signin(idRef.current.value,passRef.current.value);
            setLoading(false)
            history.push("/");
        }catch(err){
            setLoading(false)
            setOpen(true)
            setMessage(" Couldnt Login :( ")
        }
        

    }
    
    return (
        <>
        <div id="register_container">
        <div id="top">Welcome to SocialMedia-App</div>
        <div style={{margin:"auto auto"}}>
            <form id="register_form" onSubmit={(e)=>e.preventDefault()}>
                <input type="text" placeholder="Enter Email ID" id="login_id" name="login_id" ref={idRef}/>
                <input type="password" placeholder="Enter Password" id="login_password" name="login_password" ref={passRef}/>
                <Button onClick={handleSubmit} variant="contained" color="primary" disableElevation>{loading?<CircularProgress color="secondary" />:"Login"}</Button>
            </form>
            <div style={{marginTop:"5px"}}> Don't have an account? <Link to ="/register">Register</Link></div>
        </div>
        <div></div>
        </div>
        <Snackbar anchorOrigin={{vertical:'bottom',horizontal:'center'}} open={open} autoHideDuration={1500} onClose={handleClose} message={message}>
      </Snackbar>
        </>
    )
}

export default Login;
