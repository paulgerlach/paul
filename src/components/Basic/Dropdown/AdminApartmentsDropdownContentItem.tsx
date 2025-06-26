"use client";

import {
  chevron_admin,
  green_check_single,
} from "@/static/icons";
import { type ApartmentType } from "./AdminApartmentsDropdownContent";
import Image from "next/image";
import { buildLocalName, handleLocalTypeIcon, slideDown, slideUp } from "@/utils";
import { useEffect, useRef } from "react";
import { UnitType } from "@/types";

export default function AdminApartmentsDropdownContentItem({
  item,
  index,
  isOpen,
  onClick,
  toggleSelection,
  selectedLocalIds
}: {
  item: ApartmentType;
  index: number;
  isOpen: boolean;
  onClick: (index: number) => void;
  toggleSelection: (localId?: string) => void;
  selectedLocalIds: string[];
}) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      slideDown(contentRef.current);
    } else {
      slideUp(contentRef.current);
    }
  }, [isOpen]);
  return (
    <div className={`${isOpen ? "active" : ""}`}>
      <div
        onClick={() => onClick(index)}
        className="flex cursor-pointer items-center justify-between mb-1.5 text-dark_green font-bold">
        {item.street}
        {item.locals.length > 0 && (
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-3 max-h-3 [.active_&]:rotate-180 transition-all duration-300"
            src={chevron_admin}
            alt="chevron_admin"
          />
        )}
      </div>
      <div className="space-y-1.5 [.active_&]:h-auto h-0" ref={contentRef}>
        {item.locals.map((local) => (
          <div className="rounded-md localItem" key={local.id}>
            <input
              type="checkbox"
              onChange={() => toggleSelection(local.id)}
              id={local.id}
              checked={selectedLocalIds.includes(local?.id || "")}
              name={local.id}
              className="sr-only peer"
            />
            <label
              htmlFor={local.id}
              className="text-sm text-dark_green cursor-pointer p-2 flex items-center justify-between py-1 px-2 rounded-md transition-all border border-transparent duration-300
                 peer-checked:bg-green/10 peer-checked:border-green peer-checked:[&_.appartmentCheckmark]:block">
              <div className="flex items-center justify-start gap-5 rounded-md">
                <span className="flex size-7 rounded-md items-center justify-center bg-[#E7E8EA]">
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    className="max-w-3.5 max-h-3.5"
                    src={handleLocalTypeIcon(local.usage_type as UnitType) || ""}
                    alt={`local type ${local.usage_type}`}
                  />
                </span>
                {buildLocalName(local)}
              </div>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="max-w-6 hidden appartmentCheckmark max-h-6"
                src={green_check_single}
                alt="green_check_single"
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
