

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { GoogleAuthProvider } from "firebase/auth";
import firebase from 'firebase/compat/app';
//import { getFirestore, collection, setDoc, doc, getDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js'
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBm8S8VVI9RiGlb6YdogAhcM43oGxOTQWw",
  authDomain: "ev-charger-ad212.firebaseapp.com",
  projectId: "ev-charger-ad212",
  storageBucket: "ev-charger-ad212.appspot.com",
  messagingSenderId: "59845437292",
  appId: "1:59845437292:web:0e58c459547b4da7333549",
  measurementId: "G-XLW1Z03NZK"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const fv = firebase.firestore.fieldValue;  // <=
const auth = firebase.auth();
const provider = new GoogleAuthProvider();

export {app, db, fv, auth, provider };

export default firebase;