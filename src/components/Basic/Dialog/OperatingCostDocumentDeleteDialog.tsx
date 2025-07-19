"use client";

import { useDialogStore } from "@/store/useDIalogStore";
import { deleteBuildingDocument } from "@/actions/delete/deleteBuildingDocument";
import { useRouter } from "next/navigation";
import DialogBase from "../ui/DialogBase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function OperatingCostDocumentDeleteDialog() {
  const { itemID, openDialogByType, closeDialog } = useDialogStore();
  const isOpen = openDialogByType.operating_costs_delete;
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteBuildingDocument(id);
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: ["operating_cost_documents", itemID],
        });

        closeDialog("operating_costs_delete");

        toast.success("Successfully deleted!");

        router.refresh();
      }
    },
  });

  const handleDelete = () => {
    if (itemID) {
      deleteMutation.mutate(itemID);
    }
  };

  if (isOpen && !!itemID)
    return (
      <DialogBase dialogName="operating_costs_delete">
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
            onClick={() => closeDialog("operating_costs_delete")}
          >
            Abbrechen
          </button>
        </div>
      </DialogBase>
    );
}
