'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PiChatCircleDotsFill } from "react-icons/pi";
import AIChatBot from './AIChatBot';
import "./AIChatBot.css";
import { useAIMessagesStore } from '@/store/useAIMessagesStore';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fa } from 'zod/v4/locales';
import SlackChatBot from './SlackChatBot';

interface ChatBotContainerProps {
  isExistingClient: boolean;
}

export default function ChatBotContainer({ isExistingClient }:ChatBotContainerProps) {
  const [showChatBot, setShowChatBot] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isSlackChat, setIsSlackChat] = useState(false);
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
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 20000); // 1 minute

    return () => clearTimeout(timer);
  }, []);

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
    <div className="fixed bottom-8 right-8 z-[999]">
      {showChatBot ? (
        <div ref={chatContainerRef} className="chat-window">
          <>
            {isSlackChat ? (
              <SlackChatBot setIsSlackChat={setIsSlackChat} />
            ) : (
              <AIChatBot
                sendMessage={sendMessage}
                status={status}
                stop={stop}
                messages={messages}
                input={input}
                setInput={setInput}
                setShowChatBot={setShowChatBot}
                isExistingClient={isExistingClient}
                setIsSlackChat={setIsSlackChat}
              />
            )}
          </>
        </div>
      ) : (
        <PiChatCircleDotsFill
          onClick={toggleChatBot}
          className="w-auto h-auto bg-black cursor-pointer hover:scale-105 transition ease-in-out rounded-full shadow-md p-4"
          color="#FFFFFF"
          size={28}
        />
      )}

      {!showChatBot && showPopup && (
        <div className="chat-popup animate-from-right">
          Hallo, schrieben Sie uns gern bei Fragen.
        </div>
      )}
    </div>
  );
}
