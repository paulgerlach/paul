"use client";

import { useState } from "react";
import Image from "next/image";
import { close_dialog, green_check_circle } from "@/static/icons";
import { Button } from "../ui/Button";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useRef } from "react";

type HeatingBillPendingModalProps = {
  initiallyOpen?: boolean;
};

export default function HeatingBillPendingModal({
  initiallyOpen = true,
}: HeatingBillPendingModalProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const dialogRef = useRef<HTMLDivElement>(null);

  useClickOutside(dialogRef, () => setIsOpen(false));

  const handleClose = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] w-screen h-screen flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div
        ref={dialogRef}
        className="w-full max-w-[480px] max-small:w-[85%] bg-white rounded-2xl flex flex-col overflow-hidden shadow-lg"
      >
        <div className="pt-6 pr-6 flex justify-end">
          <button
            onClick={handleClose}
            className="cursor-pointer flex items-center justify-center border-none bg-transparent p-0"
            aria-label="Schließen"
          >
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="max-w-3 max-h-3"
              src={close_dialog}
              alt=""
            />
          </button>
        </div>

        <div className="px-9 pb-9 flex flex-col text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#E7F2E8] mb-4">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="max-w-8 max-h-8"
              src={green_check_circle}
              alt=""
            />
          </div>

          <h2 className="text-xl font-bold text-admin_dark_text mb-3 text-start">
            Anfrage erfolgreich versendet
          </h2>

          <p className="text-sm text-admin_dark_text mb-8 text-start">
            Die einzelnen PDF-Dokumente werden Ihnen innerhalb der nächsten 24
            Stunden zur Verfügung gestellt.
          </p>

          <div className="w-full flex justify-start">
            <Button onClick={handleClose} variant="default">
              Weiter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
