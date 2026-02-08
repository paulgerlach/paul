"use client";

import { Agency } from "@/types/Agency";
import { useState } from "react";

interface AgenciesListProps {
	agencies: Agency[];
	handleToggleActive: (id: string, isActive: boolean) => void;
	handleEditName: (id: string, name: string) => Promise<void>;
}

export default function AgenciesList({
	agencies,
	handleToggleActive,
	handleEditName,
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
					onEditName={handleEditName}
				/>
			))}
		</div>
	);
}

function AgencyItem({
	agency,
	onToggle,
	onEditName,
}: {
	agency: Agency;
	onToggle: (id: string, isActive: boolean) => void;
	onEditName: (id: string, name: string) => Promise<void>;
}) {
	const [isHovered, setIsHovered] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editName, setEditName] = useState(agency.name);
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		if (editName.trim() === agency.name) {
			setIsEditing(false);
			return;
		}

		setIsSaving(true);
		try {
			await onEditName(agency.id, editName.trim());
			setIsEditing(false);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setEditName(agency.name);
		setIsEditing(false);
	};

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
					<div className="flex items-center gap-2">
						{isEditing ? (
							<>
								<input
									type="text"
									value={editName}
									onChange={(e) => setEditName(e.target.value)}
									className="text-xl font-semibold text-dark_green border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
									disabled={isSaving}
								/>
								<button
									onClick={handleSave}
									disabled={isSaving || !editName.trim()}
									className="p-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
								>
									Save
								</button>
								<button
									onClick={handleCancel}
									disabled={isSaving}
									className="p-1 text-xs bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
								>
									Cancel
								</button>
							</>
						) : (
							<>
								<h3 className="text-xl font-semibold text-dark_green">
									{agency.name}
								</h3>
								<button
									onClick={() => setIsEditing(true)}
									className="p-1 text-gray-400 hover:text-gray-600 hover:scale-110 transition-transform"
									title="Bearbeiten"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
									</svg>
								</button>
							</>
						)}
					</div>
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
