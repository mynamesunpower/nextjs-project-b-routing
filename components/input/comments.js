import { useEffect, useState } from "react";

import CommentList from "./comment-list";
import NewComment from "./new-comment";
import classes from "./comments.module.css";

function Comments(props) {
  const eventId = props.events;

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  function getCommentsById(id) {
    fetch(`/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const comments = data.data;
        setComments(comments);
      });
  }

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
    if (!showComments) {
      getCommentsById(eventId);
    }
  }

  function addCommentHandler(commentData) {
    // send data to API
    const sendData = JSON.stringify({
      eventId,
      email: commentData.email,
      name: commentData.name,
      text: commentData.text,
    });
    fetch(`/api/events/${eventId}`, {
      method: "POST",
      body: sendData,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json)
      .then((what) => {
        console.log(what);
        getCommentsById(eventId);
      });
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && <CommentList comments={comments} />}
    </section>
  );
}

export default Comments;
