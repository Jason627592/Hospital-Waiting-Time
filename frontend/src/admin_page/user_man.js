
import React, { useEffect, useState } from "react";

import { Loading } from "../componets/loading";
import Request from "../request";
import BaseDialog from "../BaseDialog";
import { Helmet } from 'react-helmet';


import "../App.css";

const User_man = () => {
	const initialState = {
		loading: true,
		userData: [],
        tempDeleteId : -1,
        deletedUser : false,
	};

	const [state, setstate] = useState(initialState);

	function handleResponse(response) {
		// console.log("response = ", response);
		setstate({
            ...state,
			userData: response,
			loading: false,
            showDialog : false,
		});
	}

	if (state.loading == true) {
		Request.getalluser(handleResponse);
	}

	function gotoCreate() {
		window.location.href = "/create_user";
	}

	function gotoUpdate(uid) {
		window.location.href = "/update_user/" + uid;
	}

    function onDeleteButtonClicked(userId){
        setstate({...state, showDialog : true, tempDeleteId : userId});
    }

	function generateTableRow(key, index) {
        let isAdmin = key["isAdmin"];
        let backgroundColor =  isAdmin ? "#FFEFD5" : "white";
		return (
			<tr scope="row" key={index} style={{backgroundColor : backgroundColor}}>
				<td>{key["userId"]}</td>
				<td>{key["username"]}</td>
				<td>{isAdmin ? "Admin" : "User"}</td>
				<td>
					<button
						type="button"
						class="btn btn-outline-secondary"
						onClick={() => gotoUpdate(key["userId"])}
					>
						Update Info
					</button>
				</td>
				<td>
					<button
						type="button"
						class="btn btn-outline-danger"
						onClick={() => onDeleteButtonClicked(key["userId"])}
					>
						Remove
					</button>
				</td>
			</tr>
		);
	}

    function deleteUserHandler(){
        setstate({...state, deletedUser : true});
    }

    function onDialogYesButtonClicked() {
        Request.delete_user(state.tempDeleteId, deleteUserHandler);
	}

    function onDialogCancelButtonClicked() {
        setstate({...state, showDialog : false, tempDeleteId : -1});
    }

    function onDialogOkButtonClicked(){
        setstate({...state, showDialog : false, deletedUser : false});
		window.location.href = '/';
    }

	function dialogBody() {
        let message = state.deletedUser ? "User deleted successfully" : "Are you sure to delete this user ?";
        let buttons;
        if (state.deletedUser) {
            buttons = <div>
                <button
					type="button"
					className="btn btn-outline-secondary m-4"
					onClick={onDialogOkButtonClicked}
				>
					OK
				</button>
            </div>
        }
        else {
            buttons = <div>
            <button
                type="button"
                className="btn btn-outline-danger m-4"
                onClick={onDialogYesButtonClicked}
            >
                Yes
            </button>
            <button
                type="button"
                className="btn btn-outline-secondary m-4"
                onClick={onDialogCancelButtonClicked}
            >
                Cancel
            </button>
        </div>
        }
		return (
			<div>
				<h3>{message}</h3>
				{buttons}
			</div>
		);
	}

	function dialogHeading() {
		return (
			<h1>
                <i class="fas fa-exclamation-circle mx-2" style={{ color: "red" }}></i>
				Delete user
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

	return (
		<div
			className="container-fluid center-child"
			style={{ backgroundColor: "white", flexDirection: "column" }}
		>
		<Helmet>
        <title>User Management</title>
      	</Helmet>
            {showDialog()}
			<button
				type="button"
				class="btn btn-outline-primary my-2"
				id="create-user-button"
				onClick={() => gotoCreate()}
			>
				Create New User
			</button>
			<div className="d-flex container-fluid row justify-content-center m-2 col-sm-12 col-md-10">
				<table id="admin_show_all_user" className="table">
					<thead>
						<tr>
							<th scope="col">User ID</th>
							<th scope="col">Name</th>
							<th scope="col">Role</th>
							<th scope="col">Update Info</th>
							<th scope="col">Remove User</th>
						</tr>
					</thead>
					<tbody>
						{!state.loading &&
							state.userData != undefined &&
							state.userData.map((key, index) => generateTableRow(key, index))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default User_man;
