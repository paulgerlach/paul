'use client'

import { UserType } from '@/types';
import React from 'react';

interface PermissionSelectorProps {
	isEditingPermission: boolean;
	selectedPermission: string;
	setSelectedPermission: (perm: string) => void;
	handlePermissionSave: () => void;
	isUpdating: boolean;
	user: UserType;
	setIsEditingPermission: (isEditing: boolean) => void;
}
const PERMISSIONS = ["user", "admin", "super_admin"];

export default function PermissionSelector({isEditingPermission, selectedPermission, setSelectedPermission, handlePermissionSave, isUpdating, user, setIsEditingPermission}: PermissionSelectorProps) {
	return (
		<div className="flex items-center gap-2">
			{isEditingPermission ? (
				<div className="flex items-center gap-2">
					<select
						title="permissions"
						value={selectedPermission}
						onChange={(e) => setSelectedPermission(e.target.value)}
						className="text-md border rounded px-2 py-1 bg-white"
						disabled={isUpdating}
					>
						{PERMISSIONS.map((perm) => (
							<option key={perm} value={perm}>
								{perm === "super_admin"
									? "Super Admin"
									: perm === "admin"
										? "Admin"
										: "User"}
							</option>
						))}
					</select>
					<button
						onClick={handlePermissionSave}
						disabled={isUpdating}
						className="text-xs bg-green-500 text-white px-2 py-1 rounded"
					>
						{isUpdating ? "..." : "Save"}
					</button>
					<button
						onClick={() => {
							setIsEditingPermission(false);
							setSelectedPermission(user.permission ?? "user");
						}}
						className="text-xs bg-gray-300 px-2 py-1 rounded"
					>
						Cancel
					</button>
				</div>
			) : (
				<button
					onClick={() => setIsEditingPermission(true)}
					className="flex items-center gap-2 text-md text-blue-500 hover:text-blue-700 hover:cursor-pointer transition hover:scale-105 ease-in-out"
				>
					<span className="text-gray-500">Role:</span>
					<span className="font-medium">
						{user.permission === "super_admin"
							? "Super Admin"
							: user.permission === "admin"
								? "Admin"
								: "User"}
					</span>
				</button>
			)}
		</div>
	);
}
