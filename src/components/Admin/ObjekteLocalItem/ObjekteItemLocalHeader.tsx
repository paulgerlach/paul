"use client";

import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/Basic/ui/Skeleton";
import type { UnitType, LocalType } from "@/types";
import { handleLocalTypeIcon, buildLocalName } from "@/utils";
import { chevron_admin } from "@/static/icons";

type ObjekteItemLocalHeaderProps = {
  item: LocalType;
  isLoading: boolean;
  hasDocuments: boolean;
  onClickAccordion: () => void;
  link: string;
  isOpen?: boolean;
  renderStatusImage: () => React.ReactNode;
  renderStatusBadge: () => React.ReactNode;
};

export function ObjekteItemLocalHeader({
  item,
  isLoading,
  hasDocuments,
  onClickAccordion,
  renderStatusImage,
  renderStatusBadge,
  link,
  isOpen = false,
}: ObjekteItemLocalHeaderProps) {
  return (
    <Link
      href={link}
      className="bg-white p-2 rounded-2xl max-medium:rounded-xl flex items-center justify-between max-medium:gap-2 cursor-pointer"
    >
      {/* Left Section: Icon + Name */}
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

        <div className="grid grid-cols-[1fr_auto] items-center justify-start gap-5 max-medium:gap-1 min-w-0 flex-1">
          <p className="text-2xl max-xl:text-lg max-medium:text-xs text-dark_green max-medium:leading-tight">
            {buildLocalName(item)}
          </p>
          {hasDocuments && (
            <button className="h-full cursor-pointer block px-8" onClick={(e) => {
              e.preventDefault();
              onClickAccordion()
            }}>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className={`max-w-2.5 max-h-4 max-medium:max-w-2 max-medium:max-h-3 transition-all duration-300 flex-shrink-0 ${isOpen ? "rotate-0" : "-rotate-90"
                  }`}
                src={chevron_admin}
                alt="chevron"
              />
            </button>
          )}
        </div>
      </div>

      {/* Right Section: Status Badge */}
      <div className="flex items-center justify-end gap-7 max-medium:gap-1 flex-shrink-0">
        <div className="max-medium:[&>div]:px-2 max-medium:[&>div]:py-1 max-medium:[&>div]:text-[10px] max-medium:[&>div]:rounded-lg max-medium:[&_span]:w-1.5 max-medium:[&_span]:h-1.5">
          {isLoading ? (
            <Skeleton className="w-56 h-16 max-medium:w-16 max-medium:h-6 rounded-[20px] max-medium:rounded-lg" />
          ) : (
            renderStatusBadge()
          )}
        </div>
      </div>
    </Link>
  );
}
