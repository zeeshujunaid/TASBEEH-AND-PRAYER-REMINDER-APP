import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyD_zw1ClPLyK5Bv2bfw01LD8RDIy98hbf0",
  authDomain: "tasbeeh-and-namaz-app.firebaseapp.com",
  projectId: "tasbeeh-and-namaz-app",
  storageBucket: "tasbeeh-and-namaz-app.firebasestorage.app",
  messagingSenderId: "1076174190073",
  appId: "1:1076174190073:web:9018ab9a3bf253568cb928"
};

const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase)
export const db = getFirestore(firebase);