import {
  chevron_admin,
  dots_button,
  blue_x,
  green_check_circle,
  admin_plus,
} from "@/static/icons";
import { type LocalType } from "@/types";
import { handleLocalTypeIcon, slideDown, slideUp } from "@/utils";
import Image from "next/image";
import { useEffect, useRef } from "react";
import ObjekteLocalItemHistory from "./ObjekteLocalItemHistory";
import Link from "next/link";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";

export type ObjekteLocalItemProps = {
  item: LocalType;
  isOpen: boolean;
  index: number;
  onClick: (index: number) => void;
  id: string;
};

export default function ObjekteLocalItem({
  item,
  isOpen,
  index,
  onClick,
  id,
}: ObjekteLocalItemProps) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      slideDown(contentRef.current);
    } else {
      slideUp(contentRef.current);
    }
  }, [isOpen]);

  const handleStatusImage = () => {
    switch (item.status) {
      case "vacancy":
        return (
          <span className="flex items-center size-20 justify-center rounded bg-[#E5EBF5]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-8 max-h-8"
              src={blue_x}
              alt="blue_X"
            />
          </span>
        );
      case "renting":
        return (
          <span className="flex items-center size-20 justify-center rounded bg-[#E7F2E8]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-8 max-h-8"
              src={green_check_circle}
              alt="green_check_circle"
            />
          </span>
        );
    }
  };
  const handleStatusBadge = () => {
    switch (item.status) {
      case "vacancy":
        return (
          <div className="rounded-[20px] min-h-16 min-w-56 flex items-center justify-center gap-4 bg-white text-xl text-[#6083CC] drop-shadow-xl py-3 px-4">
            <span className="bg-[#6083CC] rounded-full size-3 min-w-3 min-h-3" />
            Leerstand
          </div>
        );
      case "renting":
        return (
          <div className="rounded-[20px] min-h-16 min-w-56 flex items-center justify-center gap-4 bg-white text-xl text-green drop-shadow-xl py-3 px-4">
            <span className="bg-green rounded-full size-3 min-w-3 min-h-3" />
            Voll vermietet
          </div>
        );
    }
  };

  return (
    <div
      className={`bg-white/50 rounded-2xl ${isOpen ? `active` : ""} ${item.available && "available"} [.available.active]:pb-7`}>
      <div
        className={`bg-white p-2 rounded-2xl flex items-center justify-between`}>
        <div className="flex items-center justify-start gap-8">
          <div className="flex items-center justify-start gap-2">
            <span className="flex items-center size-20 justify-center rounded bg-[#E7E8EA]">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="max-w-9 max-h-9"
                src={handleLocalTypeIcon(item.type) || ""}
                alt={item.type || ""}
              />
            </span>
            {handleStatusImage()}
          </div>
          <div
            className="flex cursor-pointer items-center justify-start gap-5"
            onClick={() => onClick(index)}>
            <p className="text-2xl text-dark_green">{item.name}</p>
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
          {handleStatusBadge()}
          <ThreeDotsButton
            editLink={`${ROUTE_OBJEKTE}/${item.objekt_id}/${item.id}/edit`}
            itemID={item.id}
            dialogAction="local_delete"
            detailsLink={`${ROUTE_OBJEKTE}/${item.objekt_id}/${item.id}/info`}
          />
        </div>
      </div>
      {!item.available ? (
        <ObjekteLocalItemHistory history={item.history} ref={contentRef} />
      ) : (
        <Link
          ref={contentRef}
          className="flex items-center [.available_&]:mt-7 [.available_&]:mx-3 w-fit justify-center gap-2 px-6 py-5 border border-dark_green rounded-md bg-[#E0E0E0] text-sm font-medium text-[#333333]"
          href={`${ROUTE_OBJEKTE}/${id}/add-history`}>
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-4 max-h-4"
            src={admin_plus}
            alt="admin_plus"
          />
          Mieter hinzufügen
        </Link>
      )}
    </div>
  );
}
