'use client';

import { useSlackChat } from '@/hooks/useSlackChat';
import React from 'react';
import { SiChatbot } from 'react-icons/si';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SlackChatInput from '../SlackChatInput';
import { LuBrainCircuit } from "react-icons/lu";
import {Triangle} from 'react-loader-spinner'

interface SlackChatBotProps {
  toggleChatType: () => void;
  userId?: string;
}

export default function SlackMessagesContainer({
  toggleChatType,
  userId,
}: SlackChatBotProps) {
  const { messages, status } = useSlackChat(userId);

  return (
    <div className="flex flex-col flex-1 min-h-0 animate-from-right  w-full">
      {" "}
      <div className="flex flex-col items-start justify-start w-full gap-3 pt-4 border-gray-200 h-full">
        {messages.length === 0 && status === "ready" && (
          <div className="flex justify-end items-center gap-2">
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
        {messages.map((message) => {
          //Messages from the web platform are technically sent by the Bot
          const isUser = message.role === "assistant";
          return (
            <div
              key={message.id}
              className={`flex ${
                isUser ? "justify-end" : "justify-start"
              } gap-2 w-full`}
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
        {status !== "ready" && (
          <div className="flex flex-row items-center justify-center">
            <Triangle
              visible={true}
              height="28"
              width="28"
              color="#4fa94d"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <>{status === 'sending' ? 'Sending message' : 'Loading messages...'}</>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start justify-center gap-3 pt-4 border-gray-200 w-full">
        <button
          title="Send message"
          onClick={toggleChatType}
          className="bg-black text-white rounded-full p-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg cursor-pointer"
        >
          <LuBrainCircuit color="#FFFFFF" size={30} />
        </button>
        <SlackChatInput userId={userId} />
      </div>
    </div>
  );
}
