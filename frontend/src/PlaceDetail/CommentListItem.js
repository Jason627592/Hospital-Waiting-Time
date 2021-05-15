
import React, { useEffect, useState } from "react";
import Request from "../request";

const CommentListItem = (props) => {
  let initialState = {
    loading: true,
    userName: "",
  };
  const [state, setstate] = useState(initialState);
  const commentInfo = props.comment;
  const datetime = new Date(commentInfo.commentTime);

  useEffect(() => {
    async function fetchUser() {
      await fetch(`${Request.SERVER_URL}user/${commentInfo.userId}`)
        .then((res) => res.json())
        .then((user) => {
          setstate({
            loading: false,
            userName: user.username,
          });
        });
    }
    fetchUser();
  }, []);

  return (
    <div className="card my-2">
      <div className="card-body">
        <div className="row">
          <span className="col-2 avatar avatar-32 avatar-xl-48 bg-secondary text-white rounded-circle ">
            {state.userName.charAt(0)}
          </span>
          <div className="col">
            <h5>{state.userName}</h5>
            <span>
              {datetime.getFullYear()}-{datetime.getMonth() + 1}-
              {datetime.getDate()} {datetime.getHours()}:{datetime.getMinutes()}
            </span>
          </div>
        </div>
        <p>{commentInfo.commentContent}</p>
      </div>
    </div>
  );
};

export default CommentListItem;
