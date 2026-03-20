"use client";

import { useState } from "react";
import PdfViewer from "@/components/Admin/Docs/Render/PdfViewer";
import { ChevronLeft, ChevronRight, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/Basic/ui/Button";
import Link from "next/link";
import CostItemAccordion from "./CostItemAccordion";
import { useDetailansichtLogic } from "./useDetailansichtLogic";
import { InvoiceDocumentType, LocalType } from "@/types";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DetailansichtBaseProps {
    relatedInvoices?: InvoiceDocumentType[];
    locals: LocalType[];
    backLink: string;
    nextLink: string;
    onSave: (item: any) => Promise<void>;
}

export default function DetailansichtBase({
    relatedInvoices,
    locals,
    backLink,
    nextLink,
    onSave
}: DetailansichtBaseProps) {
    const { documentGroups, purposeOptions } = useHeizkostenabrechnungStore();
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const {
        documents,
        currentDocIndex,
        currentDoc,
        pdfUrl,
        openAccordionIndex,
        setOpenAccordionIndex,
        handleNextDoc,
        handlePrevDoc,
        checkIfChanged
    } = useDetailansichtLogic(relatedInvoices);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            for (const group of documentGroups) {
                for (const item of group.data) {
                    if (item.id && checkIfChanged(item)) {
                        await onSave(item);
                    }
                }
            }
            toast.success("Ausgaben erfolgreich verknüpft.");
            router.push(nextLink);
        } catch (error) {
            console.error("Error saving invoices:", error);
            toast.error("Fehler beim Speichern der Änderungen.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-[#EFEEEC] border-y-[20px] border-[#EFEEEC] col-span-3 h-full rounded-2xl px-4 grid grid-cols-2 max-large:grid-cols-1 gap-8">
            <div className="bg-white h-full py-6 px-4 rounded w-full shadow-sm space-y-8 flex flex-col overflow-y-auto">
                {pdfUrl ? (
                    <PdfViewer url={pdfUrl} />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-4">
                        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="font-medium">Kein Dokument gefunden</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col h-full border border-gray-200 rounded-lg bg-[#f9fafb] shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 bg-white shadow-sm z-10 w-full relative">
                    <h2 className="text-lg font-bold text-gray-800 truncate pr-4">
                        Hochgeladenes Dokument: <span className="font-medium">{currentDoc?.file.name ?? "..."}</span>
                    </h2>
                    <div className="flex items-center gap-1 border border-gray-200 rounded-full px-1 py-1 bg-gray-50/50">
                        <button
                            onClick={handlePrevDoc}
                            disabled={currentDocIndex === 0}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-full disabled:opacity-30 disabled:hover:shadow-none transition-all"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="text-xs font-semibold text-gray-500 w-10 text-center">
                            {documents.length > 0 ? `${currentDocIndex + 1} / ${documents.length}` : "0 / 0"}
                        </span>
                        <button
                            onClick={handleNextDoc}
                            disabled={currentDocIndex === documents.length - 1}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-full disabled:opacity-30 disabled:hover:shadow-none transition-all"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 pb-28">
                    {currentDoc?.items.map((costItem, idx) => (
                        <CostItemAccordion
                            key={`${currentDocIndex}-${idx}`}
                            costItem={costItem}
                            isOpen={openAccordionIndex === idx}
                            onToggle={() => setOpenAccordionIndex(openAccordionIndex === idx ? null : idx)}
                            locals={locals}
                            purposeOptions={purposeOptions}
                        />
                    ))}
                    {!currentDoc && (
                        <div className="flex flex-col items-center justify-center text-gray-400 mt-20 gap-2">
                            <MoreVertical className="w-8 h-8 opacity-20" />
                            <p>Keine Kostenarten erkannt</p>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200 flex justify-between items-center z-10">
                    <Link
                        href={backLink}
                        className="py-4 px-6 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm max-medium:px-3 max-medium:py-2 max-medium:text-sm rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-white cursor-pointer font-medium hover:bg-[#e0e0e0]/50 transition-colors duration-300"
                    >
                        Abbrechen
                    </Link>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                        Speichern
                    </Button>
                </div>
            </div>
        </div>
    );
}
