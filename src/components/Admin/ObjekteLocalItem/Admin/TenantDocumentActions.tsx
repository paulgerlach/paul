"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { pdf_icon, doc_download, gmail } from "@/static/icons";

export type TenantDocumentActionsProps = {
    documentId: string;
    previewHref: string;
};

export default function TenantDocumentActions({
    documentId,
    previewHref,
}: Readonly<TenantDocumentActionsProps>) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/heating-bill/document-url/${documentId}`);
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.presignedUrl) {
                throw new Error("Kein Download-Link erhalten.");
            }
            const pdfRes = await fetch(data.presignedUrl);
            const blob = await pdfRes.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = "Heizkostenabrechnung.pdf";
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Error downloading PDF:", error);
            const message =
                error instanceof Error
                    ? error.message
                    : "Fehler beim Herunterladen der PDF.";
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3 max-medium:gap-2 flex-shrink-0">
            <span className="inline-flex">
                <Link href={previewHref}>
                    <Image
                        width={0}
                        height={0}
                        sizes="100vw"
                        loading="lazy"
                        className="max-w-8 max-h-8 max-xl:max-w-5 max-xl:max-h-5 max-medium:max-w-6 max-medium:max-h-6"
                        src={pdf_icon}
                        alt="preview"
                    />
                </Link>
            </span>

            <span className="inline-flex">
                <button
                    type="button"
                    className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDownload}
                    disabled={loading}
                >
                    <Image
                        width={0}
                        height={0}
                        sizes="100vw"
                        loading="lazy"
                        className="max-w-8 max-h-8 max-xl:max-w-5 max-xl:max-h-5 max-medium:max-w-6 max-medium:max-h-6"
                        src={doc_download}
                        alt="download"
                    />
                </button>
            </span>

            <span className="inline-flex">
                <button type="button">
                    <Image
                        width={0}
                        height={0}
                        sizes="100vw"
                        loading="lazy"
                        className="max-w-7 max-h-7 max-xl:max-w-5 max-xl:max-h-5 max-medium:max-w-6 max-medium:max-h-6"
                        src={gmail}
                        alt="email"
                    />
                </button>
            </span>
        </div>
    );
}
