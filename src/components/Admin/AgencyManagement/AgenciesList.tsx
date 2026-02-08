'use client';

import { Agency } from '@/types/Agency';
import React from 'react'

interface AgenciesListProps {
  agencies: any[];
  handleToggleActive: (id: string, isActive: boolean) => void;
}

export default function AgenciesList({ agencies, handleToggleActive }: AgenciesListProps) {
  if(agencies.length === 0) {
    return <p>No agencies found.</p>;
  };
  
	return (
		<ul>
			{agencies?.map((agency: Agency) => (
				<li key={agency.id}>
					{agency.name} - {agency.isActive ? "Active" : "Inactive"}
					<button
						onClick={() => handleToggleActive(agency.id, agency.isActive)}
					>
						{agency.isActive ? "Deactivate" : "Activate"}
					</button>
				</li>
			))}
		</ul>
	);
}
