'use client';

import React from 'react'
import AdminUserItem from './ObjekteItem/AdminUserItem';
import { UserType } from '@/types';
import { Agency } from '@/types/Agency';

interface UsersListProps {
  users: UserType[];
  agencies: Agency[];
}

export default function UsersList({ users, agencies }: UsersListProps) {
	return (
		<div className="pt-4 max-medium:pt-2">
			<h2 className="text-xl max-medium:text-lg font-semibold text-gray-900 mb-4 max-medium:mb-3">
				Benutzer
			</h2>
			<div className="space-y-3 max-medium:space-y-2">
				{users.map((user) => (
					<AdminUserItem key={user.id} item={user} agencies={agencies} />
				))}
			</div>
		</div>
	);
}
