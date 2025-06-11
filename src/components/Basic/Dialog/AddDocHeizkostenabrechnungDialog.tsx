"use client";

import { useDialogStore } from "@/store/useDIalogStore";
import { deleteLocal } from "@/actions/delete/deleteLocal";
import { useRouter } from "next/navigation";
import DialogBase from "../ui/DialogBase";

export default function AddDocHeizkostenabrechnungDialog() {
  const { openDialogByType, closeDialog } = useDialogStore();
  const isOpen = openDialogByType.local_delete;

  if (isOpen)
    return (
      <DialogBase dialogName="local_delete">
        <p>Sind Sie sicher, dass Sie dieses Element löschen möchten?</p>
        <div className="grid grid-cols-2 gap-4">
          <button className="px-6 py-4 cursor-pointer rounded-md bg-red-500 text-white font-medium border-none shadow-xs transition-all duration-300 hover:opacity-80">
            Löschen
          </button>
          <button
            className="px-6 py-4 cursor-pointer rounded-md bg-card_light border-none text-dark_green font-medium shadow-xs transition-all duration-300 hover:opacity-80"
            onClick={() => closeDialog("local_delete")}>
            Abbrechen
          </button>
        </div>
      </DialogBase>
    );
}
