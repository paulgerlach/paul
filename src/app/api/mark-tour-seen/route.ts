import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/utils/supabase/server';
import { getAuthenticatedServerUser } from '@/utils/auth/server';

export async function POST(request: NextRequest) {
	try {
		console.log('[API mark-tour-seen] Request received');
		const body = await request.json();
		const { userId } = body;

		console.log('[API mark-tour-seen] userId:', userId);

		if (!userId) {
			console.log('[API mark-tour-seen] Missing userId');
			return NextResponse.json(
				{ success: false, error: 'userId is required' },
				{ status: 400 }
			);
		}

		const currentUser = await getAuthenticatedServerUser();

		console.log('[API mark-tour-seen] Current user:', currentUser.id);

		if (currentUser.id !== userId) {
			console.log('[API mark-tour-seen] Unauthorized - user mismatch');
			return NextResponse.json(
				{ success: false, error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const supabase = await supabaseServer();
		const { error } = await supabase
			.from('users')
			.update({ has_seen_tour: true })
			.eq('id', userId);

		if (error) {
			console.error('[API mark-tour-seen] Error updating:', error);
			return NextResponse.json(
				{ success: false, error: error.message },
				{ status: 500 }
			);
		}

		console.log('[API mark-tour-seen] Successfully updated has_seen_tour to true');
		return NextResponse.json({
			success: true,
			message: 'Tour marked as seen'
		});
	} catch (error) {
		console.error('[API mark-tour-seen] Server error:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
