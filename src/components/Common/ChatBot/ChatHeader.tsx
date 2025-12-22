import { max_chat_avatar } from '@/static/icons';
import Image from 'next/image';
import React from 'react'

interface HeaderProps {
  headerText: string;
  subHeaderText: string;
}

export default function ChatHeader({ headerText, subHeaderText }: HeaderProps) {
  return (
    <div className="pb-4 flex justify-center">
      <div className="flex flex-row gap-2 items-center justify-center animate-from-left shadow-md w-auto px-4 py-2 rounded-full bg-white">
        <div className="relative">
          <div className="bg-green-700 rounded-full w-4 h-4 absolute -right-1 -top-1" />
          <Image
            alt="chat avatar"
            src={max_chat_avatar.src}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <div className="text-center text-lg ">
          <p className="text-sm font-semibold">{headerText}</p>
          <p className="text-xs text-gray-400">{subHeaderText}</p>
        </div>
      </div>
    </div>
  );
}
