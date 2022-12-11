import React, { useState } from 'react'
import { TextField} from '@fluentui/react/lib/TextField';
import { Stack} from '@fluentui/react/lib/Stack';
import { DefaultButton} from '@fluentui/react/lib/Button';
import data from "../mock-data.json"
const stackTokens = { childrenGap: 100 };
const stackStyles = { root: { width: 650,
  color: '#FFFFFF'   
} };
const columnProps = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 300 } },
};

export default function Profile() {
  const [ info, setInfo] = useState(data);
  console.log(info[0].firstName);

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
    <h2>User Information</h2>
    
    <hr></hr>
    <Stack horizontal tokens={stackTokens} styles={stackStyles}>
      <Stack {...columnProps }>
        <TextField label="First Name" value={info[0].firstName}/>
        <TextField label="State" value={info[0].state}/>
        <TextField label="Street" value={info[0].street}/>
      </Stack>
      <Stack {...columnProps}>
        <TextField label="Last Name" value={info[0].lastName} />
        <TextField label="City" value={info[0].city} />
        <TextField label="Apt." value={info[0].apt}/>
      </Stack>
      
    </Stack>
    <DefaultButton text="Update Profile"></DefaultButton>
    </div>
    );
    
}