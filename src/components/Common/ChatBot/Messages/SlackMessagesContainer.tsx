'use client';

import { useSlackChat } from '@/hooks/useSlackChat';
import React from 'react';
import { SiChatbot } from 'react-icons/si';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SlackChatInput from '../SlackChatInput';
import { LuBrainCircuit } from "react-icons/lu";

interface SlackChatBotProps {
  toggleChatType:()=> void
}

export default function SlackMessagesContainer({ toggleChatType }: SlackChatBotProps) {
  const { messages, status } = useSlackChat();
  return (
    <div className="flex flex-col flex-1 min-h-0 animate-from-right">
      {" "}
      <div className="flex flex-col items-start justify-center w-full gap-3 pt-4 border-gray-200 h-full">
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={`flex ${
                isUser ? "justify-end" : "justify-start"
              } gap-2`}
            >
              {!isUser && (
                <SiChatbot
                  color="#FFFFFF"
                  className="bg-black rounded-full p-2"
                  size={40}
                />
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  isUser
                    ? "bg-black text-white rounded-br-sm"
                    : "bg-white text-gray-700 rounded-bl-sm"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: (props: any) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      />
                    ),
                    strong: (props: any) => (
                      <strong {...props} className="font-bold" />
                    ),
                    ul: (props: any) => (
                      <ul {...props} className="list-disc list-inside ml-4" />
                    ),
                    ol: (props: any) => (
                      <ol
                        {...props}
                        className="list-decimal list-inside ml-4"
                      />
                    ),
                    h1: (props: any) => (
                      <h1 {...props} className="text-lg font-bold mt-3" />
                    ),
                    h2: (props: any) => (
                      <h2 {...props} className="text-base font-bold mt-2" />
                    ),
                    h3: (props: any) => (
                      <h3 {...props} className="text-sm font-bold mt-2" />
                    ),
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-start justify-center gap-3 pt-4 border-gray-200 w-full">
        <div className="flex justify-end w-full">
          <div className="max-w-[85%] rounded-2xl px-4 py-2 flex items-center gap-2">
            <p className="text-black-400 animate-pulse text-sm">Slack connection status : {status }</p>
          </div>
        </div>
        <button
          title="Send message"
          onClick={toggleChatType}
          className="bg-black text-white rounded-full p-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg cursor-pointer"
        >
          <LuBrainCircuit color="#FFFFFF" size={30} />
        </button>
        <SlackChatInput />
      </div>
    </div>
  );
}
