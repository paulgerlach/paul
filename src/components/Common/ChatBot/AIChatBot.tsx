"use client";

import { ChatStatus, UIDataTypes, UIMessage, UITools } from "ai";
import { FaRegWindowMinimize } from "react-icons/fa";
import ChatHeader from "./ChatHeader";
import MessagesContainer from "./Messages/MessagesContainer";
import ChatInput from "./ChatInput";

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

      <ChatInput sendMessage={sendMessage} input={input} setInput={setInput} status={status} stop={stop}/>
    </div>
  );
}
