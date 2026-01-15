import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/utils/supabase/server';
import { getAuthenticatedServerUser } from '@/utils/auth/server';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { userId } = body;

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: 'userId is required' },
				{ status: 400 }
			);
		}

		const currentUser = await getAuthenticatedServerUser();

		if (currentUser.id !== userId) {
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
			console.error('Error marking tour as seen:', error);
			return NextResponse.json(
				{ success: false, error: error.message },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			message: 'Tour marked as seen'
		});
	} catch (error) {
		console.error('Error in mark-tour-seen route:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
