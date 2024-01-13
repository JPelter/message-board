import React, { useState, useEffect } from 'react';
import './App.css';
import { TextField, Button, Paper } from '@mui/material';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_MESSAGE}`);
      const data = await response.json();
      setMessages(data);
      console.log('Messages fetched:', data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const postMessage = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_MESSAGE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });
      const data = await response.json();
      const newMessageData = {
        id: data.id,
        content: newMessage,
        post_time: data.post_time,
      };
      setMessages([...messages, newMessageData]);
      setNewMessage('');
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };
  return (
    <div className="App">
      <div className="MessageBoard">
        <TextField
          label="New Message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={postMessage}>
          Post Message
        </Button>
        {messages.map((message) => (
          <Paper key={message.id} elevation={3} sx={{ p: 2, mt: 2 }}>
            <div>
              <strong>ID:</strong> {message.id}
            </div>
            <div>
              <strong>Content:</strong> {message.content}
            </div>
            <div>
              <strong>Post Time:</strong> {message.post_time}
            </div>
          </Paper>
        ))}
      </div>
    </div>
  );
}

export default App;
