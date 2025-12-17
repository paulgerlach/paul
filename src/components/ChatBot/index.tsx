'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BotMessageSquare } from "lucide-react";
import AIChatBot from './AIChatBot';
import "./AIChatBot.css";
import { useAIMessagesStore } from '@/store/useAIMessagesStore';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

export default function ChatBotContainer() {
  const [showChatBot, setShowChatBot] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const storedMessages = useAIMessagesStore((state) => state.storedMessages);
  const setStoredMessages = useAIMessagesStore(
    (state) => state.setStoredMessages
  );
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    // @ts-ignore
    // To surpress type errors - this will still work correctly at runtime
    initialMessages: storedMessages,
  });
  const [input, setInput] = useState("");


  useEffect(() => {
    setStoredMessages(messages);
  }, [messages, setStoredMessages]);

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
    <div className="fixed bottom-8 right-8 z-10">
      {showChatBot && (
        <div ref={chatContainerRef} className="chat-window">
          <AIChatBot sendMessage={sendMessage} status={status} stop={stop} messages={messages} input={input} setInput={setInput} />
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
