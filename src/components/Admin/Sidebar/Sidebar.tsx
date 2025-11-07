"use client";

import {
  ROUTE_OBJEKTE,
  ROUTE_ABRECHNUNG,
  ROUTE_DASHBOARD,
  ROUTE_DOKUMENTE,
  ROUTE_IMPRESSUM,
  ROUTE_DATENSCHUTZHINWEISE,
  ROUTE_BETRIEBSKOSTENABRECHNUNG,
  ROUTE_HEIZKOSTENABRECHNUNG,
  ROUTE_ADMIN,
  ROUTE_CSV_UPLOAD,
} from "@/routes/routes";
import { abrechnung, dashboard, dokumente, objekte, caract_files } from "@/static/icons";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import SidebarButton from "./SidebarButton";
import { useState } from "react";

export type SidebarLinkType = {
  title: string;
  icon?: StaticImageData;
  route: string;
  type?: string;
  children?: SidebarLinkType[];
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user_id } = useParams();
  const [openLink, setOpenLink] = useState<string | null>(null);

  const isAdmin = !!user_id;

  const withUserPrefix = (route: string) =>
    isAdmin ? `${ROUTE_ADMIN}/${user_id}${route}` : route;

  const handleClick = (link: string) => {
    setOpenLink((prev) => (prev === link ? null : link));
  };

  const dashboardLinks: SidebarLinkType[] = [
    {
      title: "Dashboard",
      icon: dashboard,
      route: withUserPrefix(ROUTE_DASHBOARD),
    },
    {
      title: "Objekte",
      icon: objekte,
      route: withUserPrefix(ROUTE_OBJEKTE),
    },
    {
      title: "Dokumente",
      icon: dokumente,
      route: withUserPrefix(ROUTE_DOKUMENTE),
    },
    {
      title: "Abrechnung",
      icon: abrechnung,
      route: withUserPrefix(ROUTE_ABRECHNUNG),
      type: "button",
      children: [
        {
          title: "Heizkostenabrechnung",
          route: withUserPrefix(ROUTE_HEIZKOSTENABRECHNUNG),
        },
        {
          title: "Betriebskostenabrechnung",
          route: withUserPrefix(ROUTE_BETRIEBSKOSTENABRECHNUNG),
        },
      ],
    },
  ];

  // 🔒 SECURITY: Admin-only links
  if (isAdmin) {
    dashboardLinks.unshift({
      title: "User Übersicht",
      icon: dashboard,
      route: ROUTE_ADMIN,
    });
    
    // CSV Upload - Super Admin only (insert after Dokumente, before Abrechnung)
    dashboardLinks.splice(3, 0, {
      title: "CSV Upload",
      icon: caract_files,
      route: `${ROUTE_ADMIN}${ROUTE_CSV_UPLOAD}`,
    });
  }

  const isRouteActive = (route: string) =>
    isAdmin ? pathname === route : pathname?.startsWith(route);

  return (
    <div className="bg-white max-w-[356px] border-r border-[#EAEAEA] shadow-2xs min-w-[356px] max-xl:min-w-xs max-megalarge:min-w-[200px] h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] px-4 py-10 max-xl:py-4 max-medium:px-5 max-medium:py-2 flex flex-col justify-between">
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
          ) : pathname === ROUTE_ADMIN && link.route !== ROUTE_ADMIN ? (
            <div
              key={link.title}
              className="flex py-3 px-5 max-xl:text-sm w-full items-center gap-3 rounded-base text-gray-400 cursor-not-allowed opacity-50"
            >
              <Image
                width={28}
                height={28}
                className="max-w-5 max-h-5 max-xl:max-w-5 max-xl:max-h-5"
                loading="lazy"
                alt={link.title}
                src={link.icon || ""}
              />
              <span>{link.title}</span>
            </div>
          ) : (
            <Link
              key={link.title}
              href={link.route}
              className={`flex py-3 px-5 max-xl:text-sm transition-all duration-300 w-full items-center gap-3 rounded-base hover:bg-base-bg/70 ${
                isRouteActive(link.route) ? "active" : ""
              } [.active]:bg-black/10`}
            >
              <Image
                width={28}
                height={28}
                className="max-w-5 max-h-5 max-xl:max-w-5 max-xl:max-h-5"
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
          href={ROUTE_DATENSCHUTZHINWEISE}
        >
          Datenschutz
        </Link>
      </div>
    </div>
  );
}
