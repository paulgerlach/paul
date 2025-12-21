import { max_chat_avatar } from '@/static/icons';
import { SlackMessage } from '@/types/Chat';
import Image from 'next/image';
import React from 'react'
import { Triangle } from 'react-loader-spinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SlackMessageContainerProps{
  message:SlackMessage
}

export default function SlackMessageContainer({ message }: SlackMessageContainerProps) {
  const isUser = message.role === "assistant";
  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } gap-2 w-full`}
    >
      {!isUser && (
        <div>
          <Image
            alt="chat avatar"
            src={max_chat_avatar.src}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 ${
          isUser
            ? "bg-dark_green text-white rounded-br-sm"
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
            strong: (props: any) => <strong {...props} className="font-bold" />,
            ul: (props: any) => (
              <ul {...props} className="list-disc list-inside ml-4" />
            ),
            ol: (props: any) => (
              <ol {...props} className="list-decimal list-inside ml-4" />
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
      {!message.id && (
        <div className="flex flex-row items-center justify-center">
          <Triangle
            visible={true}
            height="14"
            width="14"
            color="#4fa94d"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
    </div>
  );
}
