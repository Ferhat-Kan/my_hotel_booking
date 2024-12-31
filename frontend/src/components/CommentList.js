import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import { api } from '../services/api';

const CommentList = ({ bookingId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchComments();
    }, [bookingId]);

    const fetchComments = async () => {
        try {
            const response = await api.getComments(bookingId);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async () => {
        try {
            await api.createComment({ booking_id: bookingId, content: newComment });
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <Box>
            <Typography variant="h6">Comments</Typography>
            <List>
                {comments.map((comment) => (
                    <ListItem key={comment.id}>
                        <ListItemText primary={comment.content} />
                    </ListItem>
                ))}
            </List>
            <TextField
                fullWidth
                label="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />
            <Button onClick={handleAddComment} variant="contained" sx={{ mt: 2 }}>
                Submit
            </Button>
        </Box>
    );
};

export default CommentList; 