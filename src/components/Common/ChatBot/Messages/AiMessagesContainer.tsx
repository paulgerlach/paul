'use client';

import React, { useEffect, useState } from 'react';
import { SiChatbot } from 'react-icons/si';
import Message from './Message';
import { UIMessage, UIDataTypes, UITools, ChatStatus, DefaultChatTransport } from 'ai';
import ChatInput from '../ChatInput';
import { MdOutlineSupportAgent } from 'react-icons/md';
import { useAIMessagesStore } from '@/store/useAIMessagesStore';
import { useChat } from '@ai-sdk/react';

interface AiMessagesContainerProps {
  isExistingClient: boolean;
  toggleChatType:()=> void
}

export default function AiMessagesContainer({
  isExistingClient,
  toggleChatType,
}: AiMessagesContainerProps) {
  const storedMessages = useAIMessagesStore((state) => state.storedMessages);
  const setStoredMessages = useAIMessagesStore(
    (state) => state.setStoredMessages
  );

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
    // To surpress type errors - this will still work correctly at runtime
    initialMessages: storedMessages,
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    setStoredMessages(aiMessages);
  }, [aiMessages, setStoredMessages]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {" "}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="flex flex-col gap-3">
          {aiMessages.length === 0 && (
            <div className="flex justify-start items-center gap-2">
              <SiChatbot
                color="#FFFFFF"
                className="bg-black rounded-full p-2"
                size={40}
              />
              <div className="max-w-[85%] rounded-2xl px-4 py-2 bg-white text-gray-600">
                Hallo! Wie kann ich Ihnen heute helfen?
              </div>
            </div>
          )}

          {aiMessages.map((message) => {
            const isUser = message.role === "user";
            return (
              <Message key={message.id} message={message} isUser={isUser} />
            );
          })}

          {(status === "submitted" || status === "streaming") && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-2 flex items-center gap-2">
                <p className="text-green-900 animate-pulse">Denken...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-start justify-center w-full gap-3 pt-4 border-t border-gray-200">
        {" "}
        {isExistingClient && (
          <button
            title="Send message"
            onClick={toggleChatType}
            className="bg-black text-white rounded-full p-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg cursor-pointer"
          >
            <MdOutlineSupportAgent color="#FFFFFF" size={30} />
          </button>
        )}
        <ChatInput
          sendMessage={sendMessage}
          input={input}
          setInput={setInput}
          status={status}
          stop={stop}
        />
      </div>
    </div>
  );
}
