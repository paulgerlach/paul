'use client';

import React, { useState } from 'react';
import { MessageCircle, Sparkles } from "lucide-react";

export default function ChatBotContainer() {
  const [showChatBot, setShowChatBot] = useState(false);

  return (
    <div className='relative'>
      {showChatBot && (
        <div className="absolute w-80 md:w-96 bg-red-500 rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          <p>The Chat</p>
        </div>
      )}
        <MessageCircle
          onClick={() => setShowChatBot(!showChatBot)}
          className="w-16 h-16 bg-green cursor-pointer hover:scale-105 transition ease-in-out rounded-full shadow-md p-3"
          color="#FFFFFF"
        />
    </div>
  );
}
