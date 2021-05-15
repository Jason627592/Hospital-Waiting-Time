
import React,{ useEffect, useState } from 'react'
import CommentListItem from "./CommentListItem";

import {Loading} from "../componets/loading";
import { CommentForm } from "../componets/commentForm"
import Request from '../request'


const Comment = (props) => {
    const initialState ={
        loading: true,
        commentList: [],
    }
    const hospitalId = props.hospitalID
    const [state, setstate] = useState(initialState)
    const [toggle, reload] = useState(false)

	function getCommentHandler(response){
        console.log("response = ", response);
		setstate({
			loading : false,
			commentList : response.data,
		})
    }
    console.log(state.commentList)
    function getCommenErrorHandler(error){
        console.log("Get comment error : ", error);
    }
    useEffect(() => {
        Request.getComment(getCommentHandler, getCommenErrorHandler,hospitalId);
    }, [toggle]);
    if(state.loading){
		return <Loading/>
	}
    return (
        <div>
            <h2 className="card-text">Comment on This Hospital</h2>
            <div className="overflow-auto mh-50 commentBox">
            {
                state.commentList.length
                ? state.commentList.map((comment,index) => {
                    return(
                        <CommentListItem comment={comment} key={index}/>
                    )
                })
                : <p>Be the first one to comment</p>
            }
            </div>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#new-nomment-modal">
                Create New Comment
            </button>
            <CommentForm hospitalId ={hospitalId} parentCallBack={reload}/>
        </div>
    )
}

export default Comment
