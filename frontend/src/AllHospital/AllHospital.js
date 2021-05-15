
import React, { useState, useEffect } from "react";
import Request from "../request";
import { Loading } from "../componets/loading.js";
import Login from "../webpages/login.js";
import HospitalListItem from "./HospitalListItem";
import Cookies from "js-cookie";
import { Helmet } from 'react-helmet';

const AllHospital = (props) => {
	let tempFavouriteList = [];
	let lastUpdateTime = props.hospitalPastTenHoursWaitingTime["Pamela Youde Nethersole Eastern Hospital"][39][0];
	let lastUpdateMonth = lastUpdateTime.substring(4,6);
	let lastUpdateDay = lastUpdateTime.substring(6, 8);
	let lastUpdateHour = lastUpdateTime.substring(9, 11);
	let lastUpdateMinute = lastUpdateTime.substring(11, 13);

	const initialState = {
		hospitals: [],
		favouriteList : [],
		loading: false,
	};

	const [state, setState] = useState(initialState);

	useEffect(() => {
		setState({
			...state,
			hospitals: props.hospitalList,
			favouriteList : props.favouriteList,
		});
		console.log("favourite list = ", props.favouriteList);
	}, []);

	function updateFavouriteListHandler(response){
		console.log("update facourite list successfully");
		setState({...state, favouriteList : tempFavouriteList});
	}

	function updateFavouriteListErrorHandler(error){
		console.log("Update favourite list error : ", error);
	}

	function updateFavouriteList(hospitalId){
        let userId = JSON.parse(Cookies.get("auth"))["userId"];
		tempFavouriteList = state.favouriteList;
        if (!tempFavouriteList.includes(hospitalId)){
			tempFavouriteList.push(hospitalId);
		}
		else {
			let index = tempFavouriteList.indexOf(hospitalId);
			tempFavouriteList.splice(index, 1);
		}
		tempFavouriteList = tempFavouriteList.sort((a, b) => (a - b));
		console.log("tempFavouriteList = ", tempFavouriteList);
		let body = {
			userId : userId,
			favouriteList : `[${tempFavouriteList.toString()}]`,
		}
		Request.updateFavouriteList(body, updateFavouriteListHandler, updateFavouriteListErrorHandler);
    }

	if (Request.getCurrentUser() != undefined) {
		if (props.onlyFavourite){
			if (state.favouriteList.length === 0){
				return (
					<div className="d-flex container-fluid center-child theme-grey" style={{flexDirection : "column"}}>
					<Helmet>
			        <title>My Favourite</title>
			      	</Helmet>
						<h1 className="m-3">Yor favourite list is empty now</h1>
						<br></br>
						<h1 className="m-3">Go and add some into it !</h1>
					</div>
				)
			}
			else {
				return (
					<div className="d-flex container row justify-content-center m-2">
					<Helmet>
			        <title>My Favourite</title>
			      	</Helmet>
						{state.hospitals.map((hospital, index) => {
							if (state.favouriteList.includes(hospital.hospitalId)){
								return (
									<HospitalListItem
										hospital={hospital}
										favourite={true}
										hospitalPastTenHoursWaitingTime={
											props.hospitalPastTenHoursWaitingTime[hospital.name][props.hospitalPastTenHoursWaitingTime[hospital.name].length - 1]
										}
										updateFavouriteList={updateFavouriteList}
										key={index}
									></HospitalListItem>
								);
							}
						})}
					</div>
				);
			}
		}
		else{
			return (
				<div className="d-flex container row justify-content-center m-2">
				<Helmet>
				<title>My Favourite</title>
				</Helmet>
					<h3 className="text-center theme-grey">Last Update Time: {lastUpdateMonth + "/" + lastUpdateDay + " " + lastUpdateHour + ":" + lastUpdateMinute}</h3>
					{state.hospitals.map((hospital, index) => {
						return (
							<HospitalListItem
								hospital={hospital}
								favourite={state.favouriteList.includes(hospital.hospitalId) ? true : false}
								hospitalPastTenHoursWaitingTime={
									props.hospitalPastTenHoursWaitingTime[hospital.name][props.hospitalPastTenHoursWaitingTime[hospital.name].length - 1]
								}
								updateFavouriteList={updateFavouriteList}
								key={index}
							></HospitalListItem>
						);
					})}
				</div>
			);
		}
	} else {
		return (
			<div className="App d-flex">
				<Login />
			</div>
		);
	}
};

export default AllHospital;
