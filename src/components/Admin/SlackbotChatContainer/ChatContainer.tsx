'use client'

import ChatHeader from '@/components/Common/ChatBot/ChatHeader';
import React from 'react'
import { FaRegWindowMinimize } from 'react-icons/fa';
import { SiChatbot } from 'react-icons/si';

interface ChatContainerProps {
  setShowSlackChat: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatContainer({ setShowSlackChat }: ChatContainerProps) {
  
  const handleMinimizeChat = () => {
    setShowSlackChat(false);
  };
  return (
    <div className="flex flex-col bg-slate-100 p-4 rounded-md shadow-lg h-[100vh] max-w-full relative animate-from-right">
      <FaRegWindowMinimize
        onClick={handleMinimizeChat}
        className="self-end cursor-pointer hover:-translate-y-1 transition ease-in-out absolute"
      />
      {/* Header */}
      <ChatHeader headerText='Text Support' subHeaderText='Chat Assistant'/>

      <p>ChatContainer</p>
    </div>
  );
}
