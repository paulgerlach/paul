'use client';

import React, { useEffect, useRef, useState } from 'react';
import ChatContainer from './ChatContainer';
import { PiChatCircleDotsFill } from 'react-icons/pi';
import './ChatContainer.css'

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
    <div className="fixed bottom-8 right-8  z-[999]">
      {showSlackChat ? (
        <div ref={chatContainerRef} className="chat-window">
          <ChatContainer setShowSlackChat={setShowSlackChat} />
        </div>
      ) : (
        <PiChatCircleDotsFill
          onClick={toggleChat}
          className="w-auto h-auto bg-black cursor-pointer hover:scale-105 transition ease-in-out rounded-full shadow-md p-4"
          color="#FFFFFF"
          size={28}
        />
      )}
    </div>
  );
}
