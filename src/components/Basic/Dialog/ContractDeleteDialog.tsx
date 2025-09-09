"use client";

import { useDialogStore } from "@/store/useDialogStore";
import { useRouter } from "next/navigation";
import { deleteContract } from "@/actions/delete/deleteContract";
import DialogBase from "../ui/DialogBase";

export default function ContractDeleteDialog() {
  const { itemID, openDialogByType, closeDialog } = useDialogStore();
  const isOpen = openDialogByType.contract_delete;
  const router = useRouter();

  const handleDelete = async () => {
    if (!!itemID) {
      const res = await deleteContract(itemID);
      if (res.success) {
        closeDialog("contract_delete");
        router.refresh();
      }
    }
  };

  if (isOpen && !!itemID)
    return (
      <DialogBase dialogName="contract_delete">
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
            onClick={() => closeDialog("contract_delete")}
          >
            Abbrechen
          </button>
        </div>
      </DialogBase>
    );
}
