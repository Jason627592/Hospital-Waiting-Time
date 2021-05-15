
import React from 'react'
import { useEffect, useState } from "react";
import {Loading} from "../componets/loading";
import Request from '../request';
import BaseDialog from "../BaseDialog";
import { Helmet } from 'react-helmet';


const Reload = () => {
    let initialState = {
        showDialog : false,
    }

    const [state, setstate] = useState(initialState)
	function onDialogOkButtonClicked() {
		setstate({ ...state, showDialog: false });
        window.location.href = '/';
	}

	function dialogBody() {
		return (
			<div>
				<h3>Reload data successfully</h3>
				<button
					type="button"
					className="btn btn-outline-success my-4"
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
				<i class="far fa-check-circle mx-2" style={{ color: "green" }}></i>
				Successful
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

    function reloadHandler(){
        setstate({...state, showDialog : true});
    }

    function onReloadClicked(){
        Request.refresh_hospital(reloadHandler);
    }



    return (
        <div id="reload-parent-container" className="container-fluid center-child" style={{flexDirection : "column"}}>
        <Helmet>
        <title>Reload Location Data</title>
      	</Helmet>
            {showDialog()}
            <button id="reload-button" type="button" class="btn btn-success rounded-circle" onClick={onReloadClicked}><i class="fas fa-redo fa-3x"></i></button>
        </div>
    );
}

export default Reload;
