"use client";

import { useState } from "react";
import { useAuthUser } from "@/apiClient";
import DialogBase from "../../ui/DialogBase";
import { useDialogStore } from "@/store/useDIalogStore";

export default function InviteUserDialog() {
	const { data: currentUser, isLoading } = useAuthUser();
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<"user" | "agency_admin">("user");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { openDialogByType, closeDialog } = useDialogStore();
	const isOpen = openDialogByType.invite_user;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const response = await fetch("/api/invitations", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					role,
					agency_id: currentUser?.agency_id || null,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Failed to send invitation");
				return;
			}

			setEmail("");
			setRole("user");
			closeDialog("invite_user");
		} catch (err) {
			setError("An error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return (
		<DialogBase dialogName="invite_user">
			<div className="bg-white rounded-2xl max-w-md w-full mx-auto overflow-hidden">
				{/* Header */}
				<div className="px-6 py-4 border-b border-gray-100">
					<h2 className="text-xl font-semibold text-dark_green">
						Neuen Benutzer einladen
					</h2>
					<p className="text-sm text-gray-500 mt-1">
						Senden Sie eine Einladung per E-Mail
					</p>
				</div>

				{/* Content */}
				{isLoading ? (
					<div className="px-6 py-12 text-center">
						<div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
						<p className="text-gray-500 mt-2">Wird geladen...</p>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="p-6 space-y-4">
						{error && (
							<div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
								{error}
							</div>
						)}

						{/* Invited by (read-only) */}
						<div className="space-y-1">
							<label className="text-sm font-medium text-gray-700">
								Eingeladen von
							</label>
							<input
								title={`${currentUser?.first_name} ${currentUser?.last_name} (${currentUser?.email})`}
								type="text"
								value={`${currentUser?.first_name} ${currentUser?.last_name}`}
								disabled
								className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed"
							/>
							<p className="text-xs text-gray-500">
								Agentur:{" "}
								<span className="text-dark_green font-medium">
									{currentUser?.agency_id || "Keine"}
								</span>
							</p>
						</div>

						{/* Email */}
						<div className="space-y-1">
							<label
								htmlFor="email"
								className="text-sm font-medium text-gray-700"
							>
								E-Mail-Adresse *
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="user@example.com"
								required
								className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
							/>
						</div>

						{/* Role */}
						<div className="space-y-1">
							<label
								htmlFor="role"
								className="text-sm font-medium text-gray-700"
							>
								Rolle *
							</label>
							<select
								id="role"
								value={role}
								onChange={(e) =>
									setRole(e.target.value as "user" | "agency_admin")
								}
								className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all"
							>
								<option value="user">Benutzer</option>
								<option value="agency_admin">Agentur-Admin</option>
							</select>
						</div>

						{/* Actions */}
						<div className="flex gap-3 pt-4">
							<button
								type="button"
								onClick={closeDialog.bind(null, "invite_user")}
								disabled={isSubmitting}
								className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
							>
								Abbrechen
							</button>
							<button
								type="submit"
								disabled={isSubmitting || !email}
								className="flex-1 px-4 py-2.5 bg-dark_green text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSubmitting ? "Wird gesendet..." : "Einladung senden"}
							</button>
						</div>
					</form>
				)}
			</div>
		</DialogBase>
	);
}
