import React from 'react'
import {UseAuth} from "../AuthProvider";
import NavBar from "../sub-components/NavBar"
import Profile from '../sub-components/Profile';
import "../styles/MainPage.css"
function MainPage() {
    const {currentUser}=UseAuth();
    return (
        <div>
            {/* {JSON.stringify(currentUser,null,2)} */}
        <div id="Mainpage_container">
            <div id="forNavBar">
                <NavBar/>
            </div>
            <div style={{marginTop:"10px"}}>
                <Profile/>
            </div>
        </div>
        </div>
    )
}

export default MainPage;

