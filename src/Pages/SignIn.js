import React from 'react'
import '../App.css';
import { TextField} from '@fluentui/react/lib/TextField';
import { Stack} from '@fluentui/react/lib/Stack';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';

const columnProps = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 340 } }
};
const buttonProps = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 700 } }
};
var stackTokens = { childrenGap: 30 };
var stackStyles = {width: 3 };
export default function SignIn() {
    return (
    <div className='signin'>
        <br></br>
        <hr></hr>
        <h1>Welcome to EV Charger</h1>
        <h3 className='login'>Login to your account</h3>
        <Stack className='login' {...columnProps }>
        <TextField label="email" placeholder="email address" variant="outlined"/>
        <TextField label="password" placeholder="Password" />
        </Stack>
        <br></br>
        <Stack className='login-button-placement' {...buttonProps}>
        <DefaultButton className='login-button' text="SIGN IN"></DefaultButton>
        <PrimaryButton className='login-button' text="SIGN IN WITH GOOGLE"></PrimaryButton>
        </Stack>
    <h2> Never Run Out oF Charge!</h2>
    </div>
    );
}


//initialize hash table for username and passwords

// username = prompt()
// password = ''
