import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = () => {
    const [rating, setRating] = useState('');
    const [commentText, setCommentText] = useState('');
    const [bookingId, setBookingId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const commentData = { booking_id: bookingId, rating, comment: commentText };

        try {
            const response = await axios.post('http://localhost:8000/comments/', commentData);
            console.log('Comment submitted', response.data);
        } catch (error) {
            console.error('Error submitting comment', error.response);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Booking ID:</label>
            <input type="text" value={bookingId} onChange={(e) => setBookingId(e.target.value)} required />
            <label>Rating (1-5):</label>
            <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" required />
            <label>Comment:</label>
            <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} required />
            <button type="submit">Submit Comment</button>
        </form>
    );
};

export default CommentForm;
