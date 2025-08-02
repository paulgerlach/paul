import { chevron_admin } from "@/static/icons";
import { UnitType, type LocalType } from "@/types";
import {
  buildLocalName,
  handleLocalTypeIcon,
  slideDown,
  slideUp,
} from "@/utils";
import Image from "next/image";
import { useEffect, useRef } from "react";
import ObjekteLocalItemHistory from "./ObjekteLocalItemHistory";
import { ROUTE_ADMIN, ROUTE_OBJEKTE } from "@/routes/routes";
import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";
import { useContractsByLocalID } from "@/apiClient";
import { Skeleton } from "@/components/Basic/ui/Skeleton";
import { useLocalStatus } from "@/hooks/useLocalStatus";

export type ObjekteLocalItemProps = {
  item: LocalType;
  isOpen: boolean;
  index: number;
  onClick: (index: number) => void;
  objektID: string;
  userID: string;
  localID?: string;
};

export default function ObjekteLocalAdminItem({
  item,
  isOpen,
  index,
  onClick,
  objektID,
  userID,
  localID,
}: ObjekteLocalItemProps) {
  const contentRef = useRef(null);

  const { data: contracts, isLoading } = useContractsByLocalID(localID);

  useEffect(() => {
    if (isOpen) {
      slideDown(contentRef.current);
    } else {
      slideUp(contentRef.current);
    }
  }, [isOpen]);

  const { status, renderStatusImage, renderStatusBadge } =
    useLocalStatus(contracts);

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
          <ThreeDotsButton
            editLink={`${ROUTE_ADMIN}/${userID}${ROUTE_OBJEKTE}/${item.objekt_id}/${item.id}/edit`}
            itemID={item.id}
            dialogAction="local_delete"
          />
        </div>
      </div>

      <div
        ref={contentRef}
        className="[.active_&]:pt-6 [.active_&]:pb-2 px-2.5 [.active_&]:h-auto h-0"
      >
        {/* <Link
          className="flex items-center mb-7 [.available_&]:mx-3 w-fit justify-center gap-2 px-6 py-5 max-xl:py-2.5 max-xl:px-3 border border-dark_green rounded-md bg-[#E0E0E0] text-sm font-medium text-admin_dark_text"
          href={`${ROUTE_OBJEKTE}/${id}/${localID}/create-contract`}
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
          Mieter hinzufügen
        </Link> */}
        {contracts && contracts?.length > 0 && (
          <ObjekteLocalItemHistory
            objektID={objektID}
            localID={localID}
            history={contracts}
          />
        )}
      </div>
    </div>
  );
}
