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
import { useState } from "react";
import { useMobileSidebarStore } from "@/store/useMobileSidebarStore";
import { X, ChevronDown, ChevronUp } from "lucide-react";

export type SidebarLinkType = {
  title: string;
  icon?: StaticImageData;
  route: string;
  type?: string;
  children?: SidebarLinkType[];
};

export default function MobileSidebar() {
  const pathname = usePathname();
  const { user_id } = useParams();
  const [openLink, setOpenLink] = useState<string | null>(null);
  const { isOpen, close } = useMobileSidebarStore();

  const resolvedUserId = typeof user_id === "string" ? user_id : undefined;
  const isAdmin = !!resolvedUserId;

  const withUserPrefix = (route: string) =>
    isAdmin ? `${ROUTE_ADMIN}/${resolvedUserId}${route}` : route;

  const handleClick = (link: string) => {
    setOpenLink((prev) => (prev === link ? null : link));
  };

  const handleLinkClick = () => {
    close();
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
        // {
        //   title: "Betriebskostenabrechnung",
        //   route: withUserPrefix(ROUTE_BETRIEBSKOSTENABRECHNUNG),
        // },
      ],
    },
  ];

  // Admin-only links
  if (isAdmin) {
    dashboardLinks.unshift({
      title: "User Übersicht",
      icon: dashboard,
      route: ROUTE_ADMIN,
    });

    dashboardLinks.splice(3, 0, {
      title: "CSV Upload",
      icon: caract_files,
      route: `${ROUTE_ADMIN}${ROUTE_CSV_UPLOAD}`,
    });
  }

  const isRouteActive = (route: string) =>
    isAdmin ? pathname === route : pathname?.startsWith(route);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9999] large:hidden"
        onClick={close}
      />

      {/* Sidebar Drawer */}
      <div className="fixed top-0 left-0 h-full w-[280px] bg-white z-[10000] shadow-xl large:hidden overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#EAEAEA]">
          <span className="font-semibold text-lg text-dark_green">Menü</span>
          <button
            onClick={close}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-1 p-4">
          {dashboardLinks.map((link: SidebarLinkType) =>
            link.type === "button" ? (
              <div key={link.title}>
                <button
                  onClick={() => handleClick(link.title)}
                  className={`flex py-3 px-4 w-full items-center justify-between gap-3 rounded-lg hover:bg-base-bg/70 transition-all duration-300 ${openLink === link.title ? "bg-base-bg/50" : ""
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      width={20}
                      height={20}
                      loading="lazy"
                      alt={link.title}
                      src={link.icon || ""}
                    />
                    <span>{link.title}</span>
                  </div>
                  {openLink === link.title ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openLink === link.title && link.children && (
                  <div className="ml-8 mt-1 flex flex-col gap-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.title}
                        href={child.route}
                        onClick={handleLinkClick}
                        className={`py-2 px-4 rounded-lg hover:bg-base-bg/70 transition-all duration-300 text-sm ${isRouteActive(child.route) ? "bg-black/10 font-bold" : ""
                          }`}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : pathname === ROUTE_ADMIN && link.route !== ROUTE_ADMIN ? (
              <div
                key={link.title}
                className="flex py-3 px-4 w-full items-center gap-3 rounded-lg text-gray-400 cursor-not-allowed opacity-50"
              >
                <Image
                  width={20}
                  height={20}
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
                onClick={handleLinkClick}
                className={`flex py-3 px-4 w-full items-center gap-3 rounded-lg hover:bg-base-bg/70 transition-all duration-300 ${isRouteActive(link.route) ? "bg-black/10 font-bold" : ""
                  }`}
              >
                <Image
                  width={20}
                  height={20}
                  loading="lazy"
                  alt={link.title}
                  src={link.icon || ""}
                />
                <span>{link.title}</span>
              </Link>
            )
          )}
        </div>

        {/* Footer Links */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#EAEAEA] bg-white">
          <div className="flex items-center justify-center gap-6">
            <Link
              className="text-sm text-light-text"
              href={ROUTE_IMPRESSUM}
              onClick={handleLinkClick}
            >
              Impressum
            </Link>
            <Link
              className="text-sm text-light-text"
              href={ROUTE_DATENSCHUTZHINWEISE}
              onClick={handleLinkClick}
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

