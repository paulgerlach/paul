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

export default function AdminHeader() {
  const pathname = usePathname();
  const isDashboard = pathname.includes(ROUTE_DASHBOARD);

  const { data: user } = useAuthUser();

  const isAdmin = user?.permission === "admin";

  return (
    <header id="header" className={`w-full`}>
      <div className="flex items-center justify-between border-b border-b-[#EAEAEA] shadow-2xs bg-white w-full pl-8 pr-5 max-medium:px-5 duration-300 ease-in-out">
        <Link
          href={ROUTE_DASHBOARD}
          className="flex max-w-[356px] min-w-[356px] max-xl:min-w-xs max-megalarge:min-w-[190px] items-center justify-start gap-3"
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
        {isDashboard && (
          <div
            className={`grid ${isAdmin ? "grid-cols-4" : "grid-cols-3"} w-full gap-4`}
          >
            <AdminApartmentsDropdown />
            <AdminDatetimeDropdown />
            {isAdmin && <AdminUsersDropdown user={user} />}

            <div className="flex w-full items-center gap-4 max-xl:text-sm justify-start bg-transparent border-none px-6 py-3">
              <Switch />
              Datenansicht
            </div>
          </div>
        )}
        <AdminAccoundDropdown />
      </div>
    </header>
  );
}
