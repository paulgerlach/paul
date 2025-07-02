"use client";

import { slideDown, slideUp } from "@/utils";
import { type SidebarLinkType } from "./Sidebar";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { chevron_admin } from "@/static/icons";
import Link from "next/link";

export default function SidebarButton({
  button,
  isOpen,
  onClick,
  pathname,
}: {
  button: SidebarLinkType;
  isOpen: boolean;
  pathname: string;
  onClick: (index: string) => void;
}) {
  const contentRef = useRef(null);

  const isRouteActive = (route: string) => pathname?.startsWith(route);

  useEffect(() => {
    if (isOpen) {
      slideDown(contentRef.current);
    } else {
      slideUp(contentRef.current);
    }
  }, [isOpen]);
  return (
    <div>
      <button
        className={`flex cursor-pointer py-3 px-5 max-xl:text-sm transition-all duration-300 w-full items-center justify-between gap-3 rounded-base hover:bg-base-bg/70 ${isOpen ? "active" : ""}`}
        onClick={() => onClick(button.title)}>
        <span className="flex items-center justify-start gap-3">
          <Image
            width={28}
            height={28}
            className="max-w-7 max-h-7 max-xl:max-w-5 max-xl:max-h-5"
            loading="lazy"
            alt={button.title}
            src={button.icon || ""}
          />
          {button.title}
        </span>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          className="max-w-4 max-h-5 max-xl:max-w-3 max-xl:max-h-4 transition-all duration-300 [.active_&]:rotate-180"
          loading="lazy"
          style={{ width: "100%", height: "auto" }}
          alt="chevron_admin"
          src={chevron_admin}
        />
      </button>
      <div className="space-y-1.5 pl-11 max-megalarge:pl-4" ref={contentRef}>
        {button.children?.map((child) => (
          <Link
            key={child.title}
            href={child.route}
            className={`flex py-3 px-5 transition-all max-xl:text-sm duration-300 w-full items-center gap-3 rounded-base hover:bg-base-bg/70 ${isRouteActive(child.route) ? "active" : ""} [.active]:bg-black/10`}>
            <span className="[.active_&]:font-bold">{child.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
