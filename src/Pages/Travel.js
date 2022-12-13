import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker,Polyline,Tooltip,useMap } from 'react-leaflet'
import axios from "axios";
import L from "leaflet";
import Control from 'react-leaflet-custom-control';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { useLocation } from 'react-router-dom';
import { TailSpin } from  'react-loader-spinner'
import {app, db, fv, auth, provider} from '../firebase';
import { getFirestore, collection, setDoc, doc,addDoc, getDoc, query, where, getDocs } from 'firebase/firestore';

//import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

var origin_latlong = ['38.8950368','-77.0365427'] //52.533959,13.404780
var destination_latlong = ['35.1335022','-89.9668758']//51.741505,14.352413\
var car_model = '3long'
var state_of_charge = '90'

var api_key = 'f4128c06-5e39-4852-95f9-3286712a9f3a'
//f4128c06-5e39-4852-95f9-3286712a9f3a

var url_request = 'https://api.iternio.com/1/plan_light?car_model=' + car_model + '&destinations=[{"lat":'+ origin_latlong[0] +',"lon":'+ origin_latlong[1] +'},{"lat":'+ destination_latlong[0] +',"lon":'+ destination_latlong[1] +'}]&initial_soc_perc=' + state_of_charge + '&api_key=' + api_key

const customMarker = new L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40]
});

var evPoint = L.icon({
    iconUrl: 'https://i.imgur.com/L06O14o.png',
    iconSize:     [30, 40], // size of the icon
});

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay; 
}

function getMiles(meters) {
    return Math.round(meters*0.000621371192);
}

function MyComponent() {
    const map = useMap()
    map.fitBounds([origin_latlong, destination_latlong]);
    console.log('map center:', map.getCenter())
    return null
}
/*
"googleMaps_URL":googleMaps_URL,
"latlong":
"startLocation": 
"pathInfo":
"endLocation": 
"startLocation": 
"chargerMarkers": 
*/
async function writeRouteData(geoHashRoute, g_url,latlon ,startLoc,pathIn ,endLoc,chargerMarkers) {
    ///*
    var merged = latlon.reduce(function(prev, next) {
        return prev.concat(next);
    });

    await setDoc(doc(db, "User Routes", geoHashRoute), {
      g_url :g_url,
      latlon:merged.toString(),
      startLocation:startLoc,
      pathInfo:pathIn,
      endLocation:endLoc,
      chargerMarkers:chargerMarkers
    });
    //*/
    console.log("ROUTE POSTED")

  }
  async function checkIfRouteWasMade(geoHashRoute){
    const docRef = doc(db, "User Routes", geoHashRoute);
    const docSnap = await getDoc(docRef);
    return docSnap
}
export default function Travel() {
    const { state } = useLocation();
    console.log(state)

    /*
    o_latlong: origin_latlong,
    d_latlong : destination_latlong,
    t_car: car,
    t_state_of_charge: state_of_charge
    */

    var origin_latlong = state.o_latlong//['38.8950368','-77.0365427'] //52.533959,13.404780
    var destination_latlong = state.d_latlong//['35.1335022','-89.9668758']//51.741505,14.352413\
    var car_model = state.t_car//'3long'
    var state_of_charge = state.t_state_of_charge//'90'
    var origin_label = state.t_origin_label
    var dest_label = state.t_dest_label

    var api_key = 'f4128c06-5e39-4852-95f9-3286712a9f3a'
    //f4128c06-5e39-4852-95f9-3286712a9f3a

    var url_request = 'https://api.iternio.com/1/plan_light?car_model=' + car_model + '&destinations=[{"lat":'+ origin_latlong[0] +',"lon":'+ origin_latlong[1] +'},{"lat":'+ destination_latlong[0] +',"lon":'+ destination_latlong[1] +'}]&initial_soc_perc=' + state_of_charge + '&api_key=' + api_key
    //url_request = "https://api.iternio.com/1/plan_light?car_model=3long&destinations=[{%22address%22:%20%22Lund,%20Sweden%22},%20{%22address%22:%20%22Hyattsville,%20Maryland%22}]&initial_soc_perc=90&api_key=f4128c06-5e39-4852-95f9-3286712a9f3a"
    const [isLoading, setLoading] = useState(true); // Loading state
    const [routeNA, setRouteNa] = useState(false); // Route Not Available
    const [singleChargeRoute, setsingleChargeRoute] = useState(false); // Loading state

    const [latlong, setlatlong] = useState(); // Polyline Data
    const [endMarker, setendMarker] = useState(); // End Marker Info
    const [response, setresponse] = useState(); // API Response
    const [googleMaps_URL, setgoogleMaps_URL] = useState(); // googleMaps_URL
    const [chargerMarkers, setchargerMarkers] = useState(); // chargerMarkers
    const [startLocation, setStartLocation] = useState(); // startLocation Markers
    const [endLocation, setEndLocation] = useState(); // endLocation Markers
    const [pathInfo, setpathInfo] = useState(); // Route Stats
    ///*
    useEffect(() => {
        (async () => {
            var geohash = require('ngeohash');
            //console.log((startLocation.latlon))
            var enocded_start = geohash.encode(origin_latlong[0],origin_latlong[1]);
            var enocded_stop = geohash.encode(destination_latlong[0],destination_latlong[1]);

            var encoded_Full_route = enocded_start + '-' + enocded_stop + '-' + car_model + '-' + state_of_charge

            const result = await checkIfRouteWasMade(encoded_Full_route)
            if (result.exists()) {
                console.log("Document data:", result.data());
                var doc_data = result.data();
                //console.log('DOC DATA', doc_data['latlon'])
                const merged_v2 = doc_data['latlon'].toString().split(",");
                const newArr = [];
                while(merged_v2.length) newArr.push(merged_v2.splice(0,2));
                setpathInfo(doc_data['pathInfo']);
                setlatlong(newArr);
                setgoogleMaps_URL(doc_data['g_url']);
                setStartLocation(doc_data['startLocation']);
                setEndLocation(doc_data['endLocation']);

                //console.log(chargerMarkers)
                if(doc_data['chargerMarkers'] === '['){
                    setsingleChargeRoute(true);
                    setLoading(false);
                }else{
                    var chargerMarkers = JSON.parse(doc_data['chargerMarkers']);
                    setchargerMarkers(chargerMarkers);
                    setLoading(false);
                }
                
            } else {
                axios.get(url_request)
                .then((t_response) => {
                    console.log("SECOND REQUESTS ------------------------------")
                    
                    const response = t_response.data;
                    console.log(response['result']['routes'])
                    if (response['result']['routes'] === undefined){
                        console.log("UNDEF")
                        setLoading(false);
                        setRouteNa(true)
                    }
                    var totals = response['result']['routes'][0]
                    console.log(totals)
                    var sections = response['result']['routes'][0]['steps']
                    var googleMaps_URL = 'https://www.google.com/maps/dir';
                    var latlong = [];
                    var chargerMarkers = '['
                    for (let i = 0; i < sections.length-1; i++) {
                        var decoded = sections[i]['path']
                        for (let j = 0; j < decoded.length; j++) {
                            var temp = [decoded[j][0], decoded[j][1]]
                            latlong.push(temp);
                        }
                        googleMaps_URL = googleMaps_URL + '/'+ sections[i]['lat'] + ',' + sections[i]['lon']
            
                        if(i !== 0){
                            var temp_str = '{"gps":{ "latitude": ' + sections[i]['lat'] + ',' + '"longitude": ' + sections[i]['lon'] + '}, "label": "' + sections[i]['name'] + '"},'
                            chargerMarkers += temp_str
                        }
                    }
                    if(sections.length === 2){
                        console.log('2 STEP HEHE')
                        var len_step = sections.length-1
                        var startLocation = {}
                        startLocation['latlon'] = [sections[0]['lat'],sections[0]['lon']]
                        startLocation['latlon'] = origin_latlong
                        startLocation['label'] = origin_label
                        console.log("-----------------------------------")
                        console.log(sections[0])
                        console.log("-----------------------------------")
            
                        var endLocation = {}
                        endLocation['latlon'] = [sections[len_step]['lat'],sections[len_step]['lon']]
                        endLocation['latlon'] =  destination_latlong
                        endLocation['label'] = dest_label
            
                        var pathInfo = '' + endLocation['label'] + '<br /> Total Distance: ' + getMiles(totals['total_drive_distance']) + ' Miles<br /> Total Travel Time: '+ secondsToHms((totals['total_drive_duration'] + totals['total_charge_duration']))  + '<br /> Total Drive Time: ' +secondsToHms(totals['total_drive_duration']) + '<br /> Total Charge Time: ' + secondsToHms(totals['total_charge_duration'])
            
                        googleMaps_URL = googleMaps_URL + '/' + sections[len_step]['lat'] + ',' + sections[len_step]['lon']
                        console.log(googleMaps_URL)
                        
                        setpathInfo(pathInfo);
                        setlatlong(latlong);
                        setresponse(response);
                        setgoogleMaps_URL(googleMaps_URL);
                        setEndLocation(endLocation);
                        setStartLocation(startLocation);
                        setsingleChargeRoute(true);
                        setLoading(false);
            
                        /*
                        var car_model = '3long'
                        var state_of_charge = '90'
                        */
                        var geohash = require('ngeohash');
                        //console.log((startLocation.latlon))
                        var enocded_start = geohash.encode(origin_latlong[0],origin_latlong[1]);
                        var enocded_stop = geohash.encode(destination_latlong[0],destination_latlong[1]);
            
                        var encoded_Full_route = enocded_start + '-' + enocded_stop + '-' + car_model + '-' + state_of_charge
            
            
            
                        writeRouteData(encoded_Full_route,googleMaps_URL,latlong,startLocation,pathInfo,endLocation,chargerMarkers)
                    }else{
                        chargerMarkers = chargerMarkers.slice(0, -1);
                        chargerMarkers += ']'
                        console.log(chargerMarkers)
                        var jsonChargeMarkers = chargerMarkers
                        chargerMarkers = JSON.parse(chargerMarkers);
                        var len_step = sections.length-1
            
                        var startLocation = {}
                        startLocation['latlon'] = [sections[0]['lat'],sections[0]['lon']]
                        startLocation['latlon'] = origin_latlong
                        startLocation['label'] = origin_label
            
                        var endLocation = {}
                        endLocation['latlon'] = [sections[len_step]['lat'],sections[len_step]['lon']]
                        endLocation['latlon'] =  destination_latlong
                        endLocation['label'] = dest_label
            
                        var pathInfo = '' + endLocation['label'] + '<br /> Total Distance: ' + getMiles(totals['total_drive_distance']) + ' Miles<br /> Total Travel Time: '+ secondsToHms((totals['total_drive_duration'] + totals['total_charge_duration']))  + '<br /> Total Drive Time: ' +secondsToHms(totals['total_drive_duration']) + '<br /> Total Charge Time: ' + secondsToHms(totals['total_charge_duration'])
            
                        googleMaps_URL = googleMaps_URL + '/'+ sections[len_step]['lat'] + ',' + sections[len_step]['lon']
                        console.log(googleMaps_URL)
                        
                        setpathInfo(pathInfo);
                        setlatlong(latlong);
                        setresponse(response);
                        setgoogleMaps_URL(googleMaps_URL);
                        setchargerMarkers(chargerMarkers);
                        setEndLocation(endLocation);
                        setStartLocation(startLocation);
                        setLoading(false);
                        console.log(totals);
            
                        var geohash = require('ngeohash');
                        //console.log((startLocation.latlon))
                        var enocded_start = geohash.encode(origin_latlong[0],origin_latlong[1]);
                        var enocded_stop = geohash.encode(destination_latlong[0],destination_latlong[1]);
            
                        var encoded_Full_route = enocded_start + '-' + enocded_stop + '-' + car_model + '-' + state_of_charge
            
                        writeRouteData(encoded_Full_route,googleMaps_URL,latlong,startLocation,pathInfo,endLocation,jsonChargeMarkers)
                    }
                
                    });
            }
        })();
        return () => {
            console.log('hello')
        };
    }, []);
    //*/
    

    //writeRouteData(geoHashRoute, routes, g_url,latlon ,startLoc,pathIn ,endLoc,chargerMarkers)
    //writeRouteData("TEST ROUTE CALL",googleMaps_URL,latlong,startLocation,pathInfo,endLocation,chargerMarkers)
    
    if (isLoading) {
        return (
            <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            }}>Loading the Route Data {console.log("loading state")}
            <TailSpin
            height="80"
            width="80"
            color="#000000"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            />
            </div>
        );
    }
    if (routeNA) {
        return (
            <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            }}>Sorry Your Route Was not able to calculate Please Retry with either a higher charge value or different starting or ending locations {console.log("loading state")}</div>
        );
    }
    if(singleChargeRoute){
        return (
            <div>
                <MapContainer zoom={13} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline pathOptions={{ color: "yellow" }} positions={latlong} />
                <MyComponent />
                <Marker position={startLocation['latlon']}>
                    <Tooltip content={startLocation['label']} permanent>
                    </Tooltip>
                </Marker>
    
                <Marker position={endLocation['latlon']}  >
                    <Tooltip content={pathInfo} permanent>
                    </Tooltip>
                </Marker>
                </MapContainer>
    
                <Control prepend position='topright'>
                    <DefaultButton style={{ margin: 'auto' }} onClick={ () => window.open(googleMaps_URL) } className='login-button' size="large" text="Directions On Google Maps"></DefaultButton>
                </Control>
                
            </div>
        );
    }
    return (
        <div>
            <MapContainer zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline pathOptions={{ color: "yellow" }} positions={latlong} />

            {chargerMarkers.map(chargeMark => (
                <Marker position={[chargeMark.gps.latitude, chargeMark.gps.longitude]} offset={[20,0]} icon={evPoint}>
                    <Tooltip content={chargeMark.label} permanent>
                    </Tooltip>
                </Marker>
            ))}
            <MyComponent />
            <Marker position={startLocation['latlon']}>
                <Tooltip content={startLocation['label']} permanent>
                </Tooltip>
            </Marker>

            <Marker position={endLocation['latlon']}  >
                <Tooltip content={pathInfo} permanent>
                </Tooltip>
            </Marker>
            </MapContainer>

            <Control prepend position='topright'>
                <DefaultButton style={{ margin: 'auto' }} onClick={ () => window.open(googleMaps_URL) } className='login-button' size="large" text="Directions On Google Maps"></DefaultButton>
            </Control>
            
        </div>
    );
}


