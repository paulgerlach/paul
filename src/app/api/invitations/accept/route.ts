import { supabaseServer } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await supabaseServer();
  const { token, password, first_name, last_name } = await request.json();

  // Validate invitation
  const { data: invitation } = await supabase
    .from("user_invitations")
    .select("*")
    .eq("token", token)
    .eq("status", "pending")
    .single();

  if (!invitation || new Date(invitation.expires_at) < new Date()) {
    return Response.json({ error: "Invalid or expired invitation" }, { status: 400 });
  }

  // Create user account
  const { data: newUser, error } = await supabase.auth.admin.createUser({
    email: invitation.email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name,
      last_name,
      invitation_token: token
    }
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Create user record with role
  await supabase.from("users").insert({
    id: newUser.user.id,
    email: invitation.email,
    first_name,
    last_name,
    permission: invitation.role,
    agency_id: invitation.agency_id
  });

  // Mark invitation as accepted
  await supabase
    .from("user_invitations")
    .update({ status: 'accepted' })
    .eq("id", invitation.id);

  return Response.json({ success: true });
}