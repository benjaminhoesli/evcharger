import React from 'react';
import { Grid,TextField } from '@material-ui/core';
import { Button} from 'react-bootstrap';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

const cars = [
    {
      value: 'Porsche',
      label: 'Porsche Taycan',
    },
    {
      value: 'Tesla',
      label: 'Tesla Model 3',
    },
    {
      value: 'Hyundai',
      label: 'Hyundai Ioniq 5',
    },
    {
      value: 'Audi',
      label: 'Audi e-tron GT',
    },
    {
    value: 'Honda',
    label: 'Honda e',
  },
  ];



export default function Journey() {
    const [car, setCar] = React.useState('Tesla');
    const handleChange = (event) => {
        setCar(event.target.value);
      };
    
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
            <Grid container justify="center" alignIntems="center" direction="row" spacing={1}>
                <Grid item xs={1.5}><TextField id="origin" label="Origin" variant="filled"  margin="normal" /></Grid>
                <Grid item xs={1.5}><TextField id="destination" label="Destination" variant="filled" margin="normal" /></Grid>
                <Grid item xs={1.5}><TextField id="charge" label="Remaining Charge" variant="filled" margin="normal" defaultValue="100" 
                InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}/></Grid>
                <Grid item xs={2}><TextField
                                            id="select-car"
                                            select
                                            label="Car Selection"
                                            value={car}
                                            onChange={handleChange}
                                            helperText="Please select your Car"
                                            >
                                            {cars.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                            </MenuItem>
                                            ))}
                                            </TextField></Grid>
                <Grid item xs={1.5} ><Button id="search-button" color="blue" appearance="primary"> Search Route </Button></Grid>                    
            </Grid>
        </Grid>

        </form>


        </div>
        
        );
        
}

