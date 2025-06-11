import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";
import { admin_plus, chevron_admin } from "@/static/icons";
import type { CostType } from "@/types";
import {
  getCostTypeIconByKey,
  getCostTypeNameByKey,
  slideDown,
  slideUp,
} from "@/utils";
import Image from "next/image";
import { useEffect, useRef } from "react";

export type CostTypeItemProps = {
  isOpen: boolean;
  index: number;
  onClick: (index: number) => void;
  type: CostType;
};

export default function CostTypeItem({
  isOpen,
  index,
  onClick,
  type,
}: CostTypeItemProps) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      slideDown(contentRef.current);
    } else {
      slideUp(contentRef.current);
    }
  }, [isOpen]);

  return (
    <div className={`bg-[#F5F5F5] rounded-md ${isOpen ? `active` : ""}`}>
      <div
        className={`bg-white py-3 px-6 flex items-center justify-between border border-[#E7E9ED] rounded-md`}>
        <div
          className="flex cursor-pointer items-center justify-start gap-5 w-full"
          onClick={() => onClick(index)}>
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-5 max-h-4 [.active_&]:-rotate-90 transition-all duration-300"
            src={chevron_admin}
            alt="chevron"
          />
          <div className="size-14 max-w-14 max-h-14 min-w-14 min-h-14 flex items-center justify-center bg-[#E7F2E8] rounded-full">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-7 max-h-7"
              src={getCostTypeIconByKey(type.key)!}
              alt="chevron"
            />
          </div>
          <p className="text-semibold text-dark_green">
            {getCostTypeNameByKey(type.key)}
          </p>
        </div>
        <div className="flex items-center whitespace-nowrap justify-end gap-7">
          <span>0,00 €</span>
          <ThreeDotsButton
            editLink={""}
            itemID={""}
            dialogAction="local_delete"
          />
        </div>
      </div>
      <div
        ref={contentRef}
        className="[.active_&]:py-5 px-5 [.active_&]:h-auto h-0">
        <button className="flex items-center [.available_&]:mx-3 w-fit justify-center gap-2 px-6 py-4 border border-dark_green rounded-md bg-[#E0E0E0] text-lg font-medium text-admin_dark_text">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-4 max-h-4"
            src={admin_plus}
            alt="admin_plus"
          />
          Ausgaben hinzufügen
        </button>
      </div>
    </div>
  );
}
