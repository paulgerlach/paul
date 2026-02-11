'use client';

import React from 'react';

interface SearchAndFiltersProps {
	searchQuery: string;
	setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
	sortOrder: "asc" | "desc";
	setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	isSuperAdmin: boolean;
  agencyFilter: string;
  setAgencyFilter: React.Dispatch<React.SetStateAction<string>>;
  agencies: { id: string; name: string }[];
}

export default function SearchAndFilters({
  searchQuery, setSearchQuery, sortOrder, setSortOrder, isSuperAdmin, agencyFilter, setAgencyFilter, agencies }: SearchAndFiltersProps) {
	return (
		<div className="flex flex-row justify-between mb-4 space-y-3">
			<input
				type="text"
				placeholder="Suche nach E-Mail, Vorname oder Nachname..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="w-1/2 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
			/>

			<div className="flex gap-3">
				<button
					onClick={() =>
						setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
					}
					className="px-4 py-2 bg-white rounded-2xl text-sm hover:bg-gray-200"
				>
					Sort by e-mail {sortOrder === "desc" ? "↓" : "↑"}
				</button>

				{/* Agency filter for super admins */}
				{isSuperAdmin && (
					<select
						title="agencyFilter"
						value={agencyFilter}
						onChange={(e) => setAgencyFilter(e.target.value)}
						className="px-4 py-2 border rounded-lg text-sm bg-white"
					>
						<option value="all">Alle Agenturen</option>
						{agencies.map((agency) => (
							<option key={agency.id} value={agency.id}>
								{agency.name}
							</option>
						))}
					</select>
				)}
			</div>
		</div>
	);
}
