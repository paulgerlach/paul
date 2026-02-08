'use client'

import { UserType } from '@/types';
import { Agency } from '@/types/Agency';
import React from 'react';

interface AgencySelectorProps {
	item: UserType;
	agencies: Agency[];
	isEditingAgency: boolean;
	setSelectedAgencyId: React.Dispatch<React.SetStateAction<string>>;
	selectedAgencyId: string;
	setIsEditingAgency: React.Dispatch<React.SetStateAction<boolean>>;
	handleSave: () => Promise<void>;
	isUpdating: boolean;
	agencyName:string;
}

export default function AgencySelector({ item, agencies, isEditingAgency, setSelectedAgencyId, selectedAgencyId, setIsEditingAgency, handleSave, isUpdating, agencyName }: AgencySelectorProps) {
	return (
		<div className="mt-2" onClick={(e) => e.stopPropagation()}>
			{isEditingAgency ? (
				<div className="flex items-center gap-2">
					<select
						title="agencies"
						value={selectedAgencyId}
						onChange={(e) => setSelectedAgencyId(e.target.value)}
						className="text-md border rounded px-2 py-1 bg-white"
					>
						<option value="">No agency</option>
						{agencies.map((agency) => (
							<option key={agency.id} value={agency.id}>
								{agency.name}
							</option>
						))}
					</select>
					<button
						onClick={handleSave}
						disabled={isUpdating}
						className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
					>
						{isUpdating ? "..." : "Save"}
					</button>
					<button
						onClick={() => {
							setIsEditingAgency(false);
							setSelectedAgencyId(item.agency_id || "");
						}}
						className="text-xs bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
					>
						Cancel
					</button>
				</div>
			) : (
				<button
					onClick={() => setIsEditingAgency(true)}
					className="flex items-center gap-2 text-md text-blue-500 hover:text-blue-700  hover:cursor-pointer hover:scale-105 transition ease-in-out"
				>
					<span className="text-dark_green/50">Agency:</span>
					<span className="font-medium">{agencyName}</span>
				</button>
			)}
		</div>
	);
}
