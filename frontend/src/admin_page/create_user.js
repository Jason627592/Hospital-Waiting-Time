
import React, { useEffect, useState } from "react";

import { Loading } from "../componets/loading";
// import {Loading} from "../componets/loading";
import Request from "../request";
import BaseDialog from "../BaseDialog";
import { Helmet } from 'react-helmet';

import "../App.css";

const Create_user = () => {
	let initialState = {
		showDialog: false,
		userNameErrorMessage: "",
		passwordErrorMessage: "",
    userExisted : false,
	};

	const [state, setstate] = useState(initialState);

	function validateUsername() {
		let length = document.querySelector("#username").value.length;
		if (length < 4 || length > 20) {
			setstate({
				...state,
				userNameErrorMessage: "Username should within 4-20 characters",
			});
		} else {
			setstate({ ...state, userNameErrorMessage: "" });
		}
	}

	function validatePassword() {
		let length = document.querySelector("#password").value.length;
		if (length < 4 || length > 20) {
			setstate({
				...state,
				passwordErrorMessage: "Password should within 4-20 characters",
			});
		} else {
			setstate({ ...state, passwordErrorMessage: "" });
		}
	}

	function onDialogOkButtonClicked() {
		setstate({ ...state, showDialog: false, userExisted : false});
    window.location.href = '/';
	}

	function dialogBody() {
    let message = state.userExisted ? "The username existed already" : "User created successfully !";
		return (
			<div>
				<h3>{message}</h3>
				<button
					type="button"
					className="btn btn-outline-secondary my-4"
					onClick={onDialogOkButtonClicked}
				>
					OK
				</button>
			</div>
		);
	}

	function dialogHeading() {
    if (state.userExisted) {
      return(
        <h1>
        <i class="fas fa-exclamation-circle mx-2" style={{ color: "red" }}></i>
				User Existed
			</h1>
      )
    }
    else {
      return(
          <h1>
          <i class="far fa-check-circle mx-2" style={{ color: "green" }}></i>
          User Created
        </h1>
      )
    }
	}

	function showDialog() {
		if (state.showDialog) {
			return (
				<BaseDialog
					heading={dialogHeading()}
					body={dialogBody()}
				></BaseDialog>
			);
		}
	}

  function createUserHandler(){
    setstate({...state, showDialog : true});
  }

  function createUserErrorHandler(){
    setstate({...state, showDialog : true, userExisted : true})
  }

	function createClicked() {
		Request.create_user(
			document.querySelector("#username").value,
			document.querySelector("#password").value,
			document.querySelector("#role").value, createUserHandler, createUserErrorHandler
		);
	}

	return (
		<div
			className="container-fluid center-child"
			style={{ flexDirection: "column" }}
		>
		<Helmet>
        <title>Create User</title>
      	</Helmet>
			<h1 className="my-3 theme-grey">Create New User</h1>
			<div
				className="login-dialog col-xl-3 col-lg-8 col-10 py-4 center-child"
				style={{ flexDirection: "column" }}
			>
				<div className="d-flex container center-child">
					<i class="fas fa-user fa-2x mx-2 theme-grey"></i>
					<div class="form-floating mb-3 col-10">
						<input
							id="username"
							type="text"
							class="form-control"
							placeholder="Username"
							onChange={validateUsername}
						/>
						<label htmlFor="username">Username</label>
					</div>
				</div>
				<p className="theme-red">{state.userNameErrorMessage}</p>
				<div className="d-flex container center-child">
					<i class="fas fa-lock fa-2x mx-2 theme-grey"></i>
					<div class="form-floating mb-3 col-10">
						<input
							id="password"
							type="password"
							class="form-control"
							placeholder="Password"
							onChange={validatePassword}
						/>
						<label htmlFor="password">Password</label>
					</div>
				</div>
				<p className="theme-red">{state.passwordErrorMessage}</p>
				<select name="role" id="role">
					<option value="admin">Admin</option>
					<option value="user">User</option>
				</select>
				<button
					id="login-button"
					type="button"
					class="btn btn-outline-secondary col-10 my-3"
					onClick={createClicked}
				>
					Create
				</button>
			</div>
			{showDialog()}
		</div>
	);
};

export default Create_user;
