"use client";

import Image from "next/image";
import Link from "next/link";
import { gmail, pdf_icon } from "@/static/icons";
import LocalPDFDownloadButton from "../Docs/Render/HeidiSystemsPdf/LocalPDFDownloadButton";
import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";

export type HeatingBillActionButtonsProps = {
  objektId: string;
  localId: string;
  docId: string;
  previewHref: string;
  editLink: string;
  docType: "localauswahl" | "objektauswahl";
  /** Optional: use "admin_heating_bill_delete" for admin view */
  dialogAction?: "heating_bill_delete" | "admin_heating_bill_delete";
};

export default function HeatingBillActionButtons({
  objektId,
  localId,
  docId,
  previewHref,
  editLink,
  docType: _docType,
  dialogAction = "heating_bill_delete",
}: Readonly<HeatingBillActionButtonsProps>) {
  return (
    <div className="flex items-center justify-end max-medium:justify-center gap-12 max-medium:gap-4">
      <div className="flex items-center justify-end max-medium:justify-center gap-4 max-medium:gap-3">
        <span className="inline-flex">
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
        </span>

        <span className="inline-flex">
          <LocalPDFDownloadButton
            objektId={objektId}
            localId={localId}
            docId={docId}
          />
        </span>

        <span className="inline-flex">
          <button type="button">
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
            dialogAction={dialogAction}
            editLink={editLink}
          />
        </div>
      </div>
    </div>
  );
}
