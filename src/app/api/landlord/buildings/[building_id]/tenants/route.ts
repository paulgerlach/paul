import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";

// Service role client for tenant_logins table (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/landlord/buildings/[building_id]/tenants
 * 
 * Returns list of tenants for a specific building with their invite status.
 * Chain: objekte → locals → contracts → contractors + tenant_logins status
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ building_id: string }> }
) {
  try {
    const { building_id } = await params;

    // Get authenticated user
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // Verify building belongs to this landlord
    const { data: building, error: buildingError } = await supabase
      .from("objekte")
      .select("id")
      .eq("id", building_id)
      .eq("user_id", user.id)
      .single();

    if (buildingError || !building) {
      return NextResponse.json(
        { error: "Building not found or access denied" },
        { status: 404 }
      );
    }

    // Get locals (apartments) for this building
    const { data: locals, error: localsError } = await supabase
      .from("locals")
      .select("id, floor, house_location")
      .eq("objekt_id", building_id);

    if (localsError) {
      console.error("[landlord/tenants] Locals error:", localsError);
      return NextResponse.json(
        { error: "Failed to fetch apartments" },
        { status: 500 }
      );
    }

    if (!locals || locals.length === 0) {
      return NextResponse.json({
        tenants: [],
        building_id,
      });
    }

    // Get contracts for all locals
    const localIds = locals.map(l => l.id);
    const { data: contracts, error: contractsError } = await supabase
      .from("contracts")
      .select("id, local_id, rental_start_date, rental_end_date, is_current")
      .in("local_id", localIds);

    if (contractsError) {
      console.error("[landlord/tenants] Contracts error:", contractsError);
      return NextResponse.json(
        { error: "Failed to fetch contracts" },
        { status: 500 }
      );
    }

    if (!contracts || contracts.length === 0) {
      return NextResponse.json({
        tenants: [],
        building_id,
      });
    }

    // Get contractors (tenants) for all contracts
    const contractIds = contracts.map(c => c.id);
    const { data: contractors, error: contractorsError } = await supabase
      .from("contractors")
      .select("id, contract_id, first_name, last_name, email")
      .in("contract_id", contractIds);

    if (contractorsError) {
      console.error("[landlord/tenants] Contractors error:", contractorsError);
      return NextResponse.json(
        { error: "Failed to fetch tenants" },
        { status: 500 }
      );
    }

    if (!contractors || contractors.length === 0) {
      return NextResponse.json({
        tenants: [],
        building_id,
      });
    }

    // Get tenant_logins status for all contractors (using admin client)
    const contractorIds = contractors.map(c => c.id);
    const { data: tenantLogins, error: loginsError } = await supabaseAdmin
      .from("tenant_logins")
      .select("id, contractor_id, enabled, created_at, last_login_at")
      .in("contractor_id", contractorIds);

    if (loginsError) {
      console.error("[landlord/tenants] Tenant logins error:", loginsError);
      // Don't fail - just continue without status
    }

    // Build tenant list with status
    const tenantsWithStatus = contractors.map(contractor => {
      // Find contract for this contractor
      const contract = contracts.find(c => c.id === contractor.contract_id);
      // Find local for this contract
      const local = contract ? locals.find(l => l.id === contract.local_id) : null;
      // Find tenant_login for this contractor
      const tenantLogin = tenantLogins?.find(tl => tl.contractor_id === contractor.id);

      // Determine status
      let status: "not_invited" | "invited" | "active" | "disabled" = "not_invited";
      let invite_sent_at: string | null = null;
      let last_login_at: string | null = null;
      let tenant_login_id: string | null = null;

      if (tenantLogin) {
        tenant_login_id = tenantLogin.id;
        if (tenantLogin.enabled) {
          if (tenantLogin.last_login_at) {
            status = "active";
            last_login_at = tenantLogin.last_login_at;
          } else {
            status = "invited";
            invite_sent_at = tenantLogin.created_at;
          }
        } else {
          status = "disabled";
        }
      }

      // Build apartment name from local info
      const apartment = local 
        ? `${local.floor || ""}${local.house_location ? " " + local.house_location : ""}`.trim() || "N/A"
        : "N/A";

      return {
        contractor_id: contractor.id,
        first_name: contractor.first_name,
        last_name: contractor.last_name,
        email: contractor.email,
        apartment,
        local_id: local?.id || null,
        contract_id: contract?.id || null,
        status,
        invite_sent_at,
        last_login_at,
        tenant_login_id,
      };
    });

    return NextResponse.json({
      tenants: tenantsWithStatus,
      building_id,
    });

  } catch (error) {
    console.error("[landlord/tenants] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
