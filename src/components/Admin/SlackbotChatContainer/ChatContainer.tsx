'use client'

import ChatHeader from '@/components/Common/ChatBot/ChatHeader';
import React from 'react'
import { FaRegWindowMinimize } from 'react-icons/fa';
import { SendHorizonal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSlackChat } from '@/hooks/useSlackChat';
import Image from 'next/image';
import { max_chat_avatar } from '@/static/icons';

interface ChatContainerProps {
  setShowSlackChat: React.Dispatch<React.SetStateAction<boolean>>;
  userId?:string
}

export default function ChatContainer({ setShowSlackChat, userId }: ChatContainerProps) {
  const { messages, sendMessage, status, input, setInput } =
    useSlackChat(userId);

  const handleMinimizeChat = () => {
    setShowSlackChat(false);
  };

  return (
    <div className="flex flex-col bg-slate-100 p-4 rounded-md shadow-lg h-[100vh] max-w-full relative animate-from-right">
      <FaRegWindowMinimize
        onClick={handleMinimizeChat}
        className="self-end cursor-pointer hover:-translate-y-1 transition ease-in-out absolute"
      />
      {/* Header */}
      <ChatHeader
        headerText="Slack Support"
        subHeaderText="Max Sommerfeld"
        userId={userId}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-4 min-h-0">
        <div className="flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="flex justify-start items-center gap-2">
              <Image
                alt="chat avatar"
                src={max_chat_avatar.src}
                width={40}
                height={40}
              />
              <div className="max-w-[85%] rounded-2xl px-4 py-2 bg-white text-gray-600">
                Hallo, ich bin Max von Heidi Systems. Gern helfe ich Ihnen bei
                Fragen rund um digitale Verbrauchserfassung und Abrechnung.
              </div>
            </div>
          )}

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
                  <Image
                    alt="chat avatar"
                    src={max_chat_avatar.src}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    isUser
                      ? "dark_green text-white rounded-br-sm"
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

          {/* Loading indicator */}
          {status === "sending" && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-2 flex items-center gap-2">
                <p className="text-green-900 animate-pulse">Senden...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage(input);
          }
        }}
        className="flex gap-2 mt-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== "ready"}
          placeholder="Nachricht schreiben..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-100 disabled:opacity-50"
        />

        {/* Send button */}
        <button
          title="Send message"
          type="submit"
          disabled={status !== "ready" || !input.trim()}
          className="bg-dark_green text-white rounded-full p-3 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          <SendHorizonal size={18} />
        </button>
      </form>
    </div>
  );
}
