"use client";

import Image from "next/image";
import { pdf } from "@react-pdf/renderer";
import { doc_download } from "@/static/icons";
import HeidiSystemsPdf from "./HeidiSystemsPdf";
import { useState } from "react";
import { generateHeatingBillPDF } from "@/actions/generate/generateHeatingBillPDF"; // .tsx

export default function LocalPDFDownloadButton({
  mainDoc,
  local
}: {
  mainDoc: any;
  local: any
  // Relaxed types to avoid import circles or strictness issues for now, 
  // ideally should be HeatingBillDocumentType and LocalType
}) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!mainDoc?.id || !local?.id) {
      alert("Fehler: Dokument oder Einheit nicht gefunden.");
      return;
    }

    try {
      setLoading(true);
      // Determine the ID to pass. implementation_plan says heatingBillId.
      // However, the action expects a UUID. 
      // mainDoc is the HeatingBillDocument. 
      // But we need to generate for a SPECIFIC Local if this is a local download button.

      const response = await generateHeatingBillPDF(mainDoc.id, local.id);

      if (response.success && response.url) {
        window.open(response.url, "_blank");
      } else {
        alert("Fehler: " + (response.error || "Unbekannter Fehler"));
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Fehler beim Anfordern der PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="cursor-pointer" onClick={handleDownload} disabled={loading}>
      {loading ? (
        <div className="flex items-center justify-center p-2">
          <span className="text-xs text-gray-500">...</span>
        </div>
      ) : (
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-10 max-h-10 max-xl:max-w-6 max-xl:max-h-6"
          src={doc_download}
          alt={"doc_download"}
        />
      )}
    </button>
  );
}
