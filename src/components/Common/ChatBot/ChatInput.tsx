import { ChatStatus } from 'ai';
import { SendHorizonal, Square } from 'lucide-react';
import React from 'react'

interface ChatInputProps {
  sendMessage: (message: { text: string }) => void;
  input: string;
  setInput: (input: string) => void;
  status: ChatStatus;
  stop: () => void;
}

export default function ChatInput({ sendMessage, input, setInput, status, stop }: ChatInputProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (input.trim()) {
          sendMessage({ text: input });
          setInput("");
        }
      }}
      className="flex gap-2 w-full"
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
  );
}
