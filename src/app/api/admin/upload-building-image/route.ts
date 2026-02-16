import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/utils/supabase/server";
import { isAdmin } from "@/auth";

/**
 * Admin Building Image Upload API Route
 * Uses service role key to bypass RLS for super admin uploads
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify the user is authenticated and is an admin
    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const hasAdminAccess = await isAdmin(user.id);
    if (!hasAdminAccess) {
      console.error(`Unauthorized building image upload attempt by user: ${user.id}`);
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const objektId = formData.get("objektId") as string;

    if (!file || !objektId) {
      return NextResponse.json(
        { error: "Missing required fields: file, objektId" },
        { status: 400 }
      );
    }

    // 3. Create admin Supabase client with service role key to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase configuration for admin upload");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // 4. Upload the image
    const filePath = `images/${objektId}/${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from("buildings")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Admin building image upload error:", uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 5. Get the public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("buildings")
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: "Could not get public URL" },
        { status: 500 }
      );
    }

    console.log(`Admin ${user.email} uploaded building image for objekt ${objektId}`);

    return NextResponse.json({
      success: true,
      publicUrl: urlData.publicUrl,
    });
  } catch (error: any) {
    console.error("Admin building image upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}
