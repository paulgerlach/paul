"use client";

import { useState, useMemo, useEffect } from "react";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import { InvoiceDocumentType } from "@/types";
import { format } from "date-fns";

export function useDetailansichtLogic(relatedInvoices?: InvoiceDocumentType[]) {
    const { documentGroups } = useHeizkostenabrechnungStore();
    const [activeInvoiceIndex, setActiveInvoiceIndex] = useState(0);

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

    const allInvoices = useMemo(() => {
        const flat: any[] = [];
        documents.forEach((doc, docIdx) => {
            doc.items.forEach((item, itemIdx) => {
                flat.push({ ...item, docIdx, itemIdx });
            });
        });
        return flat;
    }, [documents]);

    const currentInvoice = allInvoices[activeInvoiceIndex];
    const currentDocIndex = currentInvoice?.docIdx ?? 0;
    const openAccordionIndex = currentInvoice?.itemIdx ?? 0;
    const currentDoc = documents[currentDocIndex];
    
    const pdfUrl = useMemo(() => currentDoc ? URL.createObjectURL(currentDoc.file) : null, [currentDoc]);

    const handleNextInvoice = () => {
        if (activeInvoiceIndex < allInvoices.length - 1) {
            setActiveInvoiceIndex(prev => prev + 1);
        }
    };

    const handlePrevInvoice = () => {
        if (activeInvoiceIndex > 0) {
            setActiveInvoiceIndex(prev => prev - 1);
        }
    };

    const jumpToInvoice = (docIdx: number, itemIdx: number) => {
        const index = allInvoices.findIndex(inv => inv.docIdx === docIdx && inv.itemIdx === itemIdx);
        if (index !== -1) {
            setActiveInvoiceIndex(index);
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
        allInvoices,
        activeInvoiceIndex,
        currentDocIndex,
        currentDoc,
        pdfUrl,
        openAccordionIndex,
        handleNextInvoice,
        handlePrevInvoice,
        jumpToInvoice,
        checkIfChanged,
    };
}
