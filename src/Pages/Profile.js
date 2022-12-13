import React, {useState, useEffect} from 'react'
import { Stack} from '@fluentui/react/lib/Stack';
import { DefaultButton} from '@fluentui/react/lib/Button';
import { Grid,TextField,Button,ButtonGroup } from '@material-ui/core';
import $ from "jquery";
import { usePlacesWidget } from "react-google-autocomplete";
import {app, db, fv, auth, provider} from '../firebase';
import { getFirestore, collection, setDoc, doc,addDoc, getDoc, query, where, getDocs } from 'firebase/firestore';

const stackTokens = { childrenGap: 100 };
const stackStyles = { root: { width: 650,
  color: '#FFFFFF'   
} };
const columnProps = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 300 } },
};
async function writeUserData(userId, name, user_address,user_lat_lon) {
  await setDoc(doc(db, "User Data", userId), {
    fullname : name,
    address : user_address,
    lat_lon:user_lat_lon
  });
}

export default function Profile() {
  const [origin_label, setorigin_label] = useState(false);
  const [origin_latlong, setorigin_latlong] = useState(false);
  //var origin_label = []
  //var origin_latlong = []
  var isOrigValid = false
  var isDestValid = false
  var user_id = localStorage.getItem('u_id')
  const [buttonDisabled, setbuttonDisabled] = useState(true); //
  const [googleLoginState, setgoogleLoginState] = useState(false);
  var notLoggedIn = false
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

  if(user_id === null){
    notLoggedIn = true;
  }
  console.log('U_id',user_id)

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

  const setOrigRef = (place) => {
    //setisOrigValid(true)
    console.log("ORIGREF")
    isOrigValid = true
    console.log(place)
    //origin_label = place.formatted_address
    setorigin_label(place.formatted_address)
    setorigin_latlong([place.geometry.location.lat().toString(),place.geometry.location.lng().toString()])
    //origin_latlong = 
    checkIfSubCanBeDisabled()
  };

  const { ref: addressMaterial } = usePlacesWidget({
    apiKey: 'AIzaSyDUjNVtpL3kt1SBeVFn0ajw5LOuUEU-CBk',
    onPlaceSelected: (place) => setOrigRef(place),
    options: {
      types: ["geocode"],
      componentRestrictions: { country: "us" },
    },
  });
  
  const LogOut = (event) => {
    localStorage.removeItem('u_id');
    localStorage.removeItem('o_latlong');
    localStorage.removeItem('o_label');
    alert("You Were Logged Out");
    window.location.reload();
  };
  const submitUpdate = (event) => {
    console.log('ON CHANGE')
    //setisOrigValid(false)
    isOrigValid = false
    console.log("origin_label",origin_label)
    console.log("origin_latlong",origin_latlong)
    writeUserData(user_id, $("#fullname").val(), origin_label,origin_latlong);
    localStorage.setItem('o_latlong', origin_latlong);
    localStorage.setItem('o_label', origin_label);
    alert("Update Sucessful");
  };
    if(notLoggedIn){
      return(
        <div style={{ 
          backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/White_flag_of_surrender.svg/800px-White_flag_of_surrender.svg.png")` ,
          height:'100vh',
          marginTop:'0px',
          fontSize:'50px',
          backgroundSize: 'cover',
        }}>
      
      <h1 className="Heading">Profile</h1>
      <hr></hr>
      <h2>No Profile Is Signed In</h2>
      
      <hr></hr>
      </div>
      );
    }

    return (
      <div style={{ 
        backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/White_flag_of_surrender.svg/800px-White_flag_of_surrender.svg.png")` ,
        height:'100vh',
        marginTop:'0px',
        fontSize:'50px',
        backgroundSize: 'cover',
      }}>
    
    <h1 className="Heading">Profile</h1>
    <hr></hr>
    <h2>User Information</h2>
    
    <hr></hr>
    <Grid>
            <Grid container justify="center" alignIntems="center" direction="column" spacing={1} xs={4}>
              <TextField label="Full Name" placeholder="Full Name" variant="filled" margin="normal" id="fullname" onChange={setDestValid} InputLabelProps={{ shrink: 'TEMPPPPPPPPP' }}  required/>
              <TextField id="address" label="Address" placeholder="Enter Your Address" variant="filled" margin="normal" onChange={setOrigValid} inputRef={addressMaterial}  required/>               
            </Grid>
    </Grid>
    <Button disabled={buttonDisabled} size="large" className='login-buttons' id='submits' variant="contained" type='submit' color="success" onClick={submitUpdate}>Update Profile</Button>
    <Button size="large" className='logout' id='logout' variant="contained" type='submit' color="success" onClick={LogOut}>Log Out</Button>
    </div>
    );
    
}