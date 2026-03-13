"use client";

import { useState } from "react";
import Image from "next/image";
import { green_check_circle, close_dialog } from "@/static/icons";

interface HeatingBillPDFPendingModalProps {
  isOpen: boolean;
}

export default function HeatingBillPDFPendingModal({
  isOpen,
}: Readonly<HeatingBillPDFPendingModalProps>) {
  const [dismissed, setDismissed] = useState(false);

  if (!isOpen || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[1000] w-screen h-screen flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-[576px] max-small:w-[85%] bg-white rounded flex flex-col overflow-hidden">
        <div className="px-9 py-4 flex-shrink-0">
          <button
            onClick={() => setDismissed(true)}
            className="cursor-pointer flex items-center justify-center mr-0 ml-auto border-none bg-transparent"
          >
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-3 max-h-3"
              src={close_dialog}
              alt="close"
            />
          </button>
        </div>
        <div className="px-9 pb-10 space-y-6">
          <div>
            <Image
              width={56}
              height={56}
              src={green_check_circle}
              alt="success"
              className="mb-6"
            />
            <h2 className="text-2xl font-medium text-dark_green mb-3">
              Anfrage erfolgreich versendet
            </h2>
            <p className="text-dark_green/70 text-sm leading-relaxed">
              Die einzelnen PDF-Dokumente werden Ihnen innerhalb der nächsten 24 Stunden zur Verfügung gestellt.
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="px-8 py-3 cursor-pointer rounded-md bg-green text-dark_green font-medium border-none shadow-xs transition-all duration-300 hover:opacity-80"
          >
            Weiter
          </button>
        </div>
      </div>
    </div>
  );
}
