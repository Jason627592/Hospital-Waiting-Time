
import React, { useEffect, useState } from "react";
import Request from "../request";
import BaseDialog from "../BaseDialog";
import { Helmet } from 'react-helmet';

const Login = () => {
	let initialState = {
		showDialog: false,
		userNameErrorMessage : "",
		passwordErrorMessage : "",
	};

	const [state, setstate] = useState(initialState);

	function loginErrorHandler(error) {
		console.log("Login error : ", error);
		setstate({ ...state, showDialog: true });
	}
	function loginClicked() {
		Request.login(
			document.querySelector("#username").value,
			document.querySelector("#password").value,
			loginErrorHandler
		);
	}

	function onDialogOkButtonClicked() {
		setstate({ ...state, showDialog: false });
	}

	function dialogBody() {
		return (
			<div>
				<h3>Wrong username/password</h3>
				<button
					type="button"
					className="btn btn-outline-danger my-4"
					onClick={onDialogOkButtonClicked}
				>
					OK
				</button>
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
				Login Failed
			</h1>
		);
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

	function validateUsername(){
		let length = document.querySelector("#username").value.length;
		if (length < 4 || length > 20) {
			setstate({...state, userNameErrorMessage : "Username should within 4-20 characters"});
		}
		else{
			setstate({...state, userNameErrorMessage : ""});
		}
	}

	function validatePassword(){
		let length = document.querySelector("#password").value.length;
		if (length < 4 || length > 20) {
			setstate({...state, passwordErrorMessage : "Password should within 4-20 characters"});
		}
		else{
			setstate({...state, passwordErrorMessage : ""});
		}
	}
	return (
		<div
			className="container-fluid center-child login-parent-container"
		>
		<Helmet>
        <title>Login Page</title>
      	</Helmet>
			<h1 className="my-3 theme-grey">Account Login</h1>
			<div
				className="login-dialog col-xl-3 col-lg-8 col-10 py-4 center-child"
				style={{ flexDirection: "column" }}
			>
				<div className="d-flex container center-child">
					<i class="fas fa-user fa-2x mx-2 theme-grey"></i>
					<div class="form-floating mb-3 col-10">
						<input id="username" type="text" class="form-control" placeholder="Username" onChange={validateUsername}/>
						<label for="username">Username</label>
					</div>
				</div>
				<p className="theme-red">{state.userNameErrorMessage}</p>
				<div className="d-flex container center-child">
					<i class="fas fa-lock fa-2x mx-2 theme-grey"></i>
					<div class="form-floating mb-3 col-10">
						<input id="password" type="password" class="form-control" placeholder="Password" onChange={validatePassword}/>
						<label for="password">Password</label>
					</div>
				</div>
				<p className="theme-red">{state.passwordErrorMessage}</p>
				<button id="login-button" type="button" class="btn btn-outline-secondary col-10 my-3" onClick={loginClicked}>Login</button>

			</div>
			{showDialog()}
		</div>
	);
};

export default Login;
