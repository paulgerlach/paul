'use client';

import { QueryClient, useMutation } from '@tanstack/react-query';
import React from 'react';

interface CreateAgencyFormProps {
	queryClient: QueryClient;
}


export default function CreateAgencyForm({ queryClient }: CreateAgencyFormProps) {
	const createMutation = useMutation({
		mutationFn: async (newAgency: { name: string; is_active?: boolean }) => {
			const response = await fetch("/api/agencies", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newAgency),
			});
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to create agency");
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["agencies"] });
		},
	});
	const handleCreateAgency = async (name: string) => {
		await createMutation.mutateAsync({ name });
	};
	return <div>CreateAgencyForm</div>;
}
