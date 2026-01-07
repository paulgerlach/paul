"use client";

import React, { useCallback, useEffect, useState } from "react";
import Message from "./Message";
import { ChatRequestOptions, ChatStatus, FileUIPart, UIDataTypes, UIMessage, UITools } from "ai";
import { MdOutlineSupportAgent } from "react-icons/md";
import { useAIMessagesStore } from "@/store/useAIMessagesStore";
import AIChatInput from "../AIChatInput";
import axios from "axios";
import AnonymousChatBanner from "../AnonymousChatBanner";
import DefaultChatMessage from "./DefaultChatMessage";
import LoadingMessage from "./LoadingMessage";
import VisitorEmailFormContainer from "../VisitorEmailFormContainer";
interface AiMessagesContainerProps {
  isExistingClient: boolean;
  toggleChatType: () => void;
  aiMessages: UIMessage<unknown, UIDataTypes, UITools>[];
  sendMessage: (
    message?:
      | (Omit<UIMessage<unknown, UIDataTypes, UITools>, "id" | "role"> & {
          id?: string | undefined;
          role?: "user" | "system" | "assistant" | undefined;
        } & {
          text?: never;
          files?: never;
          messageId?: string;
        })
      | {
          text: string;
          files?: FileList | FileUIPart[];
          metadata?: unknown;
          parts?: never;
          messageId?: string;
        }
      | {
          files: FileList | FileUIPart[];
          metadata?: unknown;
          parts?: never;
          messageId?: string;
        }
      | undefined,
    options?: ChatRequestOptions
  ) => Promise<void>;
  status: ChatStatus;
  stop: () => Promise<void>;
}

export default function  AiMessagesContainer({
  isExistingClient,
  toggleChatType,
  aiMessages,
  sendMessage,
  status,
  stop,
}: AiMessagesContainerProps) {
  const [anonymousUserEmail, setAnonymousUserEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("anonymousUserEmail") || "";
    }
    return "";
  });

  const [isChatStarted, setIsChatStarted] = useState(() => {
    if (typeof window !== "undefined") {
      return !!sessionStorage.getItem("anonymousUserEmail");
    }
    return false;
  });


  const setStoredMessages = useAIMessagesStore(
    (state) => state.setStoredMessages
  );

  const [input, setInput] = useState("");

  useEffect(() => {
    setStoredMessages(aiMessages);
  }, [aiMessages, setStoredMessages]);


  const clearSessionEmail = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("anonymousUserEmail");
      setAnonymousUserEmail("");
      setIsChatStarted(false);
      setIsEmailValid(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 animate-from-right">
      <div className="flex-1 overflow-y-auto pb-4 overflow-scroll max-h-full h-full">
        <div className="flex flex-col gap-3">
          {isChatStarted && anonymousUserEmail && !isExistingClient && (
            <AnonymousChatBanner
              anonymousUserEmail={anonymousUserEmail}
              clearSessionEmail={clearSessionEmail}
            />
          )}

          {aiMessages.length === 0 && (
            <DefaultChatMessage
              anonymousUserEmail={anonymousUserEmail}
              isChatStarted={isChatStarted}
            />
          )}

          {aiMessages.map((message) => {
            const isUser = message.role === "user";
            return (
              <Message key={message.id} message={message} isUser={isUser} />
            );
          })}

          {(status === "submitted" || status === "streaming") && (
            <LoadingMessage />
          )}
        </div>
      </div>
      {!isChatStarted && !isExistingClient && !anonymousUserEmail ? (
        <VisitorEmailFormContainer
          setIsChatStarted={setIsChatStarted}
          setAnonymousUserEmail={setAnonymousUserEmail}
          anonymousUserEmail={anonymousUserEmail}
        />
      ) : (
        <div className="flex flex-col items-start justify-center w-full gap-3 pt-4 border-gray-200">
          <button
            title="Send message"
            onClick={toggleChatType}
            className="bg-dark_green text-white rounded-full p-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg cursor-pointer"
          >
            <MdOutlineSupportAgent color="#FFFFFF" size={30} />
          </button>

          {/* Show clear session button for anonymous users */}
          {!isExistingClient && isChatStarted && (
            <div className="w-full flex justify-end mb-2">
              <button
                onClick={clearSessionEmail}
                className="text-xs text-gray-600 hover:text-red-600 underline"
                title="Chat mit anderer E-Mail fortsetzen"
              >
                Andere E-Mail verwenden
              </button>
            </div>
          )}

          <AIChatInput
            sendMessage={sendMessage}
            input={input}
            setInput={setInput}
            status={status}
            stop={stop}
          />
        </div>
      )}
    </div>
  );
}
