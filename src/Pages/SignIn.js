import React, {useState, useEffect} from 'react'
import '../App.css';
import { Grid,TextField,Button,ButtonGroup } from '@material-ui/core';
import { Stack} from '@fluentui/react/lib/Stack';
import {PrimaryButton } from '@fluentui/react/lib/Button';
import {app, db, fv, auth, provider} from '../firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithRedirect  } from "firebase/auth";
import { usePlacesWidget } from "react-google-autocomplete";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import InputAdornment from '@mui/material/InputAdornment';
import { getFirestore, collection, setDoc, doc,addDoc, getDoc, query, where, getDocs } from 'firebase/firestore'
const buttonProps = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 600 } }
};
const columnProps = {
    tokens: { childrenGap: 0 },
    styles: { root: { width: 340 } }
};



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
/*
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

const db = getFirestore();
*/


//const userRef = collection(db, "User Data");
async function writeUserData(userId, name, user_address,user_lat_lon) {
  await setDoc(doc(db, "User Data", userId), {
    fullname : name,
    address : user_address,
    lat_lon:user_lat_lon
  });
}

async function checkIfUserIsMade(userId){
  const docRef = doc(db, "User Data", userId);
  const docSnap = await getDoc(docRef);
  console.log(docSnap.data())
  return docSnap
}

function SignIn() {

  //const [origin_latlong, setOrigin] = useState(); // Origin Address Geocoded
  //const [origin_label, setOriginLabel] = useState(); // Set Origin Label
  var origin_label = []
  var origin_latlong = []
  var isOrigValid = false
  var isDestValid = false
  var user_id = ''
  const [buttonDisabled, setbuttonDisabled] = useState(true); //
  const [googleLoginState, setgoogleLoginState] = useState(false);
  const [textHidden, settextHidden] = useState(true);
  

  /*
  function logIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      console.log(result.user)
      //setCurrentUser(result.user);
      $("#firstname").val(result.user.multiFactor.user.displayName)
      localStorage.setItem('currentUser', JSON.stringify(result.user));
    }).catch(function(error) {
      console.log(error);
    });
  }
  */
  function redirectPassData(){
    window.u_id = user_id
    localStorage.setItem('u_id', user_id);
    localStorage.setItem('o_latlong', origin_latlong);
    localStorage.setItem('o_label', origin_label);

    navigate('/Journey',
            {
                state: {
                    o_latlong: origin_latlong,
                    o_label:origin_label,
                    u_id:user_id

                }
            });
  }
  const auth = getAuth();
  const navigate = useNavigate();
  function GoogleSignUp(e) {
    //e.preventDefault()
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        sessionStorage.setItem("USER_INFO", JSON.stringify(user));
        sessionStorage.setItem("Username", user['displayName']);
        console.log(user['displayName']);
        console.log(user.uid)
        user_id = user.uid
        writeUserData(user.uid, $("#fullname").val(), origin_label,origin_latlong)
        redirectPassData()
        console.log(origin_label)
        //$("#signInGreet").text("Thank you for signing in " + user['displayName'] + ' are you ready to play? \n Start by Choosing a Challenge');
        //signedIn();

        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
      
  }


  const persistForm = async () => {
    console.log("H------------------------------------")
    var docSnap = await checkIfUserIsMade(user_id)
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      origin_latlong = docSnap.data()['lat_lon']
      origin_label = docSnap.data()['address']
      redirectPassData()
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      settextHidden(false);
    }
  }

  function GoogleLogin(e) {
    //e.preventDefault()
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        sessionStorage.setItem("USER_INFO", JSON.stringify(user));
        sessionStorage.setItem("Username", user['displayName']);
        console.log(user['displayName']);
        console.log(user.uid)
        user_id = user.uid
        setgoogleLoginState(true);
        persistForm();
        //writeUserData(user.uid, $("#fullname").val(), origin_label,origin_latlong)
        //redirectPassData()
        //console.log(origin_label)
        //$("#signInGreet").text("Thank you for signing in " + user['displayName'] + ' are you ready to play? \n Start by Choosing a Challenge');
        //signedIn();

        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
        // The email of the user's account used.
        //const email = error.customData.email;
        // The AuthCredential type that was used.
        //const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
      
  }
  
  
  
  
  
  

  const setOrigRef = (place) => {
    //setisOrigValid(true)
    console.log("ORIGREF")
    isOrigValid = true
    origin_label = place.formatted_address
    origin_latlong = [place.geometry.location.lat().toString(),place.geometry.location.lng().toString()]
    checkIfSubCanBeDisabled()
  };

  const checkIfSubCanBeDisabled = () => {
    console.log("isOrigValid ",isOrigValid)
    console.log("isDestValid ", isDestValid)
    if((isOrigValid === true) && (isDestValid === true)){
      setbuttonDisabled(false)
      $("#submits").prop('disabled', false);
      $("#submits").attr('disabled', false);
      console.log('TRUE')
    }else{
      setbuttonDisabled(true)
      $("#submits").prop('disabled', true);
      $("#submits").attr('disabled', true);
      console.log('NO')
    }
  };


  const { ref: addressMaterial } = usePlacesWidget({
    apiKey: 'AIzaSyDUjNVtpL3kt1SBeVFn0ajw5LOuUEU-CBk',
    onPlaceSelected: (place) => setOrigRef(place),
    options: {
      types: ["geocode"],
      componentRestrictions: { country: "us" },
    },
  });

  const setDestValid = (event) => {
    console.log('ON CHANGE')
    let textLength = event.target.value.length;
    console.log("textLength",textLength)
    if (textLength > 0){
      isDestValid = true
    }else{
      isDestValid = false
    }
    //setIsdestValid(false)
    
    checkIfSubCanBeDisabled()

  };

  const setOrigValid = (event) => {
    console.log('ON CHANGE')
    //setisOrigValid(false)
    isOrigValid = false
    checkIfSubCanBeDisabled()
  };

  /*
  $( "#submit" ).click(function() {
    GoogleLogin();
  });
  //*/

  return (
    <div style={{ 
      backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/White_flag_of_surrender.svg/800px-White_flag_of_surrender.svg.png")` ,
      height:'100vh',
      marginTop:'0px',
      fontSize:'50px',
      backgroundSize: 'cover',
    }}>
    
    <div className='signin'>
      
        <br></br>
        <hr></hr>
        <h1>Welcome to EV Charger, Never Run Out Of Charge!</h1>
        <Grid>
            <Grid container justify="center" alignIntems="center" direction="column" spacing={1} xs={4}>
              <TextField label="Full Name" placeholder="Full Name" variant="filled" margin="normal" id="fullname" onChange={setDestValid} InputLabelProps={{ shrink: 'TEMPPPPPPPPP' }}  required/>
              <TextField id="address" label="Address" placeholder="Enter Your Address" variant="filled" margin="normal" onChange={setOrigValid} inputRef={addressMaterial}  required/>               
            </Grid>
        </Grid>
        <Stack className='login' {...columnProps } >
        
        
        
        </Stack>
        <br></br>
        <Button disabled={buttonDisabled} size="large" className='login-buttons' id='submits' variant="contained"  type='submit' color="success" onClick={GoogleSignUp} >SIGN UP WITH GOOGLE</Button>
        <Button size="large"className='real-login-buttons' id='login' variant="contained" text="" type='submit' color="secondary" onClick={GoogleLogin} >SIGN IN WITH GOOGLE</Button>

    
    <h2 >Please Input Your Name and Address First and Then Sign Up </h2>
    <h2 >If You Already Signed In No Need to Sign Up </h2>
    <h2 id='LoginFailedText' hidden={textHidden}>Your Google Account Has never been used with our site</h2>
    <h2 id='LoginFailedText2' hidden={textHidden}>Please try another Google Account or Sign Up with the one previously tried</h2>
    </div>
    </div>
    );
}


export default SignIn;
