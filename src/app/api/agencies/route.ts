import { supabaseServer } from "@/utils/supabase/server";
import { isSuperAdmin } from "@/auth";
import { NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isSuperAdmin(user.id))) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { data } = await supabase
    .from("agencies")
    .select("*")
    // .eq("is_active", true)
    .order("name");

  return Response.json(data || []);
}

export async function POST(request: Request) {
  try {

  const supabase = await supabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user || !(await isSuperAdmin(user.id))) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized - Please login" },
      { status: 401 }
    );
  }

  const isSuperAdminUser = await isSuperAdmin(user.id);
  if (!isSuperAdminUser) {
    return NextResponse.json(
      { error: "Forbidden - Super admin access required" },
      { status: 403 }
    );
  }

  const body = await request.json();
  // Active is defaulted to true if not provided, but can be set to false to create an inactive agency
  const { name, is_active = true } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json(
      { error: "Agency name is required" },
      { status: 400 }
    );
  }

  if (name.trim().length > 255) {
    return NextResponse.json(
      { error: "Agency name must be 255 characters or less" },
      { status: 400 }
    );
  }

    const isExistingAgency = await agencyExists(supabase, name);
    
    if (isExistingAgency) {
    return NextResponse.json(
      { error: `Agency with name "${name}" already exists` },
      { status: 409 }
    );
    }

    const { newAgencyId, insertError } = await createAgency(supabase, name, is_active);
    // Create the agency
    

    if (insertError) {
      console.error("Failed to create agency:", insertError);
      return NextResponse.json(
        { error: "Failed to create agency" },
        { status: 500 }
      );
    }


    return NextResponse.json({ id: newAgencyId }, { status: 201 });

  } catch (error) {
    console.error("Error creating agency:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !(await isSuperAdmin(user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, is_active } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Agency ID required" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (name) updates.name = name.trim();
    if (typeof is_active === "boolean") updates.is_active = is_active;

    const { data, error } = await updateAgency(supabase, id, updates);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating agency:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const agencyExists = async (supabase: SupabaseClient<any, "public", any>, name: string) => {

  const { data: existingAgency } = await supabase
    .from("agencies")
    .select("id, name")
    .ilike("name", name.trim())
    .eq("is_active", true)
    .single();
  
  return !!existingAgency;

}

const createAgency = async (supabase: SupabaseClient<any, "public", any>, name: string, is_active: boolean) => { 
  const { data: newAgency, error: insertError } = await supabase
    .from("agencies")
    .insert({
      name: name.trim(),
      is_active: is_active
    })
    .select()
    .single();
  return { newAgencyId: newAgency?.id, insertError };
}

const updateAgency = async (supabase: SupabaseClient<any, "public", any>, id: string, updates: Record<string, unknown>) => {
  const { data, error } = await supabase
    .from("agencies")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return { data, error };
}