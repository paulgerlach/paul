"use client";

import { useClickOutside } from "@/hooks/useClickOutside";
import { close_dialog, close_white } from "@/static/icons";
import { useDialogStore } from "@/store/useDIalogStore";
import type { DialogStoreActionType } from "@/types";
import Image from "next/image";
import { PropsWithChildren, useRef } from "react";

export type DialogBaseProps = {
  dialogName: DialogStoreActionType;
  size?: number;
  maxHeight?: number;
};

export default function DialogBase({
  children,
  dialogName,
  size = 576,
  maxHeight = 600,
}: PropsWithChildren<DialogBaseProps>) {
  const { closeDialog } = useDialogStore();
  const dialogRef = useRef<HTMLDivElement>(null);

  useClickOutside(dialogRef, () => closeDialog(dialogName));

  const isAuthDialog =
    dialogName === "login" ||
    dialogName === "register" ||
    dialogName === "forgotPassword";

  return (
    <div className="fixed inset-0 z-[1000] w-screen h-screen flex items-center justify-center bg-black/20">
      <style jsx>{`
        .dialog-scrollable::-webkit-scrollbar {
          width: 8px;
        }
        .dialog-scrollable::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .dialog-scrollable::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 4px;
        }
        .dialog-scrollable::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
      <div
        ref={dialogRef}
        style={{ maxWidth: `${size}px`, maxHeight: `${maxHeight}px` }}
        className="w-full bg-white rounded flex flex-col overflow-hidden"
      >
        <div className="px-9 py-4 flex-shrink-0">
          <button
            onClick={() => closeDialog(dialogName)}
            className={`cursor-pointer flex items-center justify-center mr-0 ml-auto border-none bg-transparent ${isAuthDialog ? "mb-0" : ""}`}
          >
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className={isAuthDialog ? "max-w-4 max-h-4" : "max-w-3 max-h-3"}
              src={isAuthDialog ? close_white : close_dialog}
              alt="close_dialog"
            />
          </button>
        </div>
        <div
          className="px-9 pb-4 overflow-y-auto flex-1 space-y-6 dialog-scrollable"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E0 #F7FAFC",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
