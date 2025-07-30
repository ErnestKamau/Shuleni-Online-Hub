import React, { useEffect, useState } from 'react';
import ChatBox from './ChatBox';
import ChatInput from './ChatInput';
import api from '../../api/axios'; // Your axios config
import EducatorSidebar from '../common/EducatorSidebar';

const ChatPage = ({ classId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get(`/chats?class_id=${classId}`).then(res => {
      setMessages(res.data.chats);
    });
  }, [classId]);

  const handleNewMessage = (newMsg) => {
    setMessages(prev => [...prev, newMsg]);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      
      <header className="p-4 bg-indigo-600 text-white text-xl font-bold shadow">
        Class Chatroom
        <button
          className="bg-white text-indigo-600 px-3 py-1 rounded shadow text-sm"
          onClick={() =>window.open(`https://meet.jit.si/your-app-room-${classId}-${Date.now()}`, "_blank")


}

        >
          Join Video Call
        </button>
      </header>
      <ChatBox messages={messages} />
      <ChatInput classId={classId} onSend={handleNewMessage} />
    </div>
  );
};

export default ChatPage;
