"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIDataTypes, UIMessage, UITools } from "ai";
import { useState } from "react";
import Spinner from "../Basic/Spinner/Spinner";
import {Square} from "lucide-react"

export default function AIChatBot() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const [input, setInput] = useState("");


  
  return (
    <div className="flex flex-col bg-white p-4 rounded-md animate-grow-tr w-auto min-w-72 text-gray-600 ">
      <div className="border-b-2 pb-2">
        <p>Heidi Bot</p>
      </div>
      <div className="flex flex-col gap-3 my-4 overflow-y-auto max-h-[400px]">
        {messages.length === 0 && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl px-4 py-2 bg-gray-100 text-gray-600 rounded-bl-sm animate-from-left">
              Hallo! Wie kann ich Ihnen heute helfen?
            </div>
          </div>
        )}
        {messages.map((message) => {
          const isUser = message.role === "user";

          return <Message key={message.id} message={message} isUser={isUser} />;
        })}
      </div>

      {/* Loading/Streaming indicator */}
      {(status === "submitted" || status === "streaming") && (
        <div className="flex justify-start mb-4">
          <div className="max-w-[85%] max-h-[100%] rounded-2xl rounded-bl-sm px-4 py-3 bg-gray-100 animate-from-left">
            <div className="flex items-center gap-2">
              {status === "submitted" && <Spinner />}
              <span className="text-gray-600">Thinking...</span>
            </div>
          </div>
        </div>
      )}

      {/* Input form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
          }
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== "ready"}
          placeholder="Nachricht eingeben..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green disabled:opacity-50"
        />
        {status === "submitted" || status === "streaming" ? (
          <div className="bg-green flex flex-col justify-center items-center text-white rounded-full p-2 hover:bg-green cursor-pointer transition-colors shadow-md">
            <Square
              onClick={() => stop()}
              className="text-sm text-white cursor-pointer"
            />
          </div>
        ) : (
          <button
            type="submit"
            disabled={status !== "ready" || !input.trim()}
            className="bg-green rounded-full px-4 py-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Senden
          </button>
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
  return (
    <div
      key={message.id}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 animate-expand-horizontal ${
          isUser
            ? "bg-green text-gray-600 rounded-br-sm animate-from-right"
            : "bg-gray-100 text-gray-600 rounded-bl-sm animate-from-left"
        }`}
      >
        {message.parts.map((part, index) =>
          part.type === "text" ? (
            <span key={index} className="break-words">
              {part.text}
            </span>
          ) : null
        )}
      </div>
    </div>
  );
}
