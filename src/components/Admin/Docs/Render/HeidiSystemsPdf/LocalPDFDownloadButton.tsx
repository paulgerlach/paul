"use client";

import { useState } from "react";
import Image from "next/image";
import { doc_download } from "@/static/icons";
import { type HeatingBillPreviewProps } from "../HeatingBillPreview/HeatingBillPreview";

export default function LocalPDFDownloadButton(props: HeatingBillPreviewProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    const { mainDoc, local, objekt } = props;
    if (!mainDoc?.id) {
      alert("Fehler: Keine Abrechnung ausgewählt.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/generate-heating-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docId: mainDoc.id,
          objektId: objekt?.id,
          localId: local?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "PDF konnte nicht erzeugt werden.");
      }
      const presignedUrl = data.presignedUrl;
      if (!presignedUrl) {
        throw new Error("Kein Download-Link erhalten.");
      }
      const pdfRes = await fetch(presignedUrl);
      const blob = await pdfRes.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Heizkostenabrechnung.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating or downloading PDF:", error);
      alert("Fehler beim Erzeugen oder Herunterladen der PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleDownload}
      disabled={loading}
    >
      <Image
        width={0}
        height={0}
        sizes="100vw"
        loading="lazy"
        className="max-w-10 max-h-10 max-xl:max-w-6 max-xl:max-h-6"
        src={doc_download}
        alt={"doc_download"}
      />
    </button>
  );
}
