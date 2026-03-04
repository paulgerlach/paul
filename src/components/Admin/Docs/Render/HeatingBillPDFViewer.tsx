"use client";

import dynamic from "next/dynamic";
import HeidiSystemsPdf from "@/components/Admin/Docs/Render/HeidiSystemsPdf/HeidiSystemsPdf";
import type { HeatingBillPdfModel } from "@/app/api/heating-bill/_lib";

const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
    { ssr: false }
);

export default function HeatingBillPDFViewer({
    model,
}: Readonly<{ model: HeatingBillPdfModel }>) {
    return (
        <PDFViewer
            width="100%"
            height="100%"
            style={{ minHeight: "80vh", borderRadius: 12, border: "none" }}
            showToolbar
        >
            <HeidiSystemsPdf model={model} />
        </PDFViewer>
    );
}
