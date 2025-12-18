import React from 'react'

interface SlackChatBotProps {
  setIsSlackChat: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SlackChatBot({ setIsSlackChat }: SlackChatBotProps) {
  return <div>SlackChatBot</div>;
}
