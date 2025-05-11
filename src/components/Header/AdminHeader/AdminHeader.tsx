import Link from "next/link";
import Image from "next/image";
import { logo } from "@/static/icons";
import { ROUTE_DASHBOARD } from "@/routes/routes";
import AdminAccoundDropdown from "./AdminAccoundDropdown";
import AdminApartmentsDropdown from "./AdminApartmentsDropdown";
import AdminDatetimeDropdown from "@/components/Basic/Dropdown/AdminDatetimeDropdown";
import { Switch } from "@/components/Basic/ui/Switch";

export default function AdminHeader() {
  return (
    <header id="header" className={`w-full`}>
      <div className="grid grid-cols-5 border-b border-b-[#EAEAEA] shadow-2xs bg-white w-full px-5 max-medium:px-5 duration-300 ease-in-out">
        <Link
          href={ROUTE_DASHBOARD}
          className="flex items-center justify-start gap-3">
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
        <AdminApartmentsDropdown />
        <AdminDatetimeDropdown />

        <div className="flex w-full items-center gap-4 justify-start bg-transparent border-none px-6 py-3">
          <Switch />
          Datenansicht
        </div>

        <AdminAccoundDropdown />
      </div>
    </header>
  );
}
