"use client";

import { close_dialog } from "@/static/icons";
import { useDialogStore } from "@/store/useDIalogStore";
import type { DialogDocumentActonType } from "@/types";
import { useClickOutside } from "@/utils/client";
import Image from "next/image";
import { PropsWithChildren, useRef } from "react";

export type DialogBaseProps = {
  dialogName: DialogDocumentActonType;
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

  return (
    <div className="fixed inset-0 z-[1000] w-screen h-screen flex items-center justify-center bg-black/20">
      <div
        ref={dialogRef}
        style={{ maxWidth: `${size}px` }}
        className="w-full bg-white px-9 py-4 rounded space-y-6">
        <button
          onClick={() => closeDialog(dialogName)}
          className="cursor-pointer flex items-center justify-center mr-0 ml-auto border-none bg-transparent">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-3 max-h-3"
            src={close_dialog}
            alt="close_dialog"
          />
        </button>
        {children}
      </div>
    </div>
  );
}
