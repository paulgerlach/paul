import {
  chevron_admin,
  blue_x,
  green_check_circle,
  admin_plus,
} from "@/static/icons";
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
import Link from "next/link";
import { ROUTE_ADMIN, ROUTE_OBJEKTE } from "@/routes/routes";
import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";
import { useContractsByLocalID } from "@/apiClient";
import { Skeleton } from "@/components/Basic/ui/Skeleton";
import { useLocalStatus } from "@/hooks/useLocalStatus";
import { useSubRouteLink } from "@/lib/clientNavigation";

export type ObjekteLocalItemProps = {
  item: LocalType;
  isOpen: boolean;
  index: number;
  onClick: (index: number) => void;
  id: string;
  localID?: string;
};

export default function AdminObjekteLocalItem({
  item,
  isOpen,
  index,
  onClick,
  id,
  localID,
}: ObjekteLocalItemProps) {
  const contentRef = useRef(null);

  const { data: contracts, isLoading } = useContractsByLocalID(localID);

  const editLInk = useSubRouteLink(`${item.id}/edit`);

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
      className={`bg-white/50 rounded-2xl max-medium:rounded-xl ${isOpen ? `active` : ""} ${
        status === "vacancy" && "available"
      } [.available.active]:pb-7`}
    >
      <div
        className={`bg-white p-2 rounded-2xl max-medium:rounded-xl flex items-center justify-between max-medium:gap-2`}
      >
        <div className="flex items-center justify-start gap-8 max-medium:gap-2 flex-1 min-w-0">
          <div className="flex items-center justify-start gap-2 max-medium:gap-1 flex-shrink-0">
            <span className="flex items-center size-20 max-xl:size-14 max-medium:size-10 justify-center rounded bg-[#E7E8EA]">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="max-w-9 max-h-9 max-xl:max-w-7 max-xl:max-h-7 max-medium:max-w-4 max-medium:max-h-4"
                src={handleLocalTypeIcon(item.usage_type as UnitType) || ""}
                alt={item.usage_type || ""}
              />
            </span>
            {isLoading ? (
              <Skeleton className="w-20 h-20 max-xl:w-14 max-xl:h-14 max-medium:w-10 max-medium:h-10 rounded bg-[#E5EBF5]" />
            ) : (
              <span className="max-medium:[&>span]:size-10 max-medium:[&>span]:max-w-10 max-medium:[&>span]:max-h-10 max-medium:[&_img]:max-w-4 max-medium:[&_img]:max-h-4">
                {renderStatusImage()}
              </span>
            )}
          </div>
          <div
            className="flex cursor-pointer items-center justify-start gap-5 max-medium:gap-1 min-w-0 flex-1"
            onClick={() => onClick(index)}
          >
            <p className="text-2xl max-xl:text-lg max-medium:text-xs text-dark_green max-medium:leading-tight">
              {buildLocalName(item)}
            </p>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-2.5 max-h-4 max-medium:max-w-2 max-medium:max-h-3 -rotate-90 [.active_&]:rotate-0 transition-all duration-300 flex-shrink-0"
              src={chevron_admin}
              alt="chevron"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-7 max-medium:gap-1 flex-shrink-0">
          <div className="max-medium:[&>div]:px-2 max-medium:[&>div]:py-1 max-medium:[&>div]:text-[10px] max-medium:[&>div]:rounded-lg max-medium:[&_span]:w-1.5 max-medium:[&_span]:h-1.5">
            {isLoading ? (
              <Skeleton className="w-56 h-16 max-medium:w-16 max-medium:h-6 rounded-[20px] max-medium:rounded-lg" />
            ) : (
              renderStatusBadge()
            )}
          </div>
          <ThreeDotsButton
            editLink={editLInk}
            itemID={item.id}
            dialogAction="admin_local_delete"
          />
        </div>
      </div>

      <div
        ref={contentRef}
        className="[.active_&]:pt-6 max-medium:[.active_&]:pt-4 [.active_&]:pb-2 px-2.5 max-medium:px-2 [.active_&]:h-auto h-0"
      >
        {contracts && contracts?.length > 0 && (
          <ObjekteLocalItemHistory
            objektID={id}
            localID={localID}
            history={contracts}
          />
        )}
      </div>
    </div>
  );
}
