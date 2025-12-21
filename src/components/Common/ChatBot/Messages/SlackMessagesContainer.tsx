'use client';

import { useSlackChat } from '@/hooks/useSlackChat';
import React, { useEffect, useState } from 'react';
import SlackChatInput from '../SlackChatInput';
import { LuBrainCircuit } from "react-icons/lu";
import {Triangle} from 'react-loader-spinner'
import { SlackMessage } from '@/types/Chat';
import SlackMessageContainer from './SlackMessage';
import Image from 'next/image';
import { max_chat_avatar } from '@/static/icons';

interface SlackChatBotProps {
  toggleChatType: () => void;
  userId?: string;
}

export default function SlackMessagesContainer({
  toggleChatType,
  userId,
}: SlackChatBotProps) {
  const [localMessages, setLocalMessages] = useState<SlackMessage[]>([]);
  const { messages, status } = useSlackChat(userId);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 min-h-0 animate-from-right w-full ">
      {" "}
      <div className="flex flex-col items-start justify-start w-full gap-3 pt-4 border-gray-200 overflow-scroll max-h-full h-full">
        {localMessages.length === 0 && status === "ready" && (
          <div className="flex justify-end items-center gap-2">
            <Image alt="chat avatar"
src={max_chat_avatar.src}
width={40} height={40} className="rounded-full" />
            <div className="max-w-[85%] rounded-2xl px-4 py-2 bg-white text-gray-600">
              Hallo, ich bin Max von Heidi Systems. Gern helfe ich Ihnen bei Fragen rund um digitale Verbrauchserfassung und Abrechnung.
            </div>
          </div>
        )}
        {localMessages.map((message, idx) => {
          //Messages from the web platform are technically sent by the Bot
          return <SlackMessageContainer key={idx} message={message} />;
        })}
        {status !== "ready" && (
          <div className="flex flex-row items-center justify-center">
            <Triangle
              visible={true}
              height="28"
              width="28"
              color="#4fa94d"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <>
              {status === "sending"
                ? "Nachricht senden"
                : "Nachrichten laden..."}
            </>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start justify-center gap-3 pt-4 border-gray-200 w-full">
        <button
          title="Send message"
          onClick={toggleChatType}
          className="bg-dark_green text-white rounded-full p-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg cursor-pointer"
        >
          <LuBrainCircuit color="#FFFFFF" size={30} />
        </button>
        <SlackChatInput userId={userId} setLocalMessages={setLocalMessages} />
      </div>
    </div>
  );
}
