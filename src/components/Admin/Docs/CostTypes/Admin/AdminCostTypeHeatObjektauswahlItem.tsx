import TheeDotsCostTypeButton from "@/components/Basic/TheeDotsButton/TheeDotsCostTypeButton";
import { admin_plus, chevron_admin, pdf_icon } from "@/static/icons";
import { useDialogStore } from "@/store/useDIalogStore";
import {
  type HeizkostenabrechnungCostType,
  useHeizkostenabrechnungStore,
} from "@/store/useHeizkostenabrechnungStore";
import { getCostTypeIconByKey, slideDown, slideUp } from "@/utils";
import { Download } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type CostTypeItemProps = {
  isOpen: boolean;
  index: number;
  onClick: (index: number) => void;
  type: HeizkostenabrechnungCostType;
  objektId: string;
  docId: string;
};

export default function AdminCostTypeHeatObjektauswahlItem({
  isOpen,
  index,
  onClick,
  type,
  objektId,
  docId,
}: CostTypeItemProps) {
  const contentRef = useRef(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<
    string | null
  >(null);
  const { openDialog } = useDialogStore();
  const {
    setActiveCostType,
    setObjektID,
    setPurposeOptions,
    setOperatingDocID,
  } = useHeizkostenabrechnungStore();

  useEffect(() => {
    if (isOpen) {
      slideDown(contentRef.current);
    } else {
      slideUp(contentRef.current);
    }
  }, [isOpen]);

  const handleOpenDialog = () => {
    setActiveCostType(type.type);
    setObjektID(objektId);
    setOperatingDocID(docId);
    setPurposeOptions();
    openDialog(`admin_${type.type}_heizkostenabrechnung_upload`);
  };

  const totalAmount = type.data.reduce(
    (acc, item) => acc + Number(item.total_amount ?? 0),
    0
  );

  const handleDownloadDocument = async ({
    invoiceId,
    documentName,
  }: {
    invoiceId: string;
    documentName: string;
  }) => {
    try {
      setDownloadingInvoiceId(invoiceId);
      const query = new URLSearchParams({
        relatedId: docId,
        invoiceId,
        documentName,
      }).toString();

      const response = await fetch(
        `/api/heating-bill/invoice-document-url?${query}`
      );
      const data = await response.json();

      if (!response.ok || !data?.presignedUrl) {
        throw new Error(data?.error || "Download fehlgeschlagen");
      }

      window.open(data.presignedUrl, "_blank");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Fehler beim Herunterladen des Dokuments"
      );
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  return (
    <div className={`bg-[#F5F5F5] rounded-md ${isOpen ? `active` : ""}`}>
      <div
        className={`bg-white py-3 max-medium:py-2 px-6 max-medium:px-3 flex items-center justify-between border border-[#E7E9ED] rounded-md`}
      >
        <div
          className="flex cursor-pointer items-center justify-start gap-5 max-medium:gap-3 flex-1 min-w-0"
          onClick={() => onClick(index)}
        >
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-5 max-h-4 max-xl:max-w-3 max-xl:max-h-3 max-medium:max-w-2.5 max-medium:max-h-2.5 [.active_&]:-rotate-90 transition-all duration-300 flex-shrink-0"
            src={chevron_admin}
            alt="chevron"
          />
          <div className="size-14 max-w-14 max-h-14 min-w-14 min-h-14 max-xl:size-10 max-xl:max-w-10 max-xl:max-h-10 max-xl:min-h-10 max-xl:min-w-10 max-medium:size-9 max-medium:max-w-9 max-medium:max-h-9 max-medium:min-h-9 max-medium:min-w-9 flex items-center justify-center bg-[#E7F2E8] rounded-full flex-shrink-0">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-7 max-h-7 max-xl:max-w-5 max-xl:max-h-5 max-medium:max-w-4 max-medium:max-h-4"
              src={getCostTypeIconByKey(type.type || "")}
              alt="chevron"
            />
          </div>
          <p className="font-semibold max-xl:text-sm max-medium:text-xs text-dark_green truncate">
            {type.name}
          </p>
        </div>
        <div className="flex items-center whitespace-nowrap justify-end gap-7 max-medium:gap-2 flex-shrink-0 ml-2">
          <span className="font-medium text-dark_green max-medium:text-sm bg-gray-100 px-2 py-1 rounded">{totalAmount} €</span>
          <TheeDotsCostTypeButton
            editDialogAction="admin_cost_type_heizkostenabrechnung_edit"
            itemID={type.id ?? ""}
            userID={type.user_id}
            deleteDialogAction="admin_cost_type_heizkostenabrechnung_delete"
          />
        </div>
      </div>
      <div
        ref={contentRef}
        className="[.active_&]:py-5 px-5 [.active_&]:h-auto h-0"
      >
        {type.data.map((item, i) => {
          if (item.document?.length === 1 || item.document_name) {
            const documentName = item.document_name ?? item.document?.[0]?.name;
            const invoiceId = item.id ?? `${i}`;
            const isDownloading = downloadingInvoiceId === invoiceId;

            return (
              <ul key={i} className="mt-4 mb-9 max-xl:mt-2 max-xl:mb-5">
                <li className="flex justify-between items-center pl-12 max-xl:pl-6">
                  <span className="text-sm flex items-center gap-12 max-xl:gap-6 truncate text-[#757575]">
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      loading="lazy"
                      className="block mx-auto"
                      src={pdf_icon}
                      alt="pdf_icon"
                    />
                    {documentName}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        documentName
                          ? handleDownloadDocument({ invoiceId, documentName })
                          : undefined
                      }
                      disabled={!documentName || isDownloading}
                      title="Dokument herunterladen"
                      className="p-1.5 text-dark_green hover:bg-green/20 transition-all duration-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <TheeDotsCostTypeButton
                      editDialogAction="admin_invoice_edit"
                      itemID={item.id ?? ""}
                      userID={type.user_id}
                      deleteDialogAction="admin_invoice_delete"
                    />
                  </div>
                </li>
              </ul>
            );
          }
          return null;
        })}
        <button
          onClick={() => handleOpenDialog()}
          className="flex items-center [.available_&]:mx-3 w-fit justify-center gap-2 px-6 py-5 max-xl:py-2.5 max-xl:px-3 border border-dark_green rounded-md bg-[#E0E0E0] text-sm font-medium text-admin_dark_text"
        >
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-4 max-h-4 max-xl:max-w-3 max-xl:max-h-3"
            src={admin_plus}
            alt="admin_plus"
          />
          Ausgaben hinzufügen
        </button>
      </div>
    </div>
  );
}
