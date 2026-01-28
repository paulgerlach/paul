import { getAuthenticatedServerUser } from '@/utils/auth/server';

export async function checkUserHasSeenTour(): Promise<boolean> {
	try {
		const user = await getAuthenticatedServerUser();
		
		if (!user) {
			return false;
		}

		const { supabaseServer } = await import('@/utils/supabase/server');
		const supabase = await supabaseServer();

		const { data, error } = await supabase
			.from('users')
			.select('has_seen_tour')
			.eq('id', user.id)
			.single();

		if (error) {
			console.error('Error checking tour status:', error);
			return false;
		}

		return data?.has_seen_tour || false;
	} catch (error) {
		console.error('Error in checkUserHasSeenTour:', error);
		return false;
	}
}

export async function markTourAsSeen(userId: string): Promise<void> {
	try {
		const response = await fetch('/api/mark-tour-seen', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ userId }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to mark tour as seen');
		}
	} catch (error) {
		console.error('Error in markTourAsSeen:', error);
		throw error;
	}
}
