"use client";

import React from "react";

export default function AnonymousChatBanner({
  anonymousUserEmail,
  clearSessionEmail,
}: {
  anonymousUserEmail: string;
  clearSessionEmail: () => void;
}) {
  return (
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
  );
}
