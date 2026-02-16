"use client";

import { useState } from "react";
import Image from "next/image";
import { doc_download } from "@/static/icons";

export type LocalPDFDownloadButtonProps = {
  objektId: string;
  localId: string;
  docId: string;
};

export default function LocalPDFDownloadButton({
  objektId,
  localId,
  docId,
}: Readonly<LocalPDFDownloadButtonProps>) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!docId) {
      alert("Fehler: Keine Abrechnung ausgewählt.");
      return;
    }
    try {
      setLoading(true);
      // Try download endpoint first (for pre-generated PDFs from objektauswahl batch)
      let res = await fetch("/api/download-heating-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objektId, localId, docId }),
      });
      const data = await res.json().catch(() => ({}));

      // If PDF not found (404), fall back to generate on-demand (e.g. localauswahl flow)
      if (res.status === 404) {
        res = await fetch("/api/generate-heating-bill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ objektId, localId, docId }),
        });
        const generateData = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            (typeof generateData?.error === "string" ? generateData.error : null) ??
              "PDF konnte nicht erzeugt werden."
          );
        }
        Object.assign(data, generateData);
      } else if (!res.ok) {
        throw new Error(
          (typeof data?.error === "string" ? data.error : null) ??
            "PDF konnte nicht heruntergeladen werden."
        );
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
      const message =
        error instanceof Error
          ? error.message
          : "Fehler beim Erzeugen oder Herunterladen der PDF.";
      alert(message);
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
