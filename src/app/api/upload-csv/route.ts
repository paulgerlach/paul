import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/utils/supabase/server';
import { isAdminUser } from '@/auth';

/**
 * Manual CSV Upload API Route - SUPER ADMIN ONLY
 * Forwards CSV content to Supabase Edge Function for parsing
 */
export async function POST(request: NextRequest) {
  try {
    // 🔒 SECURITY: Verify user is admin
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const isAdmin = await isAdminUser(user.id);
    if (!isAdmin) {
      console.error(`Unauthorized CSV upload attempt by user: ${user.id}`);
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Extract filename from query params or headers
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName') ||
      searchParams.get('filename') ||
      request.headers.get('x-filename') ||
      'manual-upload.csv';

    console.log(`Processing admin upload for file: ${fileName} by user: ${user.email}`);

    // Read raw CSV content from request body
    const csvContent = await request.text();

    if (!csvContent || csvContent.trim().length === 0) {
      return NextResponse.json(
        { error: 'No CSV content provided' },
        { status: 400 }
      );
    }

    console.log(`Received CSV upload, size: ${csvContent.length} bytes`);

    // Forward to Supabase Edge Function (same function Make.com uses)
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/csv-parser?filename=${encodeURIComponent(fileName)}`;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!edgeFunctionUrl || !serviceRoleKey) {
      console.error('Missing Supabase configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'text/plain',
        'x-filename': fileName
      },
      body: csvContent
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge function error:', errorText);
      return NextResponse.json(
        { error: 'Failed to process CSV', details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('Upload result:', result);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}

