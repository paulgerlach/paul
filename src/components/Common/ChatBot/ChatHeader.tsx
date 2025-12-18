import React from 'react'
import { SiChatbot } from 'react-icons/si';

interface HeaderProps {
  headerText: string;
  subHeaderText: string;
}

export default function ChatHeader({ headerText, subHeaderText }: HeaderProps) {
  return (
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
          <p className="text-md">{headerText}</p>
          <p className="text-xs text-gray-400">{subHeaderText}</p>
        </div>
      </div>
    </div>
  );
}
