"use client";

import Link from "next/link";
import Image from "next/image";
import { admin_logo } from "@/static/icons";
import { ROUTE_DASHBOARD } from "@/routes/routes";
import AdminAccoundDropdown from "./AdminAccoundDropdown";
import AdminApartmentsDropdown from "./AdminApartmentsDropdown";
import AdminDatetimeDropdown from "@/components/Basic/Dropdown/AdminDatetimeDropdown";
import { Switch } from "@/components/Basic/ui/Switch";
import { usePathname } from "next/navigation";
import { useAuthUser } from "@/apiClient";
import AdminUsersDropdown from "./AdminUsersDropdown";
import { Menu } from "lucide-react";
import { useMobileSidebarStore } from "@/store/useMobileSidebarStore";

export default function AdminHeader() {
  const { toggle } = useMobileSidebarStore();
  const pathname = usePathname();
  const isDashboard = pathname.includes(ROUTE_DASHBOARD);

  const { data: user } = useAuthUser();

  const isAdmin = user?.permission === "admin";

  return (
    <header id="header" className={`w-full`}>
      {/* Main Header Bar */}
      <div className="flex items-center justify-between border-b border-b-[#EAEAEA] shadow-2xs bg-white w-full pl-8 pr-5 max-medium:px-4 duration-300 ease-in-out h-[77px] max-xl:h-[53px]">
        {/* Mobile/Tablet Hamburger Menu */}
        <button
          onClick={toggle}
          className="hidden max-large:flex p-2 mr-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-dark_green" />
        </button>

        <Link
          href={ROUTE_DASHBOARD}
          className="flex max-w-[356px] min-w-[356px] max-xl:min-w-xs max-megalarge:min-w-[190px] max-large:min-w-0 max-large:max-w-none items-center justify-start gap-3 flex-shrink-0"
        >
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-[90px] max-h-7 max-xl:max-w-16 max-xl:max-h-5"
            src={admin_logo}
            alt="admin_logo"
          />
        </Link>
        
        {/* Desktop Filters - Hidden on tablet/mobile */}
        {isDashboard && (
          <div
            className={`grid ${isAdmin ? "grid-cols-4" : "grid-cols-3"} w-full gap-4 max-large:hidden`}
          >
            <AdminApartmentsDropdown />
            <AdminDatetimeDropdown />
            {isAdmin && <AdminUsersDropdown user={user} />}

            <div className="flex w-full items-center gap-3 justify-start bg-transparent border-none px-6 py-3">
              <Switch />
              <span className="text-sm">Datenansicht</span>
            </div>
          </div>
        )}
        <AdminAccoundDropdown />
      </div>

      {/* Tablet/Mobile Filters - Shown on screens smaller than large (992px) */}
      {isDashboard && (
        <div className="hidden max-large:flex flex-wrap items-center gap-2 p-3 bg-white border-b border-[#EAEAEA]">
          <div className="flex-1 min-w-[150px]">
            <AdminApartmentsDropdown />
          </div>
          <div className="flex-1 min-w-[150px]">
            <AdminDatetimeDropdown />
          </div>
          {isAdmin && (
            <div className="flex-1 min-w-[150px]">
              <AdminUsersDropdown user={user} />
            </div>
          )}
          <div className="flex items-center gap-2 px-2">
            <Switch />
            <span className="text-sm whitespace-nowrap">Datenansicht</span>
          </div>
        </div>
      )}
    </header>
  );
}
