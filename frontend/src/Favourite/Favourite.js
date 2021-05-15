
import React from 'react'

import Request from "../request";
import Login from "../webpages/login.js"

const Favourite = (props) => {
    if(Request.getCurrentUser() != undefined){
        return (
            <div>
                <h1>This is Favourite</h1>
            </div>
        )
    }else{
        window.location.href = "/";
	}
}

export default Favourite
