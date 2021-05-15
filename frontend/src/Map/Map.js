
import React from "react";
import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import {
	GoogleMap,
	useLoadScript,
	Marker,
	InfoWindow,
} from "@react-google-maps/api";

import Request from "../request";
import { Helmet } from 'react-helmet';

const Map = (props) => {
	let hospitalList = props.hospitalList;
	const mapContainerStyle = {
		width: "100%",
		height: "100%",
	};
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: "secret",
	});

	const initialState = {
		selectedHospital: null,
	};
	const [state, setstate] = useState(initialState);

	const center = {
		lat: 22.318237,
		lng: 114.168137,
	};

	useEffect(() => {
		console.log("hospital List = " , props.hospitalList);
	}, []);

	if (loadError) {
		return "Error loading maps";
	}
	if (!isLoaded) {
		return "Loading Maps";
	}
	if(Request.getCurrentUser() != undefined){
		return (
			<div className="map-container col-10 mt-2">
			<Helmet>
	        <title>Google Map</title>
	      	</Helmet>
				<GoogleMap
					mapContainerStyle={mapContainerStyle}
					zoom={15}
					center={center}
				>
					{hospitalList.map((hospital) => (
						<Marker
							key={hospital.hospitalId}
							position={{
								lat: hospital.latitude,
								lng: hospital.longitude,
							}}
							onClick={() => setstate({ ...state, selectedHospital: hospital })}
						/>
					))}
					{state.selectedHospital ? (
						<InfoWindow
	                        options={{pixelOffset : new window.google.maps.Size(0, -30)}}
							position={{
								lat: state.selectedHospital.latitude,
								lng: state.selectedHospital.longitude,
							}}
	                        onCloseClick={() => setstate({...state, selectedHospital : null})}
						>
							<div>
								<h5>{state.selectedHospital.name}</h5>
	                            <p>{state.selectedHospital.address}</p>
	                            <Link className="nav-link" to={{pathname : `/place/${state.selectedHospital.hospitalId}`, state : {hospital : state.selectedHospital}}}>More details</Link>
							</div>
						</InfoWindow>
					) : null}
				</GoogleMap>
			</div>
		);
	}else{
		window.location.href = "/";
	}
};

export default Map;
