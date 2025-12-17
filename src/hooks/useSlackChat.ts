import { useState } from "react"

export const useSlackChat = () => {
  const [messages, setMessages] = useState<string[]>([])

  return{messages}
}