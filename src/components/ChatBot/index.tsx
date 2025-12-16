'use client';

import React, { useState } from 'react';
import { MessageCircle } from "lucide-react";
import AIChatBot from './AIChatBot';

export default function ChatBotContainer() {
  const [showChatBot, setShowChatBot] = useState(false);

  return (
    <div className='relative'>
      {showChatBot && (
        <div className='z-10 absolute right-8 bottom-8'>
          <AIChatBot/>
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
