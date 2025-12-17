import { UIMessage, UIDataTypes, UITools } from "ai";
import { create } from "zustand";

interface AIMessagesStoreState {
  isChatActive: boolean;
  setIsChatActive: (
    isChatActive: boolean
  ) => void;
  storedMessages: UIMessage<unknown, UIDataTypes, UITools>[];
  setStoredMessages: (
    messages: UIMessage<unknown, UIDataTypes, UITools>[]
  ) => void;
}

export const useAIMessagesStore = create<AIMessagesStoreState>((set, get) => ({
  isChatActive: false,
  setIsChatActive: (isChatActive) => set({ isChatActive }),
  storedMessages: [],
  setStoredMessages: (messages) => set({ storedMessages: messages }),
}));
