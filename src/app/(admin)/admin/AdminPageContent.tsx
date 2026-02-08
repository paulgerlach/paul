'use client'

import Breadcrumb from '@/components/Admin/Breadcrumb/Breadcrumb';
import ContentWrapper from '@/components/Admin/ContentWrapper/ContentWrapper';
import AdminUserItem from '@/components/Admin/ObjekteItem/AdminUserItem';
import RegistrationToggle from '@/components/Admin/RegistrationToggle/RegistrationToggle';
import UsersList from '@/components/Admin/UsersList';
import { ROUTE_OBJEKTE } from '@/routes/routes';
import { UserType } from '@/types';
import { Agency } from '@/types/Agency';
import React from 'react';

interface AdminPageContentProps {
	users: UserType[];
	agencies: Agency[];
	permission: string;
}

export default function AdminPageContent({
	users,
	agencies,
	permission,
}: AdminPageContentProps) {
	return (
		<div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none grid grid-rows-[auto_1fr]">
			<Breadcrumb
				backTitle="Objekte"
				link={ROUTE_OBJEKTE}
				title="User Übersicht"
			/>
			<ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto]">
				<div className="overflow-y-auto space-y-4 max-medium:space-y-3">
					{/* Registration Control */}
					<RegistrationToggle />

					{/* User List */}
					<UsersList
						users={users}
						agencies={agencies}
						isSuperAdmin={permission === "super_admin"}
					/>
				</div>
			</ContentWrapper>
		</div>
	);
}
