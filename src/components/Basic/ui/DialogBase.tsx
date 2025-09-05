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
};

export default function DialogBase({
  children,
  dialogName,
  size = 576,
}: PropsWithChildren<DialogBaseProps>) {
  const { closeDialog } = useDialogStore();
  const dialogRef = useRef<HTMLDivElement>(null);

  useClickOutside(dialogRef, () => closeDialog(dialogName));

  const isAuthDialog = dialogName === "login" || dialogName === "register" || dialogName === "forgotPassword";

  return (
    <div className="fixed inset-0 z-[1000] w-screen h-screen flex items-center justify-center bg-black/20">
      <div
        ref={dialogRef}
        style={{ maxWidth: `${size}px` }}
        className="w-full bg-white px-9 py-4 rounded space-y-6">
        <button
          onClick={() => closeDialog(dialogName)}
          className={`cursor-pointer flex items-center justify-center mr-0 ml-auto border-none bg-transparent ${isAuthDialog ? "mb-0" : ""}`}>
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
        {children}
      </div>
    </div>
  );
}
