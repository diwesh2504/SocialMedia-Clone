import React ,{useState}from 'react'
import { UseAuth } from '../AuthProvider'
import Avatar from '@material-ui/core/Avatar';
import profile_pic from "../images/profile_pic.jpg"
import "../styles/MainPage.css"
import Button from '@material-ui/core/Button';
import { Card} from '@material-ui/core';
import { db } from '../firebase/initialize';
import Snackbar from '@material-ui/core/Snackbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import FriendRequests from './FriendRequests';
import MyFriends from './MyFriends';


export default function Profile() {
    const {currentUser}=UseAuth();
    const [usera,setUser]=React.useState()
    const [allUsers,setAllUsers]=useState([])
    const [sendingRequest,setSendingRequest]=useState(false)
    const [text,setText]=useState("")
    const [open,setOpen]=useState("")
    const [searchQuery,setSearchQuery]=useState("");
    const [searchResults,setSearchResults]=useState([]);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
    //Search Results
    const searchFunction=()=>{
        if(!searchQuery){
            setText("Please Type Valid Username/user_id")
            setOpen(true)
            return
        }
        
        setSearchResults(allUsers.filter((user)=>{
            return user.full_name==searchQuery ||user.nick_name==searchQuery || user.full_name.search(searchQuery)!==-1
        }))
        setSearchQuery("");
        
    }
    //Add a Friend
    const handleAdd=async (e)=>{
        const friend_to_add=e.target.id;
        const friend_full_name=e.target.id.split(',')[1];
        //console.log("new friend",friend_to_add)
        //First Check whether the friend request is already pending, TO and FRO.
        var friendRef=db.collection("friend_requests");
        try{
            await friendRef.where("from","==",usera.email).where("to","==",friend_to_add).get().then((q)=>{
               if (q.size>0){
                    throw "Pending"
               }
             });
             await friendRef.where("from","==",friend_to_add).where("to","==",usera.email).get().then((q)=>{
                if (q.size>0){
                    throw "Pending"
               }
             });
             setSendingRequest(true)
            await friendRef.add({
                from:usera.email,
                from_name:usera.displayName,
                to:friend_to_add,
                accepted:false
            }).then(docRef=>{setText("Sent Friend Request");setOpen(true)})
            .catch(err=>{setText("Couldnt Send :(");setOpen(true)})
            setSendingRequest(false)
        }catch(err){
            setText("Request Already Pending")
            setOpen(true) 
        }
        
    }
    React.useEffect(()=>{
        setUser(currentUser);
        const unsubcribeUser=db.collection("user_info").onSnapshot((querySnapshot) => {
            setAllUsers([])
            querySnapshot.forEach((doc)=>{
                setAllUsers(prev=>[...prev,doc.data()])
            })
        });
        return unsubcribeUser;
    },[])
    return (
        <div id="Profile_container">
           <div id="req">
               <FriendRequests/>
           </div>
           
           <div id="containing_search">
               <div id="search_bar">
                   <div><input type="text" onChange={(e)=>setSearchQuery(e.target.value)} value={searchQuery} className="search_friends" placeholder="Search Friends"></input></div>
                   <div><Button  onClick={searchFunction} variant="contained" color="primary" >Search</Button></div>
               </div>
               <div style={{marginTop:"10px"}}>
               
               <div>
                   
                   <div>{sendingRequest?<LinearProgress />:null}</div>
                    <div >{searchResults.length===0?"Search a user by full name..":""}</div>
                   {searchResults.map(user=>{
                
                       return (<div style={{marginTop:"50px"}} id="inside-card">
                           <div>
                                <Avatar src={profile_pic}/>
                           </div>
                           <div>
                                {user.full_name}
                           </div>
                           <div>
                                <button className="btn-add" style ={{border:"none",background:"none"}} id={`${user.email_id}`} onClick={handleAdd}>ADD</button>
                           </div>

                            </div> 
                            );
                   
               })}</div>
               </div>
            </div>
            <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        onClose={handleClose}
        autoHideDuration={1500}
        message={text}
        
      />
        <div><MyFriends/></div>
        </div>
    )
}
