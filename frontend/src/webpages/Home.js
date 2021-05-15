t { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";

import {Loading} from "../componets/loading";
import NavigationBar from "../NavigationBar";
import AllHospital from "../AllHospital/AllHospital";
import Favourite from "../Favourite/Favourite";
import Map from "../Map/Map";
import SinglePlace from "../PlaceDetail/PlaceDetail";
import Request from "../request";
import Login from "../webpages/login.js"
import LocationTable from "../LocationTable/LocationTable";

import BaseDialog from "../BaseDialog";
import Constant from "../constant/constant";
import Cookies from "js-cookie";
import { Helmet } from 'react-helmet';

import "../App.css";

function App() {
	let tempHospitalPastTenHoursWaitingTime = {};
	let tempHospitalPast7DaysWaitingTime = {};
	let tempFavouriteList = [];
	let pastTenHourRequestCount = 0;
	let past7DaysRequestCount = 0;
	let totalRequestCount = 3;
	let finishedRequest = 0;

	let initialState = {
		loading : true,
		hospitalList : [],
		hospitalPastTenHoursWaitingTime : {},
		hospitalPast7DaysWaitingTime : {},
		favouriteList : [],
		userName : JSON.parse(Cookies.get("auth"))["username"],
	}
	const [state, setstate] = useState(initialState);

	function getAllHospitalHandler(response){
        console.log("response = ", response);
		setstate({
			...state,
			hospitalList : response.data,
			showDialog : false,
		});
    }
    function getAllHospitalErrorHandler(error){
        console.log("Get all hospital error : ", error);
		setstate({...state, showDialog : true, loading : false});
    }
	function getLastTenHoursHandler(response, yyyymmdd_hhmm){
		for (let hospital of response.data[Constant.hospitalDataWaitTimeField]){
			tempHospitalPastTenHoursWaitingTime[hospital[Constant.hospitalDataNameField]].push([yyyymmdd_hhmm, hospital[Constant.hospitalDataTopWaitField]]);
		}
		pastTenHourRequestCount ++;
		if (pastTenHourRequestCount === Constant.pastTenHourRequestNumber){
			finishedRequest++;
			console.log("finishedRequest = ", finishedRequest);
			if (finishedRequest === totalRequestCount){
				setUpNewState();
			}
		}
	}
	function getLastTenHourseErrorHandler(error){
		console.log("Get last ten hours error = ", error);
		setstate({...state, showDialog : true, loading : false});
	}
	function getLast7DaysThisHourHandler(response, yyyymmdd_hhmm){
		for (let hospital of response.data[Constant.hospitalDataWaitTimeField]){
			tempHospitalPast7DaysWaitingTime[hospital[Constant.hospitalDataNameField]].push([yyyymmdd_hhmm, hospital[Constant.hospitalDataTopWaitField]]);
		}
		past7DaysRequestCount ++;
		if (past7DaysRequestCount === Constant.past7DaysRequestNumber){
			finishedRequest++;
			console.log("finishedRequest = ", finishedRequest);
			if (finishedRequest === totalRequestCount){
				setUpNewState();
			}
		}
	}
	function getLast7DaysThisHourErrorHandler(error){
		console.log("Get last 7 days error : ", error);
		setstate({...state, showDialog : true, loading : false});
	}

	function getFavouriteListHandler(response){
		finishedRequest++;
		tempFavouriteList = response.data.result;
		console.log("get favourite list = ", tempFavouriteList);
		if (finishedRequest === totalRequestCount){
			setUpNewState();
		}
	}

	function getFavouriteListErrorHandler(error){
		console.log("Get favourite list error : ", error);
		setstate({...state, showDialog : true, loading : false});
	}

	function setUpNewState(){
		let nameList = state.hospitalList.map((hospital) => hospital.name);
		for(let name of nameList){
			tempHospitalPastTenHoursWaitingTime[name] = tempHospitalPastTenHoursWaitingTime[name].sort();
			tempHospitalPast7DaysWaitingTime[name] = tempHospitalPast7DaysWaitingTime[name].sort();
		}
		setstate({...state, hospitalPast7DaysWaitingTime : tempHospitalPast7DaysWaitingTime, hospitalPastTenHoursWaitingTime : tempHospitalPastTenHoursWaitingTime, favouriteList : tempFavouriteList, loading : false});
	}

	// get all hospital from database when first render
    useEffect(() => {
        Request.getAllHospital(getAllHospitalHandler, getAllHospitalErrorHandler);
    }, []);

	// called after hospital list is not empty, and set up two maps for temporary storing the waiting time
	useEffect(() => {
		if (state.hospitalList.length !== 0){
			for(let hospital of state.hospitalList){
				tempHospitalPastTenHoursWaitingTime[hospital.name] = [];
				tempHospitalPast7DaysWaitingTime[hospital.name] = [];
			}
			console.log("set up tempHospitalWaitingTime : ", tempHospitalPastTenHoursWaitingTime);
			Request.getLastTenHours(getLastTenHoursHandler, getLastTenHourseErrorHandler);
			Request.getLast7DaysThisHour(getLast7DaysThisHourHandler, getLast7DaysThisHourErrorHandler);
			Request.getFavouriteList(JSON.parse(Cookies.get("auth"))["userId"], getFavouriteListHandler, getFavouriteListErrorHandler);
		}
	}, [state.hospitalList]);

	function dialogBody() {
		return (
			<div>
				<h3>Sorry, there are some errors in our server</h3>
			</div>
		);
	}

	function dialogHeading() {
		return (
			<h1>
				<i
					className="far fa-times-circle mx-2"
					style={{ color: "red" }}
				></i>
				Server Error
			</h1>
		);
	}

	function showDialog() {
		return (
			<BaseDialog
				heading={dialogHeading()}
				body={dialogBody()}
			></BaseDialog>
		);
	}

	if (state.showDialog) {
		return showDialog();
	}

	if(state.loading){
		return <Loading/>
	}
    else {
        return(
            <div className="App d-flex">
                <Router>
					<p className="user-name">Login as : {state.userName}</p>
					<div className="m-3 theme-grey container-fluid center-child" id="title-name-container">
						<h1><i class="fas fa-hospital-alt mx-2 theme-grey"></i>Hospital Waiting Time
						</h1>
					</div>
                    <NavigationBar></NavigationBar>
                    <Switch>
                        <Route path="/map" component={() => <Map hospitalList={state.hospitalList}/>} />
                        <Route path="/favourite" component={() => <AllHospital hospitalList={state.hospitalList} favouriteList={state.favouriteList} hospitalPastTenHoursWaitingTime={state.hospitalPastTenHoursWaitingTime} onlyFavourite={true}/>}/>
                        <Route path="/place/:id" component={() => <SinglePlace hospitalList={state.hospitalList} hospitalPastTenHoursWaitingTime={state.hospitalPastTenHoursWaitingTime} hospitalPast7DaysWaitingTime={state.hospitalPast7DaysWaitingTime}/>}/>
						<Route path="/locationtable" component={() => <LocationTable hospitalList={state.hospitalList}/>}/>
                        <Route path="/" component={() => <AllHospital hospitalList={state.hospitalList} favouriteList={state.favouriteList} hospitalPastTenHoursWaitingTime={state.hospitalPastTenHoursWaitingTime} onlyFavourite={false}/>}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
