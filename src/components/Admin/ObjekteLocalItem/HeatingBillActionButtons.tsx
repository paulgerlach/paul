"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { gmail, pdf_icon } from "@/static/icons";
import LocalPDFDownloadButton from "../Docs/Render/HeidiSystemsPdf/LocalPDFDownloadButton";
import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";

const POLL_INTERVAL_MS = 5000;

export type HeatingBillActionButtonsProps = {
  objektId: string;
  localId: string;
  docId: string;
  previewHref: string;
  editLink: string;
  docType: "localauswahl" | "objektauswahl";
};

export default function HeatingBillActionButtons({
  objektId,
  localId,
  docId,
  previewHref,
  editLink,
  docType,
}: Readonly<HeatingBillActionButtonsProps>) {
  const [pdfReady, setPdfReady] = useState<boolean | null>(null);

  const checkPdfReady = useCallback(async () => {
    if (!docId || !objektId || !localId) return;
    try {
      const res = await fetch("/api/download-heating-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objektId, localId, docId }),
      });
      setPdfReady(res.ok);
    } catch {
      setPdfReady(false);
    }
  }, [objektId, localId, docId]);

  useEffect(() => {
    checkPdfReady();
  }, [checkPdfReady]);

  useEffect(() => {
    if (pdfReady === true || pdfReady === null) return;
    const interval = setInterval(checkPdfReady, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [pdfReady, checkPdfReady]);

  const isDisabled = pdfReady !== true;
  const disabledTooltip = "Wird generiert...";

  return (
    <div className="flex items-center justify-end max-medium:justify-center gap-12 max-medium:gap-4">
      <div className="flex items-center justify-end max-medium:justify-center gap-4 max-medium:gap-3">
        <span
          className={
            isDisabled
              ? "inline-flex opacity-50 cursor-not-allowed"
              : "inline-flex"
          }
          title={isDisabled ? disabledTooltip : undefined}
        >
          {isDisabled ? (
            <span className="pointer-events-none">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="max-w-10 max-h-10 max-xl:max-w-6 max-xl:max-h-6 max-medium:max-w-8 max-medium:max-h-8"
                src={pdf_icon}
                alt="pdf_icon"
              />
            </span>
          ) : (
            <Link href={previewHref}>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="max-w-10 max-h-10 max-xl:max-w-6 max-xl:max-h-6 max-medium:max-w-8 max-medium:max-h-8"
                src={pdf_icon}
                alt="pdf_icon"
              />
            </Link>
          )}
        </span>

        <span
          className={
            isDisabled
              ? "inline-flex opacity-50 cursor-not-allowed pointer-events-none"
              : "inline-flex"
          }
          title={isDisabled ? disabledTooltip : undefined}
        >
          <LocalPDFDownloadButton
            objektId={objektId}
            localId={localId}
            docId={docId}
          />
        </span>

        <span
          className={
            isDisabled
              ? "inline-flex opacity-50 cursor-not-allowed pointer-events-none"
              : "inline-flex"
          }
          title={isDisabled ? disabledTooltip : undefined}
        >
          <button type="button" disabled={isDisabled} aria-disabled={isDisabled}>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-[35px] max-h-[35px] max-xl:max-w-6 max-xl:max-h-6 max-medium:max-w-8 max-medium:max-h-8"
              src={gmail}
              alt="gmail_icon"
            />
          </button>
        </span>

        <div className="max-medium:hidden">
          <ThreeDotsButton
            dialogAction="heating_bill_delete"
            editLink={editLink}
          />
        </div>
      </div>
    </div>
  );
}
