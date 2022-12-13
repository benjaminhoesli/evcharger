import React, { useState,useEffect }  from 'react';
import { Grid,TextField } from '@material-ui/core';
import { Button} from 'react-bootstrap';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate, useLocation } from "react-router-dom";
import { usePlacesWidget } from "react-google-autocomplete";
import {app, db, fv, auth, provider} from '../firebase';
import { getFirestore, collection, setDoc, doc,addDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import $ from "jquery";


const cars = [
    {
      value: 'porsche:taycan:20:80:base:50kw',
      label: 'Porsche Taycan',
    },
    {
      value: '3long',
      label: 'Tesla Model 3',
    },
    {
      value: 'hyundai:ioniq5:22:74:awd',
      label: 'Hyundai Ioniq 5',
    },
    {
      value: 'audi:etron:19:95',
      label: 'Audi e-tron GT',
    },
    {
    value: 'honda:e:20:36',
    label: 'Honda e',
  },
  ];

async function getUserData(userId) {
  const docRef = doc(db, "User Data", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    console.log("Document data:", docSnap.data()['row1']);
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
  

}



export default function Journey() {
    var { state } = useLocation(null);
    //var state = null;
    console.log(state)
    
    console.log("LOCAL STORARGE STATE", localStorage.getItem('o_latlong'));


    /*
    o_latlong: origin_latlong,
    d_latlong : destination_latlong,
    t_car: car,
    t_state_of_charge: state_of_charge
    */

    //['38.8950368','-77.0365427'] //52.533959,13.404780
    /*
    var origin_latlong = ['38.8950368','-77.0365427'] //52.533959,13.404780
    var destination_latlong = ['35.1335022','-89.9668758'] //51.741505,14.352413
    var car_model = '3long'
    var state_of_charge = '90'

    localStorage.setItem('o_latlong', origin_latlong);
    localStorage.setItem('o_label', origin_label);
    */
    var isOrigValid = false
    var temp_origin_latlong = []
    var temp_origin_label = []
    if((state !== undefined) && (state !== null)){
      //getUserData(state.u_id)
      temp_origin_latlong = state.o_latlong
      temp_origin_label = state.o_label
      isOrigValid = true
      console.log('Change Val')
    }
    if((localStorage.getItem('o_latlong') !== undefined) && (localStorage.getItem('o_latlong') !== null)){
      //getUserData(state.u_id)
      temp_origin_latlong = localStorage.getItem('o_latlong')
      temp_origin_label = localStorage.getItem('o_label')
      isOrigValid = true
      console.log('Change Val')
    }
    console.log("O _ LABEL", temp_origin_label)
    
    const [origin_latlong, setOrigin] = useState(temp_origin_latlong); // Origin Address Geocoded
    const [destination_latlong, setDest] = useState(); // Destination Address Geocoded
    const [car, setCar] = React.useState('3long'); // Set Card Model Value
    const [state_of_charge, setCharge] = useState('100'); // State of The Car Charge
    const [origin_label, setOriginLabel] = useState(temp_origin_label); // Set Origin Label
    const [dest_label, setDestLabel] = useState(); // Set DEst Label
    var isDestValid = false
    //const [isOrigValid, setisOrigValid] = useState(false);
    //const [isDestValid, setIsdestValid] = useState(false);

    const handleChange = (event) => {
        setCar(event.target.value);
    };

    const checkIfSubCanBeDisabled = () => {
      console.log(isOrigValid)
      console.log(isDestValid)
      if((isOrigValid === true) && (isDestValid === true)){
        $("#search-button").prop('disabled', false);
        console.log('TRUE')
      }else{
        $("#search-button").prop('disabled', true);
        console.log('NO')
      }
    };

    const setChargeVal = (event) => {
      let chargeVals = parseInt(event.target.value);
      if (chargeVals > 100){
        $("#charge").val("100");
        chargeVals = 100;
        console.log("over 100")
      }else if(chargeVals < 1){
        console.log("under 0")
        $("#charge").val("1");
        chargeVals = 1;
      }else if(isNaN(chargeVals)){
        $("#charge").val("1");
        chargeVals = 1;
        console.log("NAN")
      }
      setCharge(chargeVals);
      console.log(chargeVals)
      //.target.value
    };
    const setOrigRef= (place) => {
      //setisOrigValid(true)
      isOrigValid = true
      setOriginLabel(place.formatted_address)
      setOrigin([place.geometry.location.lat().toString(),place.geometry.location.lng().toString()])
      checkIfSubCanBeDisabled()
    };
    const setDestRef= (place) => {
      //setIsdestValid(true)
      isDestValid = true
      setDestLabel(place.formatted_address)
      setDest([place.geometry.location.lat().toString(),place.geometry.location.lng().toString()])
      checkIfSubCanBeDisabled()
    };
    const { ref: originMaterialRef } = usePlacesWidget({
      apiKey: 'AIzaSyDUjNVtpL3kt1SBeVFn0ajw5LOuUEU-CBk',
      onPlaceSelected: (place) => setOrigRef(place),
      options: {
        types: ["geocode"],
        componentRestrictions: { country: "us" },
      },
    });
    const { ref: destMaterialRef } = usePlacesWidget({
      apiKey: 'AIzaSyDUjNVtpL3kt1SBeVFn0ajw5LOuUEU-CBk',
      onPlaceSelected: (place) => setDestRef(place),
      options: {
        types: ["geocode"],
        componentRestrictions: { country: "us" },
      },
    });

    const setDestValid = (event) => {
      console.log('ON CHANGE')
      //setIsdestValid(false)
      isDestValid = false
      checkIfSubCanBeDisabled()

    };

    const setOrigValid = (event) => {
      console.log('ON CHANGE')
      //setisOrigValid(false)
      isOrigValid = false
      checkIfSubCanBeDisabled()
    };

    /* setOrigValid
    const [origin_latlong, setOrigin] = useState(); // Origin Address Geocoded
    const [destination_latlong, setDest] = useState(); // Destination Address Geocoded
    const [car, setCar] = React.useState('3long'); // Set Card Model Value
    const [state_of_charge, setCharge] = useState('100'); // State of The Car Charge
    const [origin_label, setOriginLabel] = useState(); // Set Origin Label
    const [dest_label, setDestLabel] = useState(); // Set DEst Label
    */

    const navigate = useNavigate();
    const createPost = (e) => {
        e.preventDefault();
        navigate('/Travel',
            {
                state: {
                    o_latlong: origin_latlong,
                    d_latlong : destination_latlong,
                    t_car: car,
                    t_state_of_charge: state_of_charge,
                    t_origin_label: origin_label,
                    t_dest_label: dest_label
                }
            });
          }
    
    useEffect( () => {
        console.log('here');
    });
    
    return (
        <div style={{ 
            backgroundImage: `url("https://images.unsplash.com/photo-1489641024260-20e5cb3ee4aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2233&q=80")` ,
            height:'100vh',
            marginTop:'0px',
            fontSize:'50px',
            backgroundSize: 'cover',
          }}>

        <form onSubmit={createPost}>

        <Grid>
            <Grid container justify="center" alignIntems="center" direction="row" spacing={1}>
                <Grid item xs={1.5}><TextField id="origin" label="Origin" variant="filled" margin="normal" defaultValue={temp_origin_label} placeholder='Enter your placeholder text here' onChange={setOrigValid} inputRef={originMaterialRef} required/></Grid>
                <Grid item xs={1.5}><TextField id="destination" label="Destination" variant="filled" margin="normal" onChange={setDestValid} inputRef={destMaterialRef} required/></Grid>
                <Grid item xs={1.5}><TextField id="charge" label="Remaining Charge" variant="filled" margin="normal" onChange={setChargeVal} defaultValue="100" 
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
                <Grid item xs={1.5} ><Button id="search-button" color="blue" appearance="primary" type='submit' disabled> Search Route </Button></Grid>                    
            </Grid>
        </Grid>

        </form>


        </div>
        
        );
        
  }
