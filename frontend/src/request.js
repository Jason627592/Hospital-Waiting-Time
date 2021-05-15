
import Constant from "./constant/constant";

const axios = require("axios").default;
const FormData = require("form-data");

const SERVER_URL = "http://csci2720-g75.cse.cuhk.edu.hk/";

const API = {
	GET_ALL_HOSPITAL: "hospital",
	GET_COMMENT: "comment",
	GET_FAVOURITE_LIST : "getfavouritelist",
	UPDATE_FAVOURITE_LIST : "updatefavouritelist",
};

// Helper function to get the full path of the url given the API endpoint
function getServerFullPath(parameters) {
	let fullURL = SERVER_URL;
	for (let para of parameters) {
		fullURL += para;
		fullURL += "/";
	}
	//remove the extra "/"
	fullURL = fullURL.slice(0, -1);

	return fullURL;
}

function getHospitalDataFullPath(yyyymmdd_hhmm) {
	return `https://api.data.gov.hk/v1/historical-archive/get-file?url=http%3A%2F%2Fwww.ha.org.hk%2Fopendata%2Faed%2Faedwtdata-en.json&time=${yyyymmdd_hhmm}`;
}

function processFormDataParams(requestBody) {
	console.log(`[request.js] processFormDataParams`, requestBody);
	const form = new FormData();
	for (var key in requestBody) {
		form.append(key, requestBody[key]);
	}
	return form;
}

let getAllHospital = (handleResponse, handleError) => {
	axios
		.get(getServerFullPath([API.GET_ALL_HOSPITAL]))
		.then((response) => {
			handleResponse(response);
		})
		.catch((error) => {
			handleError(error);
		});
};

let getFavouriteList = (userId, handleResponse, handleError) => {
	axios
		.get(getServerFullPath([API.GET_FAVOURITE_LIST, userId]))
		.then((response) => {
			handleResponse(response);
		})
		.catch((error) => {
			handleError(error);
		})
};

let updateFavouriteList = (requestBody, handleResponse, handleError) => {
	let form = processFormDataParams(requestBody);
	console.log("form = ", form);
	axios
		.post(getServerFullPath([API.UPDATE_FAVOURITE_LIST]), form, {
			headers: { "Content-Type": "multipart/form-data" },
		})
		.then(function (response) {
			handleResponse(response.data.result);
		})
		.catch(function (error) {
			handleError(error);
		});
};


let getComment = (handleResponse, handleError,hosiptalID) => {
	axios
		.get(getServerFullPath([API.GET_COMMENT, hosiptalID]))
		.then((res) => {
			handleResponse(res);
		})
		.catch((err) => {
			handleError(err);
		});
};

let getLastTenHours = (handleResponse, handleError) => {
	let date = new Date();
	let lastQuarter = Math.floor(date.getMinutes() / 15) * 15;
	date.setMinutes(lastQuarter);
	date.setHours(date.getHours() - 10);
	// when convert to ISO string later it will become GMT+0, but HK is GMT +8
	date.setHours(date.getHours() + 8);

	for (let i = 0; i < Constant.pastTenHourRequestNumber; i++) {
		//ISOString example : "2021-05-04T12:15:59.322Z"
		//tempDateList : ["2021", "05", "04"]
		let tempDateList = date.toISOString().split("T")[0].split("-");
		//tempTimeList : ["12", "15", "59"]
		let tempTimeList = date.toISOString().split("T")[1].split("\.")[0].split(":");
		let yyyymmdd_hhmm = tempDateList[0] + tempDateList[1] + tempDateList[2] + "-" + tempTimeList[0] + tempTimeList[1];
		date.setMinutes(date.getMinutes() + 15);
		axios.get(getHospitalDataFullPath(yyyymmdd_hhmm))
		.then((res) => {
			// console.log("res = ", res);
			handleResponse(res, yyyymmdd_hhmm);
		})
		.catch((err) => {
			handleError(err);
		});
	}
};

let getLast7DaysThisHour = (handleResponse, handleError) => {
	let date = new Date();
	let lastQuarter = Math.floor(date.getMinutes() / 15) * 15;
	date.setMinutes(lastQuarter);
	// when convert to ISO string later it will become GMT+0, but HK is GMT +8
	date.setHours(date.getHours() + 8);
	for (let i = 0; i < Constant.past7DaysRequestNumber; i++) {
		//ISOString example : "2021-05-04T12:15:59.322Z"
		//tempDateList : ["2021", "05", "04"]
		let tempDateList = date.toISOString().split("T")[0].split("-");
		//tempTimeList : ["12", "15", "59"]
		let tempTimeList = date.toISOString().split("T")[1].split("\.")[0].split(":");
		let yyyymmdd_hhmm = tempDateList[0] + tempDateList[1] + tempDateList[2] + "-" + tempTimeList[0] + tempTimeList[1];
		date.setDate(date.getDate() - 1);
		axios.get(getHospitalDataFullPath(yyyymmdd_hhmm))
		.then((res) => {
			// console.log("get 7 days res : ", res);
			handleResponse(res, yyyymmdd_hhmm);
		})
		.catch((err) => {
			handleError(err);
		});
	}
}

let login = (username, password, handleError) => {
    console.log(username + password);
    fetch(SERVER_URL+"Login",{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({"username": username, "password": password})
    })
      .then(response => response.json())
      // .then(data => console.log(data))
      .then(data => document.cookie = "auth="+JSON.stringify(data))
	  .then(() => {window.location.href = '/'})
      // .then(() => window.location.reload(false))

      .catch((error) =>{
		  handleError(error);
        //   alert("Wrong username/password");
      });
}

let getCurrentUser = () => {
    if(document.cookie == "") return;
    return JSON.parse(document.cookie.substring(5))["username"];
}

let isAdmin = () => {
    if(document.cookie == "") return;
    return JSON.parse(document.cookie.substring(5))["is_admin"];
}
// let auth = () => {
//     fetch(SERVER_URL+"CheckValid", {
//         method: 'POST',
//         headers: {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*'
//         },
//         body: JSON.stringify(document.cookie)
//     })
//       .then(response => response.json())
//       .then(data => console.log(data))
//
//       .catch((error) =>{
//           console.log("error");
//       });
// }

let logout = () => {
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log(document.cookie);
    window.location.reload(false);
	window.location.href = '/login';
}

let getalluser = (handleResponse) => {
	fetch(SERVER_URL+"get_all_user")
	.then((response) => response.json())
	// .then((data) => console.log(data))
	.then((data) => handleResponse(data));
}

let create_user = (username, password, role, handleResponse, handleError) => {
	console.log(username + password + role);
	let admin = "false";
	if(role==="admin"){
		admin = "true";
	}

    fetch(SERVER_URL+"create_user",{
        method: 'POST',
        headers: {
        	'Content-Type': 'application/json',
        },
        body: JSON.stringify({"username": username, "password": password, "is_admin": admin})
    })
      .then(response => response.json())
      .then(data => check_create_success(data["Success"], handleResponse, handleError))
	  // .then(() => {window.location.href = '/'})
	  // .then(() => alert("New User is Created"))
      // .then(() => window.location.reload(false))

      .catch((error) =>{
          alert(error);
      });
}

let check_create_success = (code, handleResponse, handleError) => {
	if(code == 0){
		handleResponse();
		// alert("New user is created");
		// window.location.href = '/';
	}else{
		handleError();
		// alert("The username existed already");
	}
}

let delete_user = (uid, handleResponse) => {
	uid = uid.toString();
	fetch(SERVER_URL+"delete_user", {
        method: 'DELETE',
		headers: {
        	'Content-Type': 'application/json'
        },
        body: JSON.stringify({"user_id": uid})
    })
	.then(response => response.json())
	.then(data => check_delete_success(data["Success"], handleResponse))
	.catch((error) =>{
		alert(error);
	});
}

let delete_loc = (locId) => {
	locId = locId.toString();
	fetch(SERVER_URL+"delete_loc", {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({"hosptal_ID":locId})
	})
	.then(response=>response.json())
	.then(data=>loc_delete_success(data["Success"]))
	.catch((error)=> {
		alert(error);
	});
}

let loc_delete_success = (code)=> {
	if(code==0) {
		alert("The location is delete");
		window.location.href='/';
	} else {
		alert("Failed to delete");
	}
}


let check_delete_success = (code, handleResponse) => {
	if(code == 0){
		handleResponse()
	}else{
		alert("Failed to delete");
	}
}

let get_specific_user_record = (success_callback, uid) =>{
	fetch(SERVER_URL+"get_one_user/"+uid)
	.then((response) => response.json())
	.then((data) => success_callback(data));
}

let update_user = (uid, username, password, role, handleResponse) => {
	console.log(username + password + role);
	let admin = "false";
	if(role==="admin"){
		admin = "true";
	}

    fetch(SERVER_URL+"update_user",{
        method: 'PUT',
        headers: {
        	'Content-Type': 'application/json',
        },
        body: JSON.stringify({"user_id": uid, "username": username, "password": password, "is_admin": admin})
    })
      .then(response => response.json())
      .then(data => check_update_success(data["Success"], handleResponse))
	  // .then(() => {window.location.href = '/'})
	  // .then(() => alert("New User is Created"))
      // .then(() => window.location.reload(false))

      .catch((error) =>{
          alert(error);
      });
}

let check_update_success = (code, handleResponse) => {
	if(code == 0){
		handleResponse()
		// alert("Updated successfully");
		// window.location.href = '/';
	}else{
		alert("Failed to update");
	}
}

let check_update_success1 = (data, handleResponse) => {
	console.log(data);
	if(data.length >= 18){
		handleResponse();
		// alert("Refresh successfully");
		// window.location.href = '/';
	}else{
		alert("Failed to refresh");
	}
}

let refresh_hospital = (handleResponse) => {
	fetch(SERVER_URL+"refresh_hospital")
	.then((response) => response.json())
	// .then((data) => console.log(data))
	.then((data) => check_update_success1(data, handleResponse))
	.catch((error) =>{
		alert(error);
	});
}

export default{
    getAllHospital,
	getFavouriteList,
	updateFavouriteList,
	getComment,
	SERVER_URL,
    // auth : auth,
	getLast7DaysThisHour,
	getLastTenHours,
    login,
    getCurrentUser,
    isAdmin,
    logout,
	getalluser,
	create_user,
	delete_user,
	get_specific_user_record,
	update_user,
	refresh_hospital
}
