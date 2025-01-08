import React, { useState } from "react";
import { createComment } from "../services/commentService";

const CreateComment = ({ bookingId, token }) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(1);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newComment = { booking_id: bookingId, content, rating };
      await createComment(newComment, token);
      setContent("");
      setRating(1);
      setError(null);
    } catch (err) {
      setError("Failed to create comment.");
    }
  };

  return (
    <div>
      <h2>Leave a Comment</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          required
        />
        <br />
        <label>Rating (1-5):</label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          required
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CreateComment;
