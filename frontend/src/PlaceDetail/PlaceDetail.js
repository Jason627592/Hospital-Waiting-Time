
import React from "react";
import Comment from "./Comment";
import { useParams } from "react-router-dom";
import {
	GoogleMap,
	useLoadScript,
	Marker,
} from "@react-google-maps/api";
import Constant from "../constant/constant";
import HistoricalChart from "./HistoricalChart";
import Cookies from "js-cookie";
import { Helmet } from 'react-helmet';

const SinglePlace = (props) => {
  let { id } = useParams();
  const hospitals = props.hospitalList;
  const hospital = hospitals.find((hospital) => hospital.hospitalId == id);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: Constant.googleMapsApiKey,
  });

  const mapContainerStyle = {
    width: "100%",
    height: "50%",
  };

  const center = {
    lat: hospital.latitude,
    lng: hospital.longitude,
  };

  if (loadError) {
    return "Error loading maps";
  }
  if (!isLoaded) {
    return "Loading Maps";
  }

  console.log("props = ", props);
  console.log("cookie = ", Cookies.get("auth"));

  return (
    <div className="d-flex col-12 p-5 row">
	<Helmet>
	<title>Location Details</title>
	</Helmet>
      <div className="card col-sm-6 p-2">
        <img
          className="card-img-top hospital-image-container"
          src={Constant.hospitalPhoto[id - 1]}
        ></img>
        <div className="card-body">
          <h5 className="card-title">{hospital.name}</h5>
          <h6 className="card-subtitle text-muted">{hospital.address}</h6>
          <Comment hospitalID={hospital.hospitalId} />
        </div>
      </div>
      <div className="col-sm-6 pt-2">
        <div className="card">
          <HistoricalChart
            title={hospital.name}
            hospitalPastTenHoursWaitingTime={
              props.hospitalPastTenHoursWaitingTime[hospital.name]
            }
            hospitalPast7DaysWaitingTime={
              props.hospitalPast7DaysWaitingTime[hospital.name]
            }
          ></HistoricalChart>
        </div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={16}
          center={center}
        >
          <Marker
            key={1}
            position={{
              lat: hospital.latitude,
              lng: hospital.longitude,
            }}
          />
        </GoogleMap>
        {/* <HistoricalChart
						hospitalPastTenHoursWaitingTime={
							props.hospitalPastTenHoursWaitingTime[hospital.name]
						}
						hospitalPast7DaysWaitingTime={
							props.hospitalPast7DaysWaitingTime[hospital.name]
						}
					></HistoricalChart> */}
      </div>
    </div>
  );
};

export default SinglePlace;
