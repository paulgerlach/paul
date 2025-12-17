"use client";

import { ChatStatus, UIDataTypes, UIMessage, UITools } from "ai";
import { SendHorizonal, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiChatbot } from "react-icons/si";
import { useAIMessagesStore } from "@/store/useAIMessagesStore";
import { FaRegWindowMinimize } from "react-icons/fa";

interface AIChatbotInterface {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  sendMessage: (message: { text: string }) => void;
  status: ChatStatus;
  stop: () => void;
  input: string;
  setInput: (input: string) => void;
  setShowChatBot: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AIChatBot({
  messages,
  sendMessage,
  status,
  stop,
  input,
  setInput,
  setShowChatBot,
}: AIChatbotInterface) {
  const { setIsChatActive, isChatActive } = useAIMessagesStore();

  const toggleChat = () => {
    setIsChatActive(true);
  };

  const handleMinimizeChat = () => {
    setShowChatBot(false);
  }
  return (
    <div className="flex flex-col bg-slate-100 p-4 rounded-md shadow-lg h-[60vh] max-w-full relative">
      <FaRegWindowMinimize
        onClick={handleMinimizeChat}
        className="self-end cursor-pointer hover:-translate-y-1 transition ease-in-out absolute"
      />
      {/* Header */}
      <div className="pb-4 flex justify-center">
        <div className="flex flex-row gap-1 items-center justify-center animate-from-left shadow-md w-auto px-4 py-2 rounded-full bg-white">
          <div className="relative">
            <div className="bg-green-700 rounded-full w-4 h-4 absolute right-0" />
            <SiChatbot
              color="#FFFFFF"
              className="bg-black rounded-full p-2"
              size={40}
            />
          </div>
          <div className="text-center text-lg font-semibold">
            <p className="text-md">Text-Support</p>
            <p className="text-xs text-gray-400">Ai Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
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
            return (
              <Message key={message.id} message={message} isUser={isUser} />
            );
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

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
            setIsChatActive(true); 
          }
        }}
        className="flex gap-2 mt-4"
      >
        {isChatActive ? (
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status !== "ready"}
            placeholder="Nachricht eingeben..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-100 disabled:opacity-50"
          />
        ) : (
          <button
            title="start-chat"
            onClick={toggleChat}
            className="flex-1 flex items-center justify-center font-semibold text-white text-sm bg-black hover:bg-slate-900 hover:-translate-y-2 transition ease-in-out rounded-lg py-2 cursor-pointer "
          >
            <p>Let&apos;s chat</p>
          </button>
        )}

        {/* Send / Stop button */}
        {status === "submitted" || status === "streaming" ? (
          <button
            title="Stop generation"
            type="button"
            onClick={() => stop()}
            className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <Square className="text-green-600" size={18} />
          </button>
        ) : isChatActive ? (
          <button
            title="Send message"
            type="submit"
            disabled={
              !isChatActive ||
              status !== "ready" ||
              !input.trim()
            }
            className="bg-black text-white rounded-full p-3 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <SendHorizonal size={18} />
          </button>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
}

function Message({
  message,
  isUser,
}: {
  message: UIMessage<unknown, UIDataTypes, UITools>;
  isUser: boolean;
}) {
  const components = {
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
    h1: (props: any) => <h1 {...props} className="text-lg font-bold mt-3" />,
    h2: (props: any) => <h2 {...props} className="text-base font-bold mt-2" />,
    h3: (props: any) => <h3 {...props} className="text-sm font-bold mt-2" />,
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
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
        {message.parts.map((part, index) =>
          part.type === "text" ? (
            <div key={index} className="break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
              >
                {part.text}
              </ReactMarkdown>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
