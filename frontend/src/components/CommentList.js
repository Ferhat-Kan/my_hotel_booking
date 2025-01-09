import React, { useState, useEffect } from "react";
import { fetchComments } from "../services/commentService";

const CommentList = ({ bookingId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getComments = async () => {
      try {
        const data = await fetchComments(bookingId, 0, 10);
        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments");
      } finally {
        setLoading(false);
      }
    };
    getComments();
  }, [bookingId]);

  if (loading) return <p>Loading comments...</p>;

  return (
    <div>
      <h2>Comments</h2>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.content}</p>
              <p>Rating: {comment.rating}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentList;
