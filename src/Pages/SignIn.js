import React from 'react'
import '../App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { Stack} from '@fluentui/react/lib/Stack';
import {PrimaryButton } from '@fluentui/react/lib/Button';


const buttonProps = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 600 } }
};



function SignIn({setCurrentUser}) {
  function logIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    console.log("hello");
    firebase.auth().signInWithPopup(provider).then(function(result) {
      setCurrentUser(result.user);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
    }).catch(function(error) {
      console.log(error);
    });
  }
  return (
    <div className='signin'>
        <br></br>
        <hr></hr>
        <h1>Welcome to EV Charger</h1>
    
        <br></br>
        <Stack className='login-button-placement' {...buttonProps}>
      
        <PrimaryButton className='login-button' text="SIGN IN WITH GOOGLE" onClick={logIn}></PrimaryButton>
        </Stack>
    <h2> Never Run Out Of Charge!</h2>
    </div>
    );
}

export default SignIn;
