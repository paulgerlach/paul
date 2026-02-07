import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import { isAdminUser } from "@/auth";
import { createHash } from "crypto";
import type { FirmwareType, FirmwareVersionInsert } from "@/types";

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !(await isAdminUser(user.id))) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 },
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const version = formData.get("version") as string;
    const type = formData.get("type") as FirmwareType; // 'boot', 'modem', 'application'
    const deviceModel = formData.get("deviceModel") as string;
    const description = formData.get("description") as string;
    const releaseNotes = formData.get("releaseNotes") as string;

    if (!file || !version || !type || !deviceModel) {
      return NextResponse.json(
        { error: "Missing required fields: file, version, type, deviceModel" },
        { status: 400 },
      );
    }

    // Calculate checksum
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const checksum = createHash("sha256").update(fileBuffer).digest("hex");

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const filename = `${Date.now()}-${file.name}`;

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("firmware") // You'll need to create this bucket
      .upload(filename, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 },
      );
    }

    // Insert firmware version record
    const firmwareData: FirmwareVersionInsert = {
      filename,
      original_filename: file.name,
      version,
      type,
      device_model: deviceModel,
      size_bytes: file.size,
      checksum_sha256: checksum,
      total_chunks: 1, // For now, treat as single chunk
      chunk_size: file.size,
      description: description || null,
      release_notes: releaseNotes || null,
      uploaded_by: user.id,
      allowed_gateways: []
    };

    const { data: insertData, error: insertError } = await supabase
      .from("firmware_versions")
      .insert(firmwareData)
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      // Clean up uploaded file
      await supabase.storage.from("firmware").remove([filename]);
      return NextResponse.json(
        { error: "Failed to save firmware version" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      firmware: insertData,
    });
  } catch (error) {
    console.error("Unexpected error uploading firmware:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
