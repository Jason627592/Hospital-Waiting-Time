
import React from "react";
import Constant from "../constant/constant";
import Request from "../request";
import Cookies from "js-cookie";
import { Helmet } from 'react-helmet';

const HospitalListItem = (props) => {
	function goToPlaceDetails(){
		window.location = `/place/${props.hospital["hospitalId"]}`;
	}

	return (
		<div className="hospital-list-item-container container col-lg-5 col-md-12 m-2 d-flex p-2">
		<Helmet>
        <title>Hospital List</title>
      	</Helmet>
			<div className="col-3 hospita-list-item-image-container center-child" onClick={() => goToPlaceDetails()}>
				<img
					className="avatar avatar-96 avatar-lg-64 avatar-xl-96 avatar-xxl-96 rounded-circle"
					src={Constant.hospitalPhoto[props.hospital.hospitalId - 1]}
				></img>
			</div>
			<div className="hospital-list-item-right-container container-fluid">
				<div
					className="container-fluid d-flex"
					style={{ height: 30, justifyContent : "flex-end"}}
				>
					<div className="col-10" onClick={() => goToPlaceDetails()}>

					</div>
					<div className="col-2">
						<i className={`mx-2 ${props.favourite ? "fas" : "far"} fa-heart fa-2x favourite-icon`} onClick={() => props.updateFavouriteList(props.hospital.hospitalId)}></i>
					</div>

				</div>
        <div className="row" onClick={() => goToPlaceDetails()}>
					<p className="text-sm-start col hospital-list-item-text mt-2">{props.hospital.name}</p>
					<p className="text-sm-end col hospital-list-item-text mt-2">{props.hospitalPastTenHoursWaitingTime[1]}</p>
				</div>

			</div>
		</div>
	);
};

export default HospitalListItem;
