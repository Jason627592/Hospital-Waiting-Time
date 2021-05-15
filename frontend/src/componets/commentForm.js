
import React, { useState } from "react";
import Request from "../request";
import cookies from 'js-cookie';

export const CommentForm = (props) => {
  var cookieID = JSON.parse(cookies.get('auth'))
  const initialState = {
    hospitalId: props.hospitalId,
    userID: cookieID.userId,
    comment: "",
    date: "",
  };
  const [state, setState] = useState(initialState);
  const submitNewComment = () => {
    if (window.confirm("Submit this comment?")) {
      var data = {
        hospitalId: state.hospitalId,
        userID: state.userID,
        comment: state.comment,
        date: new Date().getTime(),
      };
      console.log(data);
      fetch(`${Request.SERVER_URL}comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.status === 201) {
            return res.json();
          } else {
            setTimeout(() => {
              alert("Server Error. Please try later");
            }, 2000);
          }
        })
        .then((data) => {
          document.querySelector("button.close-modal").click();
          console.log(data);
          setTimeout(() => {
            alert("Success");
            props.parentCallBack(true);
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
      <div
        className="modal"
        id="new-nomment-modal"
        tabIndex="-1"
        aria-labelledby="CommentModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="CommentModalLabel">
                Type Your Comment
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div>
                <label>Comment</label>
                <textarea
                  className="form-control"
                  id="commentArea"
                  rows="2"
                  value={state.comment}
                  onChange={(e) => {
                    setState({ ...state, comment: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary close-modal"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={submitNewComment}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
