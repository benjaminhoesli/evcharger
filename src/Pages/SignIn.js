import React, {useState, useEffect} from 'react'
import '../App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { TextField} from '@fluentui/react/lib/TextField';
import { Stack} from '@fluentui/react/lib/Stack';
import {PrimaryButton } from '@fluentui/react/lib/Button';
import { collection, addDoc, getDoc } from "firebase/firestore";
import {db} from '../firebase';

const buttonProps = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 600 } }
};
const columnProps = {
    tokens: { childrenGap: 0 },
    styles: { root: { width: 340 } }
};





function SignIn({setCurrentUser}) {
  function logIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
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
        <Stack className='login' {...columnProps }>
        <TextField label="First Name" placeholder="First Name" id="firstname"/>
        <TextField label="Last Name" placeholder="Last Name" id="lastname" />
        <TextField label="State" placeholder="State" id="state" />
        <TextField label="City" placeholder="City" id="city" />
        <TextField label="Street" placeholder="Street" id="street" />
        <TextField label="Apt." placeholder="Apt." id="apt" />
        </Stack>
        <br></br>
        <Stack className='login-button-placement' {...buttonProps}>
      
        <PrimaryButton className='login-button' text="SIGN IN WITH GOOGLE" onClick={logIn}></PrimaryButton>
        </Stack>
    <h2> Never Run Out Of Charge!</h2>
    </div>
    );
}


export default SignIn;
