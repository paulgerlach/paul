"use client";

import { Agency } from "@/types/Agency";
import { useState } from "react";

interface AgenciesListProps {
	agencies: Agency[];
	handleToggleActive: (id: string, isActive: boolean) => void;
}

export default function AgenciesList({
	agencies,
	handleToggleActive,
}: AgenciesListProps) {
	if (agencies.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500 text-lg">Keine Agenturen gefunden.</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{agencies.map((agency) => (
				<AgencyItem
					key={agency.id}
					agency={agency}
					onToggle={handleToggleActive}
				/>
			))}
		</div>
	);
}

function AgencyItem({
	agency,
	onToggle,
}: {
	agency: Agency;
	onToggle: (id: string, isActive: boolean) => void;
}) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className="bg-white p-5 rounded-2xl flex items-center justify-between transition-all hover:shadow-md"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="flex items-center gap-4">
				<div
					className={`w-3 h-3 rounded-full ${
						agency.is_active ? "bg-green-500" : "bg-gray-300"
					}`}
				/>
				<div>
					<h3 className="text-xl font-semibold text-dark_green">
						{agency.name}
					</h3>
					<p className="text-sm text-gray-500">
						{agency.is_active ? "Aktiv" : "Inaktiv"}
					</p>
				</div>
			</div>

			<button
				onClick={() => onToggle(agency.id, agency.is_active ?? false)}
				className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:cursor-pointer hover:scale-105 ease-in-out ${
					agency.is_active
						? "bg-red-50 text-red-600 hover:bg-red-100"
						: "bg-green-50 text-green-600 hover:bg-green-100"
				}`}
			>
				{agency.is_active ? "Deaktivieren" : "Aktivieren"}
			</button>
		</div>
	);
}
