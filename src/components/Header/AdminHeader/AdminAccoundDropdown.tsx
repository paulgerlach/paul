"use client";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/Basic/ui/Popover";
import { chevron_admin, main_account } from "@/static/icons";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthUser } from "@/apiClient";
import { useDialogStore } from "@/store/useDIalogStore";

export default function AdminAccoundDropdown() {
	const router = useRouter();
	const { data: currentUser } = useAuthUser();
	const { openDialog } = useDialogStore(); // ADD THIS

	const signOut = async () => {
		await supabase.auth.signOut();
		router.push("/");
	};

	const canInviteUsers =
		currentUser?.permission === "super_admin" ||
		currentUser?.permission === "agency_admin" ||
		currentUser?.permission === "admin";

	return (
		<>
			<Popover>
				<PopoverTrigger asChild>
					<button className="flex items-center gap-3 justify-between bg-transparent border-none cursor-pointer px-2 py-3 h-full">
						<div className="flex items-center justify-start text-lg max-xl:text-sm whitespace-nowrap gap-3">
							<Image
								width={0}
								height={0}
								sizes="100vw"
								className="max-w-4 max-h-4 max-xl:max-w-4 max-xl:max-h-4 w-4 h-4"
								loading="lazy"
								alt="main_account"
								src={main_account}
							/>
							<span className="text-sm">Mein Konto</span>
							<Image
								width={0}
								height={0}
								sizes="100vw"
								className="max-w-2 max-h-5 transition-all duration-300 [.open_&]:rotate-180"
								loading="lazy"
								alt="chevron_admin"
								src={chevron_admin}
							/>
						</div>
					</button>
				</PopoverTrigger>
				<PopoverContent
					className="w-64 p-0 bg-white rounded-lg shadow-lg border border-gray-100 mt-2"
					align="end"
				>
					<div className="py-2">
						{/* Main Account Section */}
						<div className="px-4 py-2">
							<div className="space-y-1">
								<Link
									href="#"
									className="block text-sm text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded"
								>
									Mein Profil
								</Link>
								<Link
									href="#"
									className="block text-sm text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded"
								>
									Unternehmensdaten
								</Link>

								{/* Team & Rollen - Opens Invite Modal */}
								{/* {true ? ( */}
									<button
										onClick={() => openDialog("invite_user")} // USE THIS
										className="w-full text-left text-sm text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded"
									>
										Team & Rollen
									</button>
								{/* ) : (
									<Link
										href="#"
										className="block text-sm text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded"
									>
										Team & Rollen
									</Link>
								)} */}

								<Link
									href="#"
									className="block text-sm text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded"
								>
									Sicherheit
								</Link>
							</div>
						</div>

						{/* Divider */}
						<div className="border-t border-gray-100 my-2 w-30" />

						{/* Integrations & Support Section */}
						<div className="px-4 py-2">
							<div className="space-y-1">
								<Link
									href="#"
									className="block text-sm text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded"
								>
									Integrationen
								</Link>
								<Link
									href="#"
									className="block text-sm text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded"
								>
									Support
								</Link>
							</div>
						</div>

						{/* Divider */}
						<div className="border-t border-gray-100 my-2 w-30" />

						{/* Logout Button */}
						<div className="px-4 py-2">
							<button
								onClick={signOut}
								className="w-full text-left text-sm text-red-300 hover:bg-red-50 px-2 py-1.5 rounded"
							>
								Logout
							</button>
						</div>

						{/* Footer Links */}
						<div className="px-4 py-2 flex justify-between">
							<Link
								href="#"
								className="text-xs text-gray-400 hover:text-gray-700"
							>
								Impressum
							</Link>
							<Link
								href="#"
								className="text-xs text-gray-400 hover:text-gray-700"
							>
								Datenschutz
							</Link>
						</div>
					</div>
				</PopoverContent>
			</Popover>

			{/* Invite User Modal */}
			{/* <InviteUserModal
				isOpen={showInviteModal}
				onClose={() => setShowInviteModal(false)}
				onSuccess={() => {
					console.log("User invited successfully");
				}}
			/> */}
		</>
	);
}
