"use client";

import { useState } from "react";
import Image from "next/image";
import { doc_download } from "@/static/icons";

export type TenantDownloadInfo = {
  contractId: string;
  contractorsNames: string;
};

export type LocalPDFDownloadButtonProps = {
  objektId: string;
  localId: string;
  docId: string;
  /** When provided, downloads all tenant PDFs for the locale */
  tenants?: TenantDownloadInfo[];
};

export default function LocalPDFDownloadButton({
  objektId,
  localId,
  docId,
  tenants,
}: Readonly<LocalPDFDownloadButtonProps>) {
  const [loading, setLoading] = useState(false);

  const downloadBlob = async (url: string, filename: string) => {
    const pdfRes = await fetch(url);
    const blob = await pdfRes.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const handleDownload = async () => {
    if (!docId) {
      alert("Fehler: Keine Abrechnung ausgewählt.");
      return;
    }
    try {
      setLoading(true);

      if (tenants && tenants.length > 0) {
        // Multi-tenant: download each tenant's PDF
        for (const tenant of tenants) {
          const res = await fetch("/api/heating-bill/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ objektId, localId, docId, contractId: tenant.contractId }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.presignedUrl) {
            console.warn(`PDF not found for tenant ${tenant.contractorsNames}, trying fallback`);
            continue;
          }
          const safeName = tenant.contractorsNames.replace(/[^a-zA-ZäöüÄÖÜß\s-]/g, "").trim() || "Mieter";
          await downloadBlob(data.presignedUrl, `Heizkostenabrechnung_${safeName}.pdf`);
          // Small delay between downloads to avoid browser blocking
          if (tenants.length > 1) {
            await new Promise((r) => setTimeout(r, 500));
          }
        }
      } else {
        // Single/legacy download
        let res = await fetch("/api/heating-bill/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ objektId, localId, docId }),
        });
        const data = await res.json().catch(() => ({}));

        if (res.status === 404) {
          // Fall back to on-demand generation
          res = await fetch("/api/heating-bill/generate", {
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

        // If multi-tenant URLs were returned, download all
        if (data.tenantUrls && data.tenantUrls.length > 1) {
          for (const tu of data.tenantUrls) {
            await downloadBlob(tu.presignedUrl, `Heizkostenabrechnung_${tu.contractId}.pdf`);
            await new Promise((r) => setTimeout(r, 500));
          }
        } else {
          const presignedUrl = data.presignedUrl;
          if (!presignedUrl) {
            throw new Error("Kein Download-Link erhalten.");
          }
          await downloadBlob(presignedUrl, "Heizkostenabrechnung.pdf");
        }
      }
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
