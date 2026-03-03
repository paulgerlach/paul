"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker using CDN (pnpm doesn't hoist pdfjs-dist)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
    url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const onDocumentLoadSuccess = useCallback(
        ({ numPages: n }: { numPages: number }) => setNumPages(n),
        [],
    );

    // Track container width for responsive page sizing
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Render at minimum 2x pixel density for crisp edges on rounded corners
    const dpr =
        typeof window !== "undefined"
            ? Math.max(window.devicePixelRatio || 1, 2)
            : 2;

    return (
        <div
            ref={containerRef}
            className="w-full h-full overflow-y-auto rounded-lg border border-gray-200 bg-gray-100 p-4"
        >
            <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">PDF wird geladen…</p>
                    </div>
                }
                error={
                    <div className="flex items-center justify-center h-64">
                        <p className="text-red-500">Fehler beim Laden des PDFs</p>
                    </div>
                }
            >
                {Array.from({ length: numPages }, (_, i) => (
                    <Page
                        key={`page-${i + 1}`}
                        pageNumber={i + 1}
                        width={containerWidth > 0 ? containerWidth - 32 : undefined}
                        devicePixelRatio={dpr}
                        className="mx-auto mb-4 shadow-md"
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                ))}
            </Document>
        </div>
    );
}
