"use client";

import { useDialogStore } from "@/store/useDIalogStore";
import { deleteDocumentById } from "@/actions/delete/deleteDocument";
import { useRouter } from "next/navigation";
import DialogBase from "../ui/DialogBase";
import { toast } from "sonner";

export default function DocumentDeleteDialog() {
  const { itemID, openDialogByType, closeDialog } = useDialogStore();
  const isOpen = openDialogByType.document_delete;
  const router = useRouter();

  const handleDelete = async () => {
    if (!!itemID) {
      const res = await deleteDocumentById(itemID);
      if (res.success) {
        toast.success("Dokument erfolgreich gelöscht");
        closeDialog("document_delete");
        router.refresh();
      } else {
        toast.error("Fehler beim Löschen des Dokuments");
      }
    }
  };

  if (isOpen && !!itemID)
    return (
      <DialogBase dialogName="document_delete">
        <p>Sind Sie sicher, dass Sie dieses Dokument löschen möchten?</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="px-6 py-4 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm cursor-pointer rounded-md bg-red-500 text-white font-medium border-none shadow-xs transition-all duration-300 hover:opacity-80"
            onClick={() => handleDelete()}
          >
            Löschen
          </button>
          <button
            className="px-6 py-4 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm cursor-pointer rounded-md bg-card_light border-none text-dark_green font-medium shadow-xs transition-all duration-300 hover:opacity-80"
            onClick={() => closeDialog("document_delete")}
          >
            Abbrechen
          </button>
        </div>
      </DialogBase>
    );
}

