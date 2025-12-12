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
import { ObjekteItemLocalHeader } from "../ObjekteItemLocalHeader";

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
      <ObjekteItemLocalHeader
        item={item}
        isLoading={isLoading}
        hasDocuments={!!relatedOpenedDocuments?.length}
        onClickAccordion={() => onClick(index)}
        renderStatusImage={renderStatusImage}
        renderStatusBadge={renderStatusBadge}
        link={`${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${item.objekt_id}/${item.id}/abrechnungszeitraum`}
        isOpen={isOpen}
      />
      <div
        ref={contentRef}
        className="[.active_&]:pt-6 [.active_&]:pb-2 max-medium:[.active_&]:pt-4 space-y-6 max-medium:space-y-3 px-24 max-medium:px-4 [.active_&]:h-auto h-0"
      >
        {relatedOpenedDocuments?.map((doc) => (
          <div className="flex items-center justify-between max-medium:gap-2" key={doc.id}>
            <Link
              className="flex items-center justify-start gap-8 max-medium:gap-3 max-medium:text-sm"
              href={`${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/weitermachen/${doc.id}/abrechnungszeitraum`}
            >
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="max-w-6 max-h-6 max-xl:max-w-4 max-xl:max-h-4 max-medium:max-w-4 max-medium:max-h-4"
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
