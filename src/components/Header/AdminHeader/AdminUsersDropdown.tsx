"use client";

import { useBasicUsers } from "@/apiClient";
import AdminUsersDropdownContent from "@/components/Basic/Dropdown/AdminUsersDropdownContent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Basic/ui/Popover";
import { chevron_admin, main_portfolio } from "@/static/icons";
import type { UserType } from "@/types";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function AdminUsersDropdown({ user }: { user?: UserType }) {
  const { user_id } = useParams();
  const { data: users } = useBasicUsers();

  const currentUser = users?.find((user) => user.id === user_id);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-controls="admin-users-dropdown"
          className="flex w-full items-center gap-4 justify-between bg-transparent border-none cursor-pointer px-2 py-3 h-full"
        >
          <div className="flex items-center justify-start whitespace-nowrap gap-5">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="max-w-6 max-h-6 max-xl:max-w-6 max-xl:max-h-6 w-6 h-6"
              loading="lazy"
              alt="main_portfolio"
              src={main_portfolio}
            />
            <div className="flex flex-col items-start justify-center">
              <span className="font-bold text-sm">Current User</span>
              <span className="text-xs text-black/50">
                {currentUser
                  ? `${currentUser.first_name} ${currentUser.last_name}`
                  : "No user selected"}
              </span>
            </div>
          </div>
          <Image
            width={0}
            height={0}
            sizes="100vw"
            className="max-w-2 max-h-5 transition-all duration-300 [.open_&]:rotate-180"
            loading="lazy"
            style={{ width: "100%", height: "auto" }}
            alt="chevron_admin"
            src={chevron_admin}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent id="admin-users-dropdown" className="border-none shadow-none p-0">
        <AdminUsersDropdownContent users={users} />
      </PopoverContent>
    </Popover>
  );
}
