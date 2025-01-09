import React from "react";
import { approveComment } from "../services/commentService";

const ApproveComment = ({ commentId, token }) => {
  const handleApprove = async () => {
    try {
      await approveComment(commentId, token);
      alert("Comment approved!");
    } catch (err) {
      alert("Failed to approve comment.");
    }
  };

  return (
    <div>
      <button onClick={handleApprove}>Approve Comment</button>
    </div>
  );
};

export default ApproveComment;
