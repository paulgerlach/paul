'use client';

import React, { useState } from 'react';
import { BotMessageSquare } from "lucide-react";
import AIChatBot from './AIChatBot';

export default function ChatBotContainer() {
  const [showChatBot, setShowChatBot] = useState(false);

  return (
    <div className="relative">
      {showChatBot && (
        <div className="!z-[9999] absolute right-4 lg:right-8 bottom-8">
          <AIChatBot />
        </div>
      )}
      <BotMessageSquare
        onClick={() => setShowChatBot(!showChatBot)}
        className="w-auto h-auto bg-green cursor-pointer hover:scale-105 transition ease-in-out rounded-full shadow-md p-3"
        color="#757575"
        size={40}
      />
    </div>
  );
}
