import React from 'react';
import { SiChatbot } from 'react-icons/si';
import Message from './Message';
import { UIMessage, UIDataTypes, UITools, ChatStatus } from 'ai';

interface AiMessagesContainerProps {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  status: ChatStatus;
}

export default function AiMessagesContainer({ messages, status }: AiMessagesContainerProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-4 min-h-0">
      <div className="flex flex-col gap-3">
        {messages.length === 0 && (
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

        {messages.map((message) => {
          const isUser = message.role === "user";
          return <Message key={message.id} message={message} isUser={isUser} />;
        })}

        {/* Loading/Streaming indicator */}
        {(status === "submitted" || status === "streaming") && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl px-4 py-2 flex items-center gap-2">
              <p className="text-green-900 animate-pulse">Denken...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
