"use client";

import { useState, useMemo } from "react";
import AdminUserItem from "./ObjekteItem/AdminUserItem";
import { UserType } from "@/types";
import { Agency } from "@/types/Agency";
import SearchAndFilters from "./SearchAndFilters";

interface UsersListProps {
	users: UserType[];
	agencies: Agency[];
	isSuperAdmin?: boolean;
}

export default function UsersList({
	users,
	agencies,
	isSuperAdmin = false,
}: UsersListProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [agencyFilter, setAgencyFilter] = useState<string>("all");

	// Filter users based on search query
	const filteredUsers = useMemo(() => {
		if (!searchQuery.trim()) return users;

		const query = searchQuery.toLowerCase().trim();
		return users.filter(
			(user) =>
				user.email?.toLowerCase().includes(query) ||
				user.first_name?.toLowerCase().includes(query) ||
				user.last_name?.toLowerCase().includes(query),
		);
	}, [users, searchQuery]);

	// Filter by agency for super admins
	const agencyFilteredUsers = useMemo(() => {
		if (!isSuperAdmin || agencyFilter === "all") return filteredUsers;
		return filteredUsers.filter((user) => user.agency_id === agencyFilter);
	}, [filteredUsers, isSuperAdmin, agencyFilter]);

	// Sort by email
	const sortedUsers = useMemo(() => {
		return [...agencyFilteredUsers].sort((a, b) => {
			const emailA = a.email?.toLowerCase() || "";
			const emailB = b.email?.toLowerCase() || "";
			return sortOrder === "desc"
				? emailB.localeCompare(emailA)
				: emailA.localeCompare(emailB);
		});
	}, [agencyFilteredUsers, sortOrder]);

	return (
		<div className="pt-4 max-medium:pt-2">
			{/* Search and Filters */}
      <SearchAndFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        isSuperAdmin={isSuperAdmin}
        agencyFilter={agencyFilter}
        setAgencyFilter={setAgencyFilter}
        agencies={agencies}
      />
			<h2 className="text-xl max-medium:text-lg font-semibold text-gray-900 mb-4 max-medium:mb-3">
				Benutzer ({sortedUsers.length})
			</h2>
			{sortedUsers.length === 0 ? (
				<p className="text-gray-500 text-center py-8">
					Keine Benutzer gefunden
				</p>
			) : (
				<div className="space-y-3 max-medium:space-y-2">
					{sortedUsers.map((user) => (
						<AdminUserItem key={user.id} item={user} agencies={agencies} />
					))}
				</div>
			)}
		</div>
	);
}
