'use client';

import { Button } from '@/components/Basic/ui/Button';
import { Input } from '@/components/Basic/ui/Input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

interface CreateAgencyFormProps {
}


export default function CreateAgencyForm({  }: CreateAgencyFormProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      setName("");
		},
	});

  const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			setError("Agency name is required");
			return;
		}
		setError(null);
		setIsSubmitting(true);
		try {
			await createMutation.mutateAsync({name});
		} finally {
			setIsSubmitting(false);
		}
  };
  
	return <form onSubmit={handleSubmit} className="space-y-4">
			{error && (
				<div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
					{error}
				</div>
			)}

			<div className="flex gap-2">
				<Input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter agency name"
					disabled={isSubmitting}
					className="flex-1"
				/>
				<Button type="submit" disabled={isSubmitting || !name.trim()}>
					{isSubmitting ? "Creating..." : "Create Agency"}
				</Button>
			</div>
		</form>;
}
