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


export default function AdminAccountDropdown() {
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const menuItems = [
    { title: "Mein Profil" },
    { title: "Unternehmensdaten" },
    { title: "Impressum & Datenschutz" },
    { title: "Sicherheit" },
    { title: "Integrationen" },
    { title: "Support" },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-3 justify-between bg-transparent border-none cursor-pointer px-2 py-3 h-full">
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
          {menuItems.slice(0, 4).map(item => (
            <MenuModal
              key={item.title}
              title={item.title}
              trigger={
                <button className="block w-full text-left text-sm text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded">
                  {item.title}
                </button>
              }
            />
          ))}

          <div className="border-t border-gray-100 my-2" />

          {menuItems.slice(4).map(item => (
            <MenuModal
              key={item.title}
              title={item.title}
              trigger={
                <button className="block w-full text-left text-sm text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded">
                  {item.title}
                </button>
              }
            />
          ))}

          <div className="border-t border-gray-100 my-2" />

          <button
            onClick={signOut}
            className="w-full text-left text-sm text-red-500 hover:bg-red-50 px-2 py-1.5 rounded"
          >
            Logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}