"use client";

import MenuModal from "@/components/Basic/ui/MenuModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Basic/ui/Popover";
import { chevron_admin, main_account } from "@/static/icons";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import ProfileEditForm from "./ProfileEditForm";
import CompanyDataForm from "./CompanyDataForm";
import TeamRolesForm from "./TeamTolesForm";
import SecurityForm from "./SecurityForm";
import IntegrationsForm from "../IntegrationsForm";
import SupportForm from "./SupportForm";

// --- Shared Styles & Components ---
const inputStyle = "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors";
const labelStyle = "text-xs font-medium text-gray-500";

export default function AdminAccountDropdown() {
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const menuItems: {
  title: string;
  render: (onClose: () => void) => ReactNode;
}[] = [
  {
    title: "Mein Profil",
    render: (onClose) => <ProfileEditForm onClose={onClose} inputStyle={inputStyle} labelStyle={labelStyle} />,
  },
  {
    title: "Unternehmensdaten",
    render: (onClose) => <CompanyDataForm onClose={onClose} inputStyle={inputStyle} labelStyle={labelStyle} />,
  },
  {
    title: "Team & Rollen",
    render: (onClose) => <TeamRolesForm onClose={onClose} inputStyle={inputStyle} labelStyle={labelStyle} />,
  },
  {
    title: "Sicherheit",
    render: (onClose) => <SecurityForm onClose={onClose} inputStyle={inputStyle} labelStyle={labelStyle} />,
  },
  {
    title: "Integrationen",
    render: (onClose) => <IntegrationsForm onClose={onClose} inputStyle={inputStyle} labelStyle={labelStyle} />,
  },
  {
    title: "Support",
    render: (onClose) => <SupportForm onClose={onClose} inputStyle={inputStyle} labelStyle={labelStyle} />,
  },
];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-3 justify-between bg-transparent border-none cursor-pointer px-2 py-3 h-full outline-none">
          <div className="flex items-center justify-start text-lg max-xl:text-sm whitespace-nowrap gap-3">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="max-w-4 max-h-4 max-xl:max-w-4 max-xl:max-h-4 w-4 h-4"
              loading="lazy"
              alt="main_account"
              src={main_account}
            />
            <span className="text-sm">Mein Konto</span>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="max-w-2 max-h-5 transition-all duration-300 [.open_&]:rotate-180"
              loading="lazy"
              alt="chevron_admin"
              src={chevron_admin}
            />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0 bg-white rounded-lg shadow-lg border border-gray-100 mt-2" align="end">
        <div className="py-2 px-4 space-y-1">
          {/* First Group */}
          {menuItems.slice(0, 4).map((item) => (
            <MenuModal
              key={item.title}
              title={item.title}
              trigger={
                <button className="block w-full text-left text-sm text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded outline-none transition-colors">
                  {item.title}
                </button>
              }
            >
              {(onClose) => item.render(onClose)}
            </MenuModal>
          ))}

          <div className="border-t border-gray-100 my-2" />

          {/* Second Group */}
          {menuItems.slice(4).map((item) => (
            <MenuModal
              key={item.title}
              title={item.title}
              trigger={
                <button className="block w-full text-left text-sm text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded outline-none transition-colors">
                  {item.title}
                </button>
              }
            >
               {(onClose) => item.render(onClose)}
            </MenuModal>
          ))}

          <div className="border-t border-gray-100 my-2" />

          <button
            onClick={signOut}
            className="w-full text-left text-sm text-red-500 hover:bg-red-50 px-2 py-1.5 rounded outline-none transition-colors"
          >
            Logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}