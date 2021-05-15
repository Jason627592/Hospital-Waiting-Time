
import React from "react";

const BaseDialog = (props) => {
	return (
		<div className="container container-fluid row">
			<div className="bg-layer container d-flex">
				<div className="base-dialog col-xl-3 col-lg-8 col-10 p-2">
					<div className="base-dialog-heading m-2">{props.heading}</div>
					<div className="base-dialog-body">{props.body}</div>
				</div>
			</div>
		</div>
	);
};

export default BaseDialog;
