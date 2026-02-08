"use client";

import { updateUserAgency } from "@/actions/admin/updateUserAgency";
import { ROUTE_ADMIN } from "@/routes/routes";
import type { UserType } from "@/types";
import type { Agency } from "@/types/Agency";
import Link from "next/link";
import { useState } from "react";
import AgencySelector from "./Admin/AgencySelector";
import { updateUserPermission } from "@/actions/admin/updateUserPermission";

interface AdminUserItemProps {
	item: UserType;
	agencies: Agency[];
	isSuperAdmin?: boolean;
}

const PERMISSIONS = ["user", "admin", "super_admin"];

export default function AdminUserItem({
	item,
	agencies,
	isSuperAdmin = false,
}: AdminUserItemProps) {
	const [isEditingAgency, setIsEditingAgency] = useState(false);
	const [isEditingPermission, setIsEditingPermission] = useState(false);
	const [selectedAgencyId, setSelectedAgencyId] = useState(
		item.agency_id || "",
	);
	const [selectedPermission, setSelectedPermission] = useState(item.permission);
	const [isUpdating, setIsUpdating] = useState(false);

	const currentAgency = agencies.find((a) => a.id === item.agency_id);
	const agencyName = currentAgency?.name || "No agency";

	const handleAgencySave = async () => {
		setIsUpdating(true);
		try {
			await updateUserAgency(item.id!, selectedAgencyId || null);
			setIsEditingAgency(false);
		} finally {
			setIsUpdating(false);
		}
	};

	const handlePermissionSave = async () => {
		setIsUpdating(true);
		try {
			await updateUserPermission(item.id!, selectedPermission ?? 'user');
			setIsEditingPermission(false);
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<div className="bg-white p-5 rounded-2xl flex items-center justify-between">
			<div className="flex items-center w-full justify-start gap-8">
				<div className="flex flex-col items-between justify-start gap-2 min-w-0">
					<AgencySelector
						item={item}
						agencies={agencies}
						isEditingAgency={isEditingAgency}
						setSelectedAgencyId={setSelectedAgencyId}
						selectedAgencyId={selectedAgencyId}
						setIsEditingAgency={setIsEditingAgency}
						handleSave={handleAgencySave}
						isUpdating={isUpdating}
						agencyName={agencyName}
					/>

					{/* Permission Selector */}
					{isSuperAdmin && (
						<div className="flex items-center gap-2">
							{isEditingPermission ? (
								<div className="flex items-center gap-2">
									<select
										title="permissions"
										value={selectedPermission}
										onChange={(e) => setSelectedPermission(e.target.value)}
										className="text-sm border rounded px-2 py-1 bg-white"
										disabled={isUpdating}
									>
										{PERMISSIONS.map((perm) => (
											<option key={perm} value={perm}>
												{perm}
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
											setSelectedPermission(item.permission);
										}}
										className="text-xs bg-gray-300 px-2 py-1 rounded"
									>
										Cancel
									</button>
								</div>
							) : (
								<button
									onClick={() => setIsEditingPermission(true)}
									className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700 hover:cursor-pointer transition"
								>
									<span className="text-gray-500">Role:</span>
										<span className="font-medium">{
											item.permission === "super_admin" ?
												"Super Admin" :
												item.permission === "admin" ? "Admin" : "User"}</span>
								</button>
							)}
						</div>
					)}

					<Link
						href={`${ROUTE_ADMIN}/${item.id}/dashboard`}
						className="text-3xl text-dark_green hover:underline cursor-pointer truncate hover:scale-105 transition ease-in-out"
					>
						{item.email}
					</Link>
					<Link
						href={`${ROUTE_ADMIN}/${item.id}/dashboard`}
						className="text-xl text-dark_green/50 hover:underline cursor-pointer truncate hover:scale-105 transition ease-in-out"
					>
						{item.first_name} {item.last_name}
					</Link>
				</div>
			</div>
		</div>
	);
}
