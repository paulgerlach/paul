"use client";

import { useDialogStore } from "@/store/useDIalogStore";
import { useParams, useRouter } from "next/navigation";
import DialogBase from "../../ui/DialogBase";
import { adminDeleteObjekt } from "@/actions/delete/admin/adminDeleteObjekt";

export default function AdminObjekteDeleteDialog() {
  const { itemID, openDialogByType, closeDialog } = useDialogStore();
  const isOpen = openDialogByType.admin_object_delete;
  const router = useRouter();
  const { user_id } = useParams();

  const handleDelete = async () => {
    if (!!itemID) {
      const res = await adminDeleteObjekt(itemID, String(user_id));
      if (res.success) {
        closeDialog("admin_object_delete");
        router.refresh();
      }
    }
  };

  if (isOpen && !!itemID)
    return (
      <DialogBase dialogName="admin_object_delete">
        <p>Sind Sie sicher, dass Sie dieses Element löschen möchten?</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="px-6 py-4 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm cursor-pointer rounded-md bg-red-500 text-white font-medium border-none shadow-xs transition-all duration-300 hover:opacity-80"
            onClick={() => handleDelete()}
          >
            Löschen
          </button>
          <button
            className="px-6 py-4 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm cursor-pointer rounded-md bg-card_light border-none text-dark_green font-medium shadow-xs transition-all duration-300 hover:opacity-80"
            onClick={() => closeDialog("admin_object_delete")}
          >
            Abbrechen
          </button>
        </div>
      </DialogBase>
    );
}
