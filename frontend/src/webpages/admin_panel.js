
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "../App.css";
import Request from "../request";

const Admin = () => {
	return (
		<div className="nav-bar-container col-12">
			<ul className="nav nav-pills flex-column flex-sm-row">
				<li className="nav-item m-3">
					<Link className="nav-link" to="/userman">
						<i className="far mx-2"></i>User Management
					</Link>
				</li>

				<li className="nav-item m-3">
					<Link className="nav-link" to="/locationManage">
						<i className="fas mx-2"></i>Location Management
					</Link>
				</li>

				<li className="nav-item m-3">
					<Link className="nav-link" to="/reload">
						Reload Data
					</Link>
				</li>

				<li className="nav-item m-3">
					<button id="logout_button" onClick={() => Request.logout()}>
						<a className="nav-link">
							<i className="fas fa-sign-out-alt mx-2"></i>Log out
						</a>
					</button>
				</li>
			</ul>
		<br></br>
		</div>
	);
};

export default Admin;
