"use client";

import { useState } from "react";
import type { UserType } from "@/types";
import AdminUsersDropdownContentItem from "./AdminUsersDropdownContentItem";

export type AdminApartmentsDropdownContentProps = {
  users?: UserType[];
};

export default function AdminUsersDropdownContent({
  users,
}: AdminApartmentsDropdownContentProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users?.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute w-full bg-white rounded-base shadow-sm px-2.5 py-4 left-0 top-[110%] space-y-3">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="rounded-md w-full border border-dark_green/10 py-1 px-6 text-sm placeholder:text-sm"
        placeholder="Objekt suchen"
        type="text"
      />
      <div className="space-y-3 px-4">
        {filteredUsers?.length === 0 ? (
          <div className="text-sm text-gray-500">Keine Ergebnisse gefunden</div>
        ) : (
          filteredUsers?.map((user) => (
            <AdminUsersDropdownContentItem key={user.id} item={user} />
          ))
        )}
      </div>
    </div>
  );
}
