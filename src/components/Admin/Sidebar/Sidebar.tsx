"use client";

import {
  ROUTE_OBJEKTE,
  ROUTE_ABRECHNUNG,
  ROUTE_ADMIN,
  ROUTE_DOKUMENTE,
  ROUTE_IMPRESSUM,
  ROUTE_DATENSCHUTZHINWEISE,
  ROUTE_BETRIEBSKOSTENABRECHNUNG,
  ROUTE_HEIZKOSTENABRECHNUNG,
} from "@/routes/routes";
import { abrechnung, dashboard, dokumente, objekte } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarButton from "./SidebarButton";
import { useState } from "react";

export type SidebarLinkType = {
  title: string;
  icon?: string;
  route: string;
  type?: string;
  children?: SidebarLinkType[];
};

export default function Sidebar() {
  const pathname = usePathname();
  const [openLink, setOpenLink] = useState<string | null>(null);

  const handleClick = (link: string) => {
    setOpenLink((prev) => (prev === link ? null : link));
  };

  const dashboardLinks: SidebarLinkType[] = [
    {
      title: "Dashboard",
      icon: dashboard,
      route: ROUTE_ADMIN,
    },
    {
      title: "Objekte",
      icon: objekte,
      route: ROUTE_OBJEKTE,
    },
    {
      title: "Dokumente",
      icon: dokumente,
      route: ROUTE_DOKUMENTE,
    },
    {
      title: "Abrechnung",
      icon: abrechnung,
      route: ROUTE_ABRECHNUNG,
      type: "button",
      children: [
        {
          title: "Heizkostenabrechnung",
          route: ROUTE_HEIZKOSTENABRECHNUNG,
        },
        {
          title: "Betriebskostenabrechnung",
          route: ROUTE_BETRIEBSKOSTENABRECHNUNG,
        },
      ],
    },
  ];

  return (
    <div className="bg-white max-w-80 border-r border-[#EAEAEA] shadow-2xs min-w-80 h-[calc(100dvh-81px)] max-h-[calc(100dvh-81px)] px-4 py-9 max-medium:px-5 max-medium:py-2 flex flex-col justify-between">
      <div className="flex flex-col gap-0.5">
        {dashboardLinks.map((link: SidebarLinkType) =>
          link.type === "button" ? (
            <SidebarButton
            pathname={pathname}
              isOpen={openLink === link.title}
              onClick={handleClick}
              key={link.title}
              button={link}
            />
          ) : (
            <Link
              key={link.title}
              href={link.route}
              className={`flex py-3 px-5 transition-all duration-300 w-full items-center gap-3 rounded-base hover:bg-base-bg/70 ${pathname === link.route ? "active" : ""} [.active]:bg-black/10`}>
              <Image
                width={28}
                height={28}
                className="max-w-7 max-h-7"
                loading="lazy"
                alt={link.title}
                src={link.icon || ""}
              />
              <span className="[.active_&]:font-bold">{link.title}</span>
            </Link>
          )
        )}
      </div>
      <div className="flex items-center justify-center gap-8">
        <Link className="text-sm text-light-text" href={ROUTE_IMPRESSUM}>
          Impressum
        </Link>
        <Link
          className="text-sm text-light-text"
          href={ROUTE_DATENSCHUTZHINWEISE}>
          Datenschutz
        </Link>
      </div>
    </div>
  );
}
