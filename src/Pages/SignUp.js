import React from 'react'
import { TextField} from '@fluentui/react/lib/TextField';
import { Stack} from '@fluentui/react/lib/Stack';
import { DefaultButton} from '@fluentui/react/lib/Button';

const stackTokens = { childrenGap: 100 };
const stackStyles = { root: { width: 650,
  color: '#FFFFFF'   
} };
const columnProps = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 300 } },
};

export default function SignUp() {
    return (
      <div style={{ 
        background: 'gray',
        height:'100vh',
        marginTop:'0px',
        fontSize:'50px',
        backgroundSize: 'cover',
      }}>
    
    <h1 className="Heading">Profile</h1>
    <hr></hr>
    <h2>Enter your info!</h2>
    
    <hr></hr>
    <Stack horizontal tokens={stackTokens} styles={stackStyles}>
      <Stack {...columnProps }>
        <TextField label="First Name" variant="outlined"/>
        <TextField label="State" />
        <TextField label="Street" />
        <TextField label="Car 1 " />
      </Stack>
      <Stack {...columnProps}>
        <TextField label="Last Name" />
        <TextField label="City" />
        <TextField label="Apt." />
        <TextField label="Car 2" />
      </Stack>
      
    </Stack>
    <DefaultButton text="Update Profile"></DefaultButton>
    </div>
    );
}