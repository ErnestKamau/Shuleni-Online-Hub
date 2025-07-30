import React from 'react';
import { useParams } from 'react-router-dom';
import ChatPage from '../components/Chat/ChatPage';

const ChatPageWrapper = () => {
  const { classId } = useParams();

  return <ChatPage classId={classId} />;
};

export default ChatPageWrapper;
