"use client";

import { chevron_admin, objekte_placeholder } from "@/static/icons";
import { type ObjektType } from "@/types";
import Image from "next/image";
import Link from "next/link";

export type ObjekteItemDocWithHistoryHeaderProps = {
  item: ObjektType;
  isOpen: boolean;
  index: number;
  onClick: (index: number) => void;
  hasDocuments: boolean;
  onClickAccordion: () => void;
  link?: string;
  commertialCount: number;
  otherCount: number;
};

export default function ObjekteItemDocWithHistoryHeader({
  item,
  isOpen,
  index,
  onClick,
  hasDocuments,
  onClickAccordion,
  link,
  commertialCount,
  otherCount,
}: ObjekteItemDocWithHistoryHeaderProps) {
  const Wrapper: React.ElementType = hasDocuments ? "div" : Link;
  const wrapperProps = hasDocuments
    ? { onClick: onClickAccordion, role: "button", "aria-expanded": isOpen }
    : { href: link ?? "#" };

  return (
    <Wrapper
      {...wrapperProps}
      className="w-full rounded-2xl p-5 bg-white cursor-pointer flex items-center justify-start gap-8"
    >
      <div className="flex items-center justify-start gap-8 max-xl:gap-4">
        {!!item.image_url ? (
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="w-[218px] h-[112px] max-xl:w-[180px] max-xl:h-[96px] flex items-center justify-center rounded-2xl max-xl:rounded-xl"
            src={item.image_url}
            alt={item.street}
          />
        ) : (
          <div className="w-[218px] h-[112px] max-xl:w-[180px] max-xl:h-[96px] flex items-center justify-center rounded-2xl max-xl:rounded-xl bg-[#E0E0E0]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-[30px] max-h-[30px] max-xl:max-w-[24px] max-xl:max-h-[24px]"
              src={objekte_placeholder}
              alt="objekte_placeholder"
            />
          </div>
        )}
        <div>
          <p className="text-2xl max-xl:text-xl text-dark_green">
            {item.street}
          </p>
          <p className="text-xl max-xl:text-base text-dark_green/50">
            {otherCount > 0 ? `${otherCount} Wohneinheiten` : ""}
            {commertialCount > 0 ? ` ${commertialCount} Gewerbeeinheiten` : ""}
          </p>
        </div>
      </div>
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
    </Wrapper>
  );
}
