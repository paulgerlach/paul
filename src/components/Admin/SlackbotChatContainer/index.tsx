'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MessageSquareQuote } from "lucide-react";
import ChatContainer from './ChatContainer';

export default function SlackBotChatContainer() {
  const [showSlackChat, setShowSlackChat] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target as Node)
      ) {
        setShowSlackChat(false);
      }
    };

    if (showSlackChat) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSlackChat]);

  const toggleChat = () => {
    setShowSlackChat((prev) => !prev);
  };
  return (
    <div className="fixed bottom-8 right-8 z-10">
      {showSlackChat && (
        <div ref={chatContainerRef} className="chat-window">
          <ChatContainer />
        </div>
      )}
      <MessageSquareQuote
        onClick={toggleChat}
        className="w-auto h-auto bg-green cursor-pointer hover:scale-105 transition ease-in-out rounded-full shadow-md p-3"
        color="#757575"
        size={40}
      />
    </div>
  );
}
