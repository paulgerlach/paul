import React from 'react'

export default function LoadingMessage() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl px-4 py-2 flex items-center gap-2">
        <p className="text-green-900 animate-pulse">tippt...</p>
      </div>
    </div>
  );
}
