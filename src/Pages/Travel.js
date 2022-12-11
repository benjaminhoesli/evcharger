import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker,Polyline,Tooltip,useMap } from 'react-leaflet'
import axios from "axios";
import L from "leaflet";
import Control from 'react-leaflet-custom-control';
import { DefaultButton } from '@fluentui/react/lib/Button';

//var map = useMap()

const position = ['38.8950368','-77.0365427']

var origin_latlong = ['38.8950368','-77.0365427'] //52.533959,13.404780


var destination_latlong = ['36.1672559','-115.148516']//51.741505,14.352413
destination_latlong = ['35.1335022','-89.9668758']
//35.1335022,-89.9668758

var ev_reachable = 'true'

var car_model = 'hyundai:kona:19:64:other'

var api_key = 'f4128c06-5e39-4852-95f9-3286712a9f3a'
//f4128c06-5e39-4852-95f9-3286712a9f3a
//&ev[connectorTypes]=iec62196Type2Combo
//&ev[connectorTypes]=j1772
var url_request = 'https://api.iternio.com/1/plan?destinations=[{"lat":'+ origin_latlong[0] +',"lon":'+ origin_latlong[1] +'},{"lat":'+ destination_latlong[0] +',"lon":'+ destination_latlong[1] +'}]&car_model='+ car_model +'&path_steps=false&path_polyline=true&ref_consumption=200&fast_chargers=ccs&&realtime_weather=false&initial_soc_perc=90&charger_soc_perc=10&charger_max_soc_perc=100.0&arrival_soc_perc=10&charge_overhead=300&speed_factor_perc=100&max_speed=150&allow_ferry=true&allow_motorway=true&allow_toll=true&allow_border=true&adjust_speed=false&outside_temp=20&wind_speed=0.0&wind_dir=head&road_condition=normal&extra_weight=0&find_alts=false&find_next_charger_alts=false&exclude_ids=0&network_preferences={}&preferred_charge_cost_multiplier=0.7&nonpreferred_charge_cost_addition=0&group_preferences={}&access_groups=[]&allowed_dbs=ocm&api_key=' + api_key

var car_model = '3long'
//car_model = 'hyundai:kona:19:64:other'
var state_of_charge = '90'

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
export default function Travel() {


    const [isLoading, setLoading] = useState(true); // Loading state
    const [latlong, setlatlong] = useState(); // Polyline Data
    const [endMarker, setendMarker] = useState(); // End Marker Info
    const [response, setresponse] = useState(); // API Response
    const [googleMaps_URL, setgoogleMaps_URL] = useState(); // googleMaps_URL
    const [chargerMarkers, setchargerMarkers] = useState(); // chargerMarkers
    const [startLocation, setStartLocation] = useState(); // startLocation Markers
    const [endLocation, setEndLocation] = useState(); // endLocation Markers
    const [pathInfo, setpathInfo] = useState(); // Route Stats
    
    useEffect(() => {
    setTimeout(() => {
    axios.get(url_request)
    .then((t_response) => {
        const response = t_response.data;
        var totals = response['result']['routes'][0]
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
        chargerMarkers = chargerMarkers.slice(0, -1);
        chargerMarkers += ']'
        console.log(chargerMarkers)
        chargerMarkers = JSON.parse(chargerMarkers);
        var len_step = sections.length-1

        var startLocation = {}
        startLocation['latlon'] = [sections[0]['lat'],sections[0]['lon']]
        startLocation['label'] = sections[0]['name']

        var endLocation = {}
        endLocation['latlon'] = [sections[len_step]['lat'],sections[len_step]['lon']]
        endLocation['label'] = sections[len_step]['name']

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
        });
    }, 3000);
    }, []);
    
    if (isLoading) {
        return (
            <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            }}>Loading the Route Data {console.log("loading state")}</div>
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


