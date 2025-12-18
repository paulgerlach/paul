"use client";

import { ChatStatus, UIDataTypes, UIMessage, UITools } from "ai";
import { SendHorizonal, Square } from "lucide-react";
import { SiChatbot } from "react-icons/si";
import { FaRegWindowMinimize } from "react-icons/fa";
import ChatHeader from "./ChatHeader";
import Message from "./Messages/Message";
import MessagesContainer from "./Messages/MessagesContainer";

interface AIChatbotInterface {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  sendMessage: (message: { text: string }) => void;
  status: ChatStatus;
  stop: () => void;
  input: string;
  setInput: (input: string) => void;
  setShowChatBot: React.Dispatch<React.SetStateAction<boolean>>;
  isExistingClient: boolean;
  setIsSlackChat: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AIChatBot({
  messages,
  sendMessage,
  status,
  stop,
  input,
  setInput,
  setShowChatBot,
  isExistingClient,
  setIsSlackChat,
}: AIChatbotInterface) {
  const handleMinimizeChat = () => {
    setShowChatBot(false);
  };

  return (
    <div className="flex flex-col bg-slate-100 p-4 rounded-md shadow-lg h-[100vh] max-w-full relative animate-from-right">
      <FaRegWindowMinimize
        onClick={handleMinimizeChat}
        className="self-end cursor-pointer hover:-translate-y-1 transition ease-in-out absolute"
      />

      <ChatHeader headerText="Text Support" subHeaderText="AI Assistant" />

      <MessagesContainer messages={messages} status={status} />

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
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

        {/* Send / Stop button */}
        {status === "submitted" || status === "streaming" ? (
          <button
            title="Stop generation"
            type="button"
            onClick={() => stop()}
            className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Square className="text-green-600" size={18} />
          </button>
        ) : (
          <button
            title="Send message"
            type="submit"
            disabled={status !== "ready" || !input.trim()}
            className="bg-black text-white rounded-full p-3 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <SendHorizonal size={18} />
          </button>
        )}
      </form>
    </div>
  );
}
