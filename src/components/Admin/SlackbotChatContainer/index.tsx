'use client';

import React, { useState } from 'react';
import { MessageSquareQuote } from "lucide-react";

export default function SlackbotChatContainer() {
  const [showChatBot, setShowChatBot] = useState(false);


  const toggleChat = () => {
    setShowChatBot((prev) => !prev);
  };
  return (
    <div className="fixed bottom-8 right-8 z-10">
      <MessageSquareQuote
        onClick={toggleChat}
        className="w-auto h-auto bg-green cursor-pointer hover:scale-105 transition ease-in-out rounded-full shadow-md p-3"
        color="#757575"
        size={40}
      />
    </div>
  );
}
