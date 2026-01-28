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
		console.log('[API mark-tour-seen] Auth user ID:', currentUser.id);
		console.log('[API mark-tour-seen] Request user ID:', userId);

		if (currentUser.id !== userId) {
			console.log('[API mark-tour-seen] Unauthorized - user mismatch');
			return NextResponse.json(
				{ success: false, error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const supabase = await supabaseServer();

		// First, check current value
		const { data: currentUserData, error: checkError } = await supabase
			.from('users')
			.select('has_seen_tour')
			.eq('id', userId)
			.single();

		if (checkError) {
			console.error('[API mark-tour-seen] Error checking current value:', checkError);
		} else {
			console.log('[API mark-tour-seen] Current has_seen_tour value BEFORE update:', currentUserData?.has_seen_tour);
		}

		// Update to true
		const { error, data, count } = await supabase
			.from('users')
			.update({ has_seen_tour: true })
			.eq('id', userId)
			.select();

		if (error) {
			console.error('[API mark-tour-seen] Error updating:', error);
			console.error('[API mark-tour-seen] Error details:', JSON.stringify(error));
			return NextResponse.json(
				{ success: false, error: error.message },
				{ status: 500 }
			);
		}

		console.log('[API mark-tour-seen] Update result:', { error, data, count });
		console.log('[API mark-tour-seen] Successfully updated has_seen_tour to true');

		// Verify the update worked
		if (data && data.length > 0) {
			console.log('[API mark-tour-seen] Updated user has_seen_tour:', data[0].has_seen_tour);
		}

		return NextResponse.json({
			success: true,
			message: 'Tour marked as seen',
			data: { updatedValue: true }
		});
	} catch (error) {
		console.error('[API mark-tour-seen] Server error:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
