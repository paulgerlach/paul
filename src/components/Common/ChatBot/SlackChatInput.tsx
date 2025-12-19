'use client';

import { useSlackChat } from '@/hooks/useSlackChat';
import { SendHorizonal } from 'lucide-react';
import React from 'react';

interface SlackChatInputProps {
}

export default function SlackChatInput({  }: SlackChatInputProps) {
  const { sendMessage, status, input, setInput } = useSlackChat();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (input.trim()) {
          sendMessage(input);
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
        className="bg-black text-white rounded-full p-3 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
      >
        <SendHorizonal size={18} />
      </button>
    </form>
  );
}
