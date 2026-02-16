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

  const body = await request.json();
  
  // Support both single invitation (backward compatible) and array of invitations
  const invitations = Array.isArray(body) ? body : [body];
  
  if (invitations.length === 0) {
    return NextResponse.json({ error: "No invitations provided" }, { status: 400 });
  }

  // Get inviter name and agency name once
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
  
  const results = [];
  
  for (const invitation of invitations) {
    const { email, role, agency_id } = invitation;

    // Validate email format
    if (!email || !email.includes("@")) {
      results.push({ email, error: "Invalid email" });
      continue;
    }

    // Generate invitation token
    const token = crypto.getRandomValues(new Uint8Array(32)).toString();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const expiresAtISO = expiresAt.toISOString();

    // Get agency name
    const agencyIdToUse = agency_id || null;
    let agencyName = null;
    
    if (agencyIdToUse) {
      const { data: agency } = await supabase
        .from("agencies")
        .select("name")
        .eq("id", agencyIdToUse)
        .single();
      agencyName = agency?.name || null;
    }

    // Store invitation
    const { error: insertError } = await supabase.from("user_invitations").insert({
      email,
      role,
      agency_id: agencyIdToUse,
      invited_by: user.id,
      token,
      expires_at: expiresAt.toISOString(),
      status: 'pending'
    });

    if (insertError) {
      console.error("[INVITATION] Failed to store invitation:", insertError);
      results.push({ email, error: "Failed to create invitation" });
      continue;
    }

    // Send invitation email
    try {
      await sendInvitationEvent(email, {
        inviter_name: inviterName,
        agency_name: agencyName,
        role: role || 'user',
        invitation_token: token,
        expires_at: expiresAtISO,
        invite_url: `${process.env.NEXT_PUBLIC_APP_URL}/invitation/accept?token=${token}`
      });
      console.log(`[INVITATION] Sent invitation to ${email}`);
      results.push({ email, success: true, message: "Invitation sent" });
    } catch (emailError) {
      console.error(`[INVITATION] Failed to send email to ${email}:`, emailError);
      results.push({ email, success: true, message: "Invitation created but email failed to send" });
    }
  }

  const allSuccessful = results.every(r => r.success);
  const status = results.some(r => r.error) ? 207 : 200;
  
  return NextResponse.json({
    success: allSuccessful,
    message: allSuccessful ? "All invitations sent" : "Some invitations failed",
    results
  }, { status });

} catch (error) {
  console.error("[INVITATION] Error:", error);
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}
}
