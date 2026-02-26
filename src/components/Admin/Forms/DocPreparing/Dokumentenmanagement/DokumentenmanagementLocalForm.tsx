"use client";

import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import type {
    DocCostCategoryType,
    InvoiceDocumentType,
} from "@/types";
import { useForm } from "react-hook-form";
import { Form } from "@/components/Basic/ui/Form";
import { UploadDropzone } from "./components/UploadDropzone";
import { FileList } from "./components/FileList";
import { FormFooter } from "./components/FormFooter";
import { UploadInfoItems } from "./components/UploadInfoItems";
import { useDokumentenManagementLocal } from "@/hooks/useDokumentenManagementLocal";

export default function DokumentenmanagementLocalForm({
    objektId,
    localId,
    docId,
    pathSlug,
    userDocCostCategories,
    relatedInvoices,
}: {
    objektId: string;
    localId: string;
    docId: string;
    pathSlug: string;
    userDocCostCategories: DocCostCategoryType[];
    relatedInvoices?: InvoiceDocumentType[];
}) {
    const methods = useForm();
    const {
        entries,
        step,
        onDrop,
        handleSubmit,
        parseMutation,
        saveMutation,
    } = useDokumentenManagementLocal({
        objektId,
        localId,
        docId,
        pathSlug,
        userDocCostCategories,
        relatedInvoices,
    });
    const isEditMode = !!relatedInvoices;

    const backLink = isEditMode
        ? `${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/weitermachen/${docId}/abrechnungszeitraum`
        : `${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objektId}/${localId}/abrechnungszeitraum`;

    return (
        <div className="bg-[#EFEEEC] border-y-[20px] border-[#EFEEEC] col-span-3 h-full rounded-2xl px-4 flex items-start justify-center">
            <div className="bg-white h-full py-6 px-4 rounded w-full shadow-sm space-y-8 flex flex-col">
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