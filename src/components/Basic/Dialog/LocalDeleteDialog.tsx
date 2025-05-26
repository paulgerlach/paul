"use client";

import { useDeleteDialogStore } from "@/store/useDeleteDIalogStore";
import { deleteLocal } from "@/actions/deleteLocal";
import { useClickOutside } from "@/utils/client";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function LocalDeleteDialog() {
  const { itemID, openDialogByType, closeDialog } = useDeleteDialogStore();
  const isOpen = openDialogByType.local_delete;
  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useClickOutside(dialogRef, () => closeDialog("local_delete"));

  const handleDelete = async () => {
    if (!!itemID) {
      const res = await deleteLocal(itemID);
      if (res.success) {
        closeDialog("local_delete");
        router.refresh();
      }
    }
  };

  if (isOpen && !!itemID)
    return (
      <div className="fixed inset-0 z-[1000] w-screen h-screen flex items-center justify-center bg-black/20">
        <div
          ref={dialogRef}
          className="max-w-xl w-full bg-white py-14 px-16 rounded space-y-6">
          <p>Sind Sie sicher, dass Sie dieses Element löschen möchten?</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              className="px-6 py-4 cursor-pointer rounded-md bg-red-500 text-white font-medium border-none shadow-xs transition-all duration-300 hover:opacity-80"
              onClick={() => handleDelete()}>
              Löschen
            </button>
            <button
              className="px-6 py-4 cursor-pointer rounded-md bg-card_light border-none text-dark_green font-medium shadow-xs transition-all duration-300 hover:opacity-80"
              onClick={() => closeDialog("local_delete")}>
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    );
}
