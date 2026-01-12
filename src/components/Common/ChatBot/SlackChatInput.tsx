'use client';

import { useSlackChat } from '@/hooks/useSlackChat';
import { SlackMessage } from '@/types/Chat';
import { SendHorizonal } from 'lucide-react';
import React, { Dispatch } from 'react';

interface SlackChatInputProps {
  userId?: string;
  setLocalMessages : Dispatch<React.SetStateAction<SlackMessage[]>>
}

export default function SlackChatInput({ userId, setLocalMessages }: SlackChatInputProps) {
  const { sendMessage, status, input, setInput, isOutOfOffice } = useSlackChat(userId);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
          if (input.trim()) {
            sendMessage(input);

            setLocalMessages((prev) => [
              ...prev,
              {
                role: "assistant", //value for user as it comes from the bot
                text: input,
                timestamp: new Date(),
              },
            ]);
          }
        
      }}
      className="flex gap-2 w-full"
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nachricht schreiben..."
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-100 disabled:opacity-50"
      />

      {/* Send button */}
      <button
        title="Send message"
        type="submit"
        disabled={!input.trim()}
        className="bg-dark_green text-white rounded-full p-3 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
      >
        <SendHorizonal size={18} />
      </button>
    </form>
  );
}
