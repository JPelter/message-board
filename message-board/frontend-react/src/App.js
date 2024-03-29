import React, { useState, useEffect } from 'react';
import './App.css';
import { TextField, Button, Paper } from '@mui/material';
import Markdown from 'react-markdown';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [calledAPI, setCalledAPI] = useState(false);
  const [badAPI, setBadAPI] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_MESSAGE}`);
      const data = await response.json();
      const decodedData = data.map((message) => {
        return {
          ...message,
          content: decodeURIComponent(message.content),
        };
      });
      setMessages(decodedData);
      setBadAPI(false);
      console.log('Messages fetched:', decodedData);
    } catch (error) {
      setBadAPI(true);
      console.error('Error fetching messages:', error);
    }
    setCalledAPI(true);
  };

  const postMessage = async () => {
    try {
      const encodedMessage = encodeURIComponent(newMessage); // Encode the newMessage
      const response = await fetch(`${process.env.REACT_APP_API_MESSAGE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: encodedMessage }), // Use the encodedMessage in the request body
      });
      const data = await response.json();
      const newMessageData = {
        id: data.id,
        content: newMessage,
        post_time: data.post_time,
      };
      setBadAPI(false);
      setMessages([...messages, newMessageData]);
      setNewMessage('');
    } catch (error) {
      setBadAPI(true);
      console.error('Error posting message:', error);
    }
    setCalledAPI(true);
  };
  return (
    <div className="App">
      {calledAPI && badAPI &&
          <div className="NewMessageArea" style={{ display: "flex", justifyContent: "center" }}>
            <Paper style={{ color: "red", margin: "10px", width: "80%", maxWidth: "600px" }}>
              Database might be sleeping. Refresh the page in a few seconds...
            </Paper>
          </div>
      }
      {calledAPI && !badAPI &&
        <div className="MessageBoard">
          <TextField
                label="New Message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                multiline
                maxRows={10}
                inputProps={{ maxLength: 1000 }}
                sx={{ margin: "10px", width: "80%", maxWidth: "600px"}}
              />
          <div className="NewMessageArea" style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" onClick={postMessage} sx={{ margin: "10px" }}>
              Post Message
            </Button>
          </div>
          {[...messages].reverse().map((message) => (
            <Paper key={message.id} elevation={3} sx={{ padding: "5px", margin: "10px" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{padding: "1px", margin: "2px"}}>
                  <strong>{message.id}</strong> 
                </div>
                <div style={{padding: "1px", margin: "2px"}}>
                  <strong>{message.post_time}</strong> 
                </div>
              </div>
              <div style={{ padding: "3px", margin: "6px", textAlign: "left"}}>
              <Markdown components={{ img: ({ node, ...props }) => ( <img {...props} style={{ maxHeight: "250px", maxWidth:"300px" }} alt="" />),}}>
                  {message.content}
                </Markdown>
              </div>
            </Paper>
          ))}
        </div>
      }
    </div>
  );
}
export default App;