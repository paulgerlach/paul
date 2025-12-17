import { UIMessage, UIDataTypes, UITools } from "ai";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AIMessagesStoreState {
  storedMessages: UIMessage<unknown, UIDataTypes, UITools>[];
  setStoredMessages: (messages: UIMessage<unknown, UIDataTypes, UITools>[]) => void;
}

export const useAIMessagesStore = create<AIMessagesStoreState>()(
  persist(
    (set, get) => ({
      storedMessages: [],
      setStoredMessages: (storedMessages) => set({ storedMessages }),
    }),
    {
      name: "ai-messages-storage", // Key for localStorage
    }
  )
);
