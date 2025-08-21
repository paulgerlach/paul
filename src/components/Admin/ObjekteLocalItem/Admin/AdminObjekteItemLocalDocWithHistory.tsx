"use client";

import {
  useContractsByLocalID,
  useHeatingBillDocumentsByLocalID,
} from "@/apiClient";
import { Skeleton } from "@/components/Basic/ui/Skeleton";
import { useLocalStatus } from "@/hooks/useLocalStatus";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import {
  chevron_admin,
  close_dialog,
  operating_cost_documents_pending,
} from "@/static/icons";
import { useDialogStore } from "@/store/useDIalogStore";
import type { LocalType, UnitType } from "@/types";
import {
  buildLocalName,
  handleLocalTypeIcon,
  slideDown,
  slideUp,
} from "@/utils";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export type ObjekteItemLocalDocWithHistoryProps = {
  item: LocalType;
  isOpen: boolean;
  index: number;
  objektID: string;
  userID: string;
  onClick: (index: number) => void;
};

export default function AdminObjekteItemLocalDocWithHistory({
  item,
  isOpen,
  index,
  userID,
  onClick,
}: ObjekteItemLocalDocWithHistoryProps) {
  const contentRef = useRef(null);
  const { setItemID, openDialog, setQueryKey } = useDialogStore();

  const { data: contracts, isLoading } = useContractsByLocalID(item.id);

  useEffect(() => {
    if (isOpen) {
      slideDown(contentRef.current);
    } else {
      slideUp(contentRef.current);
    }
  }, [isOpen]);

  const { status, renderStatusImage, renderStatusBadge } =
    useLocalStatus(contracts);

  const { data: relatedOpenedDocuments } = useHeatingBillDocumentsByLocalID(
    item.id
  );

  const openDeleteDialog = (docID: string) => {
    setItemID(docID);
    openDialog("admin_heating_bill_delete");
    setQueryKey(["operating_cost_documents", item.id ?? ""]);
  };

  return (
    <div
      className={`bg-white/50 rounded-2xl ${isOpen ? `active` : ""} ${
        status === "vacancy" && "available"
      } [.available.active]:pb-7`}
    >
      <div
        className={`bg-white p-2 rounded-2xl flex items-center justify-between`}
      >
        <div className="flex items-center justify-start gap-8">
          <div className="flex items-center justify-start gap-2">
            <span className="flex items-center size-20 max-xl:size-14 justify-center rounded bg-[#E7E8EA]">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="max-w-9 max-h-9 max-xl:max-w-7 max-xl:max-h-7"
                src={handleLocalTypeIcon(item.usage_type as UnitType) || ""}
                alt={item.usage_type || ""}
              />
            </span>
            {isLoading ? (
              <Skeleton className="w-20 h-20 max-xl:w-14 max-xl:h-14 rounded bg-[#E5EBF5]" />
            ) : (
              renderStatusImage()
            )}
          </div>
          <div
            className="flex cursor-pointer items-center justify-start gap-5"
            onClick={() => onClick(index)}
          >
            <p className="text-2xl max-xl:text-lg text-dark_green">
              {buildLocalName(item)}
            </p>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-2.5 max-h-4 -rotate-90 [.active_&]:rotate-0 transition-all duration-300"
              src={chevron_admin}
              alt="chevron"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-7">
          {isLoading ? (
            <Skeleton className="w-56 h-16 rounded-[20px]" />
          ) : (
            renderStatusBadge()
          )}
        </div>
      </div>
      <div
        ref={contentRef}
        className="[.active_&]:pt-6 [.active_&]:pb-2 space-y-6 px-24 [.active_&]:h-auto h-0"
      >
        {relatedOpenedDocuments?.map((doc) => (
          <div className="flex items-center justify-between" key={doc.id}>
            <Link
              className="flex items-center justify-start gap-8"
              href={`${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/weitermachen/${doc.id}/abrechnungszeitraum`}
            >
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="max-w-6 max-h-6 max-xl:max-w-4 max-xl:max-h-4"
                src={operating_cost_documents_pending}
                alt="operating_cost_documents_pending"
              />
              {doc.start_date
                ? format(new Date(doc.start_date), "dd.MM.yyyy", { locale: de })
                : "?"}
              {" - "}
              {doc.end_date
                ? format(new Date(doc.end_date), "dd.MM.yyyy", { locale: de })
                : "?"}
            </Link>
            <div className="flex items-center justify-end gap-2">
              <Link
                href={`${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/weitermachen/${doc.id}/abrechnungszeitraum`}
                className="text-xl max-xl:text-sm text-dark_green cursor-pointer flex items-center justify-start gap-2 hover:bg-green/20 transition-all duration-300 px-1.5 py-1 rounded-md"
              >
                <Pencil className="w-4 h-4 max-xl:w-3 max-xl:h-3" />
              </Link>
              <button
                onClick={() => openDeleteDialog(doc.id ? doc.id : "")}
                className="text-xl max-xl:text-sm text-dark_green cursor-pointer flex items-center justify-start gap-2 hover:bg-green/20 transition-all duration-300 px-1.5 py-1 rounded-md"
              >
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="max-w-2.5 max-h-2.5"
                  src={close_dialog}
                  alt="close_dialog"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
