import React, { createContext, useContext, useEffect, useState } from 'react'
import {auth,db} from '../src/firebase/initialize';
const AuthContext=createContext()
export function UseAuth(){
    return useContext(AuthContext)
}
export default function AuthProvider({children}) {
    const [currentUser,setCurrentUser]=useState();
    const [loading, setLoading] = useState(true)
    async function signup(email,password){
        console.log("SIGNUP")
        var r=await auth.createUserWithEmailAndPassword(email,password);
        return r;
    }
    function returnCurrentUser(){
        return auth().currentUser;
    }
    function logout(){
        return auth.signOut();
    }
    async function signin(e,p){
        var r = await auth.signInWithEmailAndPassword(e,p)
        return r;
    }
    async function addProfileData(user,full,nick){
        console.log(`Adding displayName ${full} full_name ${nick} to DB`)
        
            const promise1=await user.updateProfile({
                displayName:full
            })
            const promise2=await db.collection("user_info").doc(user.uid).set({
                full_name:full,
                nick_name:nick,
                email_id:user.email,
                friends:[]
            })
        return Promise.all([promise1,promise2])
    }
    useEffect(()=>{
        const unsubscribe=auth.onAuthStateChanged(user=>{
            setCurrentUser(user);
            setLoading(false);
        })
        return unsubscribe;
    },[])
    const value={
        currentUser,
        signup,
        logout,
        returnCurrentUser,
        addProfileData,
        signin
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}


