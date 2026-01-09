"use client";

import React from "react";
import Image from "next/image";
import { max_chat_avatar } from "@/static/icons";

export default function DefaultChatMessage({
  anonymousUserEmail,
  isChatStarted,
}: {
  anonymousUserEmail: string;
  isChatStarted: boolean;
}) {
  return (
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
  );
}
