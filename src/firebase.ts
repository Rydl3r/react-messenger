// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvrgdmLuADKwLg-mwLAlV4ucS8_lPuQM8",
    authDomain: "react-chat-e045e.firebaseapp.com",
    projectId: "react-chat-e045e",
    storageBucket: "react-chat-e045e.appspot.com",
    messagingSenderId: "773044340169",
    appId: "1:773044340169:web:165b7480c3cbd4de0b9418"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);