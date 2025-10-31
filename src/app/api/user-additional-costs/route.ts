import { NextResponse } from 'next/server';
import database from '@/db';
import { contracts } from '@/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import { getAuthenticatedServerUser } from '@/utils/auth/server';

export async function GET(request: Request) {
  try {
    const authenticatedUser = await getAuthenticatedServerUser();
    
    if (!authenticatedUser || !authenticatedUser.id) {
      return NextResponse.json({ 
        totalAdditionalCosts: 0,
        contractsCount: 0,
        error: 'Not authenticated' 
      });
    }
    
    // Extract userId from query params (for admin viewing another user)
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');
    
    // Use targetUserId if provided (admin case), otherwise use authenticated user
    const userId = targetUserId || authenticatedUser.id;
    
    const userContracts = await database
      .select({
        additional_costs: contracts.additional_costs,
        rental_start_date: contracts.rental_start_date,
        rental_end_date: contracts.rental_end_date,
      })
      .from(contracts)
      .where(eq(contracts.user_id, userId));

    // Sum up all additional costs from active contracts
    const totalAdditionalCosts = userContracts.reduce((sum, contract) => {
      return sum + (Number(contract.additional_costs) || 0);
    }, 0);

    return NextResponse.json({ 
      totalAdditionalCosts,
      contractsCount: userContracts.length 
    });
  } catch (error) {
    console.error('Error fetching user additional costs:', error);
    // Return 200 with 0 instead of 500 to prevent breaking the UI
    return NextResponse.json({
      totalAdditionalCosts: 0,
      contractsCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

