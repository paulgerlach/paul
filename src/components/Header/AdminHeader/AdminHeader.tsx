"use client";

import Link from "next/link";
import Image from "next/image";
import { logo } from "@/static/icons";
import { ROUTE_DASHBOARD } from "@/routes/routes";
import AdminAccoundDropdown from "./AdminAccoundDropdown";
import AdminApartmentsDropdown from "./AdminApartmentsDropdown";
import AdminDatetimeDropdown from "@/components/Basic/Dropdown/AdminDatetimeDropdown";
import { Switch } from "@/components/Basic/ui/Switch";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const pathname = usePathname();
  const isDashboard = pathname === ROUTE_DASHBOARD;

  return (
    <header id="header" className={`w-full`}>
      <div className="flex items-center justify-between border-b border-b-[#EAEAEA] shadow-2xs bg-white w-full px-5 max-medium:px-5 duration-300 ease-in-out">
        <Link
          href={ROUTE_DASHBOARD}
          className="flex min-w-xs items-center justify-start gap-3">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="colored-to-black max-w-16 max-h-5"
            src={logo}
            alt="logo"
          />
        </Link>
        {isDashboard && (
          <div className="grid grid-cols-3 w-full gap-4">
            <AdminApartmentsDropdown />
            <AdminDatetimeDropdown />

            <div className="flex w-full items-center gap-4 justify-start bg-transparent border-none px-6 py-3">
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
