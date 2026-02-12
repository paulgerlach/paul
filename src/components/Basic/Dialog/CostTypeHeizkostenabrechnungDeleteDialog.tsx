"use client";

import { useState } from "react";
import { useDialogStore } from "@/store/useDIalogStore";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import { useRouter } from "next/navigation";
import DialogBase from "../ui/DialogBase";
import { deleteCostType } from "@/actions/delete/deleteCostType";
import { toast } from "sonner";

export default function CostTypeHeizkostenabrechnungDeleteDialog() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { itemID, openDialogByType, closeDialog } = useDialogStore();
  const { documentGroups, removeDocumentGroup } =
    useHeizkostenabrechnungStore();
  const isOpen = openDialogByType.cost_type_heizkostenabrechnung_delete;
  const router = useRouter();

  const handleDelete = async () => {
    if (!itemID) return;
    setIsDeleting(true);
    const res = await deleteCostType(itemID);
    if (res.success) {
      const group = documentGroups.find((g) => g.id === itemID);
      if (group?.type) removeDocumentGroup(group.type);
      closeDialog("cost_type_heizkostenabrechnung_delete");
      router.refresh();
    } else {
      toast.error("Kostenart konnte nicht gelöscht werden.");
    }
    setIsDeleting(false);
  };

  if (isOpen && !!itemID)
    return (
      <DialogBase dialogName="cost_type_heizkostenabrechnung_delete">
        <p>Sind Sie sicher, dass Sie dieses Element löschen möchten?</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            disabled={isDeleting}
            className="px-6 py-4 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm cursor-pointer rounded-md bg-red-500 text-white font-medium border-none shadow-xs transition-all duration-300 hover:opacity-80 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={() => handleDelete()}
          >
            {isDeleting ? (
              <>
                <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Löschen...
              </>
            ) : (
              "Löschen"
            )}
          </button>
          <button
            disabled={isDeleting}
            className="px-6 py-4 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm cursor-pointer rounded-md bg-card_light border-none text-dark_green font-medium shadow-xs transition-all duration-300 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => closeDialog("cost_type_heizkostenabrechnung_delete")}
          >
            Abbrechen
          </button>
        </div>
      </DialogBase>
    );
}
