"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Basic/ui/Popover";
import { chevron_admin, main_account } from "@/static/icons";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminAccoundDropdown() {
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

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
      <PopoverContent className="w-24 border-none shadow-none p-0">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <button
              onClick={signOut}
              className="w-full cursor-pointer flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              Logout
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
