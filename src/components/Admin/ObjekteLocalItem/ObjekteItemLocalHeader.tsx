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
  link?: string;
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
  const Wrapper: React.ElementType = hasDocuments ? "div" : Link;
  const wrapperProps = hasDocuments
    ? { onClick: onClickAccordion, role: "button", "aria-expanded": isOpen }
    : { href: link ?? "#" };

  return (
    <Wrapper
      {...wrapperProps}
      className="bg-white p-2 rounded-2xl flex items-center justify-between cursor-pointer"
    >
      {/* Left Section: Icon + Name */}
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

        <div className="flex items-center justify-start gap-5 w-full">
          <p className="text-2xl max-xl:text-lg text-dark_green">
            {buildLocalName(item)}
          </p>
          {hasDocuments && (
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className={`max-w-2.5 max-h-4 transition-all duration-300 ${
                isOpen ? "rotate-0" : "-rotate-90"
              }`}
              src={chevron_admin}
              alt="chevron"
            />
          )}
        </div>
      </div>

      {/* Right Section: Status Badge */}
      <div className="flex items-center justify-end gap-7">
        {isLoading ? (
          <Skeleton className="w-56 h-16 rounded-[20px]" />
        ) : (
          renderStatusBadge()
        )}
      </div>
    </Wrapper>
  );
}
