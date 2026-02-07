import { isAgencyAdmin, isSuperAdmin } from "@/auth";
import { supabaseServer } from "@/utils/supabase/server";
import { sendInvitationEvent } from "@/utils/webhooks";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try{
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isAgencyAdmin(user.id))) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const isSuper = await isSuperAdmin(user.id);
  const isAgency = await isAgencyAdmin(user.id);

  if (!isSuper && !isAgency) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, role, agency_id } = await request.json();

  // Validate email format
  if (!email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Generate invitation token
  const token = crypto.getRandomValues(new Uint8Array(32)).toString();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const expiresAtISO = expiresAt.toISOString();

  // Get inviter name and agency name
  const { data: agency, error: agencyError } = await supabase
    .from("agencies")
    .select("name")
    .eq("id", agency_id)
    .single();

  if (!agency || agencyError) {
    console.error("Error fetching agency data:", agencyError);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  const agencyName = agency?.name || null;
  // Get inviter name and agency name
  const { data: userResult, error: userError } = await supabase
    .from("users")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  if(!userResult || userError) {
    console.error("Error fetching user data:", userError);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  const inviterName = `${userResult.first_name} ${userResult.last_name}`;
  

  // Store invitation
  const { error: insertError } = await supabase.from("user_invitations").insert({
    email,
    role,
    agency_id: agency_id || null,
    invited_by: user.id,
    token,
    expires_at: expiresAt.toISOString(),
    status: 'pending'
  });

  if (insertError) {
    console.error("[INVITATION] Failed to store invitation:", insertError);
    return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 });
  }


  // Send invitation email (implement email service)
  await sendInvitationEvent(email, {
    inviter_name: inviterName,
    agency_name: agencyName,
    role: role || 'user',
    invitation_token: token,
    expires_at: expiresAtISO,
    invite_url: `${process.env.NEXT_PUBLIC_APP_URL}/invitation/accept?token=${token}`
  });

  console.log(`[INVITATION] Sent invitation to ${email}`);

  return NextResponse.json({
    success: true,
    message: `Invitation sent to ${email}`
  });

} catch (error) {
  console.error("[INVITATION] Error:", error);
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}
}
