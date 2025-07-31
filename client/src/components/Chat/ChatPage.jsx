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
    <div className="flex h-screen">
      {/* Sidebar on the left */}
      <div className="w-1/5 bg-gray-100 shadow">
        <EducatorSidebar />
      </div>

      {/* Main chat content */}
      <div className="flex flex-col w-4/5 bg-white">
        <header className="p-4 bg-indigo-600 text-white text-xl font-bold shadow flex justify-between items-center">
          Class Chatroom
          <button
            className="bg-white text-indigo-600 px-3 py-1 rounded shadow text-sm"
            onClick={() => window.open(`https://meet.jit.si/your-app-room-${classId}-${Date.now()}`, "_blank")}

          >
            Join Video Call
          </button>
        </header>

        {/* Chat messages */}
        <ChatBox messages={messages} />

        {/* Chat input */}
        <ChatInput classId={classId} onSend={handleNewMessage} />
      </div>
    </div>
  );
};

export default ChatPage;
