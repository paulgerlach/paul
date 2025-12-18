import React from 'react'
import { LuBrainCircuit } from "react-icons/lu";

interface SlackChatBotProps {
  toggleChatType:()=> void
}

export default function SlackMessagesContainer({ toggleChatType }: SlackChatBotProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0 animate-from-right">
      {" "}
      <div className="flex flex-col items-start justify-center w-full gap-3 pt-4 border-t border-gray-200">
        {" "}
        <button
          title="Send message"
          onClick={toggleChatType}
          className="bg-black text-white rounded-full p-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg cursor-pointer"
        >
          <LuBrainCircuit color="#FFFFFF" size={30} />
        </button>
      </div>
    </div>
  );
}
