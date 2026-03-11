"use client";

import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import type {
    DocCostCategoryType,
    InvoiceDocumentType,
} from "@/types";
import { useForm } from "react-hook-form";
import { Form } from "@/components/Basic/ui/Form";
import { useAdminDokumentenManagementLocal } from "@/hooks/useAdminDokumentenManagementLocal";
import { UploadInfoItems } from "../components/UploadInfoItems";
import { UploadDropzone } from "../components/UploadDropzone";
import { FileList } from "../components/FileList";
import { FormFooter } from "../components/FormFooter";

export default function AdminDokumentenmanagementLocalForm({
    objektId,
    localId,
    docId,
    userId,
    pathSlug,
    userDocCostCategories,
    relatedInvoices,
}: {
    objektId: string;
    localId: string;
    docId: string;
    userId: string;
    pathSlug: string;
    userDocCostCategories: DocCostCategoryType[];
    relatedInvoices?: InvoiceDocumentType[];
}) {
    const methods = useForm();
    const {
        entries,
        step,
        onDrop,
        onDropRejected,
        handleSubmit,
        parseMutation,
        saveMutation,
    } = useAdminDokumentenManagementLocal({
        objektId,
        localId,
        docId,
        userId,
        pathSlug,
        userDocCostCategories,
        relatedInvoices,
    });
    const isEditMode = !!relatedInvoices;

    const backLink = isEditMode
        ? `${ROUTE_ADMIN}/${userId}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/weitermachen/${docId}/abrechnungszeitraum`
        : `${ROUTE_ADMIN}/${userId}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objektId}/${localId}/abrechnungszeitraum`;

    return (
        <div className="bg-[#EFEEEC] border-y-[20px] border-[#EFEEEC] col-span-3 h-full rounded-2xl px-4 flex items-start justify-center">
            <div className="bg-white h-full py-6 px-4 rounded w-full shadow-sm space-y-8 flex flex-col overflow-y-auto">
                <h2 className="font-bold">
                    Dokumente hochladen
                </h2>

                <UploadInfoItems />

                <Form
                    {...methods}
                >
                    <form className="flex-1 flex flex-col" onSubmit={methods.handleSubmit(handleSubmit)}>
                        {step === "upload" && (
                            <UploadDropzone
                                onDrop={onDrop}
                                onDropRejected={onDropRejected}
                            />
                        )}

                        <FileList entries={entries} />

                        <FormFooter
                            backLink={backLink}
                            step={step}
                            isPending={parseMutation.isPending || saveMutation.isPending}
                        />
                    </form>
                </Form>
            </div>
        </div>
    );
}