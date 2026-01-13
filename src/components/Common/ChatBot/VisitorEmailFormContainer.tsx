"use client";

import { useSlackChat } from '@/hooks/useSlackChat';
import { SlackMessage } from '@/types/Chat';
import axios from 'axios';
import React, { Dispatch, useCallback, useState } from 'react'

export default function VisitorEmailFormContainer({
  setIsChatStarted,
  setAnonymousUserEmail,
  anonymousUserEmail,
  isExistingClient,
  setLocalMessages,
  setIsSlackChat,
}: {
  setIsChatStarted: Dispatch<React.SetStateAction<boolean>>;
  setAnonymousUserEmail: Dispatch<React.SetStateAction<string>>;
  anonymousUserEmail: string;
  isExistingClient: boolean;
  setLocalMessages: Dispatch<React.SetStateAction<SlackMessage[]>>;
  setIsSlackChat: Dispatch<React.SetStateAction<boolean>>;
}) {
  const [emailError, setEmailError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [userEmailInput, setUserEmailInput] = useState("");
  const { sendMessage } = useSlackChat();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const saveLead = async (email: string) => {
    try {
      await axios.post(`/api/leads`, { email, source: "Heidi Website" });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setUserEmailInput(email);

    if (emailError) {
      setEmailError("");
    }

    if (email === "") {
      setIsEmailValid(false);
    } else {
      setIsEmailValid(validateEmail(email));
    }
  };

  const sendSlackMessage = async () => {
    try {
      await sendMessage(
        `Hallo, ich bin ein Besucher (nicht registrierter Nutzer) und benötige Unterstützung. Meine E-Mail-Adresse für die Kontaktaufnahme: ${userEmailInput}`
      );

      setLocalMessages((prev) => [
        ...prev,
        {
          role: "user",
          text: `Hallo, ich bin ein Besucher (nicht registrierter Nutzer) und benötige Unterstützung. Meine E-Mail-Adresse für die Kontaktaufnahme: ${userEmailInput}`,
          timestamp: new Date(),
        },
      ]);

      setUserEmailInput("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!userEmailInput.trim()) {
        setEmailError("Bitte geben Sie eine E-Mail-Adresse ein.");
        return;
      }

      if (!validateEmail(userEmailInput)) {
        setEmailError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        return;
      }

      await saveLead(userEmailInput);

      if (typeof window !== "undefined") {
        sessionStorage.setItem("anonymousUserEmail", userEmailInput);
      }

      setIsChatStarted(true);
      setIsSlackChat(true);
      setEmailError("");
      setAnonymousUserEmail(userEmailInput);
      

      if (!isExistingClient) {
        await sendSlackMessage();
      }
    },
    [userEmailInput, anonymousUserEmail]
  );

  return (
    <div className="flex flex-col w-full gap-4 p-6 border border-slate-300 rounded-2xl bg-white shadow-sm absolute bottom-0 left-0">
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
            value={userEmailInput}
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
  );
}
