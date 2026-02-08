'use client'

import { Agency } from '@/types/Agency';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import CreateAgencyForm from './CreateAgencyForm';
import AgenciesList from './AgenciesList';

export default function AgencyManagement() {
	const queryClient = useQueryClient();

	const {
		data: agencies,
		isLoading,
		error,
	} = useQuery<Agency[]>({
		queryKey: ["agencies"],
		queryFn: async () => {
			const response = await fetch("/api/agencies");
			if (!response.ok) {
				throw new Error("Failed to fetch agencies");
			}
			return response.json();
		},
		refetchOnWindowFocus: false,
	});

	// Update agency mutation
	const updateMutation = useMutation({
		mutationFn: async (updates: {
			id: string;
			name?: string;
			is_active?: boolean;
		}) => {
			const response = await fetch("/api/agencies", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updates),
			});
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to update agency");
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["agencies"] });
			queryClient.refetchQueries({ queryKey: ["agencies"] });
		},
	});
  

	const handleToggleActive = async (id: string, isActive: boolean) => {
		await updateMutation.mutateAsync({ id, is_active: !isActive });
	};

	const handleEditName = async (id: string, name: string) => {
		await updateMutation.mutateAsync({ id, name });
	};

  if (isLoading) return <div>Loading agencies...</div>;
	if (error) return <div>Error: {error.message}</div>;

  return (
		<div className="space-y-4">
			<AgenciesList
				agencies={agencies ?? []}
				handleToggleActive={handleToggleActive}
				handleEditName={handleEditName}
			/>
			<CreateAgencyForm />
		</div>
	);
}
