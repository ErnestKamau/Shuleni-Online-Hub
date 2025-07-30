import React, { useEffect, useState } from 'react';
import ChatBox from './ChatBox';
import ChatInput from './ChatInput';
import api from '../../api/axios'; // Your axios config

const ChatPage = ({ classId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get(`/api/chats?class_id=${classId}`).then(res => {
      setMessages(res.data);
    });
  }, [classId]);

  const handleNewMessage = (newMsg) => {
    setMessages(prev => [...prev, newMsg]);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="p-4 bg-indigo-600 text-white text-xl font-bold shadow">
        Class Chatroom
      </header>
      <ChatBox messages={messages} />
      <ChatInput classId={classId} onSend={handleNewMessage} />
    </div>
  );
};

export default ChatPage;
