import classes from "./comment-list.module.css";

function CommentList({ comments }) {
  return (
    <ul className={classes.comments}>
      {comments.map((comment) => {
        return (
          <li key={comment.id}>
            <p>{comment.text}</p>
            <div>
              By <address>{comment.name}</address>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default CommentList;
