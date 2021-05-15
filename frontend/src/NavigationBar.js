
import {Link} from "react-router-dom";
import "./App.css";
import Request from "./request";

const NavigationBar = () => {
	return (
		<div className="nav-bar-container col-12">
			<ul className="nav nav-pills flex-column flex-sm-row">
				<li className="nav-item m-3">
					<Link className="nav-link" to="/">
						<i className="far fa-hospital mx-2"></i>All Hospital
					</Link>
				</li>
				<li className="nav-item m-3">
					<Link className="nav-link" to="/map">
						<i className="fas fa-map-marked-alt mx-2"></i>Map
					</Link>
				</li>
				<li className="nav-item m-3">
					<Link className="nav-link" to="/favourite">
						<i class="far fa-heart mx-2"></i>Favourite
					</Link>
				</li>
				<li className="nav-item m-3">
					<Link className="nav-link" to="/locationtable">
					<i class="fas fa-info mx-2"></i>Location Details
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

export default NavigationBar;
