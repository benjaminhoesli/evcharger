import React from 'react';
import { Grid,TextField } from '@material-ui/core';
import { Button} from 'react-bootstrap';

export default function Journey() {
    return (
        <div style={{ 
            backgroundImage: `url("https://images.unsplash.com/photo-1489641024260-20e5cb3ee4aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2233&q=80")` ,
            height:'100vh',
            marginTop:'0px',
            fontSize:'50px',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}>
    
    <form>
        <Grid>
            <Grid container>
                <Grid item xs={6}><TextField id="origin" label="Origin" variant="outlined" /></Grid>
                <Grid item xs={6}><TextField id="car_model" label="Car Model" variant="outlined" /></Grid>
                <Grid item xs={6}><TextField id="destination" label="Destination" variant="outlined" /></Grid>
                <Grid item xs={6}><TextField id="charge" label="Charge" variant="outlined" /></Grid>
                <Button color="blue" appearance="primary">
                Search Route</Button>                     
            </Grid>
        </Grid>
        </form>
        </div>
        );
        
}

