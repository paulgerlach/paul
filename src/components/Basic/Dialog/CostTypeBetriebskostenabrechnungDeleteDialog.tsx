"use client";

import { useDialogStore } from "@/store/useDIalogStore";
import { useRouter } from "next/navigation";
import DialogBase from "../ui/DialogBase";
import { deleteCostType } from "@/actions/delete/deleteCostType";

export default function CostTypeBetriebskostenabrechnungDeleteDialog() {
  const { itemID, openDialogByType, closeDialog } = useDialogStore();
  const isOpen = openDialogByType.cost_type_betriebskostenabrechnung_delete;
  const router = useRouter();

  const handleDelete = async () => {
    if (!!itemID) {
      const res = await deleteCostType(itemID);
      if (res.success) {
        closeDialog("cost_type_betriebskostenabrechnung_delete");
        router.refresh();
      }
    }
  };

  if (isOpen && !!itemID)
    return (
      <DialogBase dialogName="cost_type_betriebskostenabrechnung_delete">
        <p>Sind Sie sicher, dass Sie dieses Element löschen möchten?</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="px-6 py-4 cursor-pointer rounded-md bg-red-500 text-white font-medium border-none shadow-xs transition-all duration-300 hover:opacity-80"
            onClick={() => handleDelete()}>
            Löschen
          </button>
          <button
            className="px-6 py-4 cursor-pointer rounded-md bg-card_light border-none text-dark_green font-medium shadow-xs transition-all duration-300 hover:opacity-80"
            onClick={() => closeDialog("cost_type_betriebskostenabrechnung_delete")}>
            Abbrechen
          </button>
        </div>
      </DialogBase>
    );
}
