"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";
import type { DialogDocumentActionType } from "@/types";
import { toast } from "sonner";

export type TenantDocumentUploadHandlerProps = {
    documentId: string;
    editLink?: string;
    dialogAction?: DialogDocumentActionType;
    itemID?: string;
    disabled?: boolean;
};

export default function TenantDocumentUploadHandler({
    documentId,
    editLink,
    dialogAction,
    itemID,
    disabled
}: TenantDocumentUploadHandlerProps) {
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    const handleUpload = async (file: File) => {
        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentId", documentId);

        try {
            const response = await fetch("/api/heating-bill/upload-tenant-pdf", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Upload failed");
            }

            toast.success("Dokument erfolgreich aktualisiert");
            router.refresh();
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(
                error instanceof Error ? error.message : "Fehler beim Hochladen"
            );
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {isUploading ? (
                <span className="inline-flex size-4 border border-t-2 border-green/30 border-t-green rounded-full animate-spin"></span>
            ) : (
                <ThreeDotsButton
                    disabled={disabled || isUploading}
                    editLink={editLink}
                    dialogAction={dialogAction}
                    itemID={itemID}
                    onUpload={handleUpload}
                />
            )}
        </div>
    );
}
