import React from 'react';
import { Grid,TextField, InputLabel } from '@material-ui/core';
import { Button} from 'react-bootstrap';
import Select from 'react-select'

export default function Journey() {
    return (
        <div style={{ 
            backgroundImage: `url("https://images.unsplash.com/photo-1489641024260-20e5cb3ee4aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2233&q=80")` ,
            height:'100vh',
            marginTop:'0px',
            fontSize:'50px',
            backgroundSize: 'cover',
          }}>
    
    <form>
        <Grid>
            <Grid container>
                <Grid item xs={6}><TextField id="origin" label="Origin" variant="filled" /></Grid>
                <Grid item xs={6}><InputLabel id="carmodel" label="Car Model" /><Select> </Select></Grid>
                <Grid item xs={6}><TextField id="destination" label="Destination" variant="filled" /></Grid>
                <Grid item xs={6}><TextField id="charge" label="Remaining Charge" variant="filled" /></Grid>
                <Button color="blue" appearance="primary">
                Search Route</Button>                     
            </Grid>
        </Grid>

        </form>


        </div>
        
        );
        
}

