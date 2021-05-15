
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import {Loading} from "./componets/loading";
import NavigationBar from "./NavigationBar";
import AllHospital from "./AllHospital/AllHospital";
import Favourite from "./Favourite/Favourite";
import Map from "./Map/Map";
import SinglePlace from "./PlaceDetail/PlaceDetail";
import Request from "./request";
import Login from "./webpages/login.js"
import Home from "./webpages/Home";

import "./App.css";
import { useEffect, useState } from "react";
import LocationManage from "./admin_page/loc_man.js";
import CreateLocationForm from "./admin_page/createLocation"
import ModifyLocationForm from "./admin_page/modifyLocation"
import User_man from "./admin_page/user_man.js";
import Reload from "./admin_page/reload.js";
import Admin from "./webpages/admin_panel.js";
import Create_user from "./admin_page/create_user.js";
import Update_user from "./admin_page/update_user.js";

import Cookies from "js-cookie";

function App() {
	if(Request.getCurrentUser() != undefined){
		<Router>
			<Switch>
				<Route path="/login" component={Login}/>
			</Switch>
		</Router>
		if(Request.isAdmin() === true){
			return(
				<>
				<div className="App d-flex">
					<Router>
						<p className="user-name">Login as : {JSON.parse(Cookies.get("auth"))["username"]}</p>
						<h1 className="m-3 theme-grey">Admin Panel</h1>
						<Admin></Admin>
						<Switch>
							<Route path="/userman" component={User_man}/>
							<Route path="/locationManage" component={LocationManage} />
							<Route path="/locationCreate" component={CreateLocationForm}/>
							<Route path="/locationModify/:hospitalId" component={ModifyLocationForm}/>
							<Route path="/reload" component={Reload} />
							<Route path="/create_user" component={Create_user} />
							<Route path="/update_user/:uid" component={Update_user} />
							<Route path="/" component={User_man} />
						</Switch>
					</Router>
				</div>
				</>
			);
		}else{
			return(
				<Home></Home>
			);
		}
	}else{
		// window.location.href = '/login';
		return (
			<div className="App d-flex">
				<Login />
			</div>
		);
	}
}

export default App;
