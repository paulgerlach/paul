"use client";

import { createHeatingInvoice } from "@/actions/create/createHeatingInvoice";
import {
    buildInvoiceNotes,
    mapCostCategoryToPurpose,
    processInvoicesViaNext,
} from "@/api/invoices";
import { useUploadDocuments } from "@/apiClient";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import type {
    DocCostCategoryType,
    InvoiceDocumentType,
} from "@/types";
import { useMutation } from "@tanstack/react-query";
import { parse } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type FileEntry = {
    id: string;
    file: File;
    status: "pending" | "analyzing" | "success" | "error";
    result?: {
        costType: string;
        costTypeName: string;
        purpose: string;
        invoiceDate: Date | null;
        amount: number | null;
        notes: string;
    };
    error?: string;
};

export type DialogStep = "upload" | "review";

export function useDokumentenManagementLocal({
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
    const router = useRouter();
    const uploadDocuments = useUploadDocuments();

    const {
        setDocumentGroups,
        documentGroups,
        updateDocumentGroup,
        objektID,
        operatingDocID,
    } = useHeizkostenabrechnungStore();

    const isEditMode = !!relatedInvoices;
    const [entries, setEntries] = useState<FileEntry[]>([]);
    const [step, setStep] = useState<DialogStep>("upload");

    useEffect(() => {
        const groups = userDocCostCategories.map((doc) => ({
            ...doc,
            data: isEditMode
                ? relatedInvoices?.filter(
                    (invoice) => invoice.cost_type === doc.type
                ) ?? []
                : [],
        }));

        setDocumentGroups(groups);
    }, [
        userDocCostCategories,
        setDocumentGroups,
        relatedInvoices,
        isEditMode,
    ]);

    const allPurposeOptions = useMemo(
        () => documentGroups.flatMap((g) => g.options ?? []),
        [documentGroups]
    );

    const parseMutation = useMutation({
        mutationFn: async (filesToProcess: FileEntry[]) => {
            const results = await processInvoicesViaNext(
                filesToProcess.map((e) => e.file)
            );
            return { results, filesToProcess };
        },
        onSuccess: (data) => {
            const { results, filesToProcess } = data;
            let hasValid = false;

            const updated: FileEntry[] = entries.map((entry) => {
                const processed = filesToProcess.find(
                    (f) => f.id === entry.id
                );
                if (!processed) return entry;

                const index = filesToProcess.indexOf(processed);
                const invoice = results.invoices?.[index];

                if (!invoice) {
                    return {
                        ...entry,
                        status: "error",
                        error: "Keine Rechnungsdaten erkannt.",
                    };
                }

                const mappedPurpose = mapCostCategoryToPurpose(
                    invoice.cost_category,
                    allPurposeOptions
                );

                if (!mappedPurpose) {
                    return {
                        ...entry,
                        status: "error",
                        error: "Kostenart konnte nicht zugeordnet werden.",
                    };
                }

                const group = documentGroups.find((g) =>
                    g.options?.includes(mappedPurpose)
                );

                if (!group?.type) {
                    return {
                        ...entry,
                        status: "error",
                        error: "Zugehörige Kategorie nicht gefunden.",
                    };
                }

                let invoiceDate: Date | null = null;
                if (invoice.invoice_date) {
                    const d = parse(
                        invoice.invoice_date,
                        "dd.MM.yyyy",
                        new Date()
                    );
                    if (!isNaN(d.getTime())) invoiceDate = d;
                }

                hasValid = true;

                return {
                    ...entry,
                    status: "success",
                    result: {
                        costType: group.type,
                        costTypeName: group.name ?? "Unbekannt",
                        purpose: mappedPurpose,
                        invoiceDate,
                        amount:
                            typeof invoice.gross_amount === "number"
                                ? invoice.gross_amount
                                : null,
                        notes:
                            buildInvoiceNotes(invoice)?.trimStart() ?? "",
                    },
                };
            });

            setEntries(updated);

            if (hasValid) setStep("review");
            else toast.error("Keine gültigen Rechnungen erkannt.");
        },
    });

    const nextLink = isEditMode
        ? `${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/weitermachen/${docId}/${pathSlug}/gesamtkosten`
        : `${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objektId}/${localId}/${docId}/${pathSlug}/gesamtkosten`;

    const saveMutation = useMutation({
        mutationFn: async () => {
            const valid = entries.filter(
                (e) => e.status === "success" && e.result
            );

            if (!valid.length)
                throw new Error(
                    "Keine gültigen Rechnungen vorhanden."
                );

            for (const entry of valid) {
                const { file, result } = entry;
                if (!result) continue;

                const payload = {
                    invoice_date: result.invoiceDate,
                    total_amount: result.amount,
                    service_period: false,
                    for_all_tenants: true,
                    purpose: result.purpose,
                    notes: result.notes,
                    document: [file],
                    direct_local_id: null,
                };

                await createHeatingInvoice(
                    payload,
                    objektID,
                    operatingDocID,
                    result.costType
                );

                updateDocumentGroup(result.costType, {
                    ...payload,
                    invoice_date: result.invoiceDate
                        ? result.invoiceDate.toISOString()
                        : null,
                    total_amount:
                        result.amount != null
                            ? String(result.amount)
                            : null,
                });

                await uploadDocuments.mutateAsync({
                    files: [file],
                    relatedId: operatingDocID ?? "",
                    relatedType: "heating_bill",
                });
            }
        },
        onSuccess: () => {
            toast.success(
                "Alle Rechnungen erfolgreich gespeichert."
            );
            router.push(nextLink);
        },
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newEntries = acceptedFiles.map((file) => ({
            id: Math.random().toString(36).substring(7),
            file,
            status: "pending" as const,
        }));
        setEntries((prev) => [...prev, ...newEntries]);
    }, []);

    const startAnalysis = () => {
        const pending = entries.filter(
            (e) =>
                e.status === "pending" ||
                e.status === "error"
        );
        if (!pending.length) return;

        setEntries((prev) =>
            prev.map((e) =>
                pending.some((p) => p.id === e.id)
                    ? { ...e, status: "analyzing" }
                    : e
            )
        );

        parseMutation.mutate(pending);
    };

    const handleSubmit = async () => {
        if (step === "upload") {
            startAnalysis();
            return;
        }

        if (step === "review") {
            await saveMutation.mutateAsync();
        }
    };

    return {
        entries,
        setEntries,
        step,
        setStep,
        onDrop,
        handleSubmit,
        parseMutation,
        saveMutation,
        nextLink,
    };
}