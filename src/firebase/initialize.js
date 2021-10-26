import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"

export const app=firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY ,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID
});

export const auth=app.auth();
export const db=app.firestore();
export const fv=firebase.firestore.FieldValue;
export const timestamp=firebase.firestore.Timestamp;


/*
FIREBASE_STRUCTURE
USER_INFO DOCUMENT:--->Full Name, Email ID,Friends[...email IDs],Photos (Try)#Links
CHAT DOCUMENT--->From(emailID),To(emailID),Read(true,false),Time(Date.now()),Message(strings)
(try)PHOTOS DOCUMENT--->Photo Owner,Type of Photo, Photo, 
* */