
import React,{ useEffect, useState } from 'react';
import {useParams} from "react-router-dom";
import BaseDialog from "../BaseDialog";
import Request from '../request';
import "../App.css";
import { Helmet } from 'react-helmet';


const Update_user = () => {
    const initialState = {
		user_info: [],
		loading: false,
    showDialog: false,
		userNameErrorMessage: "",
		passwordErrorMessage: "",
	};

	const [state, setstate] = useState(initialState);
    let {uid} = useParams();

    if(state.loading==false){
        Request.get_specific_user_record(load_data_to_state, uid);
    }

    function load_data_to_state(data){
        setstate({
			user_info: data,
			loading : true,
		});
    }

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
      setstate({ ...state, showDialog: false});
      window.location.href = '/';
    }

    function dialogBody() {
      return (
        <div>
          <h3>Updated user successfully</h3>
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
        return(
            <h1>
            <i class="far fa-check-circle mx-2" style={{ color: "green" }}></i>
            User Updated
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

    function updateUserHandler(){
      setstate({...state, showDialog : true});
    }

    function updateClicked(){
      Request.update_user(uid, document.querySelector("#username").value, document.querySelector("#password").value, document.querySelector("#role").value, updateUserHandler);
    }

    if(state.loading==false) return null;

    return (
      <div
        className="container-fluid center-child"
        style={{ flexDirection: "column" }}
      >
      <Helmet>
        <title>Update User Information</title>
      	</Helmet>
        <h1 className="my-3 theme-grey">Update User Info</h1>
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
                defaultValue={state.user_info[0]["username"]}
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
          <select name="role" id="role" defaultValue={state.user_info[0]["isAdmin"]==true? "admin":"user"}>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button
            id="login-button"
            type="button"
            class="btn btn-outline-secondary col-10 my-3"
            onClick={updateClicked}
          >
            Update
          </button>
        </div>
        {showDialog()}
      </div>
    );
}

export default Update_user;
