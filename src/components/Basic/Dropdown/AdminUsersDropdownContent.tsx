"use client";

import { useState } from "react";
import type { UserType } from "@/types";
import AdminUsersDropdownContentItem from "./AdminUsersDropdownContentItem";

export type AdminApartmentsDropdownContentProps = {
  users?: UserType[];
  onSelect?: () => void;
};

export default function AdminUsersDropdownContent({
  users,
  onSelect,
}: AdminApartmentsDropdownContentProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users?.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-w-[250px] bg-white rounded-base shadow-lg border border-gray-200 px-2.5 py-4 space-y-3 max-medium:max-h-[50vh] max-medium:overflow-hidden max-medium:flex max-medium:flex-col">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="rounded-md w-full border border-dark_green/10 py-2 px-4 text-sm placeholder:text-sm max-medium:flex-shrink-0"
        placeholder="Objekt suchen"
        type="text"
      />
      <div className="space-y-2 px-2 max-medium:overflow-y-auto max-medium:flex-1">
        {filteredUsers?.length === 0 ? (
          <div className="text-sm text-gray-500 py-2">Keine Ergebnisse gefunden</div>
        ) : (
          filteredUsers?.map((user) => (
            <AdminUsersDropdownContentItem key={user.id} item={user} onSelect={onSelect} />
          ))
        )}
      </div>
    </div>
  );
}
