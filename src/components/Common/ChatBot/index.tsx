'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PiChatCircleDotsFill } from "react-icons/pi";
import "./AIChatBot.css";
import { FaRegWindowMinimize } from 'react-icons/fa';
import ChatHeader from './ChatHeader';
import AiMessagesContainer from './Messages/AiMessagesContainer';
import SlackMessagesContainer from './Messages/SlackMessagesContainer';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useAIMessagesStore } from '@/store/useAIMessagesStore';
import { Exo_2 } from "next/font/google";

const exo_2Sans = Exo_2({
  variable: "--font-exo_2-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
});

interface ChatBotContainerProps {
  isExistingClient: boolean;
  userId?: string;
}

export default function ChatBotContainer({
  isExistingClient,
  userId,
}: ChatBotContainerProps) {
  const [showChatBot, setShowChatBot] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isSlackChat, setIsSlackChat] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {storedMessages} = useAIMessagesStore();
  const {
    messages: aiMessages,
    sendMessage,
    status,
    stop,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    // @ts-ignore
    initialMessages: storedMessages,
  });

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

  const toggleChatType = () => {
    setIsSlackChat((prev) => !prev);
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[999] ${exo_2Sans.variable}`}>
      {showChatBot ? (
        <div ref={chatContainerRef} className="chat-window !opacity-[95%]">
          <div className="flex flex-col bg-slate-100 p-4 rounded-md shadow-lg h-[100vh] max-w-full relative animate-from-right">
            <FaRegWindowMinimize
              onClick={toggleChatBot}
              className="self-end cursor-pointer hover:-translate-y-1 transition ease-in-out absolute"
            />

            <ChatHeader
              headerText="Kundenservice"
              subHeaderText={isSlackChat ? "Max Sommerfeld" : "Max Sommerfeld"}
            />
            {isSlackChat ? (
              <SlackMessagesContainer
                toggleChatType={toggleChatType}
                userId={userId}
              />
            ) : (
              <AiMessagesContainer
                isExistingClient={isExistingClient}
                toggleChatType={toggleChatType}
                aiMessages={aiMessages}
                sendMessage={sendMessage}
                status={status}
                stop={stop}
              />
            )}
          </div>
        </div>
      ) : (
        <PiChatCircleDotsFill
          onClick={toggleChatBot}
          className="w-auto h-auto bg-dark_green cursor-pointer hover:scale-105 transition ease-in-out rounded-full shadow-md p-4"
          color="#FFFFFF"
          size={28}
        />
      )}

      {!showChatBot && showPopup && (
        <div className="chat-popup animate-from-right">
          Hallo, schreiben Sie uns gern bei Fragen.
        </div>
      )}
    </div>
  );
}
