import React, { useState } from 'react';
import api from '../../api/axios';

const ChatInput = ({ classId, onSend }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await api.post('/chats', {
        class_id: classId,
        message: message.trim(),
      });
      onSend(res.data.chat);
      setMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex items-center gap-2">
      <input
        className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring focus:border-indigo-400"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
