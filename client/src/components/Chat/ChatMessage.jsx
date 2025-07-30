import React from 'react';
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';

const ChatMessage = ({ message }) => {
  const isEducator = message.user_role === 'educator';

  return (
    <div className={`flex ${isEducator ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-3 rounded-xl max-w-md ${isEducator ? 'bg-indigo-200' : 'bg-white'} shadow`}>
        <div className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
          {isEducator ? <FaChalkboardTeacher /> : <FaUserGraduate />}
          {message.user_name} <span className="text-xs text-gray-500">({message.user_role})</span>
        </div>
        <div className="text-gray-900">{message.message}</div>
        <div className="text-xs text-gray-500 mt-1 text-right">{message.relative_time}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
