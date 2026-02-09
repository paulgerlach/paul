"use client";

import {
  useLocalsByObjektID,
  useOperatingCostDocumentsByObjektID,
} from "@/apiClient";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";
import { close_dialog, operating_cost_documents_pending } from "@/static/icons";
import { useDialogStore } from "@/store/useDIalogStore";
import { type ObjektType } from "@/types";
import { countLocals, slideDown, slideUp } from "@/utils";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import ObjekteItemDocWithHistoryHeader from "./ObjekteItemDocWithHistoryHeader";

export type ObjekteLocalItemProps = {
  item: ObjektType;
  isOpen: boolean;
  index: number;
  onClick: (index: number) => void;
};

export default function OperatingObjekteItemDocWithHistory({
  item,
  isOpen,
  index,
  onClick,
}: ObjekteLocalItemProps) {
  const contentRef = useRef(null);
  const { setItemID, openDialog, setQueryKey } = useDialogStore();

  useEffect(() => {
    if (isOpen) {
      slideDown(contentRef.current);
    } else {
      slideUp(contentRef.current);
    }
  }, [isOpen]);

  const { data: relatedLocals } = useLocalsByObjektID(item.id);
  const { data: relatedOpenedDocuments } = useOperatingCostDocumentsByObjektID(
    item.id
  );

  const { commertialLocals, otherLocals } = countLocals(
    relatedLocals ? relatedLocals : []
  );

  const openDeleteDialog = (docID: string) => {
    setItemID(docID);
    openDialog("operating_costs_delete");
    setQueryKey(["operating_cost_documents", item.id ?? ""]);
  };

  return (
    <div
      className={` bg-white/50 max-xl:p-3 rounded-2xl max-xl:rounded-xl ${isOpen ? `active` : ""
        }`}
    >
      <ObjekteItemDocWithHistoryHeader
        item={item}
        isOpen={isOpen}
        link={`${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/${item.id}/abrechnungszeitraum`}
        onClickAccordion={() => onClick(index)}
        hasDocuments={!!relatedOpenedDocuments?.length}
        commertialCount={commertialLocals.length}
        otherCount={otherLocals.length}
      />
      <div
        ref={contentRef}
        className="[.active_&]:pt-6 [.active_&]:pb-2 space-y-6 px-24 [.active_&]:h-auto h-0"
      >
        {relatedOpenedDocuments?.map((doc) => (
          <div className="flex items-center justify-between" key={doc.id}>
            <Link
              className="flex items-center justify-start gap-8"
              href={`${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/weitermachen/${doc.id}/abrechnungszeitraum`}
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
              {item.street} {item.zip}:{" "}
              {doc.start_date
                ? format(new Date(doc.start_date), "dd.MM.yyyy", { locale: de })
                : "?"}
              {" - "}
              {doc.end_date
                ? format(new Date(doc.end_date), "dd.MM.yyyy", { locale: de })
                : "?"}
            </Link>
            <button
              onClick={() => openDeleteDialog(doc.id ? doc.id : "")}
              className="cursor-pointer"
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
        ))}
      </div>
    </div>
  );
}
