import React from 'react'
import { TextField} from '@fluentui/react/lib/TextField';
import { Stack} from '@fluentui/react/lib/Stack';

const stackTokens = { childrenGap: 100 };
const stackStyles = { root: { width: 650,
    color: '#FFFFFF'   
} };
const columnProps = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 300 } },
};

export default function Profile() {
    return (
    <div className='App'>
    <h1>Profile</h1>
    <Stack horizontal tokens={stackTokens} styles={stackStyles}>
      <Stack {...columnProps }>
        <TextField label="First Name" />
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
    </div>
    );
}