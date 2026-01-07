"use client";

import React from 'react'

export default function VisitorEmailFormContainer({
  anonymousUserEmail,
  handleEmailChange,
  handleEmailSubmit,
  emailError,
  isEmailValid
}: {
  anonymousUserEmail: string;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailSubmit: (e: React.FormEvent) => void;
  emailError: string;
  isEmailValid: boolean;
}) {
  return (
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
