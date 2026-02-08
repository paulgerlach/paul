"use client";

import { useState } from "react";
import { useAuthUser } from "@/apiClient";
import DialogBase from "../../ui/DialogBase";
import { useDialogStore } from "@/store/useDIalogStore";

export default function InviteUserDialog({

}: {
	// isOpen: boolean;
	// onClose: () => void;
	// onSuccess?: () => void;
}) {
	const { data: currentUser, isLoading } = useAuthUser();
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<"user" | "agency_admin">("user");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { openDialogByType, closeDialog } = useDialogStore();
	const isOpen = openDialogByType.invite_user; // ADD THIS LINE

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

			// Success
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
			<div className="modal-content modal-overlay">
				<h2>Invite New User</h2>

				{isLoading ? (
					<p>Loading...</p>
				) : (
					<form onSubmit={handleSubmit}>
						{error && <div className="error-message">{error}</div>}

						<div className="form-group">
							<label>Invited by:</label>
							<input
								title={`${currentUser?.first_name} ${currentUser?.last_name} (${currentUser?.email})`}
								type="text"
								value={`${currentUser?.first_name} ${currentUser?.last_name}`}
								disabled
								className="readonly-input"
							/>
							<small>Your agency: {currentUser?.agency_id || "None"}</small>
						</div>

						<div className="form-group">
							<label htmlFor="email">Email Address</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="user@example.com"
								required
							/>
						</div>

						<div className="form-group">
							<label htmlFor="role">Role</label>
							<select
								id="role"
								value={role}
								onChange={(e) =>
									setRole(e.target.value as "user" | "agency_admin")
								}
							>
								<option value="user">User</option>
								<option value="agency_admin">Agency Admin</option>
							</select>
						</div>

						<div className="modal-actions">
							<button
								type="button"
								onClick={closeDialog.bind(null, "invite_user")}
								disabled={isSubmitting}
							>
								Cancel
							</button>
							<button type="submit" disabled={isSubmitting || !email}>
								{isSubmitting ? "Sending..." : "Send Invitation"}
							</button>
						</div>
					</form>
				)}
			</div>
		</DialogBase>
	);
}
