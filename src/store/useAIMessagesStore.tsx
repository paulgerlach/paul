import { UIMessage, UIDataTypes, UITools } from "ai";
import { create } from "zustand";

interface AIMessagesStoreState {
  storedMessages: UIMessage<unknown, UIDataTypes, UITools>[];
  setStoredMessages: (messages: UIMessage<unknown, UIDataTypes, UITools>[]) => void;
}

export const useAIMessagesStore = create<AIMessagesStoreState>((set, get) => ({
  storedMessages: [],
  setStoredMessages: (messages) => set({ storedMessages: messages }),
}));
