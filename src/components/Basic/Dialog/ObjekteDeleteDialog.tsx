"use client";

import { useDeleteDialogStore } from "@/store/useDeleteDIalogStore";
import { Button } from "../ui/Button";
import { deleteObjekt } from "@/actions/deleteObjekt";

export default function ObjekteDeleteDialog() {
  const { closeDialog, itemID } = useDeleteDialogStore();
  return (
    <dialog
      id="objekte-dialog-delete"
      className="dialog w-screen h-screen flex items-center justify-center bg-black/20">
      <div className="max-w-xl w-full bg-white py-14 px-16 rounded space-y-6">
        <p>Sind Sie sicher, dass Sie dieses Element löschen möchten?</p>
        <div className="grid grid-cols-2 gap-4">
          <Button
            className="btn btn-danger"
            onClick={async () => await deleteObjekt(itemID)}>
            Löschen
          </Button>
          <Button className="btn" onClick={closeDialog}>
            Abbrechen
          </Button>
        </div>
      </div>
    </dialog>
  );
}
