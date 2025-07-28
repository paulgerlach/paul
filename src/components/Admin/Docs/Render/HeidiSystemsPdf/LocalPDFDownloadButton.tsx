"use client";

import Image from "next/image";
import { pdf } from "@react-pdf/renderer";
import { doc_download } from "@/static/icons";
import HeidiSystemsPdf from "./HeidiSystemsPdf";

export default function LocalPDFDownloadButton() {
  const handleDownload = async () => {
    try {
      const blob = await pdf(<HeidiSystemsPdf />).toBlob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Nebenkostenabrechnung.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating or downloading PDF:", error);
      alert("Fehler beim Erzeugen oder Herunterladen der PDF.");
    }
  };

  return (
    <button className="cursor-pointer" onClick={handleDownload}>
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
