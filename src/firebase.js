

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import "firebase/compat/auth";
import "firebase/compat/firestore";
import firebase from 'firebase/compat/app';
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
firebase.initializeApp(firebaseConfig);
export default firebase;