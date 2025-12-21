"use client";

import React, { useEffect, useState } from "react";
import Message from "./Message";
import { ChatRequestOptions, ChatStatus, FileUIPart, UIDataTypes, UIMessage, UITools } from "ai";
import { MdOutlineSupportAgent } from "react-icons/md";
import { useAIMessagesStore } from "@/store/useAIMessagesStore";
import AIChatInput from "../AIChatInput";
import Image from "next/image";
import { max_chat_avatar } from "@/static/icons";

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

export default function AiMessagesContainer({
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

  const [emailError, setEmailError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const setStoredMessages = useAIMessagesStore(
    (state) => state.setStoredMessages
  );

  const [input, setInput] = useState("");

  useEffect(() => {
    setStoredMessages(aiMessages);
  }, [aiMessages, setStoredMessages]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setAnonymousUserEmail(email);

    if (emailError) {
      setEmailError("");
    }

    if (email === "") {
      setIsEmailValid(false);
    } else {
      setIsEmailValid(validateEmail(email));
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!anonymousUserEmail.trim()) {
      setEmailError("Bitte geben Sie eine E-Mail-Adresse ein.");
      return;
    }

    if (!validateEmail(anonymousUserEmail)) {
      setEmailError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("anonymousUserEmail", anonymousUserEmail);
    }

    setIsChatStarted(true);
    setEmailError("");

    console.log("Chat started with email:", anonymousUserEmail);
  };

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
          {/* Optional: Show current email in chat header */}
          {isChatStarted && anonymousUserEmail && !isExistingClient && (
            <div className="mb-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>
                  Angemeldet als: <strong>{anonymousUserEmail}</strong>
                </span>
                <button
                  onClick={clearSessionEmail}
                  className="text-xs text-red-600 hover:text-red-800 underline ml-2"
                  title="Andere E-Mail verwenden"
                >
                  Ändern
                </button>
              </div>
            </div>
          )}

          {aiMessages.length === 0 && (
            <div className="flex justify-start items-center gap-2">
              <div>
                <Image
                  alt="chat avatar"
                  src={max_chat_avatar.src}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="max-w-[85%] rounded-2xl px-4 py-2 bg-white text-gray-600">
                {isChatStarted && anonymousUserEmail
                  ? `Hallo! Wie kann ich Ihnen heute helfen, ${
                      anonymousUserEmail.split("@")[0]
                    }?`
                  : "Hallo, ich bin Max von Heidi Systems. Gern helfe ich Ihnen bei Fragen rund um digitale Verbrauchserfassung und Abrechnung."}
              </div>
            </div>
          )}

          {aiMessages.map((message) => {
            const isUser = message.role === "user";
            return (
              <Message key={message.id} message={message} isUser={isUser} />
            );
          })}

          {(status === "submitted" || status === "streaming") && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-2 flex items-center gap-2">
                <p className="text-green-900 animate-pulse">tippt...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isExistingClient && !isChatStarted ? (
        <div className="flex flex-col w-full gap-4 p-6 border border-slate-300 rounded-2xl bg-white shadow-sm">
          <p className="text-sm font-medium text-slate-700">
            Geben Sie Ihre E-Mail ein, um den Chat zu starten
          </p>

          <form
            onSubmit={handleEmailSubmit}
            className="flex flex-col sm:flex-row items-stretch gap-2"
            noValidate
          >
            <div className="flex-1">
              <input
                type="email"
                placeholder="ihre@email.de"
                required
                className={`
                  w-full
                  rounded-xl
                  border ${emailError ? "border-red-500" : "border-slate-300"}
                  px-4 py-2.5
                  text-sm
                  text-slate-800
                  placeholder:text-slate-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-black/20
                  focus:border-black
                  transition
                  ${emailError ? "focus:border-red-500 focus:ring-red-200" : ""}
                `}
                value={anonymousUserEmail}
                onChange={handleEmailChange}
                aria-describedby={emailError ? "email-error" : undefined}
              />
              {emailError && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {emailError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isEmailValid}
              className={`
                rounded-xl
                bg-dark_green
                px-5 py-2.5
                text-sm
                font-semibold
                text-white
                shadow-md
                transition-all
                hover:scale-[1.02]
                hover:bg-dark_green/90
                active:scale-[0.98]
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${!isEmailValid ? "cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              Chat starten
            </button>
          </form>

          {/* Optional: Show validation status */}
          {anonymousUserEmail && !emailError && (
            <p
              className={`text-xs mt-1 ${
                isEmailValid ? "text-green-600" : "text-amber-600"
              }`}
            >
              {isEmailValid
                ? "✓ Gültige E-Mail-Adresse"
                : "Bitte geben Sie eine gültige E-Mail-Adresse ein"}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-start justify-center w-full gap-3 pt-4 border-gray-200">
          {isExistingClient && (
            <button
              title="Send message"
              onClick={toggleChatType}
              className="bg-dark_green text-white rounded-full p-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg cursor-pointer"
            >
              <MdOutlineSupportAgent color="#FFFFFF" size={30} />
            </button>
          )}

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
