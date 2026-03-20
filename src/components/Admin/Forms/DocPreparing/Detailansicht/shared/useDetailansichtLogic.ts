"use client";

import { useState, useMemo } from "react";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import { InvoiceDocumentType } from "@/types";
import { format } from "date-fns";

export function useDetailansichtLogic(relatedInvoices?: InvoiceDocumentType[]) {
    const { documentGroups } = useHeizkostenabrechnungStore();
    const [currentDocIndex, setCurrentDocIndex] = useState(0);
    const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(0);

    const initialInvoicesMap = useMemo(() => {
        const map = new Map<string, InvoiceDocumentType>();
        relatedInvoices?.forEach(inv => {
            if (inv.id) map.set(inv.id, inv);
        });
        return map;
    }, [relatedInvoices]);

    const documents = useMemo(() => {
        const docsMap = new Map<string, { file: File, items: any[] }>();

        documentGroups.forEach(group => {
            group.data.forEach((item, index) => {
                if (item.document && item.document.length > 0) {
                    const file = item.document[0];
                    const key = `${file.name}-${file.size}`;
                    if (!docsMap.has(key)) {
                        docsMap.set(key, { file, items: [] });
                    }
                    docsMap.get(key)!.items.push({ groupType: group.type, index, item, file });
                }
            });
        });

        return Array.from(docsMap.values());
    }, [documentGroups]);

    const currentDoc = documents[currentDocIndex];
    const pdfUrl = useMemo(() => currentDoc ? URL.createObjectURL(currentDoc.file) : null, [currentDoc]);

    const handleNextDoc = () => {
        if (currentDocIndex < documents.length - 1) {
            setCurrentDocIndex(prev => prev + 1);
            setOpenAccordionIndex(0);
        }
    };

    const handlePrevDoc = () => {
        if (currentDocIndex > 0) {
            setCurrentDocIndex(prev => prev - 1);
            setOpenAccordionIndex(0);
        }
    };

    const checkIfChanged = (item: any) => {
        if (!item.id) return true;
        const initial = initialInvoicesMap.get(item.id);
        if (!initial) return true;

        const hasChanged = 
            (item.invoice_date !== (initial.invoice_date ? format(new Date(initial.invoice_date), "yyyy-MM-dd") : null)) ||
            (item.total_amount !== (initial.total_amount ? String(initial.total_amount) : null)) ||
            (item.service_period !== initial.service_period) ||
            (item.for_all_tenants !== initial.for_all_tenants) ||
            (item.purpose !== initial.purpose) ||
            (item.notes !== initial.notes) ||
            (JSON.stringify(item.direct_local_id) !== JSON.stringify(initial.direct_local_id));

        return hasChanged;
    };

    return {
        documents,
        currentDocIndex,
        currentDoc,
        pdfUrl,
        openAccordionIndex,
        setOpenAccordionIndex,
        handleNextDoc,
        handlePrevDoc,
        checkIfChanged,
    };
}
