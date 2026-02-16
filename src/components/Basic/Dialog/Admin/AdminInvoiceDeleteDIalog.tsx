"use client";

import { useDialogStore } from "@/store/useDIalogStore";
import { useParams, usePathname, useRouter } from "next/navigation";
import DialogBase from "../../ui/DialogBase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminDeleteInvoice } from "@/actions/delete/admin/adminDeleteInvoice";

export default function AdminInvoiceDeleteDialog() {
    const {
        itemID,
        openDialogByType,
        closeDialog,
        queryKey: invalidateKey,
    } = useDialogStore();
    const isOpen = openDialogByType.admin_invoice_delete;
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user_id } = useParams();
    const path = usePathname();

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return await adminDeleteInvoice(id, String(user_id), path);
        },
        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({
                    queryKey: invalidateKey,
                });

                closeDialog("admin_invoice_delete");

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
            <DialogBase dialogName="admin_invoice_delete">
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
                        onClick={() => closeDialog("admin_invoice_delete")}
                    >
                        Abbrechen
                    </button>
                </div>
            </DialogBase>
        );
}
