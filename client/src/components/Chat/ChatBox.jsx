import React from 'react';
import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

const ChatBox = ({ messages }) => {

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

   const safeMessages = Array.isArray(messages) ? messages : [];



  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
      {safeMessages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default ChatBox;
