'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BotMessageSquare } from "lucide-react";
import AIChatBot from './AIChatBot';
import "./AIChatBot.css";

export default function ChatBotContainer() {
  const [showChatBot, setShowChatBot] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target as Node)
      ) {
        setShowChatBot(false);
      }
    };

    if (showChatBot) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChatBot]);

  const toggleChatBot = () => {
    setShowChatBot((prev) => !prev);
  };

  return (
    <div className="fixed bottom-8 right-8">
      {showChatBot && (
        <div ref={chatContainerRef} className="chat-window">
          <AIChatBot />
        </div>
      )}
      <BotMessageSquare
        onClick={toggleChatBot}
        className="w-auto h-auto bg-green cursor-pointer hover:scale-105 transition ease-in-out rounded-full shadow-md p-3"
        color="#757575"
        size={40}
      />
    </div>
  );
}
