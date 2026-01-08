'use client';

import { useSlackChat } from '@/hooks/useSlackChat';
import { caract_mind, max_chat_avatar } from '@/static/icons';
import Image from 'next/image';
import React from 'react'

interface HeaderProps {
  headerText: string;
  subHeaderText: string;
  userId?:string
}

export default function ChatHeader({ headerText, subHeaderText, userId }: HeaderProps) {
  const { isOutOfOffice } = useSlackChat(userId);
  
  return (
    <div className="pb-4 flex justify-center">
      <div className="flex flex-row gap-2 items-center justify-center animate-from-left shadow-md w-auto px-4 py-2 rounded-full bg-white">
        <div className="relative">
          <div
            className={`${
              isOutOfOffice ? "bg-orange-700" : "bg-green-700"
            } rounded-full w-4 h-4 absolute -right-1 -top-1`}
          />
          <Image
            alt="chat avatar"
            src={isOutOfOffice ? caract_mind : max_chat_avatar.src}
            width={isOutOfOffice ? 30 : 40}
            height={isOutOfOffice ? 30 : 40}
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
